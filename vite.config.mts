import {fileURLToPath} from 'node:url'
import {resolve} from 'path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
import createExternal from 'vite-plugin-external'
import pkg from './package.json'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/',
    publicDir: './public',
    build: {
        target: 'es2020',
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: 'index',
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [
        react(),
        tailwindcss(),
        createExternal({
            nodeBuiltins: true,
            externalizeDeps: Object.keys((pkg as any).peerDependencies || {}).concat(
                // todo due to demo server Object.keys((pkg as any).devDependencies || {})
            ),
        }),
        dts({ entryRoot: 'src' }),
    ],
})
