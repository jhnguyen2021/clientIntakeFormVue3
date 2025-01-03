import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useConfigStore = defineStore('ConfigStore', () => {
	const isNavbarVerticalCollapsed = ref(
		useStorage('isNavbarVerticalCollapsed', false, localStorage, {
			mergeDefaults: true
		})
	)
	const theme = ref(
		useStorage('theme', 'light', localStorage, {
			mergeDefaults: true
		})
	)
	const isRTL = ref(
		useStorage('isRTL', false, localStorage, {
			mergeDefaults: true
		})
	)
	const isFluid = ref(
		useStorage('isFluid', false, localStorage, {
			mergeDefaults: true
		})
	)
	const navbarStyle = ref(
		useStorage('navbarStyle', 'transparent', localStorage, {
			mergeDefaults: true
		})
	)
	const navbarPosition = ref(
		useStorage('navbarPosition', 'vertical', localStorage, {
			mergeDefaults: true
		})
	)

	return { isNavbarVerticalCollapsed, theme, isRTL, isFluid, navbarStyle, navbarPosition }
})
