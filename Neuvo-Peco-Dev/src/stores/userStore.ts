import { defineStore } from 'pinia'

export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		user: [] as UserInfo[],
		currentUserRoles: [] as UserRoles[]
	}),
	getters: {
		getData(): any {}
	},
	actions: {
		setData(data: any) {
			this.currentUserRoles = data
		}
	}
})

interface UserInfo {
	name: string
	userName: string
}

interface UserRoles {
	role: object[]
}
