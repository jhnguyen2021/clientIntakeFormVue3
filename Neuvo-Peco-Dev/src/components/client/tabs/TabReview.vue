<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import 'vue3-toastify/dist/index.css';
import tabAccount from '@/components/client/tabs/TabAccountInfo.vue'
import tabSaleContact from '@/components/client/tabs/TabSaleContact.vue'
import tabAP from '@/components/client/tabs/TabApContact.vue'
import tabPurchasing from '@/components/client/tabs/TabPurchasing.vue'
import { onMounted } from "vue";
import type { IClient } from '@/services/api/interfaces/client'

const router = useRouter()


const clientStore = useClientStore()

const formId = computed(() => (parseInt(router.currentRoute.value.params.id.toString())))

const selectedForm = computed(() => {
    return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})
const currentForm = ref<IClient>(selectedForm.value)

onMounted(async () => {
    clientStore.formAccountDisabled = true

    currentForm.value.contacts.forEach((contact) => {
        contact.formDisabled = true
    });
    currentForm.value.addresses.forEach((address) => {
        address.formDisabled = true
    });
})


</script>

<template>
    <div class="px-sm-3 px-md-5">
        <div class="card-body py-4">
            <form class="form-validation" data-wizard-form="2">
                <!-- New Section -->
                <tabAccount />
                <!-- New Section -->
                <tabSaleContact />
                <!-- New Section -->
                <tabAP />
                <!-- New Section -->
                <div v-if="currentForm.pORequired">
                    <tabPurchasing />
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.editBtn {
    border: none;
    background-color: transparent;
    color: red;
}

@media (max-width: 450px) {
    .row g-2 {
        display: block;
    }

    .col-6 {
        width: 100%;
    }
}
</style>