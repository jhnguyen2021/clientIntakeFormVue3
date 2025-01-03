import { graphConfig } from '../config/authConfig'

export async function callMsGraph(accessToken: string) {
	const headers = new Headers()
	const bearer = `Bearer ${accessToken}`

	headers.append('Authorization', bearer)

	const options = {
		method: 'GET',
		headers: headers
	}

	return fetch(graphConfig.graphMeEndpoint, options)
		.then((response) => response.json())
		.catch((error) => {
			console.log(error)
			throw error
		})
}

export async function callMsGroupGraph(accessToken: string) {
	const headers = new Headers()
	const bearer = `Bearer ${accessToken}`

	headers.append('Authorization', bearer)

	const options = {
		method: 'GET',
		headers: headers
	}

	return fetch(graphConfig.graphMeGroupEndpoint, options)
		.then((response) => response.json())
		.catch((error) => {
			console.log(error)
			throw error
		})
}
