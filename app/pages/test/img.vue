<!-- ImageUploader.vue -->
<template>
  <div class="uploader">
    <label class="pick">
      <input type="file"
             accept="image/png, image/jpeg"
             @change="onPick"
             :disabled="uploading" />
      <span>{{ selectedFile ? 'Change image…' : 'Pick image…' }}</span>
    </label>

    <img v-if="previewUrl"
         :src="previewUrl"
         alt="Preview"
         class="preview" />

    <div class="controls">
      <button class="btn"
              :disabled="!selectedFile || uploading"
              @click="startUpload">
        {{ uploading ? `Uploading ${progress}%…` : 'Resize & Upload' }}
      </button>
    </div>

    <p v-if="status"
       class="status">{{ status }}</p>

    <details class="meta">
      <summary>Result</summary>
      <pre>{{ url }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
const { $storage } = useNuxtApp()
// --- Types ---


type UploadResult = {
  url: string
  path: string
  width: number
  height: number
  sizeBytes: number
  originalName: string
  docId?: string
}

// --- State ---
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploading = ref(false)
const progress = ref(0)
const status = ref('')
const result = ref<UploadResult | null>(null)
const url = ref('')
function setStatus(msg: string) {
  status.value = msg
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] || null
  selectedFile.value = file
  result.value = null
  progress.value = 0
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = file ? URL.createObjectURL(file) : null
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

// --- Core: resize (keeps aspect ratio; never upscale) ---
async function resizeImage(
  file: File,
  { maxW, maxH, quality, type }: { maxW: number; maxH: number; quality: number; type: string }
): Promise<{ blob: Blob; width: number; height: number }> {
  // createImageBitmap respects EXIF with imageOrientation:'from-image' on modern browsers
  const hasWindow = typeof window !== 'undefined'
  if (!hasWindow) throw new Error('Image resizing only available in browser.')

  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  let { width, height } = bitmap
  const ratio = Math.min(maxW / width, maxH / height, 1)
  const targetW = Math.round(width * ratio)
  const targetH = Math.round(height * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
    ; (ctx as any).imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, targetW, targetH)

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), type, quality)
  )

  bitmap.close()
  return { blob, width: targetW, height: targetH }
}

// --- Upload flow ---
async function startUpload() {
  if (!selectedFile.value) {
    setStatus('Pick an image first.')
    return
  }

  try {
    uploading.value = true
    setStatus('Preparing upload…')



    // 1) Resize
    setStatus('Resizing…')
    const { blob, width, height } = await resizeImage(selectedFile.value, {
      maxW: 600,
      maxH: 100,
      quality: .9,
      type: "image/jpeg"
    })

    // 2) Upload to Storage (with progress)

    const path = `/uploads'/test.jpg`

    const fileRef = storageRef($storage, path)
    const task = uploadBytesResumable(fileRef, blob, { contentType: "image/jpeg" })

    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          progress.value = pct
          setStatus(`Uploading ${pct}%…`)
        },
        (err) => reject(err),
        () => resolve()
      )
    })


    previewUrl.value = await getDownloadURL(task.snapshot.ref)


  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.uploader {
  display: grid;
  gap: 12px;
  max-width: 420px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial;
}

.pick {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.pick input[type="file"] {
  display: none;
}

.preview {
  max-width: 100%;
  border-radius: 10px;
  display: block;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .08);
}

.controls {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, .12);
  background: white;
  cursor: pointer;
}

.btn[disabled] {
  opacity: .5;
  cursor: not-allowed;
}

.status {
  font-size: 0.95rem;
  opacity: .85;
}

.meta pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 10px;
  border-radius: 10px;
  overflow: auto;
}
</style>
