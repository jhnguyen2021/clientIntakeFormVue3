import { ref, reactive } from 'vue'
import { authService, type MaybeAccount } from '@/services/authService'
import type { NavigationClient } from '@azure/msal-browser'
import { callMsGraph, callMsGroupGraph } from '../utils/MsGraphApiCall'
import { graphService } from '@/services/graphService'
import { defineStore, acceptHMRUpdate } from 'pinia'
import jwt_decode from 'jwt-decode'

export const initialized = ref(false)
export const account = ref<MaybeAccount>(null)
export const error = ref<''>()

async function initialize(client?: NavigationClient) {
	if (initialized.value === true) {
		return account.value
	}
	return authService.initialize(client).then((data) => {
		account.value = data
		return data
	})
}

/**
 * Simulate a login
 */
async function login() {
	error.value = ''
	return authService
		.login()
		.then((data) => {
			account.value = data
			error.value = ''
		})
		.catch((err) => {
			error.value = err.message
			throw err
		})
}

async function logout() {
	return authService.logout().then(() => {
		account.value = null
	})
}

enum Roles {
	Sale = 'client.Sales',
	Accounting = 'client.Approver',
	Admin = 'client.Admin'
}

export const auth = reactive({
	error,
	account,
	initialized,
	initialize,
	login,
	logout,
	Roles
})

interface UserInfo {
	displayName: string
	givenName: string
	id: number
	jobTitle: string
	mail: string
	mobilePhone: string
	officeLocation: string
	preferredLanguage: string
	surname: string
	userPrincipalName: string
	photo: string
}
export interface Claims {
	roles: string[]
	salesGroup: string[]
}

export interface SecurityGroups {
	displayName: string
	groupTypes: string[]
	id: string
	membershipRule: string
	securityIdentifier: string
}

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => ({
		userInfo: {
			displayName: '',
			givenName: '',
			id: 1,
			jobTitle: '',
			mail: '',
			mobilePhone: '',
			officeLocation: '',
			preferredLanguage: '',
			surname: '',
			userPrincipalName: '',
			photo: ''
		} as UserInfo,
		isAccounting: false,
		isSale: false,
		isAdmin: false,
		securityGroups: {} as SecurityGroups[],
		name: '',
		userName: '',
		idToken: '',
		accessToken: '',
		apiAccessToken: '',
		photoBlob: ''
	}),

	getters: {
		accessTokenRoles(): Claims {
			if (this.accessToken === '') {
				return { roles: ['none'], salesGroup: ['none'] }
			} else {
				return jwt_decode<Claims>(this.accessToken)
			}
		},
		idTokenRoles(): Claims {
			if (this.idToken === '') {
				return { roles: ['none'], salesGroup: ['none'] }
			} else {
				return jwt_decode<Claims>(this.idToken)
			}
		},
		apiTokenRoles(): Claims {
			if (this.apiAccessToken === '') {
				return { roles: ['none'], salesGroup: ['none'] }
			} else {
				return jwt_decode<Claims>(this.apiAccessToken)
			}
		}
	},

	actions: {
		logout() {
			this.$patch({
				name: '',
				userName: ''
			})
		},

		async getToken() {
			return authService.getToken().then((data) => {
				this.$patch({
					accessToken: data.accessToken || '',
					idToken: data.idToken || ''
				})
				error.value = ''
			})
		},

		getApiToken(): Promise<string> {
			return authService.getAPIToken().then((data) => {
				this.$patch({
					apiAccessToken: data || ''
				})
				return data
			})
		},

		async getGraphData() {
			callMsGraph(this.accessToken).then((data) => {
				this.$patch({
					userInfo: data || ''
				})
				error.value = ''
			})
			callMsGroupGraph(this.accessToken).then((data) => {
				let i = 0
				const groupArray = []
				while (i < data.value.length) {
					const object = {
						displayName: data.value[i].displayName,
						groupTypes: data.value[i].groupTypes,
						id: data.value[i].id,
						membershipRule: data.value[i].membershipRule,
						securityIdentifier: data.value[i].securityIdentifier
					}

					groupArray.push(object)
					i++
					// console.log(data.value.length)
					// console.log(i)
				}
				console.log(groupArray)
				this.$patch({
					securityGroups: groupArray || ''
				})
				error.value = ''
			})
		},

		async getPhotoBlob() {
			return graphService.getPhoto().then((data) => {
				this.$patch({
					photoBlob: data,
					userInfo: {
						...this.userInfo,
						photo: data
					}
				})
				error.value = ''
			})
		},

		/**
		 * Attempt to login a user
		 */
		async login() {
			return authService.login().then((data) => {
				account.value = data
				this.$patch({
					name: auth.account?.name || '',
					userName: auth.account?.username || ''
				})
				error.value = ''
			})
		},
		async initialize() {
			try {
				await authService.initialize()
				error.value = ''
			} catch (err) {
				console.log(err)
			}

			try {
				await this.getToken()
				error.value = ''
			} catch (err) {
				console.log(err)
			}

			try {
				await this.getApiToken()
				error.value = ''
			} catch (err) {
				console.log(err)
			}

			try {
				await this.getGraphData()
				error.value = ''
			} catch (err) {
				console.log(err)
			}

			try {
				await this.getPhotoBlob()
				error.value = ''
			} catch (err) {
				console.log(err)
			}
		}
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
