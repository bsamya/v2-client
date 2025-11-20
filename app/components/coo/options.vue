<template>
	<v-card title="Optional Information"
					outlined>
		<v-card-text class="grid grid-cols-2 gap-2">
			<v-text-field label="Consignor Reference"
										v-model="application.consignorReference"
										density="compact"
										hide-details="auto"
										color="primary"
										class="col-span-2" />

			<v-text-field label="Import Permit Number"
										v-model="application.importPermitNumber"
										density="compact"
										hide-details="auto"
										color="primary" />

			<v-text-field label="Bill of Lading Number"
										v-model="application.billOfLadingNumber"
										density="compact"
										hide-details="auto"
										color="primary" />


			<v-text-field label="Owner/Agent"
										density="compact"
										hide-details="auto"
										v-model="application.ownerAgent"
										color="primary" />

			<v-text-field label="Export Carrier"
										v-model="application.exportCarrier"
										density="compact"
										hide-details="auto"
										color="primary" />

			<v-text-field label="Forwarding Agent"
										v-model="application.forwardingAgent"
										density="compact"
										hide-details="auto"
										color="primary" />

			<v-date-input label="Export Date"
										clearable
										v-model="application.exportDate"
										density="compact"
										hide-details="auto"
										class="date-picker"
										data-id="exportDate"
										color="primary"
										prepend-icon=""
										prepend-inner-icon="$calendar"
										:display-format="format" />


			<v-textarea label="Remarks"
									v-model="application.remarks"
									density="compact"
									hide-details="auto"
									rows="1"
									class="col-span-2"
									color="primary" />

		</v-card-text>

	</v-card>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';

const application = defineModel<COO>({ required: true });

const adapter = useDate();
function format(date: unknown): string {
	if (!date || !(date instanceof Date)) return ''
	return adapter.format(date, 'fullDate')
}

const rules = {};

const v$ = useVuelidate();

// Expose validity state to parent
defineExpose({
	isValid: computed(() => {
		if (v$.value.$dirty) {
			return !v$.value.$invalid
		}
		return true
	}),
});

</script>
