import email from "next-auth/providers/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
console.log(process.env.RESEND_API_KEY);

export const sendVervicationEmail = async (email: string, token: string) => {
  try {
    const conformationLink = `${domain}/auth/new-verification?token=${token}`;
    // console.log(email);
    // console.log(token);
    console.log(conformationLink);
    await resend.emails.send({
      from: "mail@saharej.com",
      to: [email],
      subject: "Confirm your email",
      html: `<p>
                Click <a href="${conformationLink}">here</a> to confirm email.
            </p>`,
    });
  } catch (error) {
    console.log(error);
  }
};
export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const conformationLink = `${domain}/auth/new-password?token=${token}`;
    //console.log(email);
    // console.log(token);
    console.log(conformationLink);
    await resend.emails.send({
      from: "mail@saharej.com",
      to: [email],
      subject: "reset your password",
      html: `<p>
                Click <a href="${conformationLink}">here</a> to reset your password.
            </p>`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "mail@saharej.com",
    to: [email],
    subject: "2FA Code",
    html: `<p>
              your 2FA Code: ${token}
          </p>`,
  });
};
