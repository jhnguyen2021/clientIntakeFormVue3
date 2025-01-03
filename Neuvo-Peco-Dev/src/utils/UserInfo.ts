/**
 * Graph data about the user.
 */
export default interface UserInfo {
	data: {
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
	resolved: boolean
}
