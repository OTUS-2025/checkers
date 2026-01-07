<template>
  <div class="board__letters">
    <div v-for="letter, index in boardsLetters" :key="index" class="board__square__label">
      <span class="text-xl text-amber-950 uppercase">
        {{ letter }}
      </span>
    </div>
  </div>
</template>

<style>
@reference "#main-style";

.board__letters {
  @apply h-(--label-size) w-full flex flex-row justify-center items-center;
}

.board__square__label {
  @apply w-(--square-size) h-(--label-size) flex justify-center items-center;
}
</style>

<script setup lang="ts">
const boardsLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
</script>
