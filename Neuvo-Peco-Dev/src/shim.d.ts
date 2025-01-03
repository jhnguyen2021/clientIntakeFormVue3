export {}

declare module 'vue-router' {
	interface TabRouteMeta extends RouteMeta {
		tabLabel: string
		tabIcon: string
		tabNumber: number
	}

	interface LinkRouteMeta extends RouteMeta {
		linkLabel: string
		linkNavBar: boolean
		linkNavOrder: number
	}
}
declare module 'vuejs3-datepicker' {}
