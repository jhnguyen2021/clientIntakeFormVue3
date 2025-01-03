import type { AccountInfo, AuthenticationResult, RedirectRequest, SilentRequest } from '@azure/msal-browser'
import {
	BrowserAuthError,
	InteractionRequiredAuthError,
	NavigationClient,
	PublicClientApplication
} from '@azure/msal-browser'
import { config, scopes, apiScopes, notificationScopes } from '@/config/authConfig'

// type
export type MaybeAccount = AccountInfo | null

/**
 * MSAL instance
 */
export const msal = new PublicClientApplication(config)

/**
 * Auth service
 */
export const authService = {
	/**
	 * Initialize and return active account
	 */
	async initialize(client?: NavigationClient): Promise<MaybeAccount> {
		// start msal

		await msal.handleRedirectPromise().catch((error) => {
			console.log(error)
		})

		// hook into application router
		if (client) {
			msal.setNavigationClient(client)
		}

		// grab and set account if in session
		const accounts = msal.getAllAccounts()
		if (accounts?.length) {
			this.setAccount(accounts[0])
		}

		// return any active account
		return msal.getActiveAccount()
	},

	/**
	 * Login
	 */
	async login(): Promise<MaybeAccount> {
		const request: RedirectRequest = {
			redirectUri: config.auth.redirectUri,
			scopes
		}
		return msal
			.loginRedirect(request)
			.then((result) => {
				// could do something with the AuthResult here if you need to
				console.log('Logged in with', result)
				const currentAccounts = msal.getAllAccounts()
				if (!currentAccounts || currentAccounts.length < 1) {
					throw new Error('No accounts found')
				} else {
					return this.setAccount(currentAccounts[0])
				}
				// set active account
			})
			.catch((error: BrowserAuthError) => {
				// if we get stuck, clear session and attempt to log in again
				if (error.errorCode === 'interaction_in_progress') {
					this.reset()
					return this.login()
				}
				throw new Error(error.errorMessage)
			})
	},

	/**
	 * Logout
	 */
	async logout() {
		return msal.logoutRedirect({
			// required to make the application return to the home page
			postLogoutRedirectUri: '/'
		})
	},

	/**
	 * Get token for api
	 */
	async getToken() {
		const request: SilentRequest = {
			scopes: scopes.find((scope) => scope === scope[1]) ? scopes : scopes
		}
		return (
			msal
				// try getting the token silently
				.acquireTokenSilent(request)

				// attempt login popup if this fails
				.catch(async (error: unknown) => {
					if (error instanceof InteractionRequiredAuthError) {
						return msal.acquireTokenPopup(request)
					}
					throw error
				})
				.then((result: AuthenticationResult) => {
					return { accessToken: result.accessToken, idToken: result.idToken }
				})
		)
	},

	async getNotificationToken() {
		const request: SilentRequest = {
			scopes: notificationScopes
		}
		return (
			msal
				// try getting the token silently
				.acquireTokenSilent(request)

				// attempt login popup if this fails
				.catch(async (error: unknown) => {
					if (error instanceof InteractionRequiredAuthError) {
						return msal.acquireTokenPopup(request)
					}
					throw error
				})
				.then((result: AuthenticationResult) => {
					return result.accessToken
				})
		)
	},

	/**
	 * Get token for api
	 */
	async getAPIToken() {
		const request: SilentRequest = {
			scopes: apiScopes
		}
		return (
			msal
				// try getting the token silently
				.acquireTokenSilent(request)

				// attempt login popup if this fails
				.catch(async (error: unknown) => {
					if (error instanceof InteractionRequiredAuthError) {
						return msal.acquireTokenPopup(request)
					}
					throw error
				})
				.then((result: AuthenticationResult) => {
					return result.accessToken
				})
		)
	},

	/**
	 * Set active account
	 * @private
	 */
	setAccount(account: MaybeAccount): MaybeAccount {
		msal.setActiveAccount(account)
		return account
	},

	/**
	 * Escape hatch when msal gets stuck
	 * @private
	 */
	reset() {
		sessionStorage.clear()
	}
}
