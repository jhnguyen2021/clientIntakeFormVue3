export default interface clientList {
	clients: {
		ID: number
		Status: string
		clientName: string
		createBy: string
		APContactVerified: boolean
		DirectDepositSetup: boolean
		CreditLimitApproved: boolean
	}
}
