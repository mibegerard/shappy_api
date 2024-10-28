const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"Shappy" <${process.env.EMAIL_USERNAME}>`, 
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html || '', // Optional HTML content
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true; // Indicate success
    } catch (error) {
        console.error('Error sending email:', error.message);
        return false; // Indicate failure
    }
};

module.exports = sendEmail;
