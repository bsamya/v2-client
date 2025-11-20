
export default defineEventHandler(async (event) => {


    try {
        setCookie(event, 'sessionToken', "", { maxAge: -1 })
        return { status: 200, message: "Logout successful" };

    } catch (error: any) {
        throw createError({ statusCode: 401, message: "Error loggging out" })
    }
})