<template>
  <div class="bg-white">
    <v-toolbar :title="isNewUser ? 'User Settings' : user"
               color="primary">
      <v-spacer />
      <v-btn icon="mdi-close"
             color="red"
             variant="flat"
             @click="$emit('close')" />
    </v-toolbar>
    <v-text-field v-if="isNewUser"
                  prepend-inner-icon="mdi-email"
                  label="email"
                  clearable
                  :error-messages="v$.email.$errors.map(e => e.$message as string)"
                  v-model="user" />
    <v-card title="Permissions"
            class="m-4"
            elevation="6">
      <v-card-text>
        <v-checkbox v-for="permission in permissionTypes"
                    :key="permission"
                    :label="permission"
                    :value="permission"
                    hide-details
                    v-model="userSettings.permissions" />
      </v-card-text>
    </v-card>

    <v-card title="Notifications"
            class="m-4"
            elevation="6">
      <v-card-text>
        <v-checkbox v-for="notification in notificationTypes"
                    :key="notification"
                    :label="notification"
                    :value="notification"
                    hide-details
                    v-model="userSettings.notifications" />
      </v-card-text>
    </v-card>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="flat"
             text="Cancel"
             @click="$emit('close')" />
      <v-btn color="primary"
             variant="flat"
             @click="saveUser()">Save</v-btn>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
const user = defineModel<string>("user", { required: true });
const userSettings = defineModel<{
  permissions: string[]
  notifications: string[]
}>("settings", { required: true });
const emit = defineEmits<{
  (e: "close"): void
}>();

const isNewUser = user.value === "" ? true : false;
const companyStore = useCompanyStore();

const rules = {
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Email must be valid", email),
    isUnique: helpers.withMessage("User already exists", (value: string) => {
      if (isNewUser) {
        const company = companyStore.activeCompany;
        if (!company) return false;
        return !company.authorizedUsers.includes(value);
      }
      return true;
    })

  }
};
const v$ = useVuelidate(rules, { email: user });


async function saveUser() {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }
  companyStore.setUserSettings(user.value, userSettings.value)
  emit('close')
}
</script>
