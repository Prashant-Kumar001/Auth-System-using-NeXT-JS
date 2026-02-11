export function getEmailTemplate(
  template: string,
  data: Record<string, string | number | boolean> = {},
) {
  switch (template) {
    case "WELCOME":
      return `
        <h2>Welcome ${data.name} 👋</h2>
        <p>Thanks for joining us.</p>
      `;

    case "OTP":
      return `
        <h2>Your OTP</h2>
        <p style="font-size:24px;font-weight:bold;">
          ${data.otp}
        </p>
        <p>This OTP is valid for 5 minutes.</p>
      `;

    case "CONTACT":
      return `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p>${data.message}</p>
      `;

    case "VERIFICATION":
      return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:24px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:22px;">
                  Verify Your Email
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px; color:#374151;">
                <p style="font-size:16px; margin:0 0 16px;">
                  Hello ${data.name || "there"},
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 24px;">
                  Thanks for signing up! Please confirm your email address by clicking the button below.
                </p>

                <!-- Button -->
                <div style="text-align:center; margin:32px 0;">
                  <a href="${data.verificationLink}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      padding:14px 28px;
                      text-decoration:none;
                      border-radius:6px;
                      font-size:16px;
                      font-weight:600;
                      display:inline-block;
                    ">
                    Verify Email
                  </a>
                </div>

                <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                  This link will expire shortly for security reasons.
                  If you didn’t create an account, you can safely ignore this email.
                </p>

                <!-- Divider -->
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

                <p style="font-size:13px; color:#9ca3af;">
                  If the button doesn’t work, copy and paste this link into your browser:
                  <br />
                  <a href="${data.verificationLink}" style="color:#2563eb; word-break:break-all;">
                    ${data.verificationLink}
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                  © ${new Date().getFullYear()} Your App Name. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    case "PASSWORD_RESET":
      return `
        <h2>Password Reset Requested</h2>
        <p>Hello ${data.name || "there"},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${data.resetUrl}" style="background:#2563eb; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; font-weight:600; display:inline-block;">Reset Password</a>
      `;

    default:
      return "";
  }
}

export function getVerificationEmailHtml({
  name,
  verifyUrl,
}: {
  name?: string;
  verifyUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 16px;">
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#111827; padding:24px; text-align:center;">
                <h1 style="margin:0; color:#ffffff; font-size:22px;">
                  Verify Your Email
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px; color:#374151;">
                <p style="font-size:16px; margin:0 0 16px;">
                  Hello ${name || "there"},
                </p>

                <p style="font-size:15px; line-height:1.6; margin:0 0 24px;">
                  Thanks for signing up! Please confirm your email address by clicking the button below.
                </p>

                <!-- Button -->
                <div style="text-align:center; margin:32px 0;">
                  <a href="${verifyUrl}"
                    style="
                      background:#2563eb;
                      color:#ffffff;
                      padding:14px 28px;
                      text-decoration:none;
                      border-radius:6px;
                      font-size:16px;
                      font-weight:600;
                      display:inline-block;
                    ">
                    Verify Email
                  </a>
                </div>

                <p style="font-size:14px; line-height:1.6; color:#6b7280;">
                  This link will expire shortly for security reasons.
                  If you didn’t create an account, you can safely ignore this email.
                </p>

                <!-- Divider -->
                <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

                <p style="font-size:13px; color:#9ca3af;">
                  If the button doesn’t work, copy and paste this link into your browser:
                  <br />
                  <a href="${verifyUrl}" style="color:#2563eb; word-break:break-all;">
                    ${verifyUrl}
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                  © ${new Date().getFullYear()} Your App Name. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
