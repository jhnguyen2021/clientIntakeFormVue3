import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
//import { useAuthStore } from '@/stores/authStore'
import { createPinia } from 'pinia'
import { vMaska } from 'maska'
import datepicker from 'vuejs3-datepicker'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

//import "bootstrap/dist/css/bootstrap.css"
import '@/scss/theme.scss'

import '@/scss/user.scss'

//import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import config so we can set a default style
import { config } from '@fortawesome/fontawesome-svg-core'
/* import specific icons */
import {
	faLock,
	faUser,
	faDollarSign,
	faThumbsUp,
	faChevronLeft,
	faChevronRight,
	faSun,
	faMoon,
	faAdjust,
	faCheck,
	faCrown,
	faShoppingCart,
	faBell,
	faSpinner,
	faCircle,
	faSearch,
	faLocationDot,
	faFileInvoice,
	faInfo,
	faSave,
	faHome,
	faPenToSquare,
	faCirclePlus,
	faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(
	faLock,
	faUser,
	faDollarSign,
	faThumbsUp,
	faChevronLeft,
	faChevronRight,
	faSun,
	faMoon,
	faAdjust,
	faCheck,
	faCrown,
	faShoppingCart,
	faBell,
	faSpinner,
	faCircle,
	faSearch,
	faLocationDot,
	faFileInvoice,
	faInfo,
	faSave,
	faHome,
	faPenToSquare,
	faCirclePlus,
	faCircleInfo
)
config.styleDefault = 'solid'

// create app

const app = createApp(App)
const pinia = createPinia()
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('date-picker', datepicker)
app.use(pinia)
pinia.use(piniaPluginPersistedState)
app.use(router)
app.use(Toast, {
	transition: 'Vue-Toastification__bounce',
	maxToasts: 20,
	newestOnTop: true,
	filterBeforeCreate: (toast: any, toasts: any) => {
		if (toasts.filter((t: any) => t.type === toast.type).length !== 0) {
			// Returning false discards the toast
			return false
		}
		// You can modify the toast if you want
		return toast
	}
})
app.directive('maska', vMaska)
app.use(Vue3Toasity, {
	autoClose: 5000
	// ...
} as ToastContainerOptions)

//app.mount('#app')

router.isReady().then(() => {
	app.mount('#app')
})

import '@popperjs/core'
import 'bootstrap/dist/js/bootstrap.min.js'
