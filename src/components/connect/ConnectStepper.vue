<template>
  <div class="card w-2/3">
    <Stepper ref="connectionStepper" :value="activeStep" v-on:update:value="(val) => nextStep(val)" unstyled>
      <StepItem value="1">
        <Step>Connect to server</Step>
        <StepPanel v-slot="{ activateCallback }" class="step__panel" unstyled>
          <div class="step__panel-box">
            <div class="step__box">
              <div v-if="gameStore.serverIsActive" class="step__header">Server status: OK</div>
              <div v-else class="step__header">Server status: BAD</div>
              <div v-if="gameStore.serverIsActive" class="step__field">
                <label for="inputName" class="step__field-label">Who are you?</label>
                <InputText id="inputName" v-model="userName" type="text" placeholder="Name" class="step__input" fluid
                  unstyled />
                <Message severity="warn" v-show="!isNameInput">User name must have 3 or more simbols!</Message>
              </div>
            </div>
          </div>
          <div class="py-6">
            <Button label="Next" @click="activateCallback('2')" :disabled="!gameStore.serverIsActive || !isNameInput"
              size="small" />
          </div>
        </StepPanel>
      </StepItem>
      <StepItem value="2">
        <Step>Choose your role</Step>
        <StepPanel v-slot="{ activateCallback }" unstyled>
          <div class="step__panel">
            <div class="step__box">
              <p>Hello, {{ userName }}</p>
              <div class="step__header">What do you want?</div>
            </div>
          </div>
          <div class="flex py-6 gap-2">
            <Button label="Back" severity="secondary" @click="activateCallback('1')" size="small" />
            <Button label="I`am want to play" @click="activateCallback('3')" size="small" />
            <Button label="i`am just looking" @click="activateCallback('4')" size="small" />
          </div>
        </StepPanel>
      </StepItem>
      <StepItem value="3">
        <Step>Player</Step>
        <StepPanel v-slot="{ activateCallback }" unstyled>
          <div class="step__panel">
            <div class="step__box">
              <div class="step__header">You is player!</div>
            </div>
          </div>
          <div class="py-6">
            <Button label="Back" severity="secondary" @click="activateCallback('2')" size="small" />
            <Button label="Play!" @click="activateCallback('5')" size="small" />
          </div>
        </StepPanel>
      </StepItem>
      <StepItem value="4">
        <Step>Looker</Step>
        <StepPanel v-slot="{ activateCallback }" unstyled>
          <div class="step__panel">
            <div class="step__box">
              <div class="step__header">You is looker!</div>
            </div>
          </div>
          <div class="py-6">
            <Button label="Back" severity="secondary" @click="activateCallback('2')" size="small" />
            <Button label="Look!" @click="activateCallback('5')" size="small" />
          </div>
        </StepPanel>
      </StepItem>
    </Stepper>
  </div>
</template>

<style>
@reference "#main-style";

.step__panel {
  @apply bg-none;
}

.step__panel-box {
  @apply flex flex-col;
}

.step__box {
  @apply border-1 border-dashed border-amber-800 rounded bg-amber-100 flex-auto flex flex-col justify-center items-center font-medium p-2;
}

.step__header {
  @apply text-center mb-1 p-1 text-lg font-semibold text-green-700;
}

.step__field-label {
  @apply text-green-700;
}

.step__field {
  @apply flex flex-col gap-2 items-center;
}

.step__input {
  @apply bg-green-700 text-amber-100 p-1 rounded;
}
</style>

<script setup lang="ts">
import Stepper from 'primevue/stepper';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { computed, ref } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { onMounted } from 'vue';
import router from '@/router';

const userName = ref('')
const gameStore = useGameStore()
const activeStep = ref('1')

onMounted(async () => {
  activeStep.value = '1'
  await gameStore.init()
})

const isNameInput = computed(() => {
  return userName.value.length >= 3;
})

const nextStep = async (nStep: string) => {
  // console.log("🚀 ~ nextStep ~ Stepper.name:", Stepper)
  switch (nStep) {
    case '2':
      if (isNameInput.value) {
        if (gameStore.linkByWS.sendMsg({ name: userName.value, action: 'add2queue' })) {
          activeStep.value = '2'
        } else {
          activeStep.value = '1'
        }
      }
      break;
    case '3':
      gameStore.linkByWS.sendMsg({ action: 'iwantplay', payload: { playerId: gameStore.player.id } })
      break;
    case '4':
      gameStore.linkByWS.sendMsg({ action: 'iwantlook', payload: { playerId: gameStore.player.id } })
      break;
    case '5':
      router.push({ name: 'game' })
      break;

    default:
      break;
  }
}
</script>
