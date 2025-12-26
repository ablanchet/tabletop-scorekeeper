<script setup>
import { ref, nextTick, defineProps, defineEmits } from 'vue';
import { calculateNewScore } from '../logic/calculator';

const props = defineProps(['player', 'isFirst', 'isOddLast']);
const emit = defineEmits(['resetGame']);

// Interaction State
let lastTap = { time: 0, delta: 0 };
let holdTimer = null;
let rapidInterval = null;

// Modal State
const showModal = ref(false);
const modalInput = ref("");
const inputRef = ref(null); // Reference to the input DOM element

const handleTouchStart = (delta) => {
    const now = Date.now();
    
    // Double Tap
    if (lastTap.delta === delta && (now - lastTap.time) < 150) {
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

const openModal = () => {
    modalInput.value = ""; // Clear previous
    showModal.value = true;
    
    // Wait for DOM update, then focus input
    nextTick(() => {
        if(inputRef.value) inputRef.value.focus();
    });
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

         <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80" @click.stop>
            <div class="bg-white p-6 rounded-xl w-3/4 max-w-sm shadow-2xl">
                <h3 class="text-black text-lg font-bold mb-4 text-center">Update Score</h3>
                
                <input ref="inputRef" 
                       v-model="modalInput" 
                       type="tel" 
                       placeholder="+10 or x2"
                       class="w-full text-black text-2xl border-2 border-gray-300 rounded p-3 text-center mb-4 focus:outline-none focus:border-blue-500"
                       @keydown.enter="submitModal" />
                
                <div class="flex gap-2">
                    <button @click="showModal = false" class="flex-1 py-3 bg-gray-200 text-gray-800 rounded font-bold">Cancel</button>
                    <button @click="submitModal" class="flex-1 py-3 bg-blue-600 text-white rounded font-bold">OK</button>
                </div>
            </div>
         </div>

    </div>
</template>