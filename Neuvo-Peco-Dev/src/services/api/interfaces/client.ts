export enum contactType {
	AP_Billing = 'AP/Billing',
	Purchasing = 'Purchasing',
	Client = 'Client'
}

export enum addressType {
	shipTo = 'bo_ShipTo',
	billTo = 'bo_BillTo'
}

export interface IState {
	Code: string
	Name: string
	Country: string
}

export interface IFormDisable {
	formDisabled: boolean
}

export interface IClient {
	privacyPolicy: boolean
	id: number
	status: string
	clientName: string
	federalTaxID: string
	createDate: string
	updateDate: string
	submittedBy: string
	submittedDate: string
	createBy: string
	updateBy: string
	isRFP: boolean
	hasW9: boolean
	pORequired: boolean
	matchClientAddress: boolean
	paymentTerms: string
	salesPersonCode: string
	ownerCode: string
	activeTab: number
	addresses: IAddress[]
	contacts: IClientContactInfo[]
	saleContacts(): IClientContactInfo[]
	ap_ShipToAddress(): IAddress[]
	ap_BillToAddress(): IAddress[]
	ap_BillingContact(): IClientContactInfo[]
	purchasingContact(): IClientContactInfo[]
	$reset(): IClient[]
	isDirty(): boolean
}

export interface IClientContactInfo {
	id: number
	name: string
	email: string
	phone: string
	emailGroupCode: string
	position: string
	firstName: string
	middleName?: string
	lastName: string
	address?: string
	type: contactType
	formDisabled?: boolean
}

export interface IAddress {
	addressName: string
	addressLine1: string
	addressLine2: string
	city: string
	state: string
	zipCode: string
	country: string
	id: number
	addressType: addressType
	formDisabled?: boolean
}
