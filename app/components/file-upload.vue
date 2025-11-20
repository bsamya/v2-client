<script setup lang="ts">
import { nanoid } from 'nanoid'
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import type { UploadTask } from "firebase/storage";
const props = defineProps({
  "path": {
    type: String,
    required: true
  },
  "accept": {
    type: String,
    required: true,
    default: ".pdf"
  },
  "label": {
    type: String,
    required: false,
    default: "Upload File"
  },
  "errorMessages": {
    type: String,
    required: false,
    default: '',
  }
});



const inputKey = ref(0);
const url = defineModel({ type: String, required: false });

const uploadTask = ref<UploadTask | null>(null);
const progress = ref(0);

//upload file to firebase storage
const { $storage } = useNuxtApp()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (!file) return;

  //get the file extension
  const fileExtension = file.name.split('.').pop();
  const metadata = {
    customMetadata: {
      originalName: file.name,
      type: file.type,
      size: file.size.toString()
    }
  };

  const fileRef = storageRef($storage, `${props.path}/${nanoid(6)}.${fileExtension}`);
  uploadTask.value = uploadBytesResumable(fileRef, file, metadata)


  uploadTask.value.on('state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress.value + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
      uploadTask.value = null
      progress.value = 0
      console.error("Upload failed", error);
    },
    async () => {
      // Upload completed successfully, now we can get the download URL
      url.value = await getDownloadURL(uploadTask.value!.snapshot.ref);
      // Reset the file input by forcing a re-render
      inputKey.value++;
      uploadTask.value = null
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      //getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //  console.log('File available at', downloadURL);
      //});
    }
  );
}

const openUrl = () => {
  if (url.value) {
    window.open(url.value, '_blank');
  }
};

</script><template>
  <div class="">
    <v-text-field type="file"
                  :accept="props.accept"
                  :label="props.label"
                  @change="handleFileUpload"
                  :key="inputKey"
                  persistent-hint
                  :error-messages="props.errorMessages">
      <template #append-inner
                v-if="uploadTask">
        <v-btn @click="uploadTask.cancel"
               append-icon="mdi-close"
               color="warning">{{ Math.round(progress) }}%</v-btn>
      </template>

      <template #append-inner
                v-if="!uploadTask && url">
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props"
                   @click="openUrl"
                   color="info"
                   size="small"
                   icon="mdi-file-pdf-box"
                   class="mr-2" />
          </template>
          <span>View Uploaded File</span>
        </v-tooltip>
        <v-tooltip>
          <template v-slot:activator="{ props }">
            <v-btn color="error"
                   icon="mdi-trash-can"
                   size="small"
                   v-bind="props"
                   @click="url = ''; inputKey++" />
          </template>
          <span>Remove File</span>
        </v-tooltip>
      </template>

      <template #loader>
        <v-progress-linear color="primary"
                           v-model="progress" />
      </template>
    </v-text-field>

  </div>
</template>