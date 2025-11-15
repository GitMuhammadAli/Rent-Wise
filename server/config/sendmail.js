const nodemailer = require("nodemailer");
const { BOOLEAN } = require("../utils/Roles");

const sendMail = async (to, emailContent ,  next) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || "RentWise <no-reply@rentwise.com>",
            to: to,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
        });
        return { success: BOOLEAN.TRUE, messageId: info.messageId };
    } catch (error) {
        next(error);
    }
};

module.exports = sendMail;
