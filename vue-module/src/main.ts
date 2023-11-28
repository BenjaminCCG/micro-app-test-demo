import { createApp, App as AppInstance } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import 'virtual:windi.css';
import { Router } from 'vue-router';

declare global {
  interface Window {
    eventCenterForVueApp: any;
    __MICRO_APP_NAME__: string;
    __MICRO_APP_ENVIRONMENT__: string;
    __MICRO_APP_BASE_APPLICATION__: string;
  }
}

// const app = createApp(App);
// console.log('微应用child-vite渲染了');

// app.use(createPinia()).use(router).mount('#vueApp');
// // 与基座进行数据交互
function handleMicroData(router: Router) {
  // eventCenterForAppNameVite 是基座添加到window的数据通信对象
  if (window.eventCenterForVueApp) {
    // 主动获取基座下发的数据
    console.log('child-vite getData:', window.eventCenterForVueApp.getData());

    // 监听基座下发的数据变化
    window.eventCenterForVueApp.addDataListener((data: Record<string, unknown>) => {
      console.log('child-vite addDataListener:', data);

      if (data.path && typeof data.path === 'string') {
        data.path = data.path.replace(/^#/, '');
        // 当基座下发path时进行跳转
        if (data.path && data.path !== router.currentRoute.value.path) {
          router.push(data.path as string);
        }
      }
    });

    // 向基座发送数据
    setTimeout(() => {
      window.eventCenterForVueApp.dispatch({ myname: 'child-vite' });
    }, 3000);
  }
}

let app: AppInstance | null;
function mount() {
  app = createApp(App);
  console.log('微应用child-vite渲染了');

  app.use(createPinia()).use(router).mount('#vueApp');
  handleMicroData(router);
}

// 将卸载操作放入 unmount 函数
function unmount() {
  app?.unmount();
  // 卸载所有数据监听函数
  window.eventCenterForVueApp?.clearDataListener();
  app = null;
  console.log('微应用child-vite卸载了');
}
console.log('🚀 ~ file: main.ts:65 ~ window.__MICRO_APP_BASE_APPLICATION__:', window.__MICRO_APP_BASE_APPLICATION__);

// 微前端环境下，注册mount和unmount方法
// if (window.__MICRO_APP_BASE_APPLICATION__) {
//   // @ts-ignore
//   window['micro-app-vue-app'] = { mount, unmount };
// } else {
//   // 非微前端环境直接渲染
//   mount();
// }

// @ts-ignore
window['micro-app-vue-app'] = { mount, unmount };
