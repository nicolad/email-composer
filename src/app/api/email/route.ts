import { NextRequest, NextResponse } from "next/server";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { body, subject, emailAddress } = await req?.json();
    const html = body.replace(/\n/g, "<br>");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const info: SentMessageInfo = await transporter.sendMail({
      from: "nicolai.vadim@gmail.com",
      to: emailAddress,
      subject: subject,
      html,
      bcc: "nicolai.vadim@gmail.com",
    });

    if (info.messageId) {
      const sentEmail = await prisma.sentEmail.create({
        data: {
          from: "nicolai.vadim@gmail.com", // Or the actual sender's email
          to: emailAddress,
          subject: subject,
          body: body, // or `html` if you want to store the HTML version
          userId: "your-user-id", // Replace with the actual user ID, if applicable
        },
      });

      return NextResponse.json(
        "Email sent successfully. Please check your inbox for a copy of the email.",
        { status: 200 }
      );
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
