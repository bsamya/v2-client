import nodemailer from 'nodemailer';


export async function sendMail(mailOptions: any) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const mailResult = { error: false, message: "", success: true };
    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            mailResult.error = true;
            mailResult.message = error;

        } else {
            mailResult.success = true;

        }
    });

    return mailResult;
}