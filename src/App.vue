<script setup lang="ts">
import { onMounted } from 'vue';
import router from './router';

onMounted(() => {
  router.push({ name: 'game' })
})
</script>

<template>
  <div class="container h-full flex flex-col justify-center items-center mx-auto my-0 p-2.5 bg-lime-800 ">
    <h1>Net Checkers</h1>
    <router-view />
  </div>
</template>

<style scoped></style>
