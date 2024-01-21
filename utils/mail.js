const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_SEND,
            pass: process.env.PASSWORD_EMAIL_SEND,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
};

const mailSendResetPassword = async (email, otp) => {
    const mailOptions = {
        from: 'Home_IoT',
        to: email,
        subject: 'Password Reset',
        text: 'Some content to send',
        html: `This is your verification code to retrieve your password: ${otp}. It lasts for 5 minutes and should be stored carefully. Do not give this code to anyone.`,
    };

    const transporter = createTransporter();

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { mailSendResetPassword };
