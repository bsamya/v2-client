<template>
	<div class="grid grid-cols-3 gap-2 max-w-6xl m-auto">
		<v-card v-for="c in company.contacts"
						:key="c.email"
						color="primary"
						variant="outlined">


			<!-- edit mode-->
			<v-card-text v-if="contact && contact.contactId === c.contactId">
				<lazy-company-contact-form v-if="contact"
																	 v-model="contact"
																	 :key="contact.contactId"
																	 @close="contact = null"
																	 @set="setContact" />
			</v-card-text>

			<!-- view mode -->
			<v-card-text v-if="!contact || (contact && contact.contactId !== c.contactId)">

				<v-list slim>
					<v-list-item prepend-icon="mdi-account-box-outline">
						<span class="text-h6">{{ c.fullName }}</span>
					</v-list-item>
					<v-list-item prepend-icon="mdi-format-title">
						<span>{{ c.title }}</span>
					</v-list-item>
					<v-list-item prepend-icon="mdi-email-outline">
						<span>{{ c.email }}</span>
					</v-list-item>
					<v-list-item prepend-icon="mdi-phone-outline">
						{{ mask.mask(c.tel) }} <span v-if="c.extension"
									class="ml-2">Ext {{ c.extension }}</span>
					</v-list-item>
					<v-list-item prepend-icon="mdi-bell-ring">
						<v-chip v-for="notification in c.notifications"
										:key="notification"
										class="ma-1"
										size="small">{{ notification }}</v-chip>
					</v-list-item>
				</v-list>
			</v-card-text>

			<v-divider></v-divider>
			<v-card-actions v-if="!contact">
				<v-spacer></v-spacer>
				<v-btn rounded
							 variant="tonal"
							 size="small"
							 prepend-icon="mdi-pencil"
							 @click="editContact(c.contactId)"
							 color="primary"
							 text="Edit" />


				<v-btn rounded
							 variant="tonal"
							 color="red"
							 size="small"
							 @click="deleteContact(c.contactId)"
							 prepend-icon="mdi-delete"
							 text="Delete" />

			</v-card-actions>
		</v-card>


		<v-card v-if="contact && contact.contactId === ''">

			<!-- add mode 	-->
			<v-card-text>
				<lazy-company-contact-form v-if="contact"
																	 v-model="contact"
																	 :key="$uuid()"
																	 @close="contact = null"
																	 @set="setContact" />
			</v-card-text>
		</v-card>

		<v-btn v-if="!contact"
					 class="mt-4"
					 variant="outlined"
					 color="primary"
					 rounded
					 @click="addContact"
					 prepend-icon="mdi-plus"
					 text="Add Contact" />

	</div>
</template>

<script setup lang="ts">
import { useMask } from 'vuetify'

const mask = useMask({ mask: '(###)-###-####' })

const { $uuid } = useNuxtApp();
const companyStore = useCompanyStore();
const company = toRef(companyStore.company);
const contact = ref<CompanyContact | null>(null);

function addContact() {
	contact.value = {
		contactId: "",
		fullName: "",
		title: "",
		email: "",
		tel: "",
		extension: "",
		mobile: "",
		notifications: [],
	};
	console.log("Adding contact", contact.value);
}

function editContact(contactId: string) {
	const c = company.value.contacts.find(c => c.contactId === contactId);
	if (c) {
		contact.value = JSON.parse(JSON.stringify(c));
	}
}

function deleteContact(contactId: string) {
	const index = company.value.contacts.findIndex(c => c.contactId === contactId);
	if (index !== -1) {
		company.value.contacts.splice(index, 1);
	}
	contact.value = null;
}

function setContact() {
	if (contact.value === null) return;
	const index = company.value.contacts.findIndex(c => c.contactId === contact.value!.contactId);
	if (index !== -1) {
		company.value.contacts[index] = contact.value;
	} else {
		//new contact - assign id
		contact.value.contactId = $uuid();
		company.value.contacts.push(contact.value);
	}
	contact.value = null;

	//companyStore.setContact(c);
	//dialog.value = false;
}

</script>
