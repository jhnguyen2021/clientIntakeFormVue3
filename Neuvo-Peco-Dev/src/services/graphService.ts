import { authService } from '@/services/authService'

const GRAPH_BASE = 'https://graph.microsoft.com/beta'

let accessToken: string

export const graphService = {
	//
	// Get details of user, and return as JSON
	// https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http#response-1
	//
	async getSelf(): Promise<any> {
		return callGraph('/me')
			.then((res) => {
				return res.json()
			})
			.catch((err) => {
				console.log(err)
				return {}
			})
	},

	//
	// Get user's photo and return as a blob object URL
	// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	//
	async getPhoto(): Promise<string> {
		return callGraph('/me/photos/240x240/$value')
			.then((res) => {
				return res.blob()
			})
			.then((blob) => {
				console.log(URL.createObjectURL(blob))
				return URL.createObjectURL(blob)
			})
			.catch((err) => {
				console.log(err)
				return ''
			})
	},

	//
	// Search for users
	// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	//
	async searchUsers(searchString: string, max = 50): Promise<any> {
		return callGraph(
			`/users?$filter=startswith(displayName, '${searchString}') or startswith(userPrincipalName, '${searchString}')&$top=${max}`
		)
			.then((res) => {
				return res.json()
			})
			.catch((err) => {
				console.log(err)
				return {}
			})
	},

	//
	// Accessor for access token, only included for demo purposes
	//
	getAccessToken() {
		return accessToken
	}
}

//
// Common fetch wrapper (private)
//
async function callGraph(apiPath: string): Promise<Response> {
	// Acquire an access token to call APIs (like Graph)
	// Safe to call repeatedly as MSAL caches tokens locally
	accessToken = (await authService.getToken()).accessToken

	const resp = await fetch(`${GRAPH_BASE}${apiPath}`, {
		headers: { authorization: `bearer ${accessToken}` }
	})

	if (!resp.ok) {
		throw new Error(`Call to ${GRAPH_BASE}${apiPath} failed: ${resp.statusText}`)
	}

	return resp
}
