import {
	createRouter,
	createWebHistory,
	type TabRouteMeta,
	type LinkRouteMeta,
	type RouteLocationNormalized
} from 'vue-router'
import { auth } from '@/stores/authStore'
import { VueNavigationClient } from './helpers'
import HomeView from '@/views/HomeView.vue'
import UserView from '@/views/UserView.vue'
import unmatched from '@/views/404View.vue'
import { useClientStore } from '@/stores/clientStore'
import { useToast } from 'vue-toastification'
import CardToastifySaveVue from '@/components/common/CardToastifySave.vue'

// List of routes without login protection
//const unmatchedRoute = '/:pathmatch(.*)*'
const unguarded = ['/login', '/logout']

const toast = useToast()

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/user',
			name: 'User',
			component: UserView
		},
		{
			path: '/login',
			name: 'Login',
			component: auth.login
		},
		{
			path: '/logout',
			name: 'Logout',
			component: auth.logout
		},
		{
			path: '/:pathMatch(.*)*',
			name: '404',
			component: unmatched
		},

		{
			//path: '/existingClient/:ID',
			path: '/approveForm/:id',
			name: 'approveForm',
			component: () => import('@/components/client/PageApprove.vue'),
			meta: {
				tabNumber: 5
			} as TabRouteMeta,
			props: true
		},
		{
			path: '/clients',
			name: 'clients',
			component: () => import('@/views/ClientsView.vue'),
			meta: {
				linkLabel: 'Clients',
				linkNavBar: true,
				linkNavOrder: 0
			} as LinkRouteMeta,
			children: [
				{
					path: '',
					name: 'clientList',
					component: () => import('@/components/client/PageList.vue')
				},
				{
					path: 'edit/:id',
					name: 'clientEdit',
					component: () => import('@/components/client/PageEdit.vue'),
					props: true,
					children: [
						{
							path: 'account',
							name: 'clientEditAccount',
							component: () => import('@/components/client/tabs/TabAccountInfo.vue'), //TODO: new way to handle pinia state
							beforeEnter: async () => {
								const clientStore = useClientStore()
								if (clientStore.clientForms.length === 0) {
									await clientStore.getClientData()
								}
							},
							meta: {
								tabLabel: 'Basic Info',
								tabIcon: 'user',
								tabNumber: 0
							} as TabRouteMeta
						},
						{
							path: 'sales',
							name: 'clientEditSales',
							component: () => import('@/components/client/tabs/TabSaleContact.vue'),
							meta: {
								tabLabel: 'Client Contact Info',
								tabIcon: 'dollar-sign',
								tabNumber: 1
							} as TabRouteMeta
						},
						{
							path: 'billing',
							name: 'clientEditBilling',
							component: () => import('@/components/client/tabs/TabApContact.vue'),
							meta: {
								tabLabel: 'AP/Billing',
								tabIcon: 'file-invoice',
								isDone: false,
								incomplete: false,
								tabNumber: 2
							} as TabRouteMeta
						},
						{
							path: 'additional',
							name: 'clientEditAdditional',
							component: () => import('@/components/client/tabs/TabPurchasing.vue'),
							meta: {
								tabLabel: 'Additional Information',
								tabIcon: 'info',
								tabNumber: 3
							} as TabRouteMeta
						},
						{
							path: 'review',
							name: 'clientEditReview',
							component: () => import('@/components/client/tabs/TabReview.vue'),
							meta: {
								tabLabel: 'Review',
								tabIcon: 'thumbs-up',
								tabNumber: 4
							} as TabRouteMeta,
							props: true
						}
					]
				}
			]
		},
		{
			path: '/jobs',
			name: 'jobs',
			component: () => import('@/views/JobsView.vue'),
			meta: {
				linkLabel: 'Jobs',
				linkNavBar: true,
				linkNavOrder: 1
			} as LinkRouteMeta
		},
		{
			path: '/quotes',
			name: 'quotes',
			component: () => import('@/views/QuotesView.vue'),
			meta: {
				linkLabel: 'Quotes',
				linkNavBar: true,
				linkNavOrder: 2
			} as LinkRouteMeta
		},
		{
			path: '/estimates',
			name: 'estimates',
			component: () => import('@/views/EstimatesView.vue'),
			meta: {
				linkLabel: 'Estimates',
				linkNavBar: true,
				linkNavOrder: 3
			} as LinkRouteMeta
		},
		{
			path: '/forecast',
			name: 'forecast',
			component: () => import('@/views/ForecastView.vue'),
			meta: {
				linkLabel: 'Forecast',
				linkNavBar: true,
				linkNavOrder: 4
			} as LinkRouteMeta
		}
	]
})

// authenticator
const client = new VueNavigationClient(router)

router.beforeEach((to) => {
	if (to.matched[0]?.path === '/clients') {
		if (to.name === 'clients') {
			router.push('/clients')
		}
	}
})

router.beforeEach((to, from, next) => {
	if (from.path.includes('/clients/edit') && !to.path.includes('/clients/edit')) {
		const clientStore = useClientStore()
		const isDirty = clientStore.formStateDirty

		if (isDirty.some((f) => f === true)) {
			toast.info(
				{
					component: CardToastifySaveVue,
					listeners: {
						SaveForm: () => {
							saveForm(to, from)
							next() // Continue with the navigation after saveForm is completed
						},
						ExitForm: () => {
							navigateRoute()
							next()
						}
					}
				},
				{
					timeout: false,
					pauseOnFocusLoss: false,
					pauseOnHover: false,
					draggable: false,
					draggablePercent: 0.6,
					showCloseButtonOnHover: false,
					hideProgressBar: true,
					icon: 'fas fa-rocket',
					rtl: false
				}
			)
		} else {
			next() // Continue with the navigation if there are no unsaved changes
		}
	} else {
		next() // Continue with the navigation for other routes
	}
})

router.beforeEach(async (to, from, next) => {
	// 404
	if (to.matched[0]?.path === '/:pathMatch(.*)*') {
		return next()
	}

	//login required
	const guarded = unguarded.every((path) => path !== to.path)

	if (guarded) {
		if (!auth.initialized) {
			await auth.initialize(client)
		}

		if (auth.account) {
			return next()
		}

		try {
			await auth.login()
			return next()
		} catch (err) {
			console.log('This dont look right')
			// We are probably going to want some sort of landing page here. Perhaps a dedicated security page detailing "You must login to access Nuevo Peco"
			return next(false)
		}
	}

	next()
})

async function saveForm(to: RouteLocationNormalized, from: RouteLocationNormalized) {
	const clientStore = useClientStore()
	const formId = from.params.id
	clientStore.savedFormHash = []
	clientStore.saveForm(parseInt(formId.toString()), 'Saved').then(() => {
		toast.clear()
		router.push(to).then(() => {
			toast.success('Form Saved Successfully!')
		})
	})
}

function navigateRoute() {
	const clientStore = useClientStore()
	clientStore.getClientData()
}

export default router
