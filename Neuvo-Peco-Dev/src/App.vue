<script lang="ts" setup>
import { RouterView } from 'vue-router'
import NavbarTop from '@/components/navbars/NavbarTop.vue'
import { useAuthStore, error } from '@/stores/authStore'
import { useCommonStore } from '@/stores/commonStore'
import { onMounted } from 'vue';

const authStore = useAuthStore()
const commonStore = useCommonStore()

onMounted(async () => {
    await authStore.initialize();
    await commonStore.setSalesPersons();
    await commonStore.setCountries();
    await commonStore.setSalesPersons();
});


</script>




<template>
    <!-- menu -->
    <!-- view -->
    <main class="main" id="top">
        <div class="container-fluid" data-layout="container">
            <NavbarTop />
            <div class="content">
                <RouterView />
            </div>
        </div>
    </main>

    <!-- error -->
    <div>

    </div>
    <div id="error" v-if="error"> {{ error }} </div>
</template>

<script lang="ts">
document.title = import.meta.env.VITE_APP_TITLE;
</script>