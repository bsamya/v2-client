import { type ActionCodeSettings, applyActionCode, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updateProfile, onAuthStateChanged, type User, verifyPasswordResetCode, confirmPasswordReset, verifyBeforeUpdateEmail } from "firebase/auth";
export const useAuth = () => {
  const user = useState<User | null>('user')
  const { $auth } = useNuxtApp();

  async function login(email: string, password: string) {
    console.log("Logging in with email and password:", email, password);

    //sign in the user
    //if email is not verified send email and signout
    //if verified signin on the server

    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password);
      console.log("Logged in successfully", userCredential.user);

      if (userCredential.user.emailVerified === false) {
        //if user account is not verified send email & signout
        // Send verification email
        const actionCodeSettings: ActionCodeSettings = {
          url: `${window.location.origin}/auth/login`,
          handleCodeInApp: true,
        };
        $fetch("/api/auth/confirm-email", {
          method: "POST",
          body: { email: userCredential.user.email },
        })
        signOut($auth);
        return { status: 'error', message: 'A verification email has been sent. Confirm your email address in order to proceed further' };
      }

      const idToken = await userCredential.user.getIdToken();
      await $fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { idToken },
      });
      return { status: 'success', };

    }
    catch (error: any) {
      console.error("Error logging in:", error.message);
      return { status: 'error', message: error.code };
    }
  }

  async function logout() {
    //sign out on server
    await $fetch('/api/auth/logout');

    //signout on client
    return signOut($auth);
  }

  async function register(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword($auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName });

      // Send verification email
      const actionCodeSettings: ActionCodeSettings = {
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(user, actionCodeSettings);

      return { status: 'ok' };

    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }

  function resetPassword(email: string) {
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/auth/login`,
      handleCodeInApp: true,
    };
    return sendPasswordResetEmail($auth, email, actionCodeSettings)
  }

  async function verifyCode(code: string) {
    try {
      const response = await verifyPasswordResetCode($auth, code)
      return response

    } catch (error: any) {
      console.error("Error verifying code:", error.message);
      return { status: 'error', message: error.message };
    }
  }

  async function updatePassword(code: string, newPassword: string) {
    try {
      await confirmPasswordReset($auth, code, newPassword);
      return { status: 'ok' };
    }
    catch (error: any) {
      console.error("Error updating password:", error.message);
      return { status: 'error', message: error.message };
    }
  }

  async function verifyEmail(code: string) {
    try {
      await applyActionCode($auth, code);
      return { status: 'ok' };
    } catch (error: any) {
      return { status: 'error', message: error.message };
    }
  }

  return { user, login, logout, register, resetPassword, verifyCode, updatePassword, verifyEmail };
}