import firebase from "../../utils/firebase-server";
import { type ActionCodeSettings } from "firebase/auth";

import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const appBaseUrl = process.env.APP_BASE_URL;


    const actionCodeSettings: ActionCodeSettings = {
        //url: `${host}/auth/login`,
        url: `${appBaseUrl}/auth/login`,
        handleCodeInApp: true,
        //linkDomain: host
    };

    try {
        const { $auth } = firebase();
        //generate email verification link
        const url = await $auth.generateEmailVerificationLink(body.email, actionCodeSettings)

        // Check if the user exists before generating the link
        const user = await $auth.getUserByEmail(body.email);

        if (!user) {
            throw createError({
                status: 404,
                message: `User with email ${body.email} not found.`,
            });
        }
        if (user.emailVerified) {
            throw createError({
                status: 400,
                message: `User with email ${body.email} is already verified.`,
            });
        }

        //send confirmation email
        const apiKey = process.env.NUXT_MAILER_API; // Use the correct environment variable name

        if (!apiKey) {
            throw new Error('NUXT_MAILER_API is not defined in the environment variables.');
        }

        const mailerSend = new MailerSend({ apiKey });

        const recipients = [
            new Recipient(body.email, user.displayName),
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

        return { status: 200, message: "Email Sent" }

    } catch (error: any) {
        throw createError({
            status: 401,
            message: error.message,
        })
    }
});
