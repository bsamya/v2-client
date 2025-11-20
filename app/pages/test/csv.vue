<template>
  <v-card class="pa-4"
          elevation="2">
    <v-file-input v-model="file"
                  label="Upload CSV"
                  accept=".csv"
                  :multiple="false"
                  prepend-icon="mdi-upload"
                  @update:model-value="onFileChange" />
    <v-data-table v-if="rows.length"
                  :headers="headers"
                  :items="rows"
                  class="mt-4" />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Papa from 'papaparse'

const file = ref<File | null>(null)
const rows = ref<any[]>([])
const headers = ref<any[]>([])

function parseCsv(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    })
  })
}

async function onFileChange(newFile: File | File[] | null) {
  // Vuetify sometimes returns an array — handle both
  const selectedFile = Array.isArray(newFile) ? newFile[0] : newFile
  if (!selectedFile) return

  try {
    const data = await parseCsv(selectedFile)
    rows.value = data
    headers.value = Object.keys(data[0] || {}).map((k) => ({
      title: k,
      key: k,
    }))
  } catch (e) {
    console.error('Error parsing CSV:', e)
  }
}
</script>
