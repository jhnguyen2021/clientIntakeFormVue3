import type { Configuration } from '@azure/msal-browser'
import { LogLevel } from '@azure/msal-browser'
//import { PublicClientApplication  } from '@azure/msal-browser';

export const scopes = ['User.read', `api://${import.meta.env.VITE_API_CLIENT_ID}/user_impersonation`]

export const apiScopes = [`api://${import.meta.env.VITE_API_CLIENT_ID}/user_impersonation`]

export const notificationScopes = [`api://${import.meta.env.VITE_NOTIFICATIONS_CLIENT_ID}/user_impersonation`]

export const config: Configuration = {
	// required
	auth: {
		// must match info in dashboards
		clientId: import.meta.env.VITE_CLIENT_ID,
		authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
		knownAuthorities: [`https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`],

		// login redirect; must match path in dashboard
		redirectUri: '/', // Must be registered as a SPA redirectURI on your app registration,
		postLogoutRedirectUri: '/postLogOut.html', // Must be registered as a SPA redirectURI on your app registration
		navigateToLoginRequestUrl: true
	},

	cache: {
		cacheLocation: 'localStorage', //Needed to avoid 'login_required' error
		storeAuthStateInCookie: false //recommended to avoid certain IE/Edge issues.
	},

	// optional
	system: {
		loggerOptions: {
			logLevel: LogLevel.Verbose,
			loggerCallback
		}
	}
}

function loggerCallback(level: LogLevel, message: string, containsPii: boolean) {
	if (!containsPii) {
		const parts = message.split(' : ')
		const text = parts.pop()
		switch (level) {
			case LogLevel.Error:
				return console.error(text)

			case LogLevel.Warning:
				return console.warn(text)

			case LogLevel.Info:
				// return console.info(text)
				break

			case LogLevel.Verbose:
				return console.debug(text)
		}
	}
}

export const loginRequest = {
	scopes: ['User.Read']
}

export const graphConfig = {
	graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me/',
	graphMeGroupEndpoint: 'https://graph.microsoft.com/v1.0/me/memberOf'
}
