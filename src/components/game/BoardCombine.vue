<template>
  <div class="board-box">
    <BoardLabelLetters />
    <BoardLabelNumbers />
    <div class="board">
      <div v-for="square, index in squares" :key="index" :id="square" class="board__square as-checkers">
      </div>
    </div>
    <BoardLabelNumbers />
    <BoardLabelLetters />
  </div>
  <div class="checkers">
    <CheckerOnBoard :who="oneChecker" />
  </div>
</template>

<style>
@reference "#main-style";

.as-checkers:nth-child(16n+1),
.as-checkers:nth-child(16n+3),
.as-checkers:nth-child(16n+5),
.as-checkers:nth-child(16n+7) {
  @apply bg-amber-700;
}

.as-checkers:nth-child(16n+9),
.as-checkers:nth-child(16n+11),
.as-checkers:nth-child(16n+13),
.as-checkers:nth-child(16n+15) {
  @apply bg-amber-200;
}

.as-checkers:nth-child(16n+2),
.as-checkers:nth-child(16n+4),
.as-checkers:nth-child(16n+6),
.as-checkers:nth-child(16n+8) {
  @apply bg-amber-200;
}

.as-checkers:nth-child(16n+10),
.as-checkers:nth-child(16n+12),
.as-checkers:nth-child(16n+14),
.as-checkers:nth-child(16n+16) {
  @apply bg-amber-700;
}

.board-box {
  @apply w-(--board-box-size) h-(--board-box-size) flex flex-wrap bg-amber-200;
}

.board {
  @apply w-(--board-size) h-(--board-size) flex flex-row flex-wrap border-amber-950 border-(length:--board-box-border);
}

.board__square {
  @apply w-(--square-size) h-(--square-size) flex justify-center items-center;
}
</style>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import BoardLabelLetters from './BoardLabelLetters.vue';
import BoardLabelNumbers from './BoardLabelNumbers.vue';
import CheckerOnBoard from './CheckerOnBoard.vue';
import Checker from '@/types/basic';
// TODO: add component for game controls(button with list) and game log

const squares = ref<string[]>([])
const numbers: ReadonlyArray<string> = ['1', '2', '3', '4', '5', '6', '7', '8']
const letters: ReadonlyArray<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const oneChecker: Checker = new Checker('A', '1', 'black')
const isShow = ref(false);

onMounted(() => {
  for (const number of numbers) {
    for (const letter of letters) {
      squares.value.push(letter + number)
    }
  }
  // oneChecker = new Checker('A', '5', 'white')
  nextTick(() => { isShow.value = true })

})
</script>
