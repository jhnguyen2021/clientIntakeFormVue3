<template>
    <div class="row g-3 mb-3">
        <div class="col-lg-6 offset-lg-3 pe-lg-2 mb-3">
            <div class="card h-lg-100 overflow-hidden">
                <div class="card-header bg-body-tertiary">
                    <h1>User Details</h1>
                </div>
                <div class="card-body">
                    <p><b>Name:</b> {{ user.userInfo.displayName }}</p>
                    <p><b>ID:</b> {{ user.userInfo.id }} </p>
                    <p><b>Mail:</b> {{ user.userInfo.mail }} </p>
                    <p><b>Job Title:</b> {{ user.userInfo.jobTitle }}</p>
                    <p><b>Location:</b> {{ user.userInfo.officeLocation }}</p>
                    <p><b>Department:</b> IT </p>
                    <p><b>Groups:</b></p>
                    <ul>
                        <li v-for="item in user.securityGroups" :key="item.id">
                            {{ item.displayName }}
                        </li>
                    </ul>
                    <p><b>App Roles:</b></p>
                    <ul>
                        <li v-for="item in user.idTokenRoles.roles" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                    <p><b>Graph Roles:</b></p>
                    <ul>
                        <li v-for="item in user.accessTokenRoles.roles" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                    <p><b>API Roles:</b></p>
                    <ul>
                        <li v-for="item in user.apiTokenRoles.roles" :key="item">
                            {{ item }}
                        </li>
                    </ul>
                    <p><b>App Sale Groups:</b></p>
                    <ul>
                        <li v-for="group in user.idTokenRoles.salesGroup" :key="group">
                            {{ group }}
                        </li>
                    </ul>
                    <p><b>Graph Sale Groups:</b></p>
                    <ul>
                        <li v-for="group in user.accessTokenRoles.salesGroup" :key="group">
                            {{ group }}
                        </li>
                    </ul>
                    <p><b>API Sale Groups:</b></p>
                    <ul>
                        <li v-for="group in user.apiTokenRoles.salesGroup" :key="group">
                            {{ group }}
                        </li>
                    </ul>
                    <div class="title is-5 underline">Photo</div>
                    <div class="avatar avatar-5xl border border-5 rounded-5">
                        <img v-if="user.userInfo.photo" class="rounded-soft" :src="user.userInfo.photo" alt="user" />
                        <div v-if="!user.userInfo.photo" class="avatar-emoji border border-0 rounded-5 overflow-hidden">
                            <span role="img" aria-label="Emoji">👤</span>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-body-tertiary">
                    <h6>Version: {{ version }}</h6>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { computed } from 'vue'

const user = useAuthStore();
const version = computed(() => {
    return `${import.meta.env.VITE_APP_VERSION}+${import.meta.env.VITE_BUILD_NUMBER.substring(0, 7)}`
})

</script>