<template>
    <div>
        <p>Email verification</p>
        <v-alert v-if="success"
                 type="success">
            <p>Email verified successfully.</p>
            <p class="text-center mt-4"><v-btn @click="navigateTo('/auth/login')"
                       color="primary">Login</v-btn></p>
        </v-alert>

        <v-alert v-else-if="error"
                 type="error"
                 prominent>
            <p>{{ error }}</p>
        </v-alert>

    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const auth = useAuthStore();

//verify email code
const oobCode = route.query.oobCode as string;

const success = ref(false);
const error = ref<false | string>(false);

onMounted(async () => {
    const response = await auth.verifyEmail(oobCode);
    console.log("response", response);
    if (response.status === 'ok') {
        success.value = true;
    } else {
        error.value = response.message;
    }
});

</script>