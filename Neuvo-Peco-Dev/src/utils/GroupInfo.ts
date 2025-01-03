/**
 * Graph data about the users groups.
 */
export default interface groupInfo {
	displayName: string
	groupTypes: Array<string>
	id: string
	membershipRule: string
	securityIdentifier: string
}
