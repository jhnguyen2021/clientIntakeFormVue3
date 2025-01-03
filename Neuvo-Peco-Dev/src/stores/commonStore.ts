import { defineStore } from 'pinia'
import DataService from '@/services/api/services/dataServices'
import { authService } from '@/services/authService'

export const useCommonStore = defineStore('commons', {
	state: () => {
		return {
			salesPersons: [] as SalesPersonList[],
			countries: [] as CountryList[]
		}
	},
	actions: {
		async setSalesPersons() {
			const token = await authService.getAPIToken()
			const config = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}

			await DataService.getSalesPersons(config)
				.then((response: { data: any }) => {
					this.salesPersons = response.data
				})
				.catch((e: Error) => {
					console.log(e)
				})
		},

		async setCountries() {
			const token = await authService.getAPIToken()
			const config = {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}

			await DataService.getCountries(config)
				.then((response: { data: any }) => {
					this.countries = response.data
				})
				.catch((e: Error) => {
					console.log(e)
				})
		}
	}
})

interface SalesPersonList {
	SlpCode: string
	SlpName: string
	SalespersonActive: string
	Email: string
	empID: string
	firstName: string
	lastName: string
	jobTitle: string
	EmployeeActive: string
	Branch: string
	Department: string
}

interface CountryList {
	Code: string
	Name: string
}
