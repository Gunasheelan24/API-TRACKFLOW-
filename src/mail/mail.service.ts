import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  verificationEmailContent(verificationCode: string, email: string) {
    const url = `${this.configService.getOrThrow<string>('HOST')}auth/reset-password/${email}`;

    return ` 
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email | TrackFlow</title>
      </head>
      
      <body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f7;">
          <tr>
            <td align="center" style="padding:40px 16px;">
      
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;">      
                <tr>
                  <td style="background-color:#171c35;padding:32px;">
      
                    <h2 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;">
                      Track<span>Flow</span>
                    </h2>
      
                    <p style="margin:8px 0 0;color:#c7d2fe;font-size:13px;">
                      A better way to stay on track.
                    </p>
      
                  </td>
                </tr>
      
                <tr>
                  <td style="padding:36px 32px;">
      
                    <h1 style="margin:0 0 14px;color:#111827;font-size:27px;line-height:1.3;">
                      You're almost there! 👋
                    </h1>
      
                    <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.8;">
                      Welcome to TrackFlow! Just one more step to get started.
                      Use the verification code below to confirm your email
                      address and activate your account.
                    </p>
      
                    <!-- VERIFICATION CODE -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                      style="background-color:#f1f3ff;border:1px solid #e0e7ff;border-radius:10px;">
      
                      <tr>
                        <td align="center" style="padding:28px 16px;">
      
                          <p style="margin:0 0 14px;color:#6366f1;font-size:12px;font-weight:bold;letter-spacing:2px;">
                            YOUR VERIFICATION CODE
                          </p>
      
                          <p style="margin:0;color:#3730a3;font-family:monospace;font-size:34px;font-weight:bold;letter-spacing:6px;">
                            ${verificationCode}
                          </p>
      
                          <p style="margin:14px 0 0;color:#64748b;font-size:12px;">
                            Enter this code in TrackFlow
                          </p>
      
                        </td>
                      </tr>
                    </table>
      
                    <p style="margin:20px 0 28px;color:#64748b;font-size:13px;line-height:1.7;">
                      &#128274; For your security, never share this
                      verification code with anyone.
                    </p>
      
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-top:1px solid #e5e7eb;"></td>
                      </tr>
                    </table>
      
                    <p style="margin:28px 0 20px;color:#475569;font-size:14px;line-height:1.7;text-align:center;">
                      Ready to get things moving?<br />
                      Visit TrackFlow using the link below.
                    </p>
      
                    <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                      <tr>
                        <td align="center" bgcolor="#4f46e5" style="border-radius:8px;">
                          <a
                            href="${url}"
                            target="_blank"
                            style="display:inline-block;padding:15px 34px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;border-radius:8px;"
                          >
                            Visit TrackFlow &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
    
                    <p style="margin:32px 0 0;color:#94a3b8;font-size:13px;line-height:1.7;">
                      Didn't request a TrackFlow account?
                      No worries, you can safely ignore this email.
                    </p>
      
                    <p style="margin:28px 0 0;color:#475569;font-size:14px;line-height:1.7;">
                      See you inside,<br />
                      <strong style="color:#111827;">The TrackFlow Team</strong>
                    </p>
      
                  </td>
                </tr>
      
                <tr>
                  <td align="center" style="background-color:#f8fafc;border-top:1px solid #e5e7eb;padding:24px 32px;">
      
                    <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                      &copy; TrackFlow &middot; Organize. Focus. Achieve.
                    </p>
      
                    <p style="margin:8px 0 0;color:#94a3b8;font-size:11px;line-height:1.6;">
                      This is an automated verification email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }

  resetPasswordEmailContent(resetLink: number) {
    return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reset your TrackFlow password</title>
          </head>
          <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:40px 16px;">
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="max-width:560px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;"
                  >
                    <tr>
                      <td style="padding:28px 32px;border-bottom:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:26px;font-weight:bold;">
                          TrackFlow
                        </p>
                        <p style="margin:8px 0 0;color:#6b7280;font-size:13px;">
                          Keep your work moving.
                        </p>
                      </td>
                    </tr>
        
                    <tr>
                      <td style="padding:32px;">
                        <h1 style="margin:0 0 16px;color:#111827;font-size:26px;line-height:1.3;">
                          Reset your password
                        </h1>
        
                        <p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.7;">
                          We received a request to reset the password for your
                          TrackFlow account. Click the button below to choose
                          a new password.
                        </p>
        
                        <table role="presentation" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#def7e5" style="border-radius:8px;">
                              <a
                                href="${resetLink}"
                                style="display:inline-block;padding:16px 28px;border-radius:8px;color: black;font-size:16px;font-weight:bold;text-decoration:none;"
                              >
                                Reset password
                              </a>
                            </td>
                          </tr>
                        </table>
        
        
                        <p style="margin:24px 0 12px;color:#4b5563;font-size:14px;line-height:1.6;">
                          Keep this link private. Don't share it with anyone.
                        </p>
        
                        <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                          If you didn't request a password reset, you can safely
                          ignore this email. Your password hasn't changed.
                        </p>
        
                        <p style="margin:28px 0 0;color:#4b5563;font-size:14px;line-height:1.6;">
                          Thanks,<br />
                          <strong style="color:#111827;">The TrackFlow Team</strong>
                        </p>
                      </td>
                    </tr>
        
                    <tr>
                      <td style="padding:20px 32px;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;line-height:1.6;">
                          TrackFlow · Organize your tasks. Track your progress.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>`;
  }
}
