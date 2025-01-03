/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string
	readonly VITE_API_ROOT: string
	readonly VITE_TENANT_ID: string
	readonly VITE_CLIENT_ID: string
	readonly VITE_API_CLIENT_ID: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
