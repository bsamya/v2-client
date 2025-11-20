// This file is used to check if the user is authenticated or not
// If the user is authenticated, the user object is added to the event context
// If the user is not authenticated, the user object is set to false in the event context
// This middleware is used in the serverless function to check if the user is authenticated or not

import useFirebaseServer from "../utils/firebase-server"

export default defineEventHandler(async (event) => {
    const sessionToken = getCookie(event, 'sessionToken')
    const { isLoggedIn } = useFirebaseServer()
    if (!sessionToken) {
        event.context.user = false;
        return;
    }
    try {

        await isLoggedIn(sessionToken)
            .then((decodedClaims) => {
                event.context.user = decodedClaims;
            })
    }
    catch (e) {
        console.log(e)
        event.context.user = false;
        return;
    }
})

