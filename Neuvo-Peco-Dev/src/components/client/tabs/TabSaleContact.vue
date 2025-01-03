<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import CardContact from '@/components/common/CardContact.vue'
import CardAddress from '@/components/common/CardAddress.vue'
import addBtn from '@/components/common/CardAddBtn.vue'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue';
import { contactType, addressType, type IClient } from '@/services/api/interfaces/client'
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

            <CardAddress
                v-for="(address, index) in currentForm.addresses.filter((address) => address.addressType === addressType.billTo)"
                :addressName="'Client'" :addressInfo="address" :key="address.addressType" :index="index"
                :form-id="formId" />

            <CardContact
                v-for="(clientContact, index) in currentForm.contacts.filter((contact) => contact.type === contactType.Client)"
                :contactInfo="clientContact" :key="clientContact.name" :index="index" :formId="formId" />

            <addBtn cardName="Add Client Contact" :btnDisplay="clientStore.tabs[tabIndex].displayAddBtn"
                @click="clientStore.addClientContact(contactType.Client, formId)" />
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