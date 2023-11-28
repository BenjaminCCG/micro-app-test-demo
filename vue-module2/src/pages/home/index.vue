<template>
  <div>hello world,{{ userStore.name }}测试2</div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
</script>
