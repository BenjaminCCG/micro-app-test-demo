<template>
  <!-- <div>hello world,{{ userStore.name }}测试2</div> -->
  <button v-for="(item, index) in apps" :key="index" class="mr-2" @click="active = index">{{ item.name }}</button>
  <micro-app :name="apps[active].name" :url="apps[active].url" inline disableSandbox></micro-app>
</template>

<script setup lang="ts">
import { EventCenterForMicroApp } from '@micro-zoe/micro-app';

const active = ref(0);
const apps = ref([
  { name: 'vue-app', url: 'http://localhost:8081' },
  { name: 'vue-app2', url: 'http://localhost:8082' },
  { name: 'appname-vite', url: 'http://localhost:4007/child/vite/' }
]);

// @ts-ignore
window[`eventCenterFor${apps.value[active.value].name}`] = new EventCenterForMicroApp(apps.value[active.value].name);
</script>
