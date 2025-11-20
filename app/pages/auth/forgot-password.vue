<template>
  <div>
    <v-form @submit.prevent="submit">
      <v-text-field v-model="form.email"
                    label="Email"
                    :error-messages="v$.email.$errors.map(e => e.$message as string)"
                    outlined
                    density="compact"
                    dense
                    class="mb-4" />
      <v-btn type="submit"
             color="primary">{{ $t("submit") }}</v-btn>
    </v-form>

    <v-dialog v-model="dialog"
              max-width="290"
              :close-on-content-click="true">
      <v-alert v-if="success"
               type="success">{{ $t("messages.password-reset-email-sent") }}</v-alert>

      <v-alert v-if="error"
               type="error">{{ error }}</v-alert>

    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

const auth = useAuth()
const form = ref({ email: "" });
const rules = {
  email: {
    required: helpers.withMessage($t('input.error.email.required'), required),
    email: helpers.withMessage($t('input.error.email.invalid'), email)
  }
}

const v$ = useVuelidate(rules, form);
const dialog = ref(false);
const success = ref(false);
const error = ref<false | string>(false);

async function submit() {
  const isValid = await v$.value.$validate();
  console.log(isValid);
  if (!isValid) {
    return;
  }
  auth.resetPassword(form.value.email)
    .then(() => {
      error.value = "";
      success.value = true;
      form.value.email = "";
      v$.value.$reset();

    })
    .catch((err) => {
      console.error(err);
      error.value = err.message;
      if (err.code === "auth/user-not-found") {
        error.value = "User not found. Please check the email address.";
      } else if (err.code === "auth/invalid-email") {
        error.value = "Invalid email address.";
      } else if (err.code === "auth/missing-email") {
        error.value = "Email is required.";
      } else {
        error.value = "An error occurred. Please try again later.";
      }
    })
    .finally(() => {
      dialog.value = true;
    });
}

onMounted(() => {
  console.log('mounted');
});

</script>

