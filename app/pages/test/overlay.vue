<script setup lang="ts">
import { ref } from 'vue'

const showOverlay = ref(false)
</script>

<template>
  <!-- Activator -->
  <v-btn color="primary"
         @click="showOverlay = true">
    Open Overlay
  </v-btn>

  <!-- Overlay -->
  <v-overlay v-model="showOverlay"
             location="center">
    <v-card class="pa-6 rounded-xl"
            width="400">
      <v-card-title>New Product</v-card-title>

      <v-card-text>
        This is inside the overlay.
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="grey"
               variant="text"
               @click="showOverlay = false">
          Cancel
        </v-btn>
        <v-btn color="primary"
               variant="flat"
               @click="showOverlay = false">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
