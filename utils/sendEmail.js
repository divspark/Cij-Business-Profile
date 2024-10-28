const nodemailer = require("nodemailer");


const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const options = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(options);
};



// const nodemailer = require("nodemailer");

// // Create a transporter object using SMTP or Gmail
// const transporter = nodemailer.createTransport({
//   service: "Gmail", // You can also use 'SMTP' if you prefer
//   auth: {
//     user: process.env.EMAIL_USER, // Your email address
//     pass: process.env.EMAIL_PASS, // Your email password or app-specific password
//   },
// });

// // Function to send an email
// const sendEmail = async ({ email, subject, message }) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER, // Sender address
//     to: email, // List of receivers
//     subject: subject, // Subject line
//     text: message, // Plain text body
//     // html: '<p>HTML version of the message</p>' // Optional: HTML body
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${email}`);
//   } catch (error) {
//     console.error(`Failed to send email to ${email}:`, error);
//     throw new Error("Email could not be sent.");
//   }
// };

module.exports = sendEmail;
