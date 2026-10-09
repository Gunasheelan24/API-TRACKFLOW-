import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  verificationEmailContent(verificationCode: string) {
    return `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to TrackFlow</title>
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
                          Welcome to TrackFlow!
                        </h1>
        
                        <p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.7;">
                          You're almost ready to get started. Enter the verification
                          code below in TrackFlow to confirm your email and complete
                          your account setup.
                        </p>
        
                        <table
                          role="presentation"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          style="background-color:#eef2ff;border-radius:8px;"
                        >
                          <tr>
                            <td align="center" style="padding:24px;">
                              <p style="margin:0 0 12px;color:#6b7280;font-size:12px;letter-spacing:1px;">
                                YOUR VERIFICATION CODE
                              </p>
                              <p style="margin:0;color:#4338ca;font-family:monospace;font-size:32px;font-weight:bold;letter-spacing:6px;">
                                ${verificationCode}
                              </p>
                            </td>
                          </tr>
                        </table>
        
                        <p style="margin:24px 0 12px;color:#4b5563;font-size:14px;line-height:1.6;">
                          Keep this code private. Don't share it with anyone.
                        </p>
        
                        <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                          If you didn't request a TrackFlow account, you can safely
                          ignore this email.
                        </p>
        
                        <p style="margin:28px 0 0;color:#4b5563;font-size:14px;line-height:1.6;">
                          See you inside,<br />
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
