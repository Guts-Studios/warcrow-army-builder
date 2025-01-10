import { sendEmail } from "@/utils/emailUtils";

// Example usage:
const handleSendTestEmail = async () => {
  try {
    await sendEmail(
      ['test@example.com'],
      'Test Email',
      '<h1>Hello World</h1><p>This is a test email.</p>'
    );
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
};