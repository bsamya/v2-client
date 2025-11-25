<template>
	<v-card title="Optional Information"
					outlined>
		<v-card-text class="grid grid-cols-2 gap-2">
			<!-- Consignor Reference -->
			<v-text-field label="Consignor Reference"
										v-model="application.consignorReference"
										density="compact"
										color="primary"
										class="col-span-2"
										clearable
										:error-messages="errors.consignorReference"
										@blur="v$.consignorReference.$touch()">
				<template #append-inner>
					<v-icon v-if="v$.consignorReference.$error"
									icon="mdi-alert-circle"
									color="error"
									size="20"
									class="mr-2" />

					<v-icon v-else-if="v$.consignorReference.$dirty"
									icon="mdi-check-circle"
									color="success"
									size="20"
									class="mr-2" />
				</template>
			</v-text-field>

			<!-- Import Permit Number -->
			<v-text-field label="Import Permit Number"
										v-model="application.importPermitNumber"
										density="compact"
										color="primary"
										clearable
										:error-messages="errors.importPermitNumber"
										@blur="v$.importPermitNumber.$touch()">
				<template #append-inner>
					<v-icon v-if="v$.importPermitNumber.$error"
									icon="mdi-alert-circle"
									color="error"
									size="20"
									class="mr-2" />

					<v-icon v-else-if="v$.importPermitNumber.$dirty"
									icon="mdi-check-circle"
									color="success"
									size="20"
									class="mr-2" />
				</template>
			</v-text-field>

			<!-- Bill of Lading Number -->
			<v-text-field label="Bill of Lading Number"
										v-model="application.billOfLadingNumber"
										density="compact"
										color="primary"
										clearable
										:error-messages="errors.billOfLadingNumber"
										@blur="v$.billOfLadingNumber.$touch()">
				<template #append-inner>
					<v-icon v-if="v$.billOfLadingNumber.$error"
									icon="mdi-alert-circle"
									color="error"
									size="20"
									class="mr-2" />

					<v-icon v-else-if="v$.billOfLadingNumber.$dirty"
									icon="mdi-check-circle"
									color="success"
									size="20"
									class="mr-2" />
				</template>
			</v-text-field>

			<!-- Owner/Agent -->
			<v-text-field label="Owner/Agent"
										v-model="application.ownerAgent"
										density="compact"
										color="primary"
										clearable
										:error-messages="errors.ownerAgent"
										@blur="v$.ownerAgent.$touch()">
				<template #append-inner>
					<v-icon v-if="v$.ownerAgent.$error"
									color="error"
									size="20"
									class="mr-2"
									icon="mdi-alert-circle" />

					<v-icon v-else-if="v$.ownerAgent.$dirty"
									color="success"
									size="20"
									class="mr-2"
									icon="mdi-check-circle" />
				</template>
			</v-text-field>

			<!-- Export Carrier -->
			<v-text-field label="Export Carrier"
										v-model="application.exportCarrier"
										density="compact"
										color="primary"
										clearable
										:error-messages="errors.exportCarrier"
										@blur="v$.exportCarrier.$touch()">
				<template #append-inner>
					<v-icon v-if="v$.exportCarrier.$error"
									icon="mdi-alert-circle"
									color="error"
									size="20"
									class="mr-2" />

					<v-icon v-else-if="v$.exportCarrier.$dirty"
									icon="mdi-check-circle"
									color="success"
									size="20"
									class="mr-2" />
				</template>
			</v-text-field>

			<!-- Forwarding Agent -->
			<v-text-field label="Forwarding Agent"
										v-model="application.forwardingAgent"
										density="compact"
										color="primary"
										clearable
										:error-messages="errors.forwardingAgent"
										@blur="v$.forwardingAgent.$touch()">
				<template #append-inner>
					<v-icon v-if="v$.forwardingAgent.$error"
									icon="mdi-alert-circle"
									color="error"
									size="20"
									class="mr-2" />

					<v-icon v-else-if="v$.forwardingAgent.$dirty"
									icon="mdi-check-circle"
									color="success"
									size="20"
									class="mr-2" />
				</template>
			</v-text-field>

			<!-- Export Date -->
			<v-date-input label="Export Date"
										clearable
										v-model="application.exportDate"
										density="compact"
										class="date-picker"
										data-id="exportDate"
										color="primary"
										prepend-icon=""
										prepend-inner-icon="$calendar"
										hint=""
										persistent-hint
										:display-format="fullDate" />

			<!-- Remarks -->
			<v-textarea label="Remarks"
									v-model="application.remarks"
									density="compact"
									class="col-span-2"
									color="primary"
									clearable
									counter
									rows="8"
									hint="Maximum 300 characters · Maximum 8 lines"
									persistent-hint
									:error-messages="errors.remarks"
									@blur="v$.remarks.$touch()" />
		</v-card-text>

	</v-card>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, maxLength } from '@vuelidate/validators'
import { error } from 'console'

const application = defineModel<COO>({ required: true })



const rules = {
	consignorReference: {
		maxLength: helpers.withMessage(
			'Must be at most 60 characters',
			maxLength(60)
		),
	},
	importPermitNumber: {
		maxLength: helpers.withMessage(
			'Must be at most 60 characters',
			maxLength(60)
		),
	},
	billOfLadingNumber: {
		maxLength: helpers.withMessage(
			'Must be at most 60 characters',
			maxLength(60)
		),
	},
	ownerAgent: {
		maxLength: helpers.withMessage(
			'Must be at most 60 characters',
			maxLength(60)
		),
	},
	exportCarrier: {
		maxLength: helpers.withMessage(
			'Must be at most 60 characters',
			maxLength(60)
		),
	},
	forwardingAgent: {
		maxLength: helpers.withMessage(
			'Must be at most 60 characters',
			maxLength(60)
		),
	},
	exportDate: {},
	remarks: {
		maxLength: helpers.withMessage(
			'Must be at most 300 characters',
			maxLength(300)
		),
		lines: helpers.withMessage(
			'Must be at most 8 lines',
			(remark: string | null | undefined) =>
				!remark || remark.split(/\r?\n/).length <= 8
		),
	},
}

const v$ = useVuelidate(rules, application as any)

const errors = computed(() => {
	return validationErrors(v$.value)
})

// Expose validity state to parent
defineExpose({
	isValid: computed(() => {
		if (v$.value.$dirty) {
			return !v$.value.$invalid
		}
		return true
	}),
})
</script>
