import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import checker from 'vite-plugin-checker';
import WindiCSS from 'vite-plugin-windicss';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './env');
  return {
    base: '/main-vite/',
    build: {
      outDir: env.VITE_APP_NAME
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => /^micro-app/.test(tag)
          }
        }
      }),
      WindiCSS(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()],
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        }
      }),
      Components({ resolvers: [ElementPlusResolver()] }),
      checker({
        // vueTsc: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx,vue,js,jsx}"'
        }
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), '')
        }
      },
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())]
      }
    }
  };
});
