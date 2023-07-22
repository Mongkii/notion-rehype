import { readFileSync } from 'fs';
import { resolve } from 'path';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  const pkgJSON = resolve(__dirname, './package.json');
  const pkg = JSON.parse(readFileSync(pkgJSON, 'utf-8'));

  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: pkg.name,
        fileName: 'index',
      },
      emptyOutDir: !isDev,
    },
    plugins: [dts({ insertTypesEntry: true })],
  };
});
