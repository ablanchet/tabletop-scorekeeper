<script setup>
import { defineProps, defineEmits } from 'vue';
import { calculateNewScore } from '../logic/calculator';

const props = defineProps(['player', 'isFirst', 'isOddLast']);
const emit = defineEmits(['resetGame']);

// Interaction State
let lastTap = { time: 0, delta: 0 };
let holdTimer = null;
let rapidInterval = null;

const handleTouchStart = (delta) => {
    const now = Date.now();
    
    // Double Tap Logic
    if (lastTap.delta === delta && (now - lastTap.time) < 300) {
        props.player.score -= delta; // Revert previous tap
        clearTimers();
        lastTap = { time: 0, delta: 0 };
        openPrompt();
        return;
    }

    // Single Tap / Hold Logic
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

const openPrompt = () => {
    // Timeout to allow UI to settle
    setTimeout(() => {
        const input = prompt("Math allowed (e.g. +10, x2):");
        const newScore = calculateNewScore(props.player.score, input);
        if (newScore !== undefined) props.player.score = newScore;
    }, 10);
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
    </div>
</template>