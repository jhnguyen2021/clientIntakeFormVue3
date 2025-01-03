import http from '@/utils/http-common'
export interface CardCode {
	CardCode: string
}

export type MaybeCardCode = CardCode | {}
class NeuvoPecoDataService {
	getAllForms(config: any): Promise<any> {
		return http.get('/client-intake/?status=all', config)
	}

	getFormByID(id: any, config: any): Promise<any> {
		return http.get(`/client-intake/${id}`, config)
	}

	createForm(data: any, config: any): Promise<any> {
		return http.post(`/client-intake/add`, data, config)
	}

	updateForm(id: any, data: any, config: any): Promise<any> {
		return http.patch(`/client-intake/update/${id}`, data, config)
	}

	saveToB1(data: any, config: any): Promise<CardCode> {
		return http.post(`/clients/add`, data, config).then((response) => {
			return response.data
		})
	}

	getSalesPersons(config: any): Promise<any> {
		return http.get('/common/salespersons', config)
	}

	getCountries(config: any): Promise<any> {
		return http.get('/common/countries', config)
	}

	getStates(country: any, config: any): Promise<any> {
		return http.get(`/common/states/${country}`, config)
	}
}
export default new NeuvoPecoDataService()
