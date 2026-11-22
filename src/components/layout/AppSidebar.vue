<script setup>
import { useRouter } from 'vue-router';
import { SignalIcon, ChartBarIcon, TableCellsIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/useAuthStore';

defineProps({ abierto: { type: Boolean, default: false } });

const auth = useAuthStore();
const router = useRouter();
const logo = `${import.meta.env.BASE_URL}logo-olivos.webp`;
const MENU = [
  { to: '/monitoreo', texto: 'Monitoreo', icono: SignalIcon },
  { to: '/graficas', texto: 'Gráficas', icono: ChartBarIcon },
  { to: '/registros', texto: 'Registros', icono: TableCellsIcon },
];

function salir() {
  auth.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brown-deep text-cream transition-transform duration-200',
      'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
      abierto ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex items-center gap-3 border-b border-white/10 px-5 py-5">
      <div class="rounded-lg bg-white p-1.5"><img :src="logo" alt="Los Olivos" class="h-9 w-auto" /></div>
      <div>
        <p class="font-serif text-lg font-bold leading-tight">Horno INCOL</p>
        <p class="text-xs text-white/60">Monitoreo de emisiones</p>
      </div>
    </div>

    <nav class="flex-1 space-y-1 px-3 py-4">
      <RouterLink
        v-for="item in MENU" :key="item.to" :to="item.to"
        class="flex items-center gap-3 rounded-sv px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        active-class="!bg-gold/20 !text-gold-bright"
      >
        <component :is="item.icono" class="h-5 w-5" />
        {{ item.texto }}
      </RouterLink>
    </nav>

    <div class="border-t border-white/10 p-4">
      <div class="mb-3 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-semibold">{{ auth.iniciales }}</span>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold">{{ auth.usuario?.nombre || auth.usuario?.usuario }}</p>
          <p class="truncate text-xs text-white/60">{{ auth.usuario?.usuario }}</p>
        </div>
      </div>
      <button type="button" class="flex w-full items-center gap-2 rounded-sv px-3 py-2 text-sm text-white/80 hover:bg-white/10" @click="salir">
        <ArrowRightOnRectangleIcon class="h-5 w-5" /> Cerrar sesión
      </button>
    </div>
  </aside>
</template>
