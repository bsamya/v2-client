import firebaseServer from '../../utils/firebase-server';

export default defineEventHandler(async (event) => {
    const { $auth } = firebaseServer();
    const body = await readBody(event)

    try {
        const expiresIn = 60 * 60 * 24 * 5 * 1000
        const options = {
            expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }
        const authCookie = await $auth.createSessionCookie(body.idToken, options)
        setCookie(event, 'sessionToken', authCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })
        return { status: 200, message: "Auth successful" };

    } catch (error: any) {
        throw createError({ statusCode: 401, message: "Invalid Auth Token" })
    }
})