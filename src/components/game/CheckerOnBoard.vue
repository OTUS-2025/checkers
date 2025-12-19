<template>
  <teleport :to="target" :disabled="!isTargetReady">
    <div class="checker" :class="props.who.color">
      <i class="pi pi-circle" style="font-size: 1em;"></i>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import Checker from '@/types/basic';
import { nextTick, onMounted, ref } from 'vue';

const target = ref()
const isTargetReady = ref(false)

const props = defineProps({
  who: { type: Checker, default: new Checker('A', '1', 'black') },
});

onMounted(() => {
  nextTick(() => {
    isTargetReady.value = !!document.querySelector(props.who.elementId)
    // console.log("🚀 ~ isTargetReady.value:", isTargetReady.value)
    if (isTargetReady.value) {
      target.value = props.who.elementId
    }
  })

})
</script>

<style>
@reference "#main-style";

.checker {
  font-size: calc(var(--checker-size)*0.8);
  @apply w-(--checker-size) h-(--checker-size) rounded-full flex justify-center items-center;
}

.white {
  @apply bg-amber-100 text-amber-900;
}

.black {
  @apply bg-amber-950 text-amber-100;
}

.none {
  @apply hidden;
}
</style>
