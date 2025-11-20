import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';
import 'dotenv/config';

export default defineEventHandler(async (event) => {
    const apiKey = process.env.NUXT_MAILER_API; // Use the correct environment variable name

    if (!apiKey) {
        throw new Error('NUXT_MAILER_API is not defined in the environment variables.');
    }

    const mailerSend = new MailerSend({
        apiKey
    });



    const recipients = [
        new Recipient("bsamya@gmail.com", "Behrouz Samia"),
    ];


    const personalization = [
        {
            email: "bsamya@gmail.com",
            data: {
                name: "Behrouz",
                email: "bsamya@gmail.com",
                url: 'https://swiftdox.com',
            },
        }
    ];

    const emailParams = new EmailParams()
        .setTo(recipients)
        .setTemplateId("pq3enl68e5r42vwr")
        .setPersonalization(personalization)


    try {
        await mailerSend.email.send(emailParams)
        return { status: 200, message: "Email sent" }
    }
    catch (error) {
        return { status: 401, message: "Email failed", error }
    }

});
