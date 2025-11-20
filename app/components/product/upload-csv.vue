<template>
  <v-card class="pa-4"
          elevation="2">
    <v-file-input v-model="file"
                  label="Upload CSV"
                  accept=".csv"
                  prepend-icon="mdi-upload"
                  @change="onFileChange" />
    <v-data-table v-if="rows.length"
                  :headers="headers"
                  :items="rows"
                  class="mt-4" />
  </v-card>
</template>

<script setup lang="ts">

const { parseCsv } = useCsvParser()
const file = ref<File | null>(null)
const rows = ref<any[]>([])
const headers = ref<any[]>([])

async function onFileChange(newFile: File | File[] | null) {
  if (!newFile || Array.isArray(newFile)) return
  try {
    const data = await parseCsv(newFile)
    rows.value = data
    headers.value = Object.keys(data[0] || {}).map(k => ({ title: k, key: k }))
  } catch (e) {
    console.error('Error parsing CSV:', e)
  }
}
</script>
