<template>
  <div>{{ gameState.game.actualPhase }}</div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';
const gameState = useGameStore();
</script>

<style lang="postcss" scoped></style>
