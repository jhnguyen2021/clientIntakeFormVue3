<template>
    <div class="row g-3 mb-3">
        <div class="col-lg-6 offset-lg-3 pe-lg-2 mb-3">
            <div class="card h-lg-100 overflow-hidden">
                <div class="card-header bg-body-tertiary">
                    <h1>Home</h1>
                </div>
                <div class="card-body">
                    <p v-if="auth.account">Welcome!</p>
                    <p v-else>Click to <router-link to="/login">login</router-link>.</p>

                    <p v-if="auth.account">{{ authStore.userInfo.displayName }}!</p>
                    <p v-if="auth.account">{{ authStore.userInfo.mail }}</p>
                    <p style="display:none;" v-if="auth.account">{{ authStore.accessToken }}</p>
                    <p v-if="auth.account"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { auth, useAuthStore } from '@/stores/authStore'


const authStore = useAuthStore()
console.log(authStore);

</script>