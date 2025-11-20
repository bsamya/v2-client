<template>
  <div>

    <v-card>
      <v-card-title>Select a chamber</v-card-title>
      <v-card-text>
        <v-radio-group v-model="partner"
                       hide-details="auto"
                       class="flex gap-4 items-center"
                       @change="setPartner">
          <v-list>
            <v-list-item v-for="_partner in partnerStore.partners"
                         :key="_partner.code"
                         class="items-center">


              <div class="flex gap-4 items-center">
                <div>

                  <v-radio :value="_partner">

                    <template #label>
                      <div><v-img :src="_partner.logo"
                               width="48px"
                               height="48px" /></div>
                      <div class="grow">
                        {{ _partner.name.en }}

                      </div>
                    </template>

                  </v-radio>

                </div>

              </div>

            </v-list-item>
          </v-list>

          <div class="flex gap-2 space-around mt-4">


          </div>
        </v-radio-group>
      </v-card-text>

    </v-card>

  </div>
</template>

<script setup lang="ts">
const partnerStore = usePartnerStore();
const companyStore = useCompanyStore();
const company = toRef(companyStore, "company");
const partner = ref<Partner | null>(null);

function setPartner() {
  if (partner.value) {
    Object.assign(company.value, { partnerCode: partner.value.code, partnerId: partner.value.id });
    console.log("Set partner to ", partner.value);
  }
}

</script>

<style scoped></style>
