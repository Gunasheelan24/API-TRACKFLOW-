import * as bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { apiResponse } from 'src/common/utils/api-response';
import { ApiResponse } from 'src/common/types';
import { errorMessage, successMessage } from '../common/constant/message';
import { LoginType } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { type sentEmailtype } from './dto/verifyEmailAddress';
import { randomInt } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  JwtPayload,
  JwtRefreshTokenType,
  RefreshRequest,
  type CreateAccountResponse,
} from './types/auth.types';
import { UserOtp } from './entities/otp.entity';
import { ResetPasswordDto } from './dto/reset-password';

@Injectable()
export class AuthService {
  public readonly logger: Logger;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectRepository(UserOtp)
    private readonly userOtpRepository: Repository<UserOtp>,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  // HELPER METHODS
  async hashPassword(password: string, salt: number = 10) {
    return await bcrypt.hash(password, salt);
  }

  async createJwtToken(payload: { sub: string; email: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
    });

    return accessToken;
  }

  async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async getRefreshToken(request: RefreshRequest) {
    const refreshToken = request.cookies.refreshToken;
    const getResponseToken =
      await this.jwtService.verifyAsync<JwtRefreshTokenType>(
        refreshToken as string,
        {
          secret: this.configService.get<string>('JWT_SECRET') as string,
          ignoreExpiration: false,
        },
      );

    if (!getResponseToken?.iat || !getResponseToken?.exp) {
      throw new UnauthorizedException('Refresh Token Expired');
    }

    // Token Generation
    const payload: JwtPayload = {
      sub: getResponseToken.sub,
      email: getResponseToken.email,
    };
    const accesstoken = await this.createJwtToken(payload);

    return apiResponse(
      'Access Token Generated Successfully',
      HttpStatus.CREATED,
      {
        accesstoken,
      },
    );
  }

  mailTransport() {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.getOrThrow<string>('GMAIL_USER'),
        clientId: this.configService.getOrThrow<string>('CLIENT_ID'),
        clientSecret: this.configService.getOrThrow<string>('CLIENT_SECRET'),
        refreshToken: this.configService.getOrThrow<string>('GMAIL_REFRESH'),
      },
    });
    return transport;
  }

  async sendEmailAddress(user: {
    to: string;
    subject: string;
    otp: string;
  }): Promise<boolean> {
    const transport = this.mailTransport();
    const sendEmailResponse = await transport.sendMail({
      from: {
        name: 'trackFlow',
        address: this.configService.getOrThrow<string>('GMAIL_USER'),
      },
      to: user.to,
      subject: user.subject,
      html: this.mailService.verificationEmailContent(user.otp),
    });
    return sendEmailResponse?.accepted?.length > 0;
  }

  // MAIN FUNCTIONALITY
  async createAccount(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<CreateAccountResponse>> {
    const { fullName, email, password } = createUserDto;
    const normalizedEmail = email.trim().toLowerCase();

    // check user already exist logic here
    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    // throw error if user already have an account
    if (existingUser) {
      throw new ConflictException(errorMessage.EMAIL_ALREADY_EXISTS);
    }

    // password hasing and data STored in the database
    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepository.create({
      full_name: fullName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Return the Response back to the UI
    return apiResponse<CreateAccountResponse>(
      'Account created successfully',
      HttpStatus.CREATED,
      {
        id: savedUser.id,
        fullName: savedUser.full_name,
        email: normalizedEmail,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at,
      },
    );
  }

  async loginService(body: LoginType, response: Response) {
    const email = body?.email?.trim().toLowerCase();
    const isUserExist = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    // if the user does't exist
    if (!isUserExist) {
      throw new NotFoundException(errorMessage.INVALID_CREDENTIALS);
    }

    // validate the password
    const isValidPassword = await this.validatePassword(
      body.password,
      isUserExist.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException(errorMessage.INVALID_CREDENTIALS);
    }

    // JWT Token Creation Phase
    const payload: JwtPayload = {
      sub: isUserExist.id,
      email: isUserExist.email,
    };

    const accessToken = await this.createJwtToken(payload);

    if (body.rememberMe) {
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      });

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure:
          this.configService.getOrThrow<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return apiResponse(successMessage.LOGIN_SUCCESS, HttpStatus.ACCEPTED, {
      accessToken: accessToken,
    });
  }

  async sentEmailOtp({ email }: sentEmailtype) {
    const endPoint = 'Email Verification EndPoint';

    try {
      const isExistingUser = await this.userRepository.findOne({
        where: {
          email,
          deleted_at: IsNull(),
        },
      });

      // If user not exist error will be thrown
      if (!isExistingUser) {
        throw new UnauthorizedException("User Does't Exist");
      }

      // Expiry Date
      const expiryDate = dayjs().add(1, 'hour').toDate();

      // generate otp
      const otp = randomInt(100000, 1000000).toString();

      // Send OTP
      const sentOtp = await this.sendEmailAddress({
        otp: otp,
        to: email,
        subject: 'Welcome To TrackFlow',
      });

      // If The Email Send Success else throw error
      if (sentOtp) {
        // Save the data to database
        const createOtp = this.userOtpRepository.create({
          otp: await this.hashPassword(otp),
          expiryAt: expiryDate,
          user: isExistingUser,
          userId: isExistingUser.id,
        });

        const createdOtp = await this.userOtpRepository.save(createOtp);

        if (createdOtp && createdOtp?.otp)
          return apiResponse('Email Sent successfull', HttpStatus.CREATED, {});

        throw new HttpException(
          'Failed to store otp',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `${error?.message ?? 'Something Went Wrong'} In ${endPoint}`,
          error?.stack ?? '',
        );
      }

      throw error;
    }
  }

  async resetPassword(body: ResetPasswordDto) {
    const endPoint = 'resetPassword';
    try {
      const { email, otp, password } = body;

      // fetch user and user otp
      const fetchOtp = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userOtps', 'userOtp')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .orderBy('userOtp.created_at', 'DESC')
        .limit(1)
        .getOne();

      // handling the error for invalid user or otp not exist
      if (!fetchOtp) return new UnauthorizedException("user does't exist");
      if (!fetchOtp?.userOtps?.length)
        return new UnauthorizedException('OTP not found or expired');

      // User OTP array
      const userOtp = fetchOtp?.userOtps?.[0];
      if (userOtp?.isUsed) return new UnauthorizedException('OTP Is Expired');

      // Check The Validity of the latest OTP
      const currentTime = dayjs().toDate();
      const expiresTime = userOtp?.expiryAt;
      if (currentTime > expiresTime)
        throw new BadRequestException('OTP expired');

      // Compare OTP
      const compareOtp = await this.validatePassword(otp, userOtp?.otp);
      if (!compareOtp) return new UnauthorizedException('OTP Is Incorrect');

      // Hash New Password
      const hashedPassword = await this.hashPassword(password);

      // Store new password in the user table and softdelete the otp
      fetchOtp.password = hashedPassword;
      await this.userRepository.save(fetchOtp);
      await this.userOtpRepository.update(
        {
          id: userOtp.id,
        },
        { isUsed: true },
      );

      // return the response
      return apiResponse('Password Reset Successfully', HttpStatus.CREATED, {});
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `${error?.message ?? 'Something Went Wrong'} In ${endPoint}`,
          error?.stack ?? '',
        );
      }

      throw error;
    }
  }
}
