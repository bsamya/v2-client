import firebase from '../../utils/firebase-server';
import { type ActionCodeSettings } from "firebase/auth";

import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';
import 'dotenv/config';


export default defineEventHandler(async (event) => {
    const { $auth } = firebase();
    const body = await readBody(event)
    const appBaseUrl = process.env.APP_BASE_URL;
    //const host = getRequestHeader(event, 'host');
    const user = {
        email: body.email,
        password: body.password,
        displayName: body.displayName,
        emailVerified: false,
        disabled: false
    };
    const actionCodeSettings: ActionCodeSettings = {
        //url: `${host}/auth/login`,
        url: `${appBaseUrl}/auth/login`,
        handleCodeInApp: true,
        //linkDomain: host
    };
    try {
        //create user
        await $auth.createUser(user)

        //generate email verification link
        const url = await $auth.generateEmailVerificationLink(body.email, actionCodeSettings)

        //send confirmation email
        const apiKey = process.env.NUXT_MAILER_API; // Use the correct environment variable name

        if (!apiKey) {
            throw new Error('NUXT_MAILER_API is not defined in the environment variables.');
        }

        const mailerSend = new MailerSend({ apiKey });

        const recipients = [
            new Recipient(body.email, body.displayName),
        ];

        const personalization = [
            {
                email: body.email,
                data: {
                    name: body.displayName,
                    email: body.email,
                    url,
                },
            }
        ];

        const emailParams = new EmailParams()
            .setTo(recipients)
            .setTemplateId("pq3enl68e5r42vwr")
            .setPersonalization(personalization)

        await mailerSend.email.send(emailParams)

        return { status: 200, message: "User created" }

    } catch (error: any) {
        return {
            status: 401,
            message: `Account registration failed (${error.message})`,
        }
    }

})





// try {

//     return body;

//     $auth.createUser({
//         email: body.email,
//         password: body.password,
//         displayName: body.displayName,
//         emailVerified: false,
//         disabled: false
//     })
//     const actionCodeSettings: ActionCodeSettings = {
//         url: `${host}/auth/login`,
//         handleCodeInApp: true,
//     };

//     const link = await $auth.generateEmailVerificationLink(body.email, actionCodeSettings)


//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.MAIL_USER,
//             pass: process.env.MAIL_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: 'bsamia@swiftdox.com',
//         to: body.email,
//         subject: 'CONFIRMATION EMAIL FOR YOUR SWIFTDOX ACCOUNT',
//         html: `<a href="${link}">Click to verify your account!</a>`,
//     };

//     const mailResult = { error: false, message: "", success: true };

//     transporter.sendMail(mailOptions, (error: any, info: any) => {
//         if (error) {
//             mailResult.error = true;
//             mailResult.message = error;

//         } else {
//             mailResult.success = true;

//         }
//     });

//     return { status: 200, message: "User created", link };


// } catch (error: any) {
//     throw createError({ status: 401, message: "Account registration failed" })
// }