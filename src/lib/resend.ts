import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "ClipVerse <onboarding@resend.dev>";
const BASE_URL = process.env.AUTH_URL || "https://clipverse-tan.vercel.app";

export async function sendPasswordResetEmail(email: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}`;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your ClipVerse password",
    html: emailHtml({
      title: "Reset your password",
      body: "Click the button below to reset your password. This link expires in 1 hour.",
      ctaText: "Reset Password",
      ctaUrl: link,
      footer: "If you didn&apos;t request a password reset, you can safely ignore this email.",
    }),
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}`;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your ClipVerse email",
    html: emailHtml({
      title: "Verify your email address",
      body: "Thanks for signing up! Click the button below to verify your email address.",
      ctaText: "Verify Email",
      ctaUrl: link,
      footer: "If you didn&apos;t create a ClipVerse account, you can safely ignore this email.",
    }),
  });
}

function emailHtml({
  title,
  body,
  ctaText,
  ctaUrl,
  footer,
}: {
  title: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  footer: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:22px;font-weight:700;background:linear-gradient(90deg,#a78bfa,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">ClipVerse</span>
            </td>
          </tr>
          <tr>
            <td style="background:#18181b;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:40px 36px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#ffffff;">${title}</h1>
              <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">${body}</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#7c3aed,#a855f7);">
                    <a href="${ctaUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${ctaText}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.5;">${footer}</p>
              <hr style="margin:24px 0;border:none;border-top:1px solid rgba(255,255,255,0.06);" />
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">Or copy this link: <span style="color:rgba(255,255,255,0.35);">${ctaUrl}</span></p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);">&copy; ${new Date().getFullYear()} ClipVerse. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
