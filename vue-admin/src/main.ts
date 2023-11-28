import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import 'virtual:windi.css';
import microApp from '@micro-zoe/micro-app';

microApp.start({
  plugins: {
    modules: {
      'vue-app': [
        {
          loader(code) {
            if (process.env.NODE_ENV === 'development') {
              // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
              // eslint-disable-next-line no-param-reassign
              code = code.replace(/(from|import)(\s*['"])(\/vueApp\/)/g, (all) => {
                return all.replace('/vueApp/', 'http://localhost:8081/vueApp/');
              });
            }

            return code;
          }
        }
      ],
      'vue-app2': [
        {
          loader(code) {
            if (process.env.NODE_ENV === 'development') {
              // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
              // eslint-disable-next-line no-param-reassign
              code = code.replace(/(from|import)(\s*['"])(\/vue2App\/)/g, (all) => {
                return all.replace('/vue2App/', 'http://localhost:8082/vue2App/');
              });
            }

            return code;
          }
        }
      ],
      'appname-vite': [
        {
          loader(code) {
            if (process.env.NODE_ENV === 'development') {
              // 这里 /basename/ 需要和子应用vite.config.js中base的配置保持一致
              // eslint-disable-next-line no-param-reassign
              code = code.replace(/(from|import)(\s*['"])(\/child\/vite\/)/g, (all) => {
                return all.replace('/child/vite/', 'http://localhost:4007/child/vite/');
              });
            }

            return code;
          }
        }
      ]
    }
  }
});

const app = createApp(App);

app.use(createPinia()).use(router).mount('#app');
