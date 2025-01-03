import axios, { type AxiosInstance } from 'axios'

const notificationClient: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_NOTIFICATIONS_ROOT,
	headers: {
		//Authorization: `Bearer ${localStorage.getItem('access_token')}`,
		'Content-Type': 'application/json'
	}
})

export default notificationClient
