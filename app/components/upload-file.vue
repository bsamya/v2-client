<script setup lang="ts">
import { nanoid } from 'nanoid'
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
  getMetadata
} from 'firebase/storage'
import type { UploadTask } from 'firebase/storage'

const props = defineProps({
  path: { type: String, required: true },
  accept: { type: String, default: '.pdf' },
  label: { type: String, default: 'Upload File' },
  errorMessages: { type: Array as PropType<string[]>, default: () => [] },
  multiple: { type: Boolean, default: false },
  files: {
    type: [String, Array],
    default: null
  },
  // ✅ MAX FILES (uploaded + in-progress)
  maxFiles: {
    type: Number,
    default: 1
  }
})

const emits = defineEmits<{
  (e: 'set', url: string): void
  (e: 'unset', url: string): void
}>()

const inputKey = ref(0)
type UploadEntry = {
  id: string
  name: string
  task: UploadTask
  progress: number
}

const uploads = ref<UploadEntry[]>([])
const isUploading = computed(() => uploads.value.length > 0)

const { $storage } = useNuxtApp()

// ---- Uploaded files with metadata ----
type StoredFile = {
  url: string
  name: string
  loading: boolean
  error?: string
}

const storedFiles = ref<StoredFile[]>([])

const normalizeFiles = (val: unknown): string[] => {
  if (!val) return []
  if (Array.isArray(val)) return val as string[]
  return [val as string]
}

// current uploaded + in-progress counts
const currentUploadedCount = computed(() => normalizeFiles(props.files).length)
const totalCount = computed(
  () => currentUploadedCount.value + uploads.value.length
)
const canAddMore = computed(() => totalCount.value < props.maxFiles)

// Watch incoming URLs and fetch metadata
watch(
  () => props.files,
  async (newVal) => {
    const urls = normalizeFiles(newVal)

    // Sync list (preserve existing entries where possible)
    storedFiles.value = urls.map((url) => {
      const existing = storedFiles.value.find((f) => f.url === url)
      return (
        existing || {
          url,
          name: url,     // fallback until metadata loads
          loading: true
        }
      )
    })

    // Fetch metadata for each file (sequential to keep it simple)
    for (const file of storedFiles.value) {
      if (!file.loading && file.name !== file.url) continue

      try {
        file.loading = true
        const fileRef = storageRef($storage, file.url)
        const meta = await getMetadata(fileRef)

        file.name = meta.customMetadata?.originalName || file.name
      } catch (e) {
        console.error('Failed to get metadata for', file.url, e)
        file.error = 'Could not load file name'
      } finally {
        file.loading = false
      }
    }
  },
  { immediate: true, deep: true }
)

// files comes from v-file-input as File | File[] | null
const handleFileUpload = (files: File | File[] | null) => {
  if (!files) return

  const fileArray = Array.isArray(files) ? files : [files]

  // respect multiple flag
  const selectedFiles = props.multiple ? fileArray : [fileArray[0]]

  const currentCount = totalCount.value
  const remainingSlots = props.maxFiles - currentCount

  if (remainingSlots <= 0) {
    return
  }

  // Only allow up to remainingSlots files
  const filesToUpload = selectedFiles.slice(0, remainingSlots)

  filesToUpload.forEach((file) => {
    if (!file) return

    const id = nanoid(6)
    const ext = file.name.split('.').pop()
    const metadata = {
      customMetadata: {
        originalName: file.name,
        type: file.type,
        size: file.size.toString()
      }
    }

    const fileRef = storageRef($storage, `${props.path}/${id}.${ext}`)
    const task = uploadBytesResumable(fileRef, file, metadata)

    const entry: UploadEntry = {
      id,
      name: file.name,
      task,
      progress: 0
    }

    uploads.value.push(entry)

    task.on(
      'state_changed',
      (snap) => {
        entry.progress = (snap.bytesTransferred / snap.totalBytes) * 100
      },
      (err) => {
        console.error('Upload failed', err)
        uploads.value = uploads.value.filter((u) => u.id !== entry.id)
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        emits('set', url)
        uploads.value = uploads.value.filter((u) => u.id !== entry.id)
      }
    )
  })

  // reset v-file-input (so same files can be chosen again)
  inputKey.value++
}

const cancelUpload = (entry: UploadEntry) => {
  try {
    entry.task.cancel()
  } catch (e) {
    console.warn('cancel error', e)
  }
  uploads.value = uploads.value.filter((u) => u.id !== entry.id)
}

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

const unset = (url: string) => {
  emits('unset', url)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- v-file-input, hidden while uploading -->
    <v-file-input v-if="!isUploading && canAddMore"
                  :key="inputKey"
                  :multiple="props.multiple"
                  :accept="props.accept"
                  :label="props.label"
                  prepend-inner-icon="mdi-upload"
                  prepend-icon=""
                  show-size
                  :error-messages="props.errorMessages"
                  @update:model-value="handleFileUpload" />


    <p v-else
       class="font-bold">Maximum of {{ props.maxFiles }} file(s) reached</p>




    <!-- Per-file progress cards -->
    <div v-if="uploads.length"
         class="flex flex-col gap-2">
      <v-card v-for="u in uploads"
              :key="u.id"
              class="p-2">
        <v-card-text>
          <div class="flex items-center justify-between">
            <div class="truncate text-sm">
              {{ u.name }}
            </div>

            <v-btn icon="mdi-close"
                   size="small"
                   color="warning"
                   variant="text"
                   @click="cancelUpload(u)" />
          </div>
          <v-progress-linear class="mt-1"
                             height="6"
                             rounded
                             color="primary"
                             :model-value="u.progress" />
          <div class="text-xs text-right text-gray-500 mt-1">
            {{ Math.round(u.progress) }}%
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Uploaded documents (from props.files) -->
    <v-list density="compact"
            class="pa-0">
      <v-list-item v-for="(file, index) in storedFiles"
                   :key="file.url"
                   class="py-1 "
                   :class="index % 2 === 0 ? 'bg-grey-lighten-4' : 'bg-grey-lighten-5'"
                   :style="index < storedFiles.length - 1 ? 'border-bottom: 1px solid rgba(0,0,0,0.08)' : ''">
        <!-- Left side -->
        <div class="d-flex align-center justify-space-between">

          <div class="d-flex align-center text-truncate">
            <span class="text-caption text-medium-emphasis mr-2">{{ index + 1 }}.</span>
            <span class="text-body-2 text-truncate">{{ file.name }}</span>
          </div>

          <!-- Right side -->
          <div class="d-flex align-center">
            <v-tooltip text="View Uploaded File">
              <template #activator="{ props }">
                <v-btn v-bind="props"
                       color="info"
                       variant="text"
                       size="x-small"
                       icon="mdi-eye"
                       @click="openUrl(file.url)" />
              </template>
            </v-tooltip>

            <v-tooltip text="Remove File">
              <template #activator="{ props }">
                <v-btn v-bind="props"
                       color="error"
                       variant="text"
                       size="x-small"
                       icon="mdi-trash-can"
                       @click="unset(file.url)" />
              </template>
            </v-tooltip>
          </div>
        </div>
      </v-list-item>
    </v-list>

  </div>
</template>

<style scoped>
.x-v-list-item:nth-child(odd) {
  color: white;
  background-color: grey;
}
</style>