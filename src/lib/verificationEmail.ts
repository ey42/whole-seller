import "server-only"; 
export async function sendVerificationEmail(to: string, html: string) {
    const {Resend} = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY!);

  return resend.emails.send({
    from: "Eyob whole-seller <onboarding@resend.dev>",
    to,
    subject: "Verify your email",
    html,
  });
}
export async function sendRequestEmail(to: string, html: string) {

  const {Resend} = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY!);

  return resend.emails.send({
    from: "Eyob whole-seller <onboarding@resend.dev>",
    to,
    subject: "Reset your password",
    html,
  });
}
