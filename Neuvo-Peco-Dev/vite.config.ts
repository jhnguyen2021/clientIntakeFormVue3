import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const config = {
	plugins: [vue()],
	server: {
		port: 8000
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	envDir: './env'
}

export default defineConfig(({ command, mode }) => {
	if (command === 'serve') {
		return {
			...config,
			css: { devSourcemap: true },
			build: { target: 'esnext', sourcemap: true }
		}
	} else {
		// command === 'build'
		if (mode === 'dev') {
			return {
				...config,
				css: { devSourcemap: true },
				build: { target: 'esnext', sourcemap: true }
			}
		} else if (mode === 'prod' || mode === 'qa' || mode === 'train') {
			return {
				...config,
				css: { devSourcemap: false },
				build: { target: 'esnext', sourcemap: false }
			}
		} else {
			throw new Error('Unknown mode')
		}
	}
})
