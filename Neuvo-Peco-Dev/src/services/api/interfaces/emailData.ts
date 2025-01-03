interface IBody {
	content: string
	content_type: string
}

interface IRecipient {
	email_address: {
		address: string
	}
}

interface IMessage {
	body: IBody
	subject: string
	to_recipients: IRecipient[]
}

interface IEmailData {
	title: string
	message: IMessage
	date: Date
	read: boolean
	recipients: string[]
	sender: string
	method: string
}

class EmailData implements IEmailData {
	title: string
	message: IMessage
	date: Date
	read: boolean
	recipients: string[]
	sender: string
	method: string

	constructor(
		title: string,
		message: IMessage,
		date: Date,
		read: boolean,
		recipients: string[],
		sender: string,
		method: string
	) {
		this.title = title
		this.message = message
		this.date = date
		this.read = read
		this.recipients = recipients
		this.sender = sender
		this.method = method
	}
}

export default EmailData
