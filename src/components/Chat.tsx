"use client";

import { useState } from "react";
import axios from "axios";
import { Input, Button, Row, Col } from "antd";
import TextArea from "antd/lib/input/TextArea";

export function Chat() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState<any>();
  const [emailContext, setEmailContext] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [emailSubject, setEmailSubject] = useState();
  const [emailBody, setEmailBody] = useState();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/chat", {
        content: inputText,
        recipientName,
      });
      const response = res?.data?.result?.choices?.[0]?.message?.content;
      const parsedResponse = JSON.parse(response);
      setEmailBody(parsedResponse?.body);
      setEmailSubject(parsedResponse?.subject);
    } catch (error) {
      console.error("Error:", error);
      setResponseText("An error occurred.");
    }
  };

  const handleSendEmail = async () => {
    try {
      const response = await axios.post("/api/email", {
        emailAddress,
        subject: emailSubject,
        body: emailBody,
        recipientName,
      });
      // const { data } = await supabase.from("emails").insert({
      //   recipient: emailAddress,
      //   subject: emailSubject,
      //   body: emailBody,
      //   sent_at: new Date(),
      // });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
          <TextArea
            placeholder="Context"
            value={emailContext}
            onChange={(e) => setEmailContext(e.target.value)}
            autoSize={{ minRows: 5, maxRows: 10 }}
          />
          <Input
            placeholder="Recipient Name"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
          <TextArea
            placeholder="Ask something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Col>
      <Col span={12}>
        <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
          <Input
            placeholder="Email Address"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          <Input
            placeholder="Email Subject"
            value={emailSubject}
            onChange={(e: any) => setEmailSubject(e.target.value)}
          />
          <TextArea
            placeholder="Email Body"
            value={emailBody}
            onChange={(e: any) => setEmailBody(e.target.value)}
            autoSize={{ minRows: 5 }}
          />
          <Button type="primary" onClick={handleSendEmail}>
            Send Email
          </Button>
        </div>
      </Col>
    </Row>
  );
}
