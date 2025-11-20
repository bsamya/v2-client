export default defineNuxtRouteMiddleware(async (to, from) => {
  // Make sure this middleware only runs on the client
  // This check is redundant due to the .client suffix, but good for clarity.
  //if (process.server) return;

  const auth = useAuth();


  const isLoggedIn = Boolean(auth.user.value);
  const isAuthRequired = to.meta.authRequired === true;


  console.log("Auth Middleware: isLoggedIn =", isLoggedIn, "isAuthRequired =", isAuthRequired);


  // This logic will run on client-side navigation.
  // The onAuthStateChanged listener in your plugin/composable should handle the initial user state.
  if (isAuthRequired && !isLoggedIn) {
    console.info("User not authenticated, redirecting to login page.");
    return navigateTo('/auth/login');
  }
});