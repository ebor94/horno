<script setup>
import dayjs from 'dayjs';
import { VARIABLES, formatear, etiquetaCompleta } from '@/config/variables';

defineProps({ filas: { type: Array, default: () => [] } });
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm">
      <thead class="bg-primary-50 text-left text-xs font-semibold uppercase tracking-wide text-primary-800">
        <tr>
          <th class="sticky left-0 bg-primary-50 px-4 py-3">Fecha y hora</th>
          <th v-for="v in VARIABLES" :key="v.campo" class="whitespace-nowrap px-4 py-3 text-right">{{ etiquetaCompleta(v) }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="f in filas" :key="f.id" class="hover:bg-gray-50">
          <td class="sticky left-0 whitespace-nowrap bg-white px-4 py-2.5 font-medium text-text1">{{ dayjs(f.registrado_en).format('DD/MM/YYYY HH:mm:ss') }}</td>
          <td v-for="v in VARIABLES" :key="v.campo" class="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-text2">{{ formatear(f[v.campo], v) }}</td>
        </tr>
        <tr v-if="!filas.length">
          <td :colspan="VARIABLES.length + 1" class="px-4 py-10 text-center text-text3">No hay lecturas en este rango</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
