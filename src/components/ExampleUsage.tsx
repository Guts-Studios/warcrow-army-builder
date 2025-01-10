import React from 'react';
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/utils/emailUtils";
import { toast } from "sonner";

const ExampleUsage: React.FC = () => {
  const handleSendTestEmail = async () => {
    try {
      await sendEmail(
        ['test@example.com'],
        'Test Email',
        '<h1>Hello World</h1><p>This is a test email.</p>'
      );
      toast.success('Email sent successfully');
    } catch (error) {
      toast.error('Failed to send test email');
      console.error('Failed to send test email:', error);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleSendTestEmail}>
        Send Test Email
      </Button>
    </div>
  );
};

export default ExampleUsage;