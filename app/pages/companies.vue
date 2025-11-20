<template>
  <v-container class="max-w-5xl ml-2 mt-2 bg-white h-full flex flex-col">
    <v-toolbar color="primary"
               height="80"
               density="compact">
      <template #prepend>
        <div class="flex gap-2 mx-2 items-center">
          <v-icon size="48">mdi-domain</v-icon> Companies
        </div>
      </template>
      <v-text-field label="Search Companies"
                    color="primary"
                    v-model="search"
                    density="compact"
                    hide-details
                    prepend-inner-icon="mdi-magnify" />
      <v-spacer></v-spacer>


      <v-btn variant="text"
             class="flex-column"
             stacked
             to="company-new">
        <v-icon size="24">mdi-domain-plus</v-icon>
        <span class="text-caption mt-1">Add Company</span>
      </v-btn>


    </v-toolbar>

    <div class="p-4 grow "
         ref="body">
      <v-data-table-virtual fixed-header
                            :items="companyStore.companyList"
                            :headers="headers"
                            :search="search"
                            hover>
        <template v-slot:item.company="{ item }">
          <div class="flex items-center gap-4">
            <div class="flex flex-col">
              <span class="font-weight-medium">{{ item.company }}</span>
              <span class="text-caption">{{ item.partner }}</span>
            </div>
          </div>
        </template>


        <template v-slot:item.status="{ item }">
          <v-chip :color="chip[item.status].color"
                  :prepend-icon="chip[item.status].icon"
                  :text="item.status" />
        </template>

        <template #item.actions="{ item }">
          <v-speed-dial location="left center"
                        transition="fade-transition"
                        class="bg-overlay">
            <template v-slot:activator="{ props: activatorProps }">
              <v-fab v-bind="activatorProps"
                     size="small"
                     icon="mdi-dots-vertical"></v-fab>
            </template>

            <div class="speed-dial-bg">

              <v-btn variant="text"
                     key="1"
                     class="flex-column"
                     stacked
                     @click="$router.push(`/company-${item.companyId}`)">
                <v-icon size="24">mdi-pencil</v-icon>
                <span class="text-caption mt-1">Edit</span>
              </v-btn>
              <v-btn variant="text"
                     key="2"
                     class="flex-column"
                     stacked
                     @click="companyStore.toggleArchive(item.companyId)">
                <v-icon size="24">mdi-domain-off</v-icon>
                <span class="text-caption mt-1">Archive Company</span>
              </v-btn>

              <v-btn :disabled="item.isDefault"
                     variant="text"
                     key="3"
                     class="flex-column"
                     stacked
                     @click="companyStore.toggleDefault(item.companyId)">
                <v-icon size="24">mdi-star-check</v-icon>
                <span class="text-caption mt-1">Set as Default Company</span>
              </v-btn>

            </div>

          </v-speed-dial>
        </template>

        <template #item.isDefault="{ item }">
          <v-tooltip text="Default Company"
                     location="top">
            <template #activator="{ props }">
              <v-icon v-if="item.isDefault"
                      v-bind="props"
                      color="yellow darken-3">
                mdi-star
              </v-icon>
            </template>
          </v-tooltip>
        </template>

        <template #item.isArchived="{ item }">
          <v-tooltip text="Archived Company"
                     location="top">
            <template #activator="{ props }">
              <v-icon v-if="item.isArchived"
                      v-bind="props"
                      color="grey">
                mdi-archive
              </v-icon>
            </template>
          </v-tooltip>
        </template>

      </v-data-table-virtual>

    </div>


  </v-container>
</template>

<script setup lang="ts">

definePageMeta({
  title: "My Companies",
  description: "My Companies",
});
const companyStore = useCompanyStore();

const headers = [
  { title: "Company", key: "company", sortable: true },
  { title: "Status", key: "status", width: "150px" },
  { title: "", key: "isDefault", sortable: true, width: "50px" },
  { title: "", key: "isArchived", sortable: true, width: "50px" },
  { title: "", key: "actions", sortable: false, width: "50px" }
];
const search = ref("");

const chip = {
  approved: { icon: "mdi-check-circle", color: "green" },
  pending: { icon: "mdi-clock-outline", color: "orange" },
  rejected: { icon: "mdi-close-circle", color: "red" },
}

</script>
<style>
.speed-dial-bg {
  background-color: rgb(241, 237, 237);
  /* semi-transparent black */
  backdrop-filter: blur(6px);
  /* subtle blur for glass effect */
  border-radius: 12px;
  padding: 8px;
}
</style>
