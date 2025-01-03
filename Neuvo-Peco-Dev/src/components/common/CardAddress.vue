<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DataService from "@/services/api/services/dataServices";
import { authService } from '@/services/authService'
import { useClientStore } from '@/stores/clientStore'
import { useCommonStore } from '@/stores/commonStore';
import { required, helpers } from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
import type { IAddress } from '@/services/api/interfaces/client'
import { useRouter } from 'vue-router'


const commons = useCommonStore()

const props = defineProps<{
    addressInfo: IAddress
    addressName: string
    index: number
    formId: number
}>()

const clientAddress = ref<IAddress>(props.addressInfo)
const clientStore = useClientStore()

const router = useRouter()
const tabIndex = parseInt(router.currentRoute.value.meta.tabNumber as string)


watch(() => clientStore.addressSameAsClient, (currentValue) => {
    if (currentValue) {
        buildState()
    } else {
        buildState()
    }
});

const rules = {
    addressLine1: { required: helpers.withMessage(props.addressName + ' ' + 'Address Line 1 Is Required', required) },
    city: { required: helpers.withMessage(props.addressName + ' ' + 'City Is Required', required) },
    state: { required: helpers.withMessage(props.addressName + ' ' + 'State Is Required', required) },
    country: { required: helpers.withMessage(props.addressName + ' ' + 'Country Is Required', required) },
    zipCode: { required: helpers.withMessage(props.addressName + ' ' + 'Zip Code Is Required', required) },
}

const v$ = useVuelidate(rules, clientAddress)

interface state {
    Code: string,
    Name: string,
    Country: string
}

const states = ref<state[]>([]);
defineEmits(["addClientContact"])

onMounted(async () => {

    let code = "US"

    if (code !== undefined && code !== null && code != '') {
        let token = await authService.getAPIToken()
        let config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        await DataService.getStates(code, config)
            .then((response: { data: state[] }) => {
                states.value = response.data;
                console.log(response.data)
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    if (!clientStore.tabs[tabIndex].tabReview && !clientStore.tabs[tabIndex].tabAccounting) {
        clientAddress.value.formDisabled = false;
    } else {
        clientAddress.value.formDisabled = true;
    }
})

async function buildState() {
    let token = await authService.getAPIToken()
    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    let code = clientAddress.value.country;

    if (code !== undefined && code !== null && code != '') {
        await DataService.getStates(code, config)
            .then((response: { data: state[] }) => {
                states.value = response.data;
                console.log(response.data)
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
}


</script>

<template>
    <div class="row g-2" style="padding-top:30px;padding-bottom: 30px">
        <div class="col-6" style="display: flex">
            <div>
                <h5>{{ addressName }} Address:</h5>
            </div>
            <div v-if="clientStore.tabs[tabIndex].dislayEditBtn" class="form-check form-switch"
                style="margin-left:10px;">
                <input @change="clientAddress.formDisabled = !clientAddress.formDisabled" class="form-check-input"
                    name="confirmedBusiness" id="flexSwitchCheckChecked" type="checkbox" />
                <label class="form-check-label" for="flexSwitchCheckChecked">&nbsp;&nbsp;Edit</label>
            </div>
        </div>
    </div>

    <div class="mb-3">
        <label class="form-label" for="bootstrap-wizard-wizard-address1">{{ addressName }} Address Line
            1:<span class="text-danger">*</span></label>
        <input :disabled="clientAddress.formDisabled" class="form-control" type="text" name="addressLine1"
            :placeholder="addressName + ' Address Line 1'" id="bootstrap-wizard-wizard-address1" required="true"
            v-model="clientAddress.addressLine1" :class="{ 'is-invalid': v$.addressLine1.$error }" />
    </div>

    <div class="mb-3">
        <label class="form-label" for="bootstrap-wizard-wizard-address2">{{ addressName }} Address Line
            2:</label>
        <input :disabled="clientAddress.formDisabled" class="form-control" type="text" name="addressLine2"
            :placeholder="addressName + ' Address Line 2'" required="true" id="bootstrap-wizard-wizard-address2"
            v-model="clientAddress.addressLine2" />
    </div>


    <div class="row g-2">
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-country">Country:<span
                        class="text-danger">*</span></label>
                <select :class="{ 'is-invalid': v$.country.$error }" :disabled="clientAddress.formDisabled"
                    :placeholder="addressName + ' Country'" required="true" name="Country"
                    v-model="clientAddress.country" class="form-select  mb-3" @change="buildState()">
                    <option value="" selected>--Select--</option>
                    <option v-for="country in commons.countries" :value="country.Code" :key="country.Name">{{
                    country.Name
                }}
                    </option>
                </select>
            </div>


        </div>
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-confirm-state">State:<span
                        class="text-danger">*</span></label>
                <select :class="{ 'is-invalid': v$.state.$error }" :placeholder="addressName + ' State'"
                    :disabled="clientAddress.formDisabled" required="true" name="State" title="State"
                    v-model="clientAddress.state" class="form-select  mb-3">
                    <option value="" selected>--Select--</option>
                    <option v-for="state in states" :value="state.Code" :key="state.Name">{{ state.Name }}</option>
                </select>
            </div>
        </div>
    </div>

    <div class="row g-2">
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-city">City:<span
                        class="text-danger">*</span></label>
                <input :placeholder="addressName + ' City'" :disabled="clientAddress.formDisabled" class="form-control"
                    type="text" name="city" id="bootstrap-wizard-wizard-city" required="true"
                    v-model="clientAddress.city" :class="{ 'is-invalid': v$.city.$error }" />
            </div>
        </div>
        <div class="col-6">
            <div class="mb-3">
                <label class="form-label" for="bootstrap-wizard-wizard-confirm-zip">Zip Code:<span
                        class="text-danger">*</span></label>
                <input :disabled="clientAddress.formDisabled" class="form-control" type="text" name="zip"
                    :placeholder="addressName + ' Zip Code'" required="true" id="bootstrap-wizard-wizard-confirm-zip"
                    v-model="clientAddress.zipCode" :class="{ 'is-invalid': v$.zipCode.$error }" />
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