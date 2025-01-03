import { NavigationClient } from '@azure/msal-browser'
import type { NavigationOptions } from '@azure/msal-browser'
import type { Router } from 'vue-router'

export class VueNavigationClient extends NavigationClient {
	private router: Router

	constructor(router: Router) {
		super()
		this.router = router
	}

	/**
	 * Only called during redirects
	 */
	navigateExternal(url: string, options: NavigationOptions): Promise<boolean> {
		return super.navigateExternal(url, options)
	}

	/**
	 * Only called during popup completion
	 */
	async navigateInternal(url: string, options: NavigationOptions): Promise<boolean> {
		const path = url.replace(location.origin, '')
		options.noHistory ? await this.router.replace(path) : await this.router.push(path)
		return true
	}
}
