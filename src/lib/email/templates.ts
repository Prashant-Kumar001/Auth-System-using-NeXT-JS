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

    case "DELETE_ACCOUNT":

      return `
        <div style="
  background:#f4f6f8;
  padding:40px 20px;
  font-family:Arial, Helvetica, sans-serif;
">

  <div style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    box-shadow:0 4px 12px rgba(0,0,0,0.08);
  ">

    <!-- Header -->
    <div style="
      background:linear-gradient(135deg,#ef4444,#dc2626);
      color:#ffffff;
      padding:24px;
      text-align:center;
    ">
      <h2 style="margin:0;">Account Deletion Requested</h2>
    </div>

    <!-- Body -->
    <div style="padding:32px; color:#1f2937;">

      <p style="font-size:16px;">
        Hello <strong>${data.name || "there"}</strong>,
      </p>

      <p style="font-size:15px; line-height:1.6; color:#4b5563;">
        We received a request to permanently delete your account. This action will remove all your data and cannot be undone.
      </p>

      <!-- Warning Box -->
      <div style="
        background:#fef2f2;
        border:1px solid #fecaca;
        padding:16px;
        border-radius:8px;
        margin:24px 0;
        color:#991b1b;
        font-size:14px;
      ">
        ⚠️ <strong>Warning:</strong> Once deleted, your account and all associated data will be permanently removed.
      </div>

      <p style="font-size:15px; color:#4b5563;">
        Click the button below to confirm account deletion:
      </p>

      <!-- Button -->
      <div style="text-align:center; margin:32px 0;">
        <a href="${data.DeleteLink}"
          style="
            background:#dc2626;
            color:#ffffff;
            padding:14px 28px;
            text-decoration:none;
            border-radius:8px;
            font-size:16px;
            font-weight:600;
            display:inline-block;
          ">
          Delete My Account
        </a>
      </div>

      <!-- Alternate link -->
      <p style="font-size:13px; color:#6b7280;">
        Or copy and paste this link into your browser:
      </p>

      <p style="
        font-size:13px;
        word-break:break-all;
        color:#2563eb;
      ">
        ${data.DeleteLink}
      </p>

      <p style="
        font-size:14px;
        margin-top:24px;
        color:#6b7280;
      ">
        If you did not request this, you can safely ignore this email. Your account will remain active.
      </p>

      <p style="
        font-size:14px;
        color:#6b7280;
      ">
        This link may expire for security reasons.
      </p>

    </div>

    <!-- Footer -->
    <div style="
      background:#f9fafb;
      padding:20px;
      text-align:center;
      font-size:13px;
      color:#9ca3af;
    ">
      © ${new Date().getFullYear()} Your App Name. All rights reserved.
      <br/>
      Need help? Contact support at
      <a href="mailto:support@yourapp.com"
        style="color:#dc2626; text-decoration:none;">
        support@yourapp.com
      </a>
    </div>

  </div>

  <!-- Bottom note -->
  <div style="
    max-width:600px;
    margin:16px auto 0;
    text-align:center;
    font-size:12px;
    color:#9ca3af;
  ">
    This is an automated message. Please do not reply.
  </div>

</div>

        `;
    
    case "ORGANIZATION_INVITATION":
      return `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Organization Invitation</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      width: 100%;
      padding: 20px;
      background-color: #f4f6f8;
    }

    .card {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
      font-size: 22px;
      font-weight: bold;
      color: #2563eb;
    }

    .title {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 15px;
    }

    .text {
      font-size: 15px;
      color: #374151;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .info-box {
      background-color: #f9fafb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #111827;
    }

    .info-box strong {
      display: inline-block;
      width: 120px;
      color: #6b7280;
    }

    .button {
      text-align: center;
      margin-top: 25px;
    }

    .button a {
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 15px;
      font-weight: bold;
      display: inline-block;
    }

    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }

  </style>
</head>
<body>

  <div class="container">
    <div class="card">

      <div class="logo">
        Your Organization
      </div>

      <div class="title">
        You're invited to join an organization 🎉
      </div>

      <div class="text">
        Hello <strong>${data.email}</strong>,<br><br>

        <strong>${data.inviter}</strong> has invited you to join the organization
        <strong>${data.organization}</strong>.
      </div>

      <div class="info-box">
        <div><strong>Email:</strong> ${data.email}</div>
        <div><strong>Organization:</strong> ${data.organization}</div>
        <div><strong>Invited by:</strong> ${data.inviter}</div>
      </div>

      <div class="button">
        <a href="${process.env.BATTER_AUTH_URL}/organizations/invites/${data.invitation}" target="_blank">
          Accept Invitation
        </a>
      </div>

      <div class="footer">
        If you did not expect this invitation, you can safely ignore this email.
      </div>

    </div>
  </div>

</body>
</html>
`
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
