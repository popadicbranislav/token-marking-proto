<script setup lang="ts">
import { nanoid } from "nanoid";
import { ref } from "vue";

const props = defineProps<{
  text: string;
}>();

const tokens = setupTokens(props.text);
type UtterToken = typeof tokens[number];

function setupTokens(sentence: string) {
  const nonAlphaRegex = /([!,?.: ])/;
  let i = 0;
  let j = 0;
  return sentence
    .split(nonAlphaRegex)
    .filter((word) => word.trim() !== "")
    .map((word) => {
      const start = i;
      const end = i + word.length;

      const wordObj = {
        id: nanoid(),
        pos: j++,
        start,
        end,
        text: word,
        isAlpha: !word.match(nonAlphaRegex),
        entity: null as unknown,
      };

      i += word.length + 1;

      return wordObj;
    });
}

const startPos = ref<null | number>(null);
const endPos = ref<null | number>(null);

function onMouseDown(token: UtterToken) {
  console.log(token);
  if (!token.isAlpha) {
    startPos.value = null;
    endPos.value = null;
    return;
  }
  startPos.value = token.pos;
}

function onMouseUp(token: UtterToken) {
  console.log(token);
  if (!token.isAlpha) return;

  // If the user clicks on the same token twice, it will reset the endPos.value to null.
  if (token.pos === startPos.value) return (endPos.value = null);

  endPos.value = token.pos;

  if (startPos.value && endPos.value && startPos.value > endPos.value) {
    const tmp = endPos.value;
    endPos.value = startPos.value;
    startPos.value = tmp;
  }
}

function onMouseOver(token: UtterToken) {
  console.log(token);
}

function isHighlighted(tokenPos: number): boolean {
  console.log(tokenPos, 'is between', startPos.value, endPos.value);
  const start = startPos.value
  if(start == null ) return false
  const end = endPos.value || start

  return start <= tokenPos && tokenPos <=end
}
</script>

<template>
  <div>
    <span
      v-for="token of tokens"
      :key="token.id"
      :class="{
        'ml--1': !token.isAlpha,
        'token-active bg-white color-black': isHighlighted(token.pos),
        'label-start': token.pos === startPos,
        'label-end': endPos ? token.pos === endPos : token.pos === startPos,
        'hover:bg-red': token.isAlpha,
      }"
      class="cursor-pointer select-none px-.5"
      @mousedown="onMouseDown(token)"
      @mouseup="onMouseUp(token)"
      @mouseover="onMouseOver(token)"
    >
      {{ token.text }}</span
    >
  </div>
</template>

<style scoped>
span{
  --b-radius: .2rem;
}
span.label-start
 {
  border-top-left-radius: var(--b-radius); 
  border-bottom-left-radius: var(--b-radius); 
}

span.label-end
 {
  border-top-right-radius: var(--b-radius); 
  border-bottom-right-radius: var(--b-radius); 
}

/* span[data-active="true"]:last-of-type */
</style>
