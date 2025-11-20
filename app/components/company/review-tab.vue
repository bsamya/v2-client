<template>
	<v-container>

		<v-card title="Company Details"
						class="mb-2">
			<v-card-text>

				<v-list>
					<v-list-item two-line
											 active-class="bg-slate-300"
											 :color="error.partnerCode ? 'error' : undefined"
											 :style="error.partnerCode ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-town-hall"
											:color="error.partnerCode ? 'error' : undefined"></v-icon>
						</template>

						<template #title><span class="uppercase">{{ company.partnerCode }}</span> {{ partner!.name.en
						}}</template>
						<template #subtitle
											:style="error.partnerCode ? 'color: #dc2626; font-weight: 500;' : ''">
							{{ error.partnerCode ?? "Partner Name" }}
						</template>
					</v-list-item>

					<v-list-item two-line
											 :color="error.company ? 'error' : undefined"
											 :style="error.company ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-domain"
											:color="error.company ? 'error' : undefined"></v-icon>
						</template>

						<template #title>{{ company.company }}</template>
						<template #subtitle
											:style="error.company ? 'color: #dc2626; font-weight: 500;' : ''">
							{{ error.company ?? "Company Name" }}
						</template>
					</v-list-item>

					<v-list-item v-if="company.dba"
											 two-line
											 :color="error.dbaName ? 'error' : undefined"
											 :style="error.dbaName ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-domain"
											:color="error.dbaName ? 'error' : undefined"></v-icon>
						</template>

						<template #title>{{ company.dbaName }}</template>
						<template #subtitle
											:style="error.dbaName ? 'color: #dc2626; font-weight: 500;' : ''">
							{{ error.dbaName ?? "Doing Business As" }}</template>
					</v-list-item>

					<v-list-item two-line
											 :color="error.website ? 'error' : undefined"
											 :style="error.website ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-web"
											:color="error.website ? 'error' : undefined"></v-icon>
						</template>

						<template #title>{{ company.website }}</template>
						<template #subtitle
											:style="error.website ? 'color: #dc2626; font-weight: 500;' : ''">
							{{ error.website ?? "Website URL" }}</template>
					</v-list-item>

					<v-list-item two-line
											 :color="error.registeredAddress ? 'error' : undefined"
											 :style="error.registeredAddress ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-map-marker-star"
											:color="error.registeredAddress ? 'error' : undefined"></v-icon>
						</template>

						<template #title>{{ company.registeredAddress }}</template>
						<template #subtitle
											:style="error.registeredAddress ? 'color: #dc2626; font-weight: 500;' : ''">{{
												error.registeredAddress ??
												"Registered Address" }}</template>
					</v-list-item>

					<v-list-item v-if="company.hasOperationsAddress"
											 two-line
											 :color="error.operationsAddress ? 'error' : undefined"
											 :style="error.operationsAddress ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-map-marker-multiple-outline"
											:color="error.operationsAddress ? 'error' : undefined"></v-icon>
						</template>

						<template #title>{{ company.operationsAddress }}</template>
						<template #subtitle
											:style="error.operationsAddress ? 'color: #dc2626; font-weight: 500;' : ''">{{
												error.operationsAddress ??
												"Operations Address" }}</template>
					</v-list-item>

					<v-list-item two-line
											 :color="error['businessLicense.number'] || error['businessLicense.expiry'] || error['businessLicense.url'] ? 'error' : undefined"
											 :style="error['businessLicense.number'] || error['businessLicense.expiry'] || error['businessLicense.url'] ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-license"
											:color="error['businessLicense.number'] || error['businessLicense.expiry'] || error['businessLicense.url'] ? 'error' : undefined"></v-icon>
						</template>

						<template #title>
							{{ company.businessLicense.number }}
							{{ company.businessLicense.expiry }}

							<v-chip v-if="company.businessLicense.url"
											label
											color="primary"
											target="_blank"
											:href="company.businessLicense.url"
											prepend-icon="mdi-file-pdf-box">
								Business License
							</v-chip>

						</template>
						<template #subtitle
											:style="error['businessLicense.number'] || error['businessLicense.expiry'] || error['businessLicense.url'] ? 'color: #dc2626; font-weight: 500;' : ''">{{
												error['businessLicense.number'] ?? error['businessLicense.expiry'] ??
												error['businessLicense.url'] ?? "Business License" }}</template>
					</v-list-item>

					<v-list-item v-if="company.isManufacturer"
											 two-line
											 :color="error['manufacturingLicense.number'] || error['manufacturingLicense.expiry'] || error['manufacturingLicense.url'] ? 'error' : undefined"
											 :style="error['manufacturingLicense.number'] || error['manufacturingLicense.expiry'] || error['manufacturingLicense.url'] ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-factory"
											:color="error['manufacturingLicense.number'] || error['manufacturingLicense.expiry'] || error['manufacturingLicense.url'] ? 'error' : undefined"></v-icon>
						</template>

						<template #title>
							{{ company.manufacturingLicense.number }}
							{{ company.manufacturingLicense.expiry }}

							<v-chip v-if="company.manufacturingLicense.url"
											label
											color="primary"
											target="_blank"
											:href="company.manufacturingLicense.url"
											prepend-icon="mdi-file-pdf-box">
								Manufacturing License
							</v-chip>

						</template>
						<template #subtitle
											:style="error['manufacturingLicense.number'] || error['manufacturingLicense.expiry'] || error['manufacturingLicense.url'] ? 'color: #dc2626; font-weight: 500;' : ''">{{
												error['manufacturingLicense.number'] ?? error['manufacturingLicense.expiry'] ??
												error['manufacturingLicense.url'] ?? "Manufacturing License" }}</template>
					</v-list-item>

					<v-list-item v-if="company.isChamberMember"
											 two-line
											 :color="error['chamberMembership.number'] || error['chamberMembership.expiry'] ? 'error' : undefined"
											 :style="error['chamberMembership.number'] || error['chamberMembership.expiry'] ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-check-decagram-outline"
											:color="error['chamberMembership.number'] || error['chamberMembership.expiry'] ? 'error' : undefined"></v-icon>
						</template>

						<template #title>
							{{ company.chamberMembership.number }}
							{{ company.chamberMembership.expiry }}
						</template>
						<template #subtitle
											:style="error['chamberMembership.number'] || error['chamberMembership.expiry'] ? 'color: #dc2626; font-weight: 500;' : ''">{{
												error['chamberMembership.number'] ?? error['chamberMembership.expiry'] ??
												"Chamber Membership" }}</template>
					</v-list-item>

					<v-list-item two-line
											 :color="error.contacts ? 'error' : undefined"
											 :style="error.contacts ? 'background-color: #fef2f2; border-left: 4px solid #dc2626;' : ''">
						<template #prepend>
							<v-icon icon="mdi-account-multiple-outline"
											:color="error.contacts ? 'error' : undefined"></v-icon>
						</template>

						<template #title>
							{{ company.contacts.length }} Contact(s)
						</template>
						<template #subtitle
											:style="error.contacts ? 'color: #dc2626; font-weight: 500;' : ''">
							{{ error.contacts ?? "Company Contacts" }}
						</template>
					</v-list-item>
				</v-list>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary"
							 variant="flat"
							 :disabled="Object.keys(error).length !== 0"
							 @click="set">
					Confirm Info and Send to Chamber</v-btn>
			</v-card-actions>


		</v-card>
	</v-container>
</template>

<script setup lang="ts">
const props = defineProps<{
	error: Record<string, string>;
}>();

const companyStore = useCompanyStore();
const company = toRef(companyStore, "company");
const partner = toRef(companyStore, "partner");

const set = async () => {
	await companyStore.setCompany()
		.then(() => {
			alert("Company information submitted successfully!")
			useRouter().push("/companies");
		})
		.catch((error) => {
			alert("Error submitting company information: " + error.message);
		});
};
</script>
