import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma";
import nodemailer from "nodemailer";
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
    },
});




export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    trustedOrigins: [process.env.APP_URL!],
    //user table e extra  feature add korar jonno amra eikhane sei fields gula diye dilam
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                const info = await transporter.sendMail({
                    from: `"Prisma Blog <${process.env.APP_USER}>"`,
                    to: user.email,
                    subject: "Verify your email — Prisma Blog ",
                    html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }
      .content {
        color: #555;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 20px;
        background-color: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        color: #888;
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Verify Your Email</div>

      <div class="content">
        <p>Hi <strong>${user.name || "there"}</strong>,</p>

        <p>
          Thanks for signing up for <strong>Prisma Blog</strong>!  
          Please verify your email address to complete your registration.
        </p>

        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">
            Verify Email
          </a>
        </p>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p style="word-break: break-all; color: #4f46e5;">
          ${verificationUrl}
        </p>

        <p>
          If you didn’t create an account, you can safely ignore this email.
        </p>

        <p>Best regards,<br/>Prisma Blog Team</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `,
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.log(error)
                throw error;
            }
        },
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }
    }
});