import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: 'public',
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    server: {
        port: 5000,
        open: true,
        hmr: true,
    },
    css: {
        postcss: './postcss.config.js',
    },
    plugins: [],
});


