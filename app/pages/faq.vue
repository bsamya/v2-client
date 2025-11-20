<template>
  <div class="max-w-5xl  mt-1 ml-1">
    <v-toolbar color="primary"
               class="mb-1">
      <v-icon icon="mdi-frequently-asked-questions"
              class="mx-2" />
      <v-toolbar-title>Frequently Asked Questions</v-toolbar-title>

      <v-text-field label="Search"
                    density="compact"
                    hide-details
                    append-inner-icon="mdi-magnify"
                    clearable
                    v-model="search"
                    class="m-4" />
    </v-toolbar>

    <v-data-iterator :items="faqList"
                     :page="page"
                     :search="search">
      <template v-slot:default="{ items }">
        <div class="flex flex-col gap-2">
          <div class="p-4 bg-white "
               v-for="faq in items"
               :key="faq.raw.id">
            <p class="text-lg font-semibold">
              {{ faq.raw.question }}
            </p>
            <p class="text-lg">
              {{ faq.raw.answer }}
            </p>
          </div>



        </div>
      </template>
    </v-data-iterator>

  </div>
</template>

<script setup lang="ts">
import { getDocs, query, where, collection, onSnapshot } from "firebase/firestore";

definePageMeta({
  title: "FAQ",
  description: "Frequently asked questions",
});
const search = ref("");
const page = ref(1);


type FAQ = {
  id: "string";
  question: string;
  answer: string;
  partnerCode: string;
};

const { $db } = useNuxtApp();
const faqList = ref<FAQ[]>([]);
const faqColl = collection($db, "faq");

onSnapshot(faqColl, (snapshot) => {
  const faqs: FAQ[] = [];
  snapshot.forEach((doc) => {
    faqs.push(doc.data() as FAQ);
  });
  faqList.value = faqs;
});
</script>

<style scoped></style>
