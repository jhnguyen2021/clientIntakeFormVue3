<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useClientStore } from '@/stores/clientStore'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/AppTable.vue'
import _ from 'lodash'

const columns = [
    { name: 'Form ID', data: 'id' },
    { name: 'Status', data: 'status' },
    { name: 'Client Name', data: 'clientName' },
    { name: 'Created On', data: 'createDate' },
    { name: 'Created By', data: 'updateBy' },
]


onMounted(() => {
    clientStore.getClientData()
})

const authStore = useAuthStore()
const canViewApprove = ['Submitted', 'Approved', 'Rejected', 'Error']
const canViewEdit = ['Submitted', 'Rejected', 'Saved', 'Error']

const clientStore = useClientStore()
const router = useRouter()

const canApprove = computed(() => {
    return clientStore.canApprove;
});

const canEdit = computed(() => {
    return clientStore.canEdit;
});


const filtersValue = computed(() => {
    if (canApprove.value && canEdit.value) {
        return ['--Select all--'].concat(canViewApprove).concat('Saved')
    } else if (canEdit.value) {
        return ['--Select all--'].concat(canViewEdit)
    } else if (canApprove.value) {
        return ['--Select all--'].concat(canViewApprove)
    } else {
        return []
    }
});


const statusesFilter = ref('--Select all--');
const formContainer = ref('')


const filteredItems = computed(() => {

    clientStore.clientForms.forEach((client) => {
        client.createDate = convertDate(client.createDate);
    });

    var filteredItems;

    if (clientStore.canViewAll) {
        filteredItems = clientStore.clientForms;
    } else {
        filteredItems = clientStore.clientForms.filter((client) => client.createBy === authStore.userInfo.displayName);
    }
    return filteredItems.filter((client) => (client.status === statusesFilter.value || statusesFilter.value === '--Select all--') && filtersValue.value.some(r => client.status.includes(r)));
});

async function setFormData(id: number) {
    router.push({ name: 'clientEditAccount', params: { id } });
}

async function routeApproveForm(id: number) {

    router.push({ name: 'approveForm', params: { id } })
}

function convertDate(date: string) {
    return new Date(date).toLocaleDateString();
}

</script>

<template>
    <div class="card relative border rounded-lg" ref="formContainer">
        <div id="tableExample4"
            data-list='{"valueNames":["formNumber","status","name", "submittedDate","createBy"],"filter":{"key":"status"}}'>
            <div class="row g-0" style="padding-top:1rem;">
                <div class="col-auto">
                    <RouterLink v-if="canEdit" @click="clientStore.addClientForm" to="/clients/edit/0/account"
                        class="px-3" style="cursor: pointer;">
                        <font-awesome-icon :icon="['fas', 'circle-plus']" /><span style="margin-left:7px;">New Client
                            Intake
                            Form</span>
                    </RouterLink>
                </div>
                <div class="col-auto px-3 ms-auto">
                    <select class="form-select form-select-sm mb-3" aria-label="Bulk actions"
                        data-list-filter="data-list-filter" v-model="statusesFilter">
                        <option v-for='status in filtersValue' :key='status' :value='status'>{{ status }}</option>
                    </select>
                </div>
                <AppTable @setFormData="setFormData" @routeApproveForm="routeApproveForm" title="Clients"
                    :columns="columns" :records="filteredItems" :canEdit="canEdit" :canApprove="canApprove" />
            </div>
        </div>
    </div>
</template>
