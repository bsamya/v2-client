<template>
    <div class="loading-overlay">
        <v-progress-circular indeterminate
                             color="primary"
                             :size="70"
                             :width="7"></v-progress-circular>
        <p v-if="message"
           class="loading-message mt-4">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
// Optional: Define props if you want to customize the message
defineProps({
    message: {
        type: String,
        default: 'Loading, please wait...' // Default message
    }
});
</script>

<style scoped>
.loading-overlay {
    /* Make it cover the parent container or viewport */
    position: fixed;
    /* Or absolute, depending on context */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    /* Optional: semi-transparent background */
    display: flex;
    flex-direction: column;
    /* Stack spinner and message vertically */
    justify-content: center;
    align-items: center;
    z-index: 9999;
    /* Ensure it's on top */
}

.loading-message {
    color: rgba(0, 0, 0, 0.7);
    /* Adjust color as needed */
    font-size: 1rem;
}
</style>