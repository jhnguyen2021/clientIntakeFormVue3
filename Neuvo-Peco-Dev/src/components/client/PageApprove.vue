<script setup lang="ts">
import { onMounted, computed, ref, type ComputedRef } from "vue";
import router from '@/router';
import { useClientStore } from '@/stores/clientStore'
import { authService } from '@/services/authService'
import { useLoading } from 'vue-loading-overlay'
import { useAuthStore } from '@/stores/authStore'
import tabAccount from '@/components/client/tabs/TabAccountInfo.vue'
import tabAP from '@/components/client/tabs/TabApContact.vue'
import tabPurchasing from '@/components/client/tabs/TabPurchasing.vue'
import tabSaleContact from '@/components/client/tabs/TabSaleContact.vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import WidgetSectionTitle from '@/components/widgets/WidgetSectionTitle.vue'
import { notificationService } from "@/services/notificationService";
import type { IClient } from '@/services/api/interfaces/client'

const $loading = useLoading(
    {
        opacity: 0.9,
        canCancel: false,
        isFullPage: true,
    }
);

onMounted(async () => {
    if (currentForm.value.createDate.length == 0) {
        currentForm.value.createDate = (new Date()).toJSON()
    }
});

const userStore = useAuthStore()
const clientStore = useClientStore()

const rejectionNotes = ref('');

const formId: ComputedRef<number> = computed(() => parseInt(router.currentRoute.value.params.id.toString()))

const linkRoute = computed(() => {
    let linkRoute1 = router.resolve({ name: 'clientEditAccount', params: { id: formId.value } }).path
    return import.meta.env.VITE_APP_BASEURL + linkRoute1
})

const selectedForm = computed(() => {
    return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})

const currentForm = ref<IClient>(selectedForm.value)

const previouslyCreatedDate = ref(currentForm.value.createDate)

const submitToB1 = async () => {
    clientStore.savedFormHash = []
    currentForm.value.createDate = (new Date(previouslyCreatedDate.value)).toJSON()
    let loader = $loading.show();

    clientStore.submitToB1(formId.value)
        .then((response) => {
            loader.hide();

            //buildEmailData("ERP Notification", "Approved", "Client Onboarding Form Approved", userStore.userInfo.userPrincipalName, new Date(Date.now()), true);

            const buildEmailBody = clientStore.buildEmailTemplate("ERP Notification", "Approved", "Client Onboarding Form Approved", userStore.userInfo.userPrincipalName, response.CardCode)
            sendNotificationEmail(buildEmailBody);

            clientStore.getClientData()
            router.push('/clients').then(() => {
                toast.success('Client Created in PECO:' + '{' + response.CardCode + '}', {
                    position: toast.POSITION.TOP_CENTER,

                });
            });
        }).catch((e: Error) => {
            console.log(e);
            loader.hide();
            currentForm.value.createDate = (new Date(previouslyCreatedDate.value)).toJSON()
            clientStore.saveForm(formId.value, "Error")
            router.push('/clients').then(() => {
                toast.error("Error Creating Client. Please contact support for assistance." + '{' + e.message + '}', {
                    position: toast.POSITION.TOP_CENTER,
                });
            });
        });
}

const RejectForm = async () => {

    let loader = $loading.show();

    currentForm.value.createDate = (new Date(previouslyCreatedDate.value)).toJSON()
    await clientStore.saveForm(formId.value, "Rejected")

    const buildEmailBody = clientStore.buildEmailTemplate("ERP Notification", "Rejected", "Client Onboarding Form Rejected", userStore.userInfo.userPrincipalName, '', rejectionNotes.value, linkRoute.value)
    sendNotificationEmail(buildEmailBody);
    loader.hide();
    router.push('/clients').then(() => {
        toast.success("Client Form Saved Successfully !", {
            position: toast.POSITION.TOP_CENTER,
        });

    });
}

async function sendNotificationEmail(sendEmailData: any) {

    let token = await authService.getNotificationToken()

    let config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    await notificationService.sendEmail(sendEmailData, config)
        .then((response: { data: any }) => {
            console.log(response.data);
            toast.success("Email Notification sent to requestor!", {
                position: toast.POSITION.TOP_CENTER,
            });
        })
        .catch((e: Error) => {
            console.log(e);
            toast.error("Email failed to sent to requestor!", {
                position: toast.POSITION.TOP_CENTER,
            });
        });
}



</script>

<template>
    <div class="container">
        <div class="col-lg-6 col-xl-12 col-xxl-6 h-100">
            <WidgetSectionTitle title="Review Submitted Forms" icon="spinner" />
        </div>


        <div class="card theme-wizard mb-5">
            <div class="card-body py-4">
                <form disabled readonly class="form-validation" data-wizard-form="2">

                    <tabAccount />
                    <!-- New Section -->
                    <tabSaleContact />
                    <!-- New Section -->
                    <tabAP />
                    <!-- New Section -->
                    <tabPurchasing />
                </form>
            </div>

            <div class="card-footer bg-body-tertiary">
                <div class="text-center px-sm-3 px-md-5" role="tabpanel" aria-labelledby="bootstrap-wizard-tab4"
                    id="bootstrap-wizard-tab4">
                    <button id="rejectBtn" class="btn btn-primary px-5 my-3" type="button" data-bs-toggle="modal"
                        data-bs-target="#error-modal">Reject/Return To Sender
                    </button>
                </div>

                <div class="text-center px-sm-3 px-md-5" role="tabpanel" aria-labelledby="bootstrap-wizard-tab4">
                    <button id="approveBtn" @click="submitToB1()" class="btn btn-primary px-5 my-3"
                        type="button">Approve/Submit To ERP
                    </button>
                </div>

                <div class="modal fade" id="error-modal" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 500px">
                        <div class="modal-content position-relative">
                            <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                                <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body p-0">

                                <div class="p-4 pb-0">
                                    <form>
                                        <h4 class="mb-1" id="modalExampleDemoLabel">Reasons for rejection:</h4>
                                        <label class="col-form-label" for="message-text">Message:</label>
                                        <textarea style="height: 150px;" v-model="rejectionNotes" class="form-control"
                                            id="message-text"></textarea>
                                    </form>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                                <button @click="RejectForm" class="btn btn-primary" data-bs-dismiss="modal"
                                    type="button">Send Mail </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.editBtn {
    border: none;
    background-color: transparent;
    color: red;
}

#rejectBtn {
    float: left;
}

#approveBtn {
    float: right;
}


@media (max-width: 450px) {
    .row g-2 {
        display: block;
    }

    .col-6 {
        width: 100%;
    }

    #rejectBtn {
        float: none;
    }

    #approveBtn {
        float: none;

    }
}
</style>