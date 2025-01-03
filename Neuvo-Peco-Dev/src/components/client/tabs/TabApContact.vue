<script setup lang="ts">

import { computed, ref } from 'vue'
import { useClientStore } from '@/stores/clientStore'
import cardAddress from '@/components/common/CardAddress.vue'
import cardContact from '@/components/common/CardContact.vue'
import addBtn from '@/components/common/CardAddBtn.vue'
import { useRouter } from 'vue-router'
import { type IClient, addressType, contactType } from '@/services/api/interfaces/client'
import 'vue3-toastify/dist/index.css';


const clientStore = useClientStore()
const router = useRouter()

const tabIndex = parseInt(router.currentRoute.value.meta.tabNumber as string)

const formId = computed(() => (parseInt(router.currentRoute.value.params.id.toString())))

const selectedForm = computed(() => {
	return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})

const currentForm = ref<IClient>(selectedForm.value)

const displayAddBtn = computed(() => {
	if (currentForm.value.addresses.filter((client) => client.addressType === addressType.shipTo).length > 0) {
		return false
	}
	else {
		if (clientStore.tabs[tabIndex].displayAddBtn) {
			return true
		} else {
			return false
		}
	}
});

const displayCheckBox = computed(() => {

	if (clientStore.tabs[tabIndex].tabAccounting || clientStore.tabs[tabIndex].tabReview) {
		return false
	}

	if (displayAddBtn.value) {
		return false
	} else {
		return true
	}
});

const fillAddress = async (event: Event) => {
	const checkBox = event.target as HTMLInputElement
	const clientAddress = currentForm.value.addresses.filter((address) => address.addressType === addressType.billTo)[0]
	const apBillingAddress = currentForm.value.addresses.filter((address) => address.addressType === addressType.shipTo)[0]

	if (checkBox.checked) {
		clientStore.addressSameAsClient = true
		apBillingAddress.addressLine1 = clientAddress.addressLine1
		apBillingAddress.addressLine2 = clientAddress.addressLine2
		apBillingAddress.country = clientAddress.country
		apBillingAddress.city = clientAddress.city
		apBillingAddress.state = clientAddress.state
		apBillingAddress.zipCode = clientAddress.zipCode
	} else {
		clientStore.addressSameAsClient = false
		apBillingAddress.addressLine1 = ''
		apBillingAddress.addressLine2 = ''
		apBillingAddress.country = ''
		apBillingAddress.city = ''
		apBillingAddress.state = ''
		apBillingAddress.zipCode = ''

	}
}


</script>

<template>
	<div class="card-body py-4">

		<form class="form-validation" data-wizard-form="2">
			<!-- <cardContact v-for="contact in currentForm.ap_BillingContact()" :contactInfo="contact" :key="contact.name" /> -->
			<cardContact
				v-for="(contact, index) in currentForm.contacts.filter((contact) => contact.type === contactType.AP_Billing)"
				:contactInfo="contact" :key="contact.name" :index="index" :form-id="formId" />


			<cardAddress
				v-for="(address, index) in currentForm.addresses.filter((address) => address.addressType === addressType.shipTo)"
				:addressName="'AP/Billing'" :addressInfo="address" :key="address.addressType" :index="index"
				:form-id="formId" />

			<addBtn cardName="Add Client Address" :btn-display="displayAddBtn"
				@click="clientStore.addClientAddress(addressType.shipTo, formId)" />


			<div v-if="displayCheckBox">
				<div class="form-check form-switch">
					<input @change="fillAddress" class="form-check-input" name="fillAddress" id="fillAddress"
						type="checkbox" v-model=currentForm.matchClientAddress />
					<label class="form-check-label" for="hasW9">&nbsp;&nbsp;AP/Billing address is the same as Client
						address</label>
				</div>
			</div>

		</form>
	</div>
</template>

<style scoped>
@media (max-width: 450px) {
	.row g-2 {
		display: block;
	}

	.col-6 {
		width: 100%;
	}
}
</style>