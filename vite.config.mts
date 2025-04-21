import {fileURLToPath} from 'node:url'
import {resolve} from 'path'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'
import createExternal from 'vite-plugin-external'
import pkg from './package.json'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// (?) Development environment requires React and the /public directory
// here we toggle the configuration to render them available
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
    base: '/',
    publicDir: isDev ? './public' : false,
    build: {
        target: 'es2020',
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: 'index',
        },
        minify: true,
        sourcemap: false,
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
            externalizeDeps: ([] as string[])
                .concat(Object.keys((pkg as any).peerDependencies || {}))
                .concat(isDev ? [] : Object.keys((pkg as any).devDependencies || {})),
        }),
        dts({ entryRoot: 'src', rollupTypes: true }),
    ],
})
