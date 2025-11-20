<template>
  <v-container>
    <!--1) TITLE TOOLBAR -->


    <v-card>
      <v-toolbar class="mb-1">

        <v-toolbar-title v-if="partner">
          <div class="flex gap-2 items-center">

            <nuxt-img alt="."
                      class="max-h-12  rounded-full object-contain"
                      :src="partner.logo" />

            <span class="text-h6 ml-3">{{ partner.name.en }} - {{ company.partnerCode }}</span>
          </div>

        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close"
               to="/companies" />
      </v-toolbar>

      <!---  TABS Toolbar -->
      <v-tabs v-model="tab"
              align-tabs="center"
              color="primary"
              grow>
        <v-tab v-if="route.params.id === 'new'"
               value="chamber"> <v-icon icon="mdi-town-hall" />Chamber</v-tab>

        <v-tab value="company"
               :disabled="!company.partnerCode"> <v-icon icon="mdi-domain" />Company</v-tab>
        <v-tab value="contacts"
               :disabled="!company.partnerCode"><v-icon icon="mdi-account-multiple" />Contacts</v-tab>
        <!-- <v-tab value="legal"><v-icon icon="mdi-shield-check" />Legal</v-tab> -->
        <v-tab value="review"
               :disabled="!company.partnerCode"> <v-icon icon="mdi-check" />Review & Submit</v-tab>
      </v-tabs>

      <v-window v-model="tab"
                class="p-4">
        <v-window-item value="chamber">
          <lazy-company-partner-selector />

        </v-window-item>


        <v-window-item value="company">
          <company-info-tab :error
                            :registeredAdressIsValid
                            :operationsAdressIsValid />
        </v-window-item>

        <v-window-item value="contacts">
          <lazy-company-contacts-tab />
        </v-window-item>


        <v-window-item value="review">
          <lazy-company-review-tab :error />
        </v-window-item>
      </v-window>

      <v-card-actions v-if="company.partnerCode">
        {{ tab }} {{ tabs.indexOf(tab) }} / {{ tabs.length - 1 }} <v-btn @click="validate">Validate</v-btn>
        <v-spacer></v-spacer>
        <v-btn :disabled="tabs.indexOf(tab) === 0"
               variant="tonal"
               color="grey-dark-2"
               @click="goBack"><v-icon class="mr-2"
                  icon="mdi-chevron-left" />Back</v-btn>
        <v-btn :disabled="tabs.indexOf(tab) === tabs.length - 1"
               variant="tonal"
               color="grey-dark-2"
               @click="goNext">Next <v-icon clss="ml-4"
                  icon="mdi-chevron-right"></v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, requiredIf, url, minLength, maxLength } from "@vuelidate/validators";

definePageMeta({
  title: "My Company Profile",
  description: "My Company Profile",
});
const companyStore = useCompanyStore();
const company = toRef(companyStore, 'company');
const partner = toRef(companyStore, 'partner');

const route = useRoute();

if (route.params.id && companyStore.getCompanyById(route.params.id as string)) {
  //invalid id - redirect to companies page
} else if (route.params.id === "new") {
  companyStore.newCompany();
} else {
  //invalid id - redirect to companies page
  console.log("invalid company id - redirecting to companies");
  useRouter().push("/companies");
}



//tab setup & navigation
type Tabs = "chamber" | "company" | "contacts" | "review";

const tab = ref<Tabs>(route.params.id === "new" ? "chamber" : "company");
const tabs: Tabs[] = ["chamber", "company", "contacts", "review"];
function goBack() {
  const index = tabs.indexOf(tab.value);
  if (index !== 0) {
    const prevTab = tabs[index - 1];
    if (prevTab !== undefined) {
      tab.value = prevTab;
    }
  }
}

function goNext() {
  const index = tabs.indexOf(tab.value);
  if (index < tabs.length - 1) {
    const nextTab = tabs[index + 1];
    if (nextTab !== undefined) {
      tab.value = nextTab;
    }
  }
}


//company validation
//control validity of address components
const registeredAdressIsValid = ref<boolean>(true);
const operationsAdressIsValid = ref<boolean>(true);


const rules = {
  partnerCode: { required: helpers.withMessage("Partner Code is required", required) },
  company: {
    required: helpers.withMessage("Company name is required", required),
    minLength: helpers.withMessage("Company name must be at least 3 characters", minLength(3)),
    maxLength: helpers.withMessage("Company name must be at most 100 characters", maxLength(100))
  },
  registeredAddress: {
    required: helpers.withMessage("Registered Address is required", required),
    isValid: helpers.withMessage("Registered Address is invalid", () => companyStore.registeredAdressIsValid)
  },
  operationsAddress: {
    required: helpers.withMessage("Operations Address is required", requiredIf(() => company.value.hasOperationsAddress)),
    isValid: helpers.withMessage("Operations Address is invalid", () => companyStore.operationsAdressIsValid)
  },
  website: {
    url: helpers.withMessage("Enter a valid URL", url)
  },
  dbaName: {
    requiredIf: helpers.withMessage("DBA Name is required", requiredIf(() => company.value.dba)),
  },
  dbaUrl: {
    requiredIf: helpers.withMessage("DBA Copy is required", requiredIf(() => company.value.dba)),
  },
  businessLicense: {
    number: { required: helpers.withMessage("Business License Number is required", required) },
    expiry: { required: helpers.withMessage("Business License Expiry is required", required) },
    url: { required: helpers.withMessage("Business License Copy is required", required) },
  },
  manufacturingLicense: {
    number: { requiredIf: helpers.withMessage("Manufacturing License Number is required", requiredIf(() => company.value.isManufacturer)) },
    expiry: { requiredIf: helpers.withMessage("Manufacturing License Expiry is required", requiredIf(() => company.value.isManufacturer)) },
    url: { requiredIf: helpers.withMessage("Manufacturing License Copy is required", requiredIf(() => company.value.isManufacturer)) },
  },
  chamberMembership: {
    number: { requiredIf: helpers.withMessage("Chamber Membership Number is required", requiredIf(() => company.value.isChamberMember)) },
    expiry: { requiredIf: helpers.withMessage("Chamber Membership Expiry is required", requiredIf(() => company.value.isChamberMember)) },
  },
  contacts: {
    required: helpers.withMessage("At least one contact is required", required)
  }
}

const v$ = useVuelidate(rules, company);

const validate = async () => {
  v$.value.$touch()
  const isValid = await v$.value.$validate();
  return isValid;
}

const error = computed(() => {
  const error: Record<string, string> = {}
  if (!v$.value.$error) return error
  v$.value.$errors.forEach(err => {
    error[err.$propertyPath] = normalizeMessage(err.$message)
  })
  return error
})

function normalizeMessage(msg: string | Ref<string>) {
  return typeof msg === 'string' ? msg : msg.value
}


watch(() => tab.value, (newTab) => {
  if (newTab === "review") {
    validate();
  }
});
</script>