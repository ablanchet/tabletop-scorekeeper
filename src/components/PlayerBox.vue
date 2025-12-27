<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['player', 'isFirst', 'isOddLast']);
const emit = defineEmits(['resetGame', 'editScore']);

// --- STATE ---
let holdTimer = null;
let rapidInterval = null;
let lastScoreTap = 0;

// --- HAPTIC ---
const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(15);
};

// --- TOUCH LOGIC (+1 / -1) ---
const handleTouchStart = (delta) => {
    triggerHaptic();
    props.player.score += delta;
    holdTimer = setTimeout(() => {
        rapidInterval = setInterval(() => {
            triggerHaptic();
            props.player.score += delta;
        }, 100);
    }, 500);
};

const handleTouchEnd = () => {
    clearTimeout(holdTimer);
    clearInterval(rapidInterval);
};

// --- SCORE LOGIC ---
const handleScoreTouch = () => {
    const now = Date.now();
    if (now - lastScoreTap < 300) {
        emit('editScore', props.player);
        lastScoreTap = 0;
    } else {
        lastScoreTap = now;
    }
};
</script>

<template>
    <div class="relative flex flex-col items-center justify-center transition-colors rounded-3xl overflow-hidden shadow-lg"
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

         <div class="text-[6rem] leading-none font-black text-white drop-shadow-md z-20 select-none cursor-pointer active:scale-95 transition-transform"
              @touchstart.stop.prevent="handleScoreTouch"
              @mousedown.stop.prevent="handleScoreTouch">
             {{ player.score }}
         </div>
    </div>
</template>