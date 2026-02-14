import path from 'node:path';

import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

import createAutoImport from './vite/plugins/auto-import';
import createComponents from './vite/plugins/components';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
        createAutoImport(path),
        createComponents(path),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            // target: 'http://localhost:5320/api',
            target: 'http://localhost:10080',
            ws: true,
          },
        },
      },
    },
  };
});
