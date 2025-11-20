<template>
    <v-form @submit.prevent="submit">
        <v-text-field v-model="form.password"
                      label="New Password"
                      :type="showPassword ? 'text' : 'password'"
                      :error-messages="v$.password.$errors.map(e => e.$message as string)"
                      variant="outlined"
                      density="compact"
                      class="mb-4" />
        <v-text-field v-model="form.confirmPassword"
                      label="Confirm New Password"
                      :type="showPassword ? 'text' : 'password'"
                      :error-messages="v$.confirmPassword.$errors.map(e => e.$message as string)"
                      variant="outlined"
                      density="compact"
                      class="mb-4" />

        <div class="flex justify-between">
            <v-checkbox v-model="showPassword"
                        :label="showPassword ? 'Hide Password' : 'Show Password'"
                        hide-details />
            <v-btn type="submit"
                   color="primary">Reset Password</v-btn>
        </div>
    </v-form>


    <v-dialog v-model="dialog"
              max-width="400"
              :close-on-content-click="true"
              @update:model-value="redirectTo">
        <v-alert v-if="success"
                 border="start"
                 border-color="">
            <p>Password reset successfully.</p>

            <p class="text-center mt-4"><v-btn color="primary">Login to Continue</v-btn></p>

        </v-alert>
        <v-alert v-if="error"
                 type="error"
                 class="p-4"
                 prominent>
            <p>{{ error }}</p>
        </v-alert>
    </v-dialog>

</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';

const auth = useAuth();
const route = useRoute();
const showPassword = ref(false);
const form = ref({ password: '', confirmPassword: '' });

const rules = {
    password: {
        required: helpers.withMessage('Password is required', required),
        minLength: helpers.withMessage('Password must be at least 6 characters', minLength(6)),
    },
    confirmPassword: {
        required: helpers.withMessage('Confirm Password is required', required),
        sameAs: helpers.withMessage('Passwords do not match', () => form.value.confirmPassword === form.value.password),
    },
};

const v$ = useVuelidate(rules, form);

const dialog = ref(false);
const success = ref(false);
const error = ref<false | string>(false);
const oobCode = route.query.oobCode as string;



if (!oobCode) {
    error.value = "Invalid link";
    dialog.value = true;
    navigateTo('/auth/login');
} else {
    const isValid: any = await auth.verifyCode(oobCode);
    if (isValid.status === "error") {
        error.value = "Error resetting password. Please request a new link. (Code expired)";
        dialog.value = true;

        //navigateTo('/auth/login');

    }
    console.log("isValid code", isValid);
}

async function submit() {
    const isValid = await v$.value.$validate();
    console.log("submit", isValid);
    if (!isValid) {
        return;
    }


    const response = await auth.updatePassword(oobCode, form.value.password);
    console.log(response)
    if (response.status === 'ok') {
        success.value = true;

    }
    else if (response.status === 'error') error.value = response.message;
    else error.value = "unknown response";
    dialog.value = true;
}



const redirectTo = () => {
    if (error.value) {
        navigateTo('/auth/forgot-password');
    } else if (success.value) {
        navigateTo('/auth/login');
    }
}

</script>
