<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import CardContact from '@/components/common/CardContact.vue'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { type IClient, contactType } from '@/services/api/interfaces/client'
import 'vue3-toastify/dist/index.css';

const clientStore = useClientStore()
const router = useRouter()
const tabIndex = parseInt(router.currentRoute.value.meta.tabNumber as string)

const formId = computed(() => (parseInt(router.currentRoute.value.params.id.toString())))

const selectedForm = computed(() => {
	return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})
const currentForm = ref<IClient>(selectedForm.value)

</script>

<template>
	<div class="card-body py-4">
		<form novalidate="true" data-wizard-form="1">

			<div v-if="clientStore.tabs[tabIndex].displayAddBtn" class="col-6">
				<div class="mb-3">

					<label class="form-label" for="bootstrap-wizard-card-purchasingContact">Purchase Order
						Required?</label>
					<div style="padding:10px;">
						<label><input :disabled="clientStore.tabs[tabIndex].disabled" type="radio" :value="true"
								name="orderRequired" v-model="currentForm.pORequired" />Yes</label>
						<label style="margin-left:40px;"><input type="radio" v-model="currentForm.pORequired"
								:value="false" name="orderRequired" />No</label>
					</div>
				</div>
			</div>

			<div v-if="currentForm.pORequired">
				<CardContact
					v-for="(clientContact, index) in currentForm.contacts.filter((contact) => contact.type === contactType.Purchasing)"
					:contactInfo="clientContact" :key="clientContact.name" :index="index" :formId="formId" />
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