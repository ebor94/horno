<script setup>
import { Bars3Icon } from '@heroicons/vue/24/outline';

defineProps({ titulo: { type: String, default: '' } });
defineEmits(['menu']);
</script>

<template>
  <header class="sticky top-0 z-20 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
    <button type="button" class="rounded-sv p-2 text-text2 hover:bg-gray-100 lg:hidden" aria-label="Abrir menú" @click="$emit('menu')">
      <Bars3Icon class="h-6 w-6" />
    </button>
    <h1 class="font-serif text-xl font-bold text-primary-800">{{ titulo }}</h1>
  </header>
</template>
