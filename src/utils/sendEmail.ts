import { generateResetPasswordToken } from "./tokenUtils";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendResetLink(id: string, email: string) {
  try {
    const accessToken = generateResetPasswordToken(id);
    const resetUrl = `http://localhost:3000/resetPassword/${accessToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: Number(process.env.MAILER_PORT),
      secure: false,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAILER_FROM_ADDRESS,
      to: email,
      subject: "Password Reset Link",
      text: "Link",
      html: `
                <p>Click the following link to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <br />
                <p>Alternatively, you can click the button below:</p>
                <a href="${resetUrl}">
                    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Reset Password</button>
                </a>
            `,
    });

    return { msg: "Check Your Email For Verification" };
  } catch (error) {
    return { error: "Failed to send email" };
  }
}
