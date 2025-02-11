import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../errors/appError';

export type TEmailPayload = {
  receiver: string;
  subject: string;
  text?: string;
  html: string;
};

const sendEmail = async (payload: TEmailPayload) => {
  const { receiver, subject, html, text } = payload;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: config.env === 'production',
    auth: {
      user: config.node_mailer.my_email_address,
      pass: config.node_mailer.email_app_password,
    },
  });

  const mailOptions = {
    from: config.node_mailer.my_email_address,
    to: receiver,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // eslint-disable-next-line no-console
    console.log(info);
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send verification email.',
    );
  }
};

export const getValidateMailContent = ({
  redirectUrl,
}: {
  redirectUrl: string;
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset styles for email clients */
        body, table, td, div, p, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        table {
            border-collapse: collapse !important;
        }
        /* Base styles */
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-width: 100%;
            background-color: #f8fafc;
        }
        /* Responsive styles */
        @media only screen and (max-width: 640px) {
            .main-container {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body style="background-color: #f8fafc;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" class="main-container" style="width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td class="content" style="padding: 40px;">
                            <!-- Logo -->
                            <table role="presentation" style="width: 100%; margin-bottom: 32px;">
                                <tr>
                                    <td align="center">
                                        <img src="https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=100&h=100&fit=crop&auto=format" alt="Logo" style="width: 64px; height: 64px; border-radius: 50%;">
                                    </td>
                                </tr>
                            </table>

                            <!-- Header -->
                            <h1 style="color: #1a202c; font-size: 24px; font-weight: 700; text-align: center; margin: 0 0 24px 0;">
                                Verify Your Email Address
                            </h1>

                            <!-- Main content -->
                            <p style="color: #4a5568; font-size: 16px; line-height: 24px; margin-bottom: 24px; text-align: center;">
                                Thanks for signing up! Please verify your email address by clicking the button below.
                            </p>

                            <!-- Button -->
                            <table role="presentation" style="width: 100%; margin: 32px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${redirectUrl}" style="
                                            background-color: #4f46e5;
                                            border-radius: 6px;
                                            color: #ffffff;
                                            display: inline-block;
                                            font-size: 16px;
                                            font-weight: 600;
                                            line-height: 1;
                                            padding: 16px 32px;
                                            text-decoration: none;
                                            text-align: center;
                                            transition: background-color 0.2s;">
                                            Verify Email Address
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Alternative link -->
                            <p style="color: #4a5568; font-size: 14px; line-height: 24px; margin-bottom: 24px; text-align: center;">
                                If the button doesn't work, copy and paste this link into your browser:
                                <br>
                                <a href="${redirectUrl}" style="color: #4f46e5; text-decoration: none; word-break: break-all;">${redirectUrl}</a>
                            </p>

                            <!-- Footer -->
                            <table role="presentation" style="width: 100%; margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
                                <tr>
                                    <td>
                                        <p style="color: #718096; font-size: 14px; line-height: 24px; margin: 0; text-align: center;">
                                            If you didn't create an account, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Company footer -->
                <table role="presentation" style="width: 600px; margin-top: 24px;">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="color: #718096; font-size: 14px; margin: 0;">
                                © \${new Date().getFullYear()} Your Company. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export default sendEmail;
