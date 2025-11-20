<template>
	<v-card outlined
					title="Shipment Details">

		<template v-for="(item, i) in application.shipment"
							:key="i">
			<coo-shipping-item v-model="application.shipment[i]!"
												 :index="i"
												 @copy="() => copyItem(i)"
												 @delete="() => deleteItem(i)" />
		</template>


		<v-card-actions class="justify-end">
			<v-btn color="primary"
						 variant="tonal"
						 prepend-icon="mdi-plus"
						 size="small"
						 @click="addItem">
				Add Item
			</v-btn>
		</v-card-actions>
	</v-card>

</template>

<script setup lang="ts">
const application = defineModel<COO>({ required: true });

const defaultShipment = {
	description: '',
	hsCode: '',
	netWeight: '',
	grossWeight: '',
	marksAndNumbers: '',
	countryOfOrigin: [] as string[],
};

function addItem() {
	console.log('adding item');
	application.value.shipment.push({ ...defaultShipment });
}

function copyItem(index: number) {
	const src = application.value.shipment[index];
	if (!src) return;
	const clone = {
		...src,
		countryOfOrigin: Array.isArray(src.countryOfOrigin)
			? [...src.countryOfOrigin]
			: [],
	};
	application.value.shipment.splice(index + 1, 0, clone);
}

function deleteItem(index: number) {
	const list = application.value.shipment;
	if (list.length === 1) {
		list[0] = { ...defaultShipment };
		return;
	}
	list.splice(index, 1);
}

watch(
	() => application.value.shipment,
	() => { if (application.value.shipment.length === 0) application.value.shipment.push({ ...defaultShipment }) },
	{ immediate: true }
);

import { useVuelidate } from '@vuelidate/core';
const v$ = useVuelidate()

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
