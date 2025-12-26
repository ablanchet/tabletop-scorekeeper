<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { calculateNewScore } from '../logic/calculator';

const props = defineProps(['player', 'isFirst', 'isOddLast']);
const emit = defineEmits(['resetGame']);

// --- INTERACTION STATE ---
let lastTap = { time: 0, delta: 0 };
let holdTimer = null;
let rapidInterval = null;

// --- MODAL STATE ---
const showModal = ref(false);
const modalInput = ref("");

// --- TOUCH LOGIC ---
const handleTouchStart = (delta) => {
    const now = Date.now();
    
    // Double Tap: < 200ms
    if (lastTap.delta === delta && (now - lastTap.time) < 200) {
        props.player.score -= delta; // Revert
        clearTimers();
        lastTap = { time: 0, delta: 0 };
        openModal();
        return;
    }

    lastTap = { time: now, delta };
    props.player.score += delta;

    holdTimer = setTimeout(() => {
        rapidInterval = setInterval(() => {
            props.player.score += delta;
        }, 100);
    }, 500);
};

const handleTouchEnd = () => clearTimers();

const clearTimers = () => {
    clearTimeout(holdTimer);
    clearInterval(rapidInterval);
};

// --- KEYPAD LOGIC ---
const openModal = () => {
    modalInput.value = "";
    showModal.value = true;
};

const appendChar = (char) => {
    modalInput.value += char;
};

const backspace = () => {
    modalInput.value = modalInput.value.slice(0, -1);
};

const submitModal = () => {
    const newScore = calculateNewScore(props.player.score, modalInput.value);
    if (newScore !== undefined) props.player.score = newScore;
    showModal.value = false;
};
</script>

<template>
    <div class="relative flex flex-col items-center justify-center border border-black/10 transition-colors"
         :class="{ 'col-span-2': isOddLast }"
         :style="{ backgroundColor: player.color }">

         <div class="absolute top-0 left-0 w-full h-1/2 z-10 active:bg-white/10"
              @touchstart.prevent="handleTouchStart(1)" @touchend="handleTouchEnd"
              @mousedown="handleTouchStart(1)" @mouseup="handleTouchEnd" @mouseleave="handleTouchEnd">
         </div>
         <div class="absolute bottom-0 left-0 w-full h-1/2 z-10 active:bg-black/10"
              @touchstart.prevent="handleTouchStart(-1)" @touchend="handleTouchEnd"
              @mousedown="handleTouchStart(-1)" @mouseup="handleTouchEnd" @mouseleave="handleTouchEnd">
         </div>

         <div v-if="isFirst" @click.stop="emit('resetGame')" 
              class="absolute top-4 left-4 p-3 bg-black/20 rounded-full z-20 hover:bg-black/30 cursor-pointer">
            <svg class="w-5 h-5 stroke-white stroke-2" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </div>

         <div class="text-[6rem] leading-none font-black text-white drop-shadow-md pointer-events-none z-0 select-none">
             {{ player.score }}
         </div>

         <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click.stop>
            <div class="bg-neutral-800 border border-neutral-700 p-4 rounded-2xl w-full max-w-xs shadow-2xl flex flex-col gap-3">
                
                <div class="bg-neutral-900 rounded-lg p-4 mb-2 text-right">
                    <span class="text-neutral-400 text-sm block h-4">Current: {{ player.score }}</span>
                    <span class="text-white text-3xl font-mono tracking-widest min-h-[40px] block">
                        {{ modalInput || "0" }}
                    </span>
                </div>

                <div class="grid grid-cols-4 gap-2">
                    <button @click="appendChar('7')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">7</button>
                    <button @click="appendChar('8')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">8</button>
                    <button @click="appendChar('9')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">9</button>
                    <button @click="appendChar('/')" class="bg-orange-600 text-white p-4 rounded text-xl font-bold active:bg-orange-500">÷</button>

                    <button @click="appendChar('4')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">4</button>
                    <button @click="appendChar('5')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">5</button>
                    <button @click="appendChar('6')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">6</button>
                    <button @click="appendChar('x')" class="bg-orange-600 text-white p-4 rounded text-xl font-bold active:bg-orange-500">×</button>

                    <button @click="appendChar('1')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">1</button>
                    <button @click="appendChar('2')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">2</button>
                    <button @click="appendChar('3')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">3</button>
                    <button @click="appendChar('-')" class="bg-orange-600 text-white p-4 rounded text-xl font-bold active:bg-orange-500">-</button>

                    <button @click="backspace" class="bg-red-900/50 text-red-200 p-4 rounded text-xl font-bold active:bg-red-900">⌫</button>
                    <button @click="appendChar('0')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">0</button>
                    <button @click="appendChar('.')" class="bg-neutral-700 text-white p-4 rounded text-xl font-bold active:bg-neutral-600">.</button>
                    <button @click="appendChar('+')" class="bg-orange-600 text-white p-4 rounded text-xl font-bold active:bg-orange-500">+</button>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-2">
                    <button @click="showModal = false" class="py-4 bg-neutral-600 text-white rounded-lg font-bold">CANCEL</button>
                    <button @click="submitModal" class="py-4 bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-900/50">APPLY</button>
                </div>

            </div>
         </div>

    </div>
</template>