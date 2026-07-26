// Dev-mode "mailer" — no email provider is wired up yet, so instead of
// sending a real email this logs the link to the server console. The
// token itself is already persisted on the User row too, so it's also
// inspectable via `npx prisma studio` if the console output scrolled away.
//
// Swap the inside of `sendMail` for a real provider (Resend, SMTP via
// Nodemailer, etc.) when ready to go live — every call site that imports
// this stays the same.

interface MailPayload {
  to: string;
  subject: string;
  actionLabel: string;
  actionUrl: string;
}

export async function sendMail({ to, subject, actionLabel, actionUrl }: MailPayload) {
  console.log(
    `\n📧 [dev-mode email — no provider configured]\nTo:      ${to}\nSubject: ${subject}\n${actionLabel}: ${actionUrl}\n`
  );
}

export function appUrl(path: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}
