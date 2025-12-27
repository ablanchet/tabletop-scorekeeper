<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { calculateNewScore } from '../logic/calculator';

const props = defineProps(['currentScore', 'color']);
const emit = defineEmits(['close', 'save']);

const modalInput = ref("");

const appendChar = (char) => { modalInput.value += char; };
const backspace = () => { modalInput.value = modalInput.value.slice(0, -1); };

const submit = () => {
    const newScore = calculateNewScore(props.currentScore, modalInput.value);
    if (newScore !== undefined) {
        emit('save', newScore);
    } else {
        emit('close');
    }
};
</script>

<template>
    <div class="fixed inset-0 z-50 bg-neutral-900 flex flex-col p-2 animate-fade-in"
         style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
         @click.stop>
        
        <div class="bg-black/50 rounded-xl p-4 mb-2 text-right flex flex-col justify-center shrink-0">
            <span class="text-sm font-bold uppercase tracking-wider mb-1" 
                  :style="{ color: color }">
                  Current: {{ currentScore }}
            </span>
            <span class="text-white text-5xl font-mono font-bold tracking-widest break-all">
                {{ modalInput || "0" }}
            </span>
        </div>

        <div class="grid grid-cols-4 gap-2 flex-1">
            <button @click="appendChar('7')" class="btn-num">7</button>
            <button @click="appendChar('8')" class="btn-num">8</button>
            <button @click="appendChar('9')" class="btn-num">9</button>
            <button @click="appendChar('/')" class="btn-op">÷</button>

            <button @click="appendChar('4')" class="btn-num">4</button>
            <button @click="appendChar('5')" class="btn-num">5</button>
            <button @click="appendChar('6')" class="btn-num">6</button>
            <button @click="appendChar('x')" class="btn-op">×</button>

            <button @click="appendChar('1')" class="btn-num">1</button>
            <button @click="appendChar('2')" class="btn-num">2</button>
            <button @click="appendChar('3')" class="btn-num">3</button>
            <button @click="appendChar('-')" class="btn-op">-</button>

            <button @click="backspace" class="btn-del">⌫</button>
            <button @click="appendChar('0')" class="btn-num">0</button>
            <button @click="appendChar('.')" class="btn-num">.</button>
            <button @click="appendChar('+')" class="btn-op">+</button>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-2 h-20 shrink-0">
            <button @click="$emit('close')" class="bg-neutral-600 text-white rounded-lg text-xl font-bold uppercase tracking-wider active:bg-neutral-500">Cancel</button>
            <button @click="submit" class="bg-green-600 text-white rounded-lg text-xl font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-transform">Apply</button>
        </div>
    </div>
</template>

<style scoped>
.btn-num { @apply bg-neutral-700 text-white rounded-lg text-3xl font-bold active:bg-neutral-600; }
.btn-op  { @apply bg-orange-600 text-white rounded-lg text-3xl font-bold active:bg-orange-500; }
.btn-del { @apply bg-red-900/40 text-red-200 rounded-lg text-2xl font-bold active:bg-red-900/60; }
</style>