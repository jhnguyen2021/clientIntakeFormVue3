<script setup lang="ts">
import { useClientStore } from '@/stores/clientStore'
import { computed, ref, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'
import { useLoading } from 'vue-loading-overlay'
import { toast } from 'vue3-toastify';
import type { Validation } from '@vuelidate/core';

const $loading = useLoading(
    {
        opacity: 0.9,
        canCancel: false,
        isFullPage: true,
    }
);

const props = defineProps<{
    FormValid: Validation
    btnName: string
}>()

const formValid = ref<Validation>(props.FormValid)


const router = useRouter()
const clientStore = useClientStore()
const formId: ComputedRef<number> = computed(() => parseInt(router.currentRoute.value.params.id.toString()))
const currentForm = computed(() => {
    return clientStore.clientForms.filter((form) => form.id === formId.value)[0]
})

defineEmits(["validateForm"])


const SubmitForm = async () => {
    let loader = $loading.show();
    const result = await formValid.value.$validate()

    switch (props.btnName) {
        case "Save":
            clientStore.savedFormHash = []
            clientStore.saveForm(formId.value, "Saved");
            loader.hide();
            router.push('/clients').then(() => {
                toast.success("Client Form Saved Successfully !", {
                    position: toast.POSITION.TOP_CENTER,
                });
            });
            break;
        case "Submit":
            if (result) {
                clientStore.savedFormHash = []
                clientStore.saveForm(formId.value, "Submitted");
                loader.hide();
                router.push('/clients').then(() => {
                    toast.success("Client Form Submitted Successfully !", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                });
            }
            break;
    }
}

</script>

<template>
    <button @click="$emit('validateForm'), SubmitForm()" class="btn btn-primary px-5 px-sm-6" type="submit">
        {{ props.btnName }}<font-awesome-icon :icon="['fas', 'chevron-right']" class="ms-2" transform="shrink-3" />
    </button>
</template>