import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const msg = {
    to,
    from: process.env.EMAIL_ADDRESS as string,
    subject, 
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error al enviar email:", error);
    throw error;
  }
};
