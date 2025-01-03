import { InteractionStatus } from '@azure/msal-browser'
import { getCurrentInstance, toRefs } from 'vue'

export function useMsal() {
	const internalInstance = getCurrentInstance()

	if (!internalInstance) {
		throw 'useMsal() cannot be called outside the setup() function of a component'
	}

	const { instance, accounts, inProgress } = toRefs(internalInstance.appContext.config.globalProperties.$msal)

	if (!instance.value || !accounts.value || !inProgress.value) {
		throw 'Please install the msalPlugin'
	}

	if (inProgress.value === InteractionStatus.Startup) {
		instance.value.initialize().then(() => {
			instance.value.handleRedirectPromise().catch(() => {
				// Errors should be handled by listening to the LOGIN_FAILURE event
				return
			})
		})
	}

	console.log(instance)
	console.log(accounts)
	console.log(inProgress)

	return {
		instance: instance.value,
		accounts,
		inProgress
	}
}
