<template>
	<div>
		<vue-pdf-embed v-if="isReady"
									 :source="'data:application/pdf;base64,' + pdfSrc" />

		<v-checkbox v-model="agree"
								:disabled="v$.$invalid"><template v-slot:label>
				I agree to the terms and conditions {{ cooStore.isComplete }}
			</template>
		</v-checkbox>
		<v-btn color="info"
					 size="x-large"
					 block
					 :disabled="v$.$invalid || !agree"
					 @click="cooStore.submitApplication">
			Submit Application</v-btn>
	</div>
</template>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, helpers, requiredIf, minLength } from "@vuelidate/validators";

//import VuePdfEmbed from "vue-pdf-embed";
import pdfMake from "pdfmake/build/pdfmake";
pdfMake.fonts = {
	Roboto: {
		normal:
			"https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
		bold:
			"https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
		italics:
			"https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
		bolditalics:
			"https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
	},
};

const cooStore = useCooStore();

const rules = {
	//main tab
	consignee: {
		required: helpers.withMessage("Consignee is required", required),
	},
	transportType: {
		required: helpers.withMessage("Transportation type is required", required),
	},
	portOfLoading: {
		required: helpers.withMessage("Port of loading is required", required),
	},
	destinationCountry: {
		required: helpers.withMessage("Destination country is required", required),
	},
	destinationPort: {
		required: helpers.withMessage("Destination port is required", required),
	},

	//shipment tab
	shipment: {
		$each: helpers.forEach({
			description: {
				required: helpers.withMessage("Description is required", required),
				minLength: helpers.withMessage(
					"Description must be at least 3 characters",
					minLength(3)
				),
			},
			countryOfOrigin: {
				required: helpers.withMessage("Country of Origin is required", required),
			},
			grossWeight: {
				required: helpers.withMessage("Gross Weight is required", required),
			},
		}),
	},

	//documents tab
	documents: {
		invoice: { required: helpers.withMessage("Invoice is required", required) },
	},

	mailingAddress: {
		required: helpers.withMessage(
			"Address is required",
			requiredIf(cooStore.requiresMailingAddress)
		),
	},
	mailingLabel: {
		required: helpers.withMessage(
			"Mailing label is required",
			requiredIf(cooStore.requiresMailingLabel)
		),
	},
};

const v$ = useVuelidate(rules, cooStore.data);
await v$.value.$validate();
console.log(v$.value.$errors);

const isReady = ref(false);
const pdfSrc = ref("");

//get pdf doc definition
const docDefinition = await cooStore.getPdfDocDefinition(cooStore.data);

//create pdf generator instance
const pdfGenerator = pdfMake.createPdf(docDefinition);

//create the certificate
pdfGenerator.getBase64((data) => {
	pdfSrc.value = data;
	isReady.value = true;
});

function downloadPdf() {
	pdfGenerator.download("Preview copy COO");
}
function printPdf() {
	pdfGenerator.print();
}

const agree = ref(false);
</script>
