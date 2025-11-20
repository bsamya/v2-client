<template>
  <v-container>
    <v-toolbar color="primary">
      <template #prepend>
        <div class="flex gap-2 mx-2 items-center">

          <v-icon size="48">mdi-file-certificate</v-icon>
          Applications
        </div>
      </template>
      <v-text-field label="Search Applications"
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    v-model="search"></v-text-field>
      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props"
                   variant="text"
                   class="flex-column"
                   stacked>
              <v-icon size="24">mdi-file-certificate-outline</v-icon>
              <span class="text-caption mt-1">New Certificate</span>
            </v-btn>
          </template>

          <v-list>
            <v-list-item to="/company/applications/cfs-new">
              CFS
            </v-list-item>

            <v-list-item to="/company/applications/gmp-new">
              GMP
            </v-list-item>

            <v-list-item to="/company/applications/coo-new">
              Certificate of Origin
            </v-list-item>

          </v-list>
        </v-menu>
      </template>
    </v-toolbar>

    <v-data-table-virtual :items="applications"
                          :headers="headers"
                          :height="400"
                          :search
                          fixed-header>

      <template #item.actions="{ item, index }">
        <v-speed-dial location="left center"
                      transition="fade-transition">

          <template v-slot:activator="{ props: activatorProps }">
            <v-fab v-bind="activatorProps"
                   size="small"
                   icon="mdi-dots-vertical"></v-fab>
          </template>


          <div class="speed-dial-bg"
               key="12">
            <v-btn variant="text"
                   class="flex-column"
                   stacked
                   key="0"
                   @click="copy(item.id)">
              <v-icon size="24">mdi-file-multiple</v-icon>
              <span class="text-caption mt-1">Copy</span>
            </v-btn>

            <v-btn v-if="['rejected', 'draft'].includes(item.status)"
                   variant="text"
                   class="flex-column"
                   stacked
                   key="1"
                   :to="`/company/applications/${item.type}-${item.id}`">
              <v-icon size="24">mdi-pencil</v-icon>
              <span class="text-caption mt-1">edit</span>
            </v-btn>

            <v-btn v-if="item.status === 'approved'"
                   variant="text"
                   class="flex-column"
                   stacked
                   key="2"
                   @click="get('certificate', item.id)">
              <v-icon size="24">mdi-file-certificate-outline</v-icon>
              <span class="text-caption mt-1">Download Certificate</span>
            </v-btn>

            <v-btn v-if="item.status === 'approved' && item.hasScan === true"
                   variant="text"
                   class="flex-column"
                   stacked
                   key="3"
                   @click="get('scanned', item.id)">
              <v-icon size="24">mdi-invoice</v-icon>
              <span class="text-caption mt-1">Scanned Copy</span>
            </v-btn>

            <v-btn v-if="item.status === 'approved'"
                   variant="text"
                   class="flex-column"
                   stacked
                   key="4"
                   @click="get('invoice', item.id)">
              <v-icon size="24">mdi-invoice</v-icon>
              <span class="text-caption mt-1">Invoice</span>
            </v-btn>


            <v-btn v-if="item.status === 'pending'"
                   variant="text"
                   class="flex-column"
                   stacked
                   key="5">
              <v-icon size="24">mdi-file-undo-outline</v-icon>
              <span class="text-caption mt-1">Withdraw</span>
            </v-btn>



            <v-btn variant="text"
                   class="flex-column"
                   stacked
                   key="6">
              <v-icon size="24">mdi-timeline</v-icon>
              <span class="text-caption mt-1">Timeline</span>
            </v-btn>

            <v-btn v-if="item.status === 'draft'"
                   variant="text"
                   class="flex-column"
                   stacked
                   key="7">
              <v-icon size="24">mdi-delete</v-icon>
              <span class="text-caption mt-1">Delete</span>
            </v-btn>




          </div>
        </v-speed-dial>
      </template>

      <template #item.date="{ item }">
        {{ item.date.toISOString().split('T')[0] }}
      </template>

      <template #item.status="{ item }">
        <v-chip :color="STATUS_META[item.status].color"
                :prepend-icon="STATUS_META[item.status].icon"
                flat
                :text="item.status" />
      </template>
      <template #item.country="{ item }">
        <div class="flex items-center gap-2">
          <CountryFlag :country="item.country[0]?.toLowerCase()" />
          <span>x</span>
        </div>
      </template>

      <template #item.type="{ item }">
        <v-tooltip location="top">
          <template #activator="{ props }">

            <v-chip label
                    v-bind="props">
              <span class="m">{{ item.type.toUpperCase() }}</span>
            </v-chip>
          </template>
          <span>{{ TYPE_META[item.type].name }}</span>
        </v-tooltip>
      </template>

    </v-data-table-virtual>
    <pre>{{ applications }} </pre>

  </v-container>
</template>

<script setup lang="ts">
import CountryFlag from 'vue-country-flag-next'
const TYPE_META = {
  cfs: { name: 'Certificate of Free Sale', icon: 'mdi-file-certificate', color: 'indigo' },
  gmp: { name: 'Good Manufacturing Practice', icon: 'mdi-flask-outline', color: 'deep-purple' },
  coo: { name: 'Certificate of Origin', icon: 'mdi-earth', color: 'teal' }
} as const;

const STATUS_META = {
  draft: { color: "grey", icon: "mdi-pencil", },
  approved: { color: "green", icon: "mdi-check-circle-outline" },
  rejected: { color: "red", icon: "mdi-close-circle-outline" },
  pending: { color: "warning", icon: "mdi-timer-sand", },
}

const headers = [
  { title: 'Date', value: 'date', width: '150px' },
  { title: 'Application ID', value: 'sequence', width: '250px' },
  { title: 'Type', value: 'type', width: '50px' },
  { title: 'Country', value: 'country' },
  { title: 'Status', value: 'status', width: '100px' },
  { title: 'Actions', value: 'actions', width: '50px' },
]

const search = ref('')
async function get(type: 'certificate' | 'scanned' | 'invoice', id: string) {
  //simulate download
  alert(`Downloading ${type} for application ${id}`)
}

async function copy(id: string) {
  //simulate copy
  const newId = crypto.randomUUID()
  alert(`Copied application ${id} to new application ${newId}`)
}


//generate mock applications data
type Application = {
  type: 'cfs' | 'gmp' | 'coo'
  status: 'draft' | 'approved' | 'rejected' | 'pending',
  id: string
  country: string
  date: Date
  hasScan?: boolean
}[]

const TYPES = ['cfs', 'gmp', 'coo'] as const;
const STATUS = ['draft', 'approved', 'declined', 'pending'] as const;



const applications: Application = [];




</script>

<style scoped>
.m {
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
</style>