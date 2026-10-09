import {
  ExceptionFilter,
  Logger,
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();

    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Internal server error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const responseMessage = (
        exceptionResponse as {
          message: string | string[];
        }
      ).message;

      message = responseMessage;
    }

    const errorName =
      exception instanceof Error ? exception.name : 'UnknownException';

    const stack = exception instanceof Error ? exception.stack : undefined;

    // Server side logging
    this.logger.error(
      `${request.method} ${request.url} - ${statusCode} - ${JSON.stringify(message)}`,
      stack,
    );

    // Client response
    response.status(statusCode).json({
      success: false,
      statusCode,
      error: errorName,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
