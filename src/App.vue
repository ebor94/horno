<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import AppHeader from '@/components/layout/AppHeader.vue';

const route = useRoute();
const menuAbierto = ref(false);
const publica = computed(() => route.meta.publica === true);
watch(() => route.fullPath, () => { menuAbierto.value = false; });
</script>

<template>
  <RouterView v-if="publica" />
  <div v-else class="min-h-screen lg:flex">
    <AppSidebar :abierto="menuAbierto" />
    <div v-if="menuAbierto" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="menuAbierto = false" />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppHeader :titulo="route.meta.titulo || ''" @menu="menuAbierto = true" />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
