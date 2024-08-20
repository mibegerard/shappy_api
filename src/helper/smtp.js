const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendInvitationEmail = async (toEmail, token) => {
    try {
        const info = await transporter.sendMail({
            from: 'salemshahdev@gmail.com',
            to: toEmail,
            subject: "Completer l'inscription",
            html: `<p>Veuillez cliquer sur le lien suivant pour finaliser votre inscription: <a href="${process.env.ORIGIN}/auth/register?token=${token}">Terminer l&apos;inscription</a></p>`,
        });
        console.log("Message sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }

}

