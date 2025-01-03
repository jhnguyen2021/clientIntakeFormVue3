import { defineStore } from 'pinia'
import DataService, { type CardCode } from '@/services/api/services/dataServices'
import { useAuthStore } from '@/stores/authStore'
import objectHash from 'object-hash'
import EmailData from '@/services/api/interfaces/emailData'
import { createApp } from 'vue'
import CardApprovedEmailTemplate from '@/components/common/CardApprovedEmailTemplate.vue'
import CardRejectedEmailTemplate from '@/components/common/CardRejectedEmailTemplate.vue'

const canApproveRoles = ['App.Admin', 'Client.Approve']
const canEditRoles = ['App.Admin', 'Client.Edit']
const canViewAll = ['App.Admin', 'Client.Approve']

import {
	type IClient,
	type IClientContactInfo,
	type IAddress,
	contactType,
	addressType
} from '@/services/api/interfaces/client'

class ContactInfo implements IClientContactInfo {
	id = 0
	name = ''
	email = ''
	phone = ''
	emailGroupCode = ''
	position = ''
	firstName = ''
	middleName = ''
	lastName = ''
	address?: ''
	type = contactType.AP_Billing
	formDisabled?: boolean

	constructor(type: contactType = contactType.AP_Billing, emailGroupCode: string) {
		this.id = 0
		this.name = ''
		this.email = ''
		this.phone = ''
		this.emailGroupCode = emailGroupCode
		this.position = ''
		this.firstName = ''
		this.middleName = ''
		this.lastName = ''
		this.address = ''
		this.type = type
		this.formDisabled = false
	}
}

class AddressInfo implements IAddress {
	addressName = 'Primary'
	addressLine1 = ''
	addressLine2 = ''
	city = ''
	state = ''
	zipCode = ''
	country = ''
	id = 0
	addressType = addressType.billTo
	formDisabled: boolean
	constructor(type: addressType = addressType.billTo) {
		this.addressName = 'Primary'
		this.addressLine1 = ''
		this.addressLine2 = ''
		this.city = ''
		this.state = ''
		this.zipCode = ''
		this.country = ''
		this.id = 0
		this.addressType = type
		this.formDisabled = false
	}
}

class ClientInfo implements IClient {
	privacyPolicy = false
	id = 0
	status = ''
	clientName = ''
	federalTaxID = ''
	createDate = ''
	updateDate = ''
	submittedBy = ''
	submittedDate = ''
	createBy = ''
	updateBy = ''
	isRFP = false
	hasW9 = false
	pORequired = true
	matchClientAddress = false
	paymentTerms = ''
	salesPersonCode = ''
	ownerCode = ''
	activeTab = 1
	addresses = [new AddressInfo(addressType.billTo), new AddressInfo(addressType.shipTo)]
	contacts = [
		new ContactInfo(contactType.Purchasing, 'ClientAP'),
		new ContactInfo(contactType.AP_Billing, 'ClientPurchasing'),
		new ContactInfo(contactType.Client, '')
	]
	saleContacts(): IClientContactInfo[] {
		return this.contacts.filter((contact: IClientContactInfo) => contact.type === contactType.Client)
	}
	ap_ShipToAddress(): IAddress[] {
		return this.addresses.filter((address: IAddress) => address.addressType === addressType.shipTo)
	}
	ap_BillToAddress(): IAddress[] {
		return this.addresses.filter((address: IAddress) => address.addressType === addressType.billTo)
	}
	ap_BillingContact(): IClientContactInfo[] {
		return this.contacts.filter((contact: IClientContactInfo) => contact.type === contactType.AP_Billing)
	}
	purchasingContact(): IClientContactInfo[] {
		return this.contacts.filter((contact: IClientContactInfo) => contact.type === contactType.Purchasing)
	}
	$reset(): IClient[] {
		return [new ClientInfo()]
	}
	isDirty(): boolean {
		if (this.submittedBy !== '') {
			return true
		} else {
			return false
		}
	}
}

export const useClientStore = defineStore({
	id: 'client',
	state: () => ({
		formAccountDisabled: false,
		addressSameAsClient: false,
		tabs: [
			{
				label: 'clientEditAccount',
				disabled: false,
				calendarDisabled: true,
				displayAddBtn: false,
				dislayEditBtn: false,
				tabReview: false,
				tabAccounting: false
			},
			{
				label: 'clientEditSales',
				disabled: false,
				calendarDisabled: true,
				displayAddBtn: true,
				dislayEditBtn: false,
				tabReview: false,
				tabAccounting: false
			},
			{
				label: 'clientEditBilling',
				disabled: false,
				calendarDisabled: true,
				displayAddBtn: true,
				dislayEditBtn: false,
				tabReview: false,
				tabAccounting: false
			},
			{
				label: 'clientEditAdditional',
				disabled: false,
				calendarDisabled: true,
				displayAddBtn: true,
				dislayEditBtn: false,
				tabReview: false,
				tabAccounting: false
			},
			{
				label: 'clientEditReview',
				disabled: true,
				calendarDisabled: true,
				displayAddBtn: false,
				dislayEditBtn: true,
				tabReview: true,
				tabAccounting: false
			},
			{
				label: 'approveForm',
				disabled: true,
				calendarDisabled: true,
				displayAddBtn: false,
				dislayEditBtn: false,
				tabReview: false,
				tabAccounting: true
			}
		],
		clientForms: [] as IClient[],
		savedFormHash: [] as any[]
	}),
	getters: {
		getAuthStore(): ReturnType<typeof useAuthStore> {
			return useAuthStore()
		},
		canApprove(): boolean {
			const roles = this.getAuthStore.idTokenRoles.roles
			return roles && roles.some((r) => canApproveRoles.includes(r))
		},
		canEdit(): boolean {
			const roles = this.getAuthStore.idTokenRoles.roles
			return roles && roles.some((r) => canEditRoles.includes(r))
		},
		canViewAll(): boolean {
			const roles = this.getAuthStore.idTokenRoles.roles
			return roles && roles.some((r) => canViewAll.includes(r))
		},
		currentStoreHash(): any[] {
			return this.clientForms.map((f) => objectHash(f))
		},
		formStateDirty(): boolean[] {
			const output = [] as boolean[]
			this.savedFormHash.forEach((f, i) => {
				if (f !== this.currentStoreHash[i]) {
					output.push(true)
				} else {
					output.push(false)
				}
			})
			return output
		}
	},
	actions: {
		getClientData(): Promise<any> {
			return this.getAuthStore
				.getApiToken()
				.then((token) => {
					return {
						headers: {
							Authorization: `Bearer ${token}`
						}
					}
				})
				.then((config) => {
					DataService.getAllForms(config)
						.then((response: { data: IClient[] }) => {
							this.$reset()
							this.clientForms = response.data
							this.savedFormHash = this.clientForms.map((f) => objectHash(f))
							console.log(response.data)
						})
						.catch((e: Error) => {
							console.log(e)
						})
				})
		},
		setData(data: any, id: number) {
			this.savedFormHash = this.clientForms.map((f) => objectHash(f))

			this.clientForms.filter((client) => client.id === id)[0] = data
		},
		addClientContact(type: contactType, id: number) {
			//this.savedFormHash = this.clientForms.map((f) => objectHash(f))
			const newContact = new ContactInfo(type, '')
			this.clientForms.filter((client) => client.id === id)[0].contacts.push(newContact)
		},
		addClientAddress(addressType: addressType, id: number) {
			const newAddress = new AddressInfo(addressType)
			this.clientForms.filter((client) => client.id === id)[0].addresses.push(newAddress)
		},
		addClientForm() {
			const index = this.clientForms.findIndex((p) => p.id === 0)
			this.clientForms.splice(index, 1)
			const newForm = new ClientInfo()
			this.clientForms.push(newForm)
			this.clientForms.filter((client) => client.id === 0)[0] = newForm
			this.savedFormHash = this.clientForms.map((f) => objectHash(f))
		},
		removeClientContact(index: number, id: number) {
			this.clientForms.filter((client) => client.id === id)[0].contacts.pop()
		},
		saveForm(id: number, status: string): Promise<any> {
			const token = this.getAuthStore.apiAccessToken
			const authStore = this.getAuthStore
			const config = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}

			const data = this.clientForms.filter((client) => client.id === id)[0] as IClient
			data.status = status

			data.addresses.map((address) => {
				address.id = id
			})

			data.contacts.map((contact) => {
				contact.id = id
				contact.name = contact.firstName + ' ' + contact.lastName
			})

			if (id === 0) {
				data.createBy = authStore.userInfo.displayName
				data.updateBy = authStore.userInfo.displayName
				data.createDate = Date.now().toString()
				data.updateDate = Date.now().toString()

				// return the promise chain created by the createForm method
				return DataService.createForm(data, config)
					.then((response: { data: any }) => {
						console.log(response.data)
					})
					.catch((e: Error) => {
						console.log(e)
					})
					.then(() => {
						this.getClientData()
					})
			} else {
				data.updateBy = authStore.userInfo.displayName
				data.updateDate = Date.now().toString()
				// return the promise chain created by the updateForm method
				return DataService.updateForm(id, data, config)
					.then((response: { data: any }) => {
						console.log(response.data)
					})
					.catch((e: Error) => {
						console.log(e)
					})
					.then(() => {
						this.getClientData()
					})
			}
		},
		submitToB1(id: number): Promise<CardCode> {
			const token = this.getAuthStore.apiAccessToken
			const config = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}

			const data = this.clientForms.filter((client) => client.id === id)[0] as IClient
			data.updateDate = Date.now().toString()
			data.addresses.map((address) => {
				address.id = id
			})

			data.contacts.map((contact) => {
				contact.id = id
				contact.name = contact.firstName + ' ' + contact.lastName
			})

			const filteredContacts = data.contacts.filter((contact) => contact.name.trim() !== '')
			console.log(filteredContacts)
			data.contacts = filteredContacts

			// return the promise chain created by the saveToB1 method
			return DataService.saveToB1(data, config).then((response) => {
				//console.log(response)
				this.saveForm(id, 'Approved')
				//console.log('Form submitted to B1')
				return response //return the response from the saveToB1 method
			})
		},
		$reset() {
			this.formAccountDisabled = false
			this.addressSameAsClient = false
			this.clientForms = []
			this.savedFormHash = []
		},
		buildEmailTemplate(
			title: string,
			status: string,
			subject: string,
			to: string,
			cardCode?: string,
			rejectionReason?: string,
			linkRoute?: string
		): EmailData {
			const htmlElement = document.createElement('div')
			if (status === 'Approved') {
				const app = createApp(CardApprovedEmailTemplate, {
					cardCode: cardCode
				})
				app.mount(htmlElement)
			} else {
				const app = createApp(CardRejectedEmailTemplate, {
					rejectionNotes: rejectionReason,
					linkToForm: linkRoute
				})
				app.mount(htmlElement)
			}
			// Instantiate an EmailData object
			const email: EmailData = new EmailData(
				title,
				{
					body: { content: htmlElement.innerHTML, content_type: 'HTML' },
					subject: subject,
					to_recipients: [{ email_address: { address: to } }]
				},
				new Date(),
				true,
				[''],
				'',
				''
			)
			return email
		},
		updateOnwerCode(code: string, id: number) {
			const data = this.clientForms.filter((client) => client.id === id)[0] as IClient
			data.ownerCode = code
		}
	},
	persist: true
})
