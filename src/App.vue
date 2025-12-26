<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import PlayerBox from './components/PlayerBox.vue';

const STORAGE_KEY = 'tabletop_scorekeeper_v2';
const step = ref('setup');
const playerCount = ref(4);
const players = ref([]);

const colors = [
    "#E53935", "#1E88E5", "#43A047", "#FB8C00", "#8E24AA", 
    "#00897B", "#D81B60", "#3949AB", "#6D4C41", "#546E7A",
    "#7CB342", "#039BE5" // New: Light Green & Light Blue
];

// Persistence
onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const p = JSON.parse(saved);
            step.value = p.step;
            playerCount.value = p.playerCount;
            players.value = p.players;
        } catch(e) {}
    }
});

watch([step, playerCount, players], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        step: step.value, playerCount: playerCount.value, players: players.value 
    }));
}, { deep: true });

// Actions
const adjustCount = (n) => {
    const v = playerCount.value + n;
    if (v >= 2 && v <= 12) playerCount.value = v;
};

const startGame = () => {
    players.value = Array.from({ length: playerCount.value }, (_, i) => ({
        id: i, 
        score: 0, 
        color: colors[i]
    }));
    
    step.value = 'game';
};

const resetGame = () => { if(confirm("Exit to menu?")) step.value = 'setup'; };

const gridClass = computed(() => players.value.length >= 9 ? 'grid-cols-3' : 'grid-cols-2');
const isOddLast = (index) => (index === players.value.length - 1) && (players.value.length % 2 !== 0);
</script>

<template>
    <div class="h-screen w-screen overflow-hidden bg-neutral-900 text-white select-none">
        
        <div v-if="step === 'setup'" class="h-full flex flex-col items-center justify-center space-y-8">
            <h1 class="text-2xl uppercase tracking-widest text-neutral-400">Player Count</h1>
            <div class="flex items-center space-x-8">
                <button @click="adjustCount(-1)" class="w-16 h-16 rounded-full border-2 border-neutral-600 text-3xl flex items-center justify-center">-</button>
                <span class="text-6xl font-bold w-20 text-center">{{ playerCount }}</span>
                <button @click="adjustCount(1)" class="w-16 h-16 rounded-full border-2 border-neutral-600 text-3xl flex items-center justify-center">+</button>
            </div>
            <button @click="startGame" class="bg-green-600 px-12 py-4 rounded-full text-xl font-bold shadow-lg">START</button>
        </div>

        <div v-else class="grid h-full w-full" :class="gridClass">
            <PlayerBox 
                v-for="(player, index) in players"
                :key="player.id"
                :player="player"
                :isFirst="index === 0"
                :isOddLast="isOddLast(index)"
                @resetGame="resetGame"
            />
        </div>
    </div>
</template>