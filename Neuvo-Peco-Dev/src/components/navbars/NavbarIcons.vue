<script lang="ts" setup>
import MenuTheme from '@/components/navbars/MenuTheme.vue'
//import IconNineDots from '@/components/icons/IconNineDots.vue'
//import MenuNineDots from '@/components/navbars/MenuNineDots.vue'
import MenuNotifications from '@/components/navbars/MenuNotifications.vue'
import CardUserPreferences from '@/components/navbars/CardUserPreferences.vue'
import { useAuthStore } from '@/stores/authStore'
//import type { onMounted } from 'vue'

const user = useAuthStore()


</script>
<template>
    <ul class="navbar-nav navbar-nav-icons ms-auto flex-row align-items-center">
        <li class="nav-item ps-2 pe-0">
            <MenuTheme />
        </li>
        <li class="nav-item dropdown">
            <MenuNotifications />
        </li>
        <li class="nav-item dropdown">
            <a class="nav-link pe-0 ps-1" id="navbarDropdownUser" role="button" data-bs-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                <div class="avatar avatar-xl">
                    <img v-if="user.userInfo.photo" class="rounded-soft" :src="user.userInfo.photo" alt="user" />
                    <span v-if="!user.userInfo.photo" class="rounded-soft" role="img" aria-label="Emoji">👤</span>
                </div>
            </a>
            <div class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end py-0"
                aria-labelledby="navbarDropdownUser">
                <CardUserPreferences />
            </div>
        </li>
    </ul>
</template>