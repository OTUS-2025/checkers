<script setup lang="ts">
import { onMounted } from 'vue';
import router from './router';
import GameState from './components/connect/GameState.vue';

onMounted(() => {
  // router.push({ name: 'game' })
  router.push({ name: 'welcome' })
})
</script>

<template>
  <div class="container h-full flex flex-col justify-center items-center mx-auto my-0 p-2.5 bg-lime-800 ">
    <h1>Net Checkers</h1>
    <game-state />
    <router-view />
  </div>
</template>

<style scoped></style>
