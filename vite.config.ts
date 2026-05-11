import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE?.trim() || '/';

  return {
    base,
    plugins: [react(), tailwindcss(), tsconfigPaths(), process.env.HTTPS && mkcert()],
    build: {
      target: 'esnext',
      minify: 'terser',
    },
    publicDir: './public',
    server: {
      host: true,
    },
  };
});
