<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { onMounted, ref, computed, watch } from 'vue'
import useVuelidate from "@vuelidate/core";
import { useCommonStore } from '@/stores/commonStore'
import { useRouter } from 'vue-router'
import type { IClient } from '@/services/api/interfaces/client'
import { required, helpers } from '@vuelidate/validators'
import 'vue3-toastify/dist/index.css';


const clientStore = useClientStore()
const commons = useCommonStore()
const router = useRouter()

const tabIndex = parseInt(router.currentRoute.value.meta.tabNumber as string)

const formId = computed(() => (parseInt(router.currentRoute.value.params.id.toString())))

const selectedForm = computed(() => {
    return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})

const currentForm = ref<IClient>(selectedForm.value)

onMounted(() => {
    currentForm.value.createDate = (new Date()).toJSON()

    if (!clientStore.tabs[tabIndex].tabReview && !clientStore.tabs[tabIndex].tabAccounting) {
        clientStore.formAccountDisabled = false;
    } else {
        clientStore.formAccountDisabled = true;
    }
})

const rules = {
    clientName: { required: helpers.withMessage('Client Name Is Required', required) },
    salesPersonCode: { required: helpers.withMessage('Sale Person Is Required', required) },
};

const v$ = useVuelidate(rules, currentForm.value);

watch(() => currentForm.value.salesPersonCode, (newValue) => {
    const selectedSalesPerson = commons.salesPersons.find((person) => person.SlpCode === newValue)
    // Update salesPerson.empID in the store
    if (selectedSalesPerson) {
        clientStore.updateOnwerCode(selectedSalesPerson.empID, formId.value);
    }
});


</script>

<template>
    <div class="card-body py-4">
        <form novalidate="true" data-wizard-form="1">
            <div class="row g-2" style="padding-top:30px;padding-bottom: 30px">
                <div class="col-6" style="display: flex">
                    <div>
                        <h5>Basic Information:</h5>
                    </div>
                    <div v-if="clientStore.tabs[tabIndex].dislayEditBtn" style="margin-left:10px;"
                        class="form-check form-switch">
                        <input @change="clientStore.formAccountDisabled = !clientStore.formAccountDisabled"
                            class="form-check-input" name="confirmedBusiness" id="flexSwitchCheckChecked" :value="true"
                            type="checkbox" />
                        <label class="form-check-label" for="flexSwitchCheckChecked">&nbsp;&nbsp;Edit</label>
                    </div>
                </div>

            </div>
            <div class="row g-2">
                <div class="col-6">
                    <div class="mb-3">

                        <label class="form-label" for="bootstrap-wizard-card-purchasingContact">Client type:<span
                                class="text-danger">*</span></label>
                        <div>
                            <div class="form-check form-switch">
                                <input :disabled="clientStore.formAccountDisabled" class=" form-check-input"
                                    name="confirmedBusiness" id="flexSwitchCheckChecked" type="checkbox" checked
                                    :value="true" v-model=currentForm.isRFP />
                                <label class="form-check-label" for="flexSwitchCheckChecked">&nbsp;&nbsp;Is this client
                                    intake
                                    form for an RFQ/RFI/RFP ?</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="clientStore.tabs[tabIndex].tabAccounting" class="col-6">
                    <div class="mb-3">
                        <label class="form-label" for="bootstrap-wizard-wizard-confirm-zip">Status:</label>
                        <span :class="{
                        'badge-subtle-danger': currentForm.status == 'Error',
                        'badge-subtle-warning': currentForm.status == 'Rejected',
                        'badge-subtle-info': currentForm.status == 'Saved' || currentForm.status == 'Submitted',
                        'badge-subtle-success': currentForm.status == 'Approved',
                    }" class="badge rounded-pill">{{
                        currentForm.status }}<span class="ms-1 fas fa-check"
                                data-fa-transform="shrink-2"></span></span>
                    </div>
                </div>
            </div>

            <div class="col-6">
                <div class="mb-3">
                    <label class="form-label" for="datePicker">Date:<span class="text-danger">*</span></label>
                    <date-picker :disabled="clientStore.tabs[tabIndex].calendarDisabled" calendar-class="card"
                        class="form-control datePicker" type="date" name="date" id="datePicker"
                        :class="{ 'isDisabled': clientStore.tabs[tabIndex].calendarDisabled }"
                        v-model="currentForm.createDate" format="MM / dd / yyyy">
                    </date-picker>
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-Client">Client's Legal Name:<span
                        class="text-danger">*</span>
                    <div id="tooltip" class="mb-3">
                        <font-awesome-icon style="height: 20px;" :icon="['fas', 'circle-info']" class="me-2"
                            transform="shrink-3" />
                        <span class="tooltiptext">Example: Pinnacle Exhibits Inc</span>
                    </div>
                </label>

                <input :disabled="clientStore.formAccountDisabled" class="form-control" type="text"
                    :class="{ 'is-invalid': v$.clientName.$error }" name="clientLegalName"
                    placeholder="Client's Legal Name" id="bootstrap-wizard-wizard-Client"
                    v-model="currentForm.clientName" />
            </div>

            <div class="col-6">
                <div class="mb-3">
                    <label class="form-label" for="bootstrap-wizard-wizard-billingName">Federal Tax ID:</label>
                    <input :disabled="clientStore.formAccountDisabled" class="form-control" type="text"
                        name="federalTaxID" placeholder="Federal Tax ID" id="bootstrap-wizard-wizard-federalTaxID"
                        v-model="currentForm.federalTaxID" />
                </div>
            </div>
            <div class="col-6">
                <div class="mb-3">


                    <div>
                        <div class="form-check form-switch">
                            <input :disabled="clientStore.formAccountDisabled" class="form-check-input" name="hasW9"
                                id="flexSwitchCheckChecked" type="checkbox" checked :value="true"
                                v-model=currentForm.hasW9 />
                            <label class="form-check-label" for="hasW9">&nbsp;&nbsp;Has the client provided Pinnacle
                                with
                                their W9?</label>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-6">
                <div class="mb-3">
                    <label class="form-label" for="bootstrap-wizard-wizard-SalePerson">Sales Person:<span
                            class="text-danger">*</span></label>
                    <select :class="{ 'is-invalid': v$.salesPersonCode.$error }"
                        :disabled="clientStore.formAccountDisabled" v-model=currentForm.salesPersonCode
                        class="form-select mb-3">
                        <option value="" selected>--Select--</option>
                        <option v-for="salesPerson in commons.salesPersons" :key="salesPerson.SlpCode"
                            :value="salesPerson.SlpCode.toString()">
                            {{ salesPerson.SlpName }}</option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
#tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

#tooltip .tooltiptext {
    visibility: hidden;
    width: 300px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 5px;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
}

#tooltip:hover .tooltiptext {
    visibility: visible;
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