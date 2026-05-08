import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/reactjs-template/',
  plugins: [react(), tailwindcss(), tsconfigPaths(), process.env.HTTPS && mkcert()],
  build: {
    target: 'esnext',
    minify: 'terser',
  },
  publicDir: './public',
  server: {
    host: true,
  },
});
