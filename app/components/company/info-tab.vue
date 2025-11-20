<template>
  <div>
    <v-text-field label="Company"
                  v-model="company.company"
                  hint="Legal Company name"
                  :persistent-hint="true"
                  :error-messages="error['company'] ?? ''"
                  color="primary" />


    <div class="flex gap-2 my-2 items-center">
      <span>Does your business operate under a different name (DBA)?</span>
      <v-radio-group v-model="company.dba"
                     color="primary"
                     inline
                     hide-details>
        <v-radio label="Yes"
                 :value="true" />
        <v-radio label="No"
                 :value="false" />
      </v-radio-group>

    </div>
    <v-text-field v-if="company.dba"
                  label="Doing Business As"
                  v-model.trim="company.dbaName"
                  :error-messages="error['dbaName'] ?? ''"
                  color="primary" />

    <file-upload v-if="company.dba"
                 accept=".pdf"
                 type="file"
                 :path="`documents/${company.companyId}`"
                 v-model="company.dbaUrl"
                 label="Upload DBA authorization letter"
                 :error-messages="error['dbaUrl'] ?? ''" />

    <auto-complete label="Registered Address"
                   v-model:address="company.registeredAddress"
                   v-model:is-valid="companyStore.registeredAdressIsValid"
                   :error-messages="error['registeredAddress'] ?? ''"
                   id="registeredAddress"
                   color="primary" />
    <v-checkbox label="Is your Operations Address different from your Registered Address?"
                v-model="company.hasOperationsAddress" />
    <transition name="fade">
      <div>

        <auto-complete v-if="company.hasOperationsAddress"
                       class="box"
                       label="Operations Address"
                       v-model:address="company.operationsAddress"
                       v-model:is-valid="companyStore.operationsAdressIsValid"
                       :error-messages="error['operationsAddress'] ?? ''"
                       id="operationsAddress"
                       color="primary" />

      </div>
    </transition>

    <v-text-field v-model="company.website"
                  label="Website URL"
                  :error-messages="error['website'] ?? ''"
                  color="primary"
                  prepend-inner-icon="mdi-web" />


    <!-- Buiness License -->
    <div class="flex gap-2">
      <v-text-field label="Business License Number"
                    color="primary"
                    :error-messages="error['businessLicense.number'] ?? ''"
                    v-model="company.businessLicense.number" />

      <date-picker label="Expiry Date of Business License"
                   color="primary"
                   :error-messages="error['businessLicense.expiry'] ?? ''"
                   v-model="company.businessLicense.expiry" />

      <file-upload v-model="company.businessLicense.url"
                   type="file"
                   accept=".pdf"
                   :path="`documents/${company.companyId}`"
                   :error-messages="error['businessLicense.url'] ?? ''"
                   label="Upload your Business License" />
    </div>


    <!-- /*Manufacting license info -->
    <div class="flex gap-2 mb-4 items-center">

      <p class="text-h6 ">Are you a manufacturer?</p>
      <p class="grow">
        <v-radio-group v-model="company.isManufacturer"
                       color="primary"
                       inline
                       hide-details>
          <v-radio label="Yes"
                   :value="true" />
          <v-radio label="No"
                   :value="false" />
        </v-radio-group>
      </p>
    </div>
    <v-slide-x-transition>
      <div v-if="company.isManufacturer"
           class="grid gap-2 grid-cols-2">

        <v-text-field label="Manufacturing License Number"
                      v-model="company.manufacturingLicense.number"
                      :error-messages="error['manufacturingLicense.number'] ?? ''"
                      color="primary" />

        <date-picker v-model="company.manufacturingLicense.expiry"
                     :error-messages="error['manufacturingLicense.expiry'] ?? ''"
                     label="Expiry Date of Manufacturing License" />

        <file-upload v-model="company.manufacturingLicense.url"
                     :path="`documents/${company.companyId}`"
                     :error-messages="error['manufacturingLicense.url']"
                     accept=".pdf"
                     label="Upload your Manufacturing License (PDF)" />

        <file-upload v-model="company.goodManufacturingLicenseURL"
                     :path="`documents/${company.companyId}`"
                     :error-messages="error['goodManufacturingLicenseURL.url']"
                     accept=".pdf"
                     label="Upload your your GMP Certificate" />
      </div>

    </v-slide-x-transition>


    <!-- Chamber Membership -->


    <p class="text-h6">
      Are you a member of
      {{ partner?.name.en }} ?

      <v-radio-group color="primary"
                     v-model="company.isChamberMember"
                     inline>
        <v-radio label="Yes"
                 :value="true" />
        <v-radio label="No"
                 :value="false" />
      </v-radio-group>
    </p>


    <v-slide-x-transition>
      <div v-show="company.isChamberMember"
           class="grid grid-cols-2 gap-2">
        <v-text-field label="Membership Number"
                      v-model="company.chamberMembership.number"
                      :error-messages="error['chamberMembership.number'] ?? ''"
                      color="primary" />

        <date-picker label="Expiry Date of Membership"
                     :error-messages="error['chamberMembership.expiry'] ?? ''"
                     v-model="company.chamberMembership.expiry" />

      </div>
    </v-slide-x-transition>


    <!-- <div v-if="company.associates.length">
        <p class="text-h6">Are you a member of the following associations?</p>
        <v-checkbox v-for="association in partner!.associates"
                    v-model="company.associates"
                    :key="association.id"
                    :value="association.id"
                    :label="company.associates.find(a => a.id === association.id)?.name || 'Undefined'" />
      </div> -->


  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  error: Record<string, string>;
}>();

const companyStore = useCompanyStore();
const company = toRef(companyStore, "company");
const partner = toRef(companyStore, "partner");


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>