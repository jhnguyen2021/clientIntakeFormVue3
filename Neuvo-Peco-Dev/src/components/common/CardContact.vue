<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { vMaska } from "maska"
import { required, minLength, email, requiredIf, helpers } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import cardXbtn from '@/components/common/CardXbtn.vue'
import { type IClientContactInfo, contactType, type IClient } from '@/services/api/interfaces/client'

const props = defineProps<{
    contactInfo: IClientContactInfo
    index: number
    formId: number

}>()

const clientContact = ref<IClientContactInfo>(props.contactInfo)
const clientContactIndex = ref<number>(props.index)

const clientStore = useClientStore()
const router = useRouter()
const tabIndex = parseInt(router.currentRoute.value.meta.tabNumber as string)
const formId = ref<number>(props.formId)

const selectedForm = computed(() => {
    return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})

const currentForm = ref<IClient>(selectedForm.value)


defineEmits(["addClientContact"])

onMounted(() => {
    if (!clientStore.tabs[tabIndex].tabReview && !clientStore.tabs[tabIndex].tabAccounting) {
        clientContact.value.formDisabled = false;
    } else {
        clientContact.value.formDisabled = true;
    }
})



const displayXbtn = computed(() => {
    if (clientContactIndex.value == 0) {
        return false
    }
    else {
        return true
    }
})

const rules = {
    firstName: { requiredIf: helpers.withMessage(clientContact.value.type + ' ' + 'First Name Is Required', requiredIf(() => clientContact.value.type != contactType.Purchasing)) },
    lastName: { requiredIf: helpers.withMessage(clientContact.value.type + ' ' + 'Last  Name Is Required', requiredIf(() => clientContact.value.type != contactType.Purchasing)) },
    phone: { required: helpers.withMessage(clientContact.value.type + ' ' + 'Phone Is Required', required), minLength: minLength(14) },
    email: { required: helpers.withMessage(clientContact.value.type + ' ' + 'Email Is Required', required), email }
}

const v$ = useVuelidate(rules, clientContact);


const removeComponent = () => {
    const index = currentForm.value.contacts.indexOf(clientContact.value)
    currentForm.value.contacts.splice(index, 1)
}


</script>

<template>
    <div class="row g-2" style="padding-top:30px;padding-bottom: 30px">
        <div class="col-6" style="display: flex">
            <div>
                <h5>{{ clientContact.type }} Contact Info:</h5>
            </div>
            <div v-if="clientStore.tabs[tabIndex].dislayEditBtn" class="form-check form-switch"
                style="margin-left:10px;">
                <input @change="clientContact.formDisabled = !clientContact.formDisabled" class="form-check-input"
                    name="confirmedBusiness" id="flexSwitchCheckChecked" type="checkbox" />
                <label class="form-check-label" for="flexSwitchCheckChecked">&nbsp;&nbsp;Edit</label>
            </div>
        </div>

        <cardXbtn @deleteComponent="removeComponent()" :displayXbtn="displayXbtn" />


    </div>
    <div class="row g-2">
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-billingName">{{ clientContact.type }} Contact
                    First
                    Name:<span v-if="clientContact.type != contactType.Purchasing" class="text-danger">*</span></label>
                <input :disabled="clientContact.formDisabled" class="form-control" type="text" name="billingFirstname"
                    :placeholder="clientContact.type + ' Contact First Name'" required="true"
                    id="bootstrap-wizard-wizard-billingName" v-model="clientContact.firstName"
                    :class="{ 'is-invalid': v$.firstName.$error }" />
            </div>
        </div>
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-billingName">{{ clientContact.type }} Contact
                    Last
                    Name:<span v-if="clientContact.type != contactType.Purchasing" class="text-danger">*</span></label>
                <input :disabled="clientContact.formDisabled" class="form-control" type="text" name="billingLastName"
                    required="true" :placeholder="clientContact.type + ' Contact Last Name'"
                    id="bootstrap-wizard-wizard-billingName" v-model="clientContact.lastName"
                    :class="{ 'is-invalid': v$.lastName.$error }" />
            </div>
        </div>
    </div>

    <div class="mb-3">
        <label class="form-label" for="bootstrap-wizard-wizard-billingName">{{ clientContact.type }} Email:<span
                class="text-danger">*</span></label>
        <input :disabled="clientContact.formDisabled" class="form-control" type="text" name="billingEmail"
            :placeholder="clientContact.type + ' Contact Email'" id="bootstrap-wizard-wizard-billingEmail"
            required="true" v-model="clientContact.email" :class="{ 'is-invalid': v$.email.$error }" />
    </div>

    <div class="row g-2">
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-apPhone">{{ clientContact.type }} Contact
                    Phone:<span class="text-danger">*</span></label>
                <input :disabled="clientContact.formDisabled" v-maska data-maska="(###) ###-####" class="form-control"
                    type="text" name="apPhone" placeholder="(000) 000-0000" id="bootstrap-wizard-wizard-apPhone"
                    required="true" v-model="clientContact.phone" :class="{ 'is-invalid': v$.phone.$error }" />

            </div>
        </div>
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