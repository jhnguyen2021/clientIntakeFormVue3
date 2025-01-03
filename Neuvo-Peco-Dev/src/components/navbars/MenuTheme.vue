<script lang="ts" setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/ConfigStore.js'
import { useMediaQuery } from '@vueuse/core'
const { theme } = storeToRefs(useConfigStore())

updateDOM()

const isLightActive = computed(() => {
    return theme.value == 'light'
})
const isDarkActive = computed(() => {
    return theme.value == 'dark'
})

const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

//const themeSet = computed(() => prefersDark.value ? 'dark' : 'light')

watch(prefersDark, () => {
    updateDOM()
}
)
function changeTheme(themeString: string) {
    theme.value = themeString
    updateDOM()
}
function updateDOM() {
    if (theme.value === 'dark' || theme.value === 'light') {
        document.documentElement.setAttribute('data-bs-theme', theme.value)
    }
}
</script>
<template>
    <div class="dropdown theme-control-dropdown">
        <a class="nav-link d-flex align-items-center dropdown-toggle fs-0 pe-1 py-0" href="#" role="button"
            id="themeSwitchDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-icon icon='sun' class="fs-2" transform="shrink-2" data-theme-dropdown-toggle-icon="light"
                v-if="theme == 'light'" />
            <font-awesome-icon icon='moon' class="fs-2" transform="shrink-3" data-theme-dropdown-toggle-icon="dark"
                v-if="theme == 'dark'" />

        </a>
        <div class="dropdown-menu dropdown-menu-end dropdown-caret border py-0 mt-3" aria-labelledby="themeSwitchDropdown">
            <div class="bg-white dark__bg-1000 rounded-2 py-2">
                <button class="dropdown-item d-flex align-items-center gap-2" type="button" value="light"
                    data-theme-control="theme" :class="{ active: isLightActive }" @click="changeTheme('light')">
                    <font-awesome-icon icon='sun' />Light
                    <font-awesome-icon icon='check' class="dropdown-check-icon ms-auto text-600" />
                </button>
                <button class="dropdown-item d-flex align-items-center gap-2" type="button" value="dark"
                    data-theme-control="theme" :class="{ active: isDarkActive }" @click="changeTheme('dark')">
                    <font-awesome-icon icon='moon' transform="" />Dark
                    <font-awesome-icon icon='check' class="dropdown-check-icon ms-auto text-600"
                        :class="theme == 'dark' ? 'active' : ''" />
                </button>
                <!-- <button class="dropdown-item d-flex align-items-center gap-2" type="button" value="auto"
					data-theme-control="theme" :class="{ active: isAutoActive }" @click="changeTheme('auto')">
					<font-awesome-icon icon='adjust' transform="" />Auto
					<font-awesome-icon icon='check' class="dropdown-check-icon ms-auto text-600"
						:class="theme == 'auto' ? 'active' : ''" />
				</button> -->
            </div>
        </div>
    </div>
</template>
