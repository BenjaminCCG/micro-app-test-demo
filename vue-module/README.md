# Vue 3 + TypeScript + Vite

常规的vue3全家桶基础模板，vue3 + ts + vite + vue-router + pinia

在此基础上为解决团队开发代码风格不统一，从开发阶段到git提交，引入了eslint、prettier、husky、commitizen、cz-customizable进行代码规范

可依据此项目从零开发，也可按照此项目教程在原有项目上进行优化

- 通过vite创建包含ts的vue项目
- 引入vue-router、pinia完善全家桶
- 引入eslint、prettier支持，添加.editorconfig，引入vite-plugin-checker优化错误提示
- 添加husky、lint-staged、commitizen、cz-customizable支持规范代码风格
- 添加windicss、postcss

[github](https://github.com/BenjaminCCG/vue3-template-cli.git)
[国内gitee](https://gitee.com/theGreatWallCCG/my-vue-cli)

## 1.项目初始化

```js
pnpm create vite my-vue-cli --template vue-ts
cd my-vue-cli
pnpm install
pnpm run dev
```

## 2.引入vue-router、pinia

```js
pnpm add vue-router@4 pinia @types/node
```

tsconfig.json添加如下配置

```js
{
  "compilerOptions":{
     ...,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },
  }
}
```

vite.config.ts引入

```js
import { resolve } from "path";

...,
resolve: {
alias: {
  "@": resolve(__dirname, "src"),
},
},
```

新建pages目录下，建立home/index.vue文件测试

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d831f93055e04578a5b4efaf930a22e8~tplv-k3u1fbpfcp-watermark.image?)

新建router目录，建立index.ts

```js
import { createWebHashHistory, createRouter } from 'vue-router';
import Home from '@/pages/home/index.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
});

export default router;
```

新建store目录，建立user.ts pinia模块

```js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'vben'
  }),
  getters: {},
  actions: {}
});
```

修改app.vue组件设置路由入口

```js
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" />
  </router-view>
</template>
```

main.ts引入安装router、pinia

```js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';

const app = createApp(App);

app.use(createPinia()).use(router).mount('#app');
```

修改home/index.vue代码

```js
<template>
  <div>hello world,{{ userStore.name }}</div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
</script>
```

此时访问页面可见,已正常引入

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/616549c485604f52b9645e10a9067234~tplv-k3u1fbpfcp-watermark.image?)

## 3.安装eslint、prettier、vite-plugin-checker

首页完成eslint的安装配置

```js
pnpm add -D eslint
npx eslint --init

? How would you like to use ESLint? ...
    To check syntax only
    To check syntax and find problems
    > To check syntax, find problems, and enforce code style
    ---------------------------------------------------------------- 选择强制代码风格 √
 How would you like to use ESLint? · style ?
 What type of modules does your project use? ...
 > JavaScript modules (import/export)
 CommonJS (require/exports)
 None of these -
 --------------------------------------------------------------- 选择ESM规范 √
 How would you like to use ESLint? · style √
 What type of modules does your project use? · esm ?
 Which framework does your project use? ...
 React >
 Vue.js
 None of these
 ---------------------------------------------------------------- 选择VUE框架 √
 How would you like to use ESLint? · style √
 What type of modules does your project use? · esm √
 Which framework does your project use? · vue ?
 Does your project use TypeScript? » No / Yes
 ---------------------------------------------------------------- 使用TS yes √
 How would you like to use ESLint? · style √
 What type of modules does your project use? · esm √
 Which framework does your project use? · vue √
 Does your project use TypeScript? · No / Yes ?
 Where does your code run? ...
 (Press <space> to select, <a> to toggle all, <i> to invert selection)
 √ Browser
 √ Node
 ---------------------------------------------------------------- 空格增选Node 回车 √
 How would you like to use ESLint? · style √
 What type of modules does your project use? · esm √
 Which framework does your project use? · vue √
 Does your project use TypeScript? · No / Yes √
 Where does your code run? · browser, node ?
 How would you like to define a style for your project? ...
 Use a popular style guide
 > Answer questions about your style
 ---------------------------------------------------------------- 用过A&Q来配置规则 √
 How would you like to define a style for your project? · prompt ?
 What format do you want your config file to be in? ...
 > JavaScript
 YAML
 JSON
 ---------------------------------------------------------------- 配置文件使用js文件

 What style of indentation do you use? · tab √
 What quotes do you use for strings? · double √
 What line endings do you use? · unix √
 Do you require semicolons? · YES
 The config that you‘ve selected requires the following dependencies:
 eslint-plugin-vue@latest
 @typescript-eslint/eslint-plugin@latest
 @typescript-eslint/parser@latest
 ---------------------------------------------------------------- 选择yes现在立即初始化配置文件
 Would you like to install them now? · YES
 Which package manager do you want to use? ...
 npm
 yarn
 > pnpm ---------------------------------------------------------------- 包管理器选择pnpm


```

安装prettier

```js
pnpm add  prettier eslint-config-prettier eslint-plugin-prettier
```

添加.prettierrc.cjs

```js
module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾需要有逗号
  trailingComma: 'none',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  bracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: 'lf',
  // 格式化嵌入的内容
  embeddedLanguageFormatting: 'auto',
  // html, vue, jsx 中每个属性占一行
  singleAttributePerLine: false
};
```

#### 使用 AlloyTeam 的 ESLint 配置

此时ESLint 原生的规则和 `@typescript-eslint/eslint-plugin` 的规则太多了，会产生许多报错，而且原生的规则有一些在 TypeScript 中支持的不好，需要禁用掉。

```js
pnpm add eslint-config-alloy @babel/eslint-parser
```

.eslintrc.cjs修改为

```js
module.exports = {
  extends: ['alloy', 'alloy/vue', 'alloy/typescript'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      js: '@babel/eslint-parser',
      jsx: '@babel/eslint-parser',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser'

      // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
    }
  },
  env: {
    // Your environments (which contains several predefined global variables)
    //
    browser: true,
    node: true
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    ComponentInstance: true
  },
  rules: {
    // Customize your rules
    //
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-unused-vars': 2,
    // Please keep this rule off because it requiresTypeChecking
    // https://github.com/vuejs/vue-eslint-parser/issues/104
    // https://github.com/typescript-eslint/typescript-eslint/pull/5318
    '@typescript-eslint/prefer-optional-chain': 'off'
  }
};
```

此时F1重启volar或者重启下vscode，红色报错消息已经全部消失
让我们来安装下vite-plugin-checker，优化报错提示

```js
pnpm add vite-plugin-checker
```

此时写出不符合规范的语法则会在终端提示报错

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8f07ed7e1b446f3bd3c3ebdb0998f43~tplv-k3u1fbpfcp-watermark.image?)

接着，我们在根目录建立.editorconfig文件

```js
# Editor configuration, see http://editorconfig.org

# 表示是最顶层的 EditorConfig 配置文件
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行首的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

此时，我们开发阶段的代码风格约束已经完善，接下来处理git提交阶段

## 添加husky、commitizen、cz-customizable支持规范代码风格

首先是husky，提供了git阶段的hooks

```js
pnpm dlx husky-init && pnpm install
```

安装 lint-staged

```js
pnpm add lint-staged
```

修改package.json文件

```js
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "prepare": "husky install",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "prettier": "prettier --write .",
  },
  "lint-staged": {
    "*.{vue,js,ts,jsx,tsx}": [
      "pnpm lint",
      "pnpm prettier"
    ]
  },
```

修改.husky/pre-commit

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

集成commitizen、cz-customizable

```js
pnpm add commitizen cz-customizable
```

package.json内scripts添加命令

```js
    "commit": "git-cz"
```

根目录创建.cz-config.cjs

```js
const Configuration = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'style', // 样式
        'refactor', // 重构
        'pref', // 性能优化
        'docs', // 文档
        'test', // 测试
        'chore', // 构建过程和辅助工具
        'revert', // 代码回退
        'build', // 构建打包
        'dependence', // 依赖变更
        'WIP' // 工作进行中
      ]
    ]
  }
};
module.exports = Configuration;
```

修改package.json

```js
{
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    },
    "cz-customizable": {
      "config": "cz-config.js"
    }
  }
}
```

上面配置之后，使用 git commit 依旧可以提交不规范的格式，所以要通过 commitlint 来限制提交。

```js
pnpm add @commitlint/config-conventional @commitlint/cli
```

根目录新建commitlint.config.cjs

```js
module.exports = { extends: ['@commitlint/config-conventional'] };
```

此时，我们提交不符合规范的代码，则会进行报错

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a44497a43a1a49439b5f42ff4cb91e9f~tplv-k3u1fbpfcp-watermark.image?)

至此，我们的项目代码校验已全部完成

## 添加windicss、postcss

顺便完善下项目建设，添加下常用的工具

```js
pnpm add vite-plugin-windicss windicss postcss-preset-env
```

添加windis.config.ts

```js
import { defineConfig } from 'windicss/helpers';
import formsPlugin from 'windicss/plugin/forms';

export default defineConfig({
  darkMode: 'class',
  safelist: 'p-3 p-4 p-5',
  theme: {
    extend: {
      colors: {
        teal: {
          100: '#096'
        }
      }
    }
  },
  plugins: [formsPlugin],
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git']
  }
});
```

最终vite.config.ts如下

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import checker from 'vite-plugin-checker';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
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
  }
});
```

[github](https://github.com/BenjaminCCG/vue3-template-cli.git)
[国内gitee](https://gitee.com/theGreatWallCCG/my-vue-cli)
