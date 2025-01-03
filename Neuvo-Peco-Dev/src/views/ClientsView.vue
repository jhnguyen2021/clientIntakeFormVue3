<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useClientStore } from '@/stores/clientStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const clientStore = useClientStore();

const formId = computed(() => {
    var id;
    if (router.currentRoute.value.params.id != undefined || router.currentRoute.value.params.id != null) {
        id = parseInt(router.currentRoute.value.params.id.toString())
    }
    return id
})




onMounted(async () => {
    if (formId.value === 0) {
        clientStore.addClientForm();
    }
});

</script>



<template>
    <RouterView />
</template>