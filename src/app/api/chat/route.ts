import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const TEMPLATE = `Extract the requested fields from the input.

Write a short email

Specify about which opportunity you are writing,

Use spaces between sentences, use <<NEWLINE>> instead of new line.

Try not to start with "I" or "We".

Don't write introduction and footer, it's in the template.

Make it concise, but not too short.

Tone: formal, polite, friendly.

Input:

{input}`;

export async function POST(req: Request) {
  const { context, content, recipientName } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const stream = openai.beta.chat.completions.stream({
    model: "gpt-4-1106-preview",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: TEMPLATE.replace("{input}", content).replace(
          "{recipientName}",
          recipientName
        ),
      },
      { role: "user", content: `Email post context: ${context}` },
      { role: "user", content },
      {
        role: "system",
        content:
          'Please write email in JSON format. For example, { "subject": "Hello", "body": "World" }',
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  return new Response(stream.toReadableStream());
}
