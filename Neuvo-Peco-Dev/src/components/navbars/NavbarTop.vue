<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useRouter, RouterLink, type RouteRecordRaw, type LinkRouteMeta } from 'vue-router'

import NavbarToggle from './NavbarToggle.vue'
import NavbarBrand from './NavbarBrand.vue'
import NavbarSearch from './NavbarSearch.vue'
import NavbarIcons from './NavbarIcons.vue'

const router = useRouter()

const links: ComputedRef<RouteRecordRaw[]> = computed(() => {
    return router.options.routes?.filter(
        (route: RouteRecordRaw) =>
            (route.meta) as LinkRouteMeta && ((route.meta) as LinkRouteMeta).linkNavBar === true
    )
})

</script>
<template>
    <nav class="navbar navbar-light navbar-glass navbar-top navbar-expand-lg navbar-glass-shadow"
        style=" margin-top: 0px; margin-bottom:10px;">
        <NavbarToggle class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3 collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#navbarStandard" aria-controls="navbarStandard" aria-expanded="false"
            aria-label="Toggle Navigation" />
        <NavbarBrand class="me-1 me-sm-3" />
        <div class="navbar-collapse scrollbar collapse" id="navbarStandard" style="">
            <ul class="navbar-nav" data-top-nav-dropdowns="data-top-nav-dropdowns">
                <li class="nav-item" v-for="link in links" :key="link.name">
                    <RouterLink class="nav-link" active-class="active" :to="{ name: link.name }">{{ ((link.meta) as
                        LinkRouteMeta).linkLabel }}
                    </RouterLink>
                </li>
            </ul>
        </div>
        <NavbarSearch />
        <NavbarIcons />
    </nav>
</template>