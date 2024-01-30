import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/EmailTemplate";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { body, subject, emailAddress, firstName } = await req?.json();

    const { data, error } = await resend.emails.send({
      from: "Vadim Nicolai <contact@vadim.blog>",
      bcc: ["nicolai.vadim@gmail.com"],
      to: [emailAddress],
      subject,
      text: "",
      react: EmailTemplate({
        body,
        firstName,
      }),
    });

    console.log(error);

    if (!error) {
      const sentEmail = await prisma.sentEmail.create({
        data: {
          to: emailAddress,
          subject: subject,
          body: body,
          userId: "d174ea22-c8e2-406a-a7ed-eecf26086dd7",
        },
      });

      return NextResponse.json(
        "Email sent successfully. Please check your inbox for a copy of the email.",
        { status: 200 }
      );
    }

    return NextResponse.json(
      "There was an error sending the email. Please try again.",
      { status: 500 }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
