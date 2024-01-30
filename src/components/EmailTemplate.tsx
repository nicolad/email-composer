import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  body: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  body,
}) => (
  <div>
    <p>Dear {firstName},</p>
    <p>
      {body.split("<<NEWLINE>>").map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </p>
    <p>Best regards,</p>
    <p>Vadim Nicolai</p>
  </div>
);
