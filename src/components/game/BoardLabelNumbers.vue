<template>
  <div class="boards-numbers w-(--label-size) flex flex-col ">
    <div v-for="number, index in boardsNumbers" :key="index"
      class="square-label w-(--label-size) h-(--square-size) flex justify-center items-center">
      <p class="text-center text-amber-950">{{ number }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const boardsNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
</script>
