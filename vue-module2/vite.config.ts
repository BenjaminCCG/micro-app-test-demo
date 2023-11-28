import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import checker from 'vite-plugin-checker';
import WindiCSS from 'vite-plugin-windicss';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { join } from 'path';
import { writeFileSync } from 'fs';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, './env');
  return {
    base: '/vue2App/',
    build: {
      outDir: env.VITE_APP_NAME
    },
    plugins: [
      vue(),
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
      }),
      (function () {
        let basePath = '';
        return {
          name: 'vite:micro-app',
          apply: 'build',
          configResolved(config) {
            basePath = `${config.base}${config.build.assetsDir}/`;
          },
          writeBundle(options, bundle) {
            for (const chunkName in bundle) {
              // eslint-disable-next-line prefer-object-has-own
              if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
                const chunk = bundle[chunkName];
                if (chunk.fileName && chunk.fileName.endsWith('.js')) {
                  // eslint-disable-next-line max-params
                  chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
                    return all.replace($3, new URL($3, basePath));
                  });
                  const fullPath = join(options.dir, chunk.fileName);
                  writeFileSync(fullPath, chunk.code);
                }
              }
            }
          }
        };
      })() as any
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
      }
    }
  };
});
