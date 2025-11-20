<template>
  <div v-if="company">
    <v-data-table :items="authorizedUsers"
                  :headers>
      <template #top>
        <v-toolbar color="primary">

          <template #prepend>
            <div class="flex gap-2 mx-2 items-center">
              <v-icon size="48">mdi-shield-account</v-icon> Authorized Users
            </div>
          </template>
          <v-spacer></v-spacer>


          <v-btn variant="text"
                 key="2"
                 class="flex-column"
                 stacked
                 @click="addUser">
            <v-icon size="24">mdi-account-plus</v-icon>
            <span class="text-caption mt-1">Add User</span>
          </v-btn>



        </v-toolbar>
      </template>

      <template #item.permissions="{ item }">

      </template>

      <template #item.actions="{ item }">
        <v-speed-dial location="start center"
                      transition="fade-transition">
          <template v-slot:activator="{ props: activatorProps }">
            <v-fab v-bind="activatorProps"
                   size="small"
                   icon="mdi-dots-vertical"></v-fab>
          </template>

          <v-btn variant="text"
                 key="1"
                 class="flex-column"
                 stacked
                 @click="editUser(item.email)">
            <v-icon size="24">mdi-account-edit</v-icon>
            <span class="text-caption mt-1">Edit User</span>
          </v-btn>

          <v-btn variant="text"
                 key="2"
                 class="flex-column"
                 stacked
                 :disabled="(item.email === $auth.currentUser?.email)"
                 @click="removeUser(item.email)">
            <v-icon size="24">mdi-account-remove</v-icon>
            <span class="text-caption mt-1">Remove User</span>
          </v-btn>


        </v-speed-dial>




      </template>

    </v-data-table>

    <v-dialog v-model="dialog"
              width="600">
      <company-user-form @close="dialog = false"
                         v-model:user="user"
                         v-model:settings="userSettings" />
    </v-dialog>
  </div>
</template>





<script setup lang="ts">
const companyStore = useCompanyStore();
const company = toRef(companyStore, "activeCompany")



if (!company.value) {
  useRouter().push("/companies");
}
if (!company.value?.userSettings) {
  company.value!.userSettings = {};
}

const authorizedUsers = computed(
  () => company.value!.authorizedUsers.map(e => ({
    email: e,
  })));

const headers = [
  { title: "Email", key: "email", sortable: true },
  { title: "Permissions", key: "permissions", width: "100", sortable: false },
  { title: "Actions", key: "actions", width: "100", sortable: false }
];



function addUser() {
  user.value = "";
  userSettings.value = { permissions: [], notifications: [] }
  dialog.value = true;
}

function editUser(email: string) {
  dialog.value = true;

  user.value = email;
  userSettings.value = company.value!.userSettings[email] ?? { permissions: [], notifications: [] };
}

function removeUser(email: string) {

  companyStore.removeUser(email);
}


const dialog = ref(false);
const user = ref<string>("");
const userSettings = ref<{
  permissions: string[]
  notifications: string[]
}>({ permissions: [], notifications: [] });




</script>

<style scoped></style>