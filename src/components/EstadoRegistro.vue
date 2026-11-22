<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { estadoRegistro } from '@/utils/estado';

const props = defineProps({
  minutos: { type: Number, default: null },
  registradoEn: { type: String, default: null },
});

const estado = computed(() => estadoRegistro(props.minutos));
const ESTILOS = {
  ok: 'bg-primary-50 border-primary-200 text-primary-800',
  alerta: 'bg-amber-50 border-amber-200 text-amber-800',
  critico: 'bg-red-50 border-red-200 text-red-800',
  'sin-datos': 'bg-gray-50 border-gray-200 text-text2',
};
const PUNTO = { ok: 'bg-primary-500', alerta: 'bg-warning', critico: 'bg-danger', 'sin-datos': 'bg-gray-400' };
</script>

<template>
  <div :class="['flex flex-wrap items-center gap-3 rounded-sv border px-4 py-3', ESTILOS[estado.nivel]]" role="status">
    <span class="relative flex h-3 w-3">
      <span v-if="estado.nivel === 'ok'" class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-60" />
      <span :class="['relative inline-flex h-3 w-3 rounded-full', PUNTO[estado.nivel]]" />
    </span>
    <span class="font-semibold">{{ estado.texto }}</span>
    <span v-if="registradoEn" class="text-sm opacity-80">· Último dato: {{ dayjs(registradoEn).format('DD/MM/YYYY HH:mm:ss') }}</span>
  </div>
</template>
