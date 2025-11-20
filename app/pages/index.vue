<template>
  <v-alert type="info">
    <pre>Index Page - User is logged in: {{ Boolean(auth.user.value) }}</pre>
    <pre>{{ auth.user.value }}</pre>
  </v-alert>
</template>

<script setup lang="ts">
// import VuePdfEmbed from 'vue-pdf-embed'
// const pdfSource = '/pdf/LA-COO-64689-68cc3ac16a08a.pdf'
definePageMeta({
  authRequired: true,
  middleware: ['auth-global-client']
})



const auth = useAuth();

</script>

<style scoped></style>