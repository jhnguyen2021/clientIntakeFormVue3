import { notifications as notices } from '../../data/sampleNotifications'
import http from '@/utils/http-emailInstance'

export interface INotification {
	id: number
	title: string
	message: string
	to_recipients: string
	date: Date
	read: boolean
	dateClassify(): string
}
export class Notification implements INotification {
	id = 0
	title = ''
	message = ''
	to_recipients = ''
	date = new Date()
	read = false
	dateClassify() {
		const now = new Date()
		const diff = now.getTime() - this.date.getTime()
		const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
		if (diffDays === 0) {
			return 'today'
		} else if (diffDays === 1) {
			return 'yesterday'
		} else {
			return 'earlier'
		}
	}
	constructor(id: number, title: string, message: string, to_recipients: string, date: Date, read: boolean) {
		this.id = id
		this.title = title
		this.message = message
		this.to_recipients = to_recipients
		this.date = date
		this.read = read
	}
}

export const notificationService = {
	notifications: [] as Notification[],
	getAllMessages() {
		for (let i = 0; i < notices.length; i++) {
			const notification = notices[i]
			this.notifications[i] = new Notification(
				notification.id,
				notification.title,
				notification.message,
				notification.from,
				notification.date,
				notification.read
			)
		}
		return this.notifications
	},
	getUnread() {
		return this.notifications.filter((notification: Notification) => !notification.read)
	},
	markAsRead(id: any) {
		this.notifications.forEach((notification: Notification) => {
			if (notification.id === id) {
				notification.read = true
			}
		})
	},
	markAllAsRead() {
		this.notifications.forEach((notification: Notification) => {
			notification.read = true
		})
	},
	markAllAsUnread() {
		this.notifications.forEach((notification: Notification) => {
			notification.read = false
		})
	},
	deleteNotification(id: any) {
		const index = this.notifications.findIndex((notification: Notification) => notification.id === id)
		this.notifications.splice(index, 1)
	},
	sendEmail(data: any, config: any): Promise<any> {
		return http.post(`/mail/send-email`, data, config)
	}
}
