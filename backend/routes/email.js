const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-booking-confirmation', async (req, res) => {
  const { name, email, hotelName, bookingId, mobile } = req.body;

  console.log(`📧 Attempting to send booking confirmation to: ${email}`);

  // If credentials are missing, we log it and simulate success for the user experience
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set in .env. Email sending skipped.');
    console.log('--- Email Content ---');
    console.log(`To: ${email}`);
    console.log(`Subject: Booking Confirmation - ${hotelName}`);
    console.log(`Body: Hello ${name}, your booking for ${hotelName} (ID: ${bookingId}) is confirmed.`);
    console.log('----------------------');
    return res.status(200).json({ success: true, message: 'Simulation: Email logged to console' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🏨 Booking Confirmed: ${hotelName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #4f46e5, #9333ea); padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">Booking Confirmed!</h1>
        </div>
        <div style="padding: 30px; color: #333;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your booking has been successfully processed. Here are your details:</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Hotel:</strong> ${hotelName}</p>
            <p style="margin: 5px 0;"><strong>Booking ID:</strong> <span style="font-family: monospace; color: #4f46e5;">${bookingId}</span></p>
            <p style="margin: 5px 0;"><strong>Guest:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Mobile:</strong> ${mobile}</p>
          </div>
          <p>Thank you for choosing AI Trip Planner!</p>
        </div>
        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          &copy; 2026 AI Trip Planner. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
