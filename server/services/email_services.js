const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL, // Set in .env file
    pass: process.env.BREVO_API_KEY, // Set in .env file
  },
});

const sendEmail = async (recipients, subject, text = "", html = "") => {
  try {
    const mailOptions = {
      from: process.env.BREVO_EMAIL,
      to: recipients,
      subject: String(subject), // Ensure subject is a string
      text: String(text), // Ensure text is a string
      html: String(html), // Ensure html is a string
      priority: "high",
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
