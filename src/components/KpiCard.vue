<script setup>
import { computed } from 'vue';
import { formatear } from '@/config/variables';

const props = defineProps({
  variable: { type: Object, required: true },
  valor: { type: Number, default: null },
});
const texto = computed(() => formatear(props.valor, props.variable));
</script>

<template>
  <div class="sv-card relative overflow-hidden p-5">
    <span class="absolute inset-y-0 left-0 w-1.5" :style="{ backgroundColor: variable.color }" />
    <p class="text-xs font-semibold uppercase tracking-wide text-text3">{{ variable.etiqueta }}</p>
    <p class="mt-2 flex items-baseline gap-1.5">
      <span class="font-serif text-3xl font-bold text-text1">{{ texto }}</span>
      <span v-if="variable.unidad" class="text-sm font-semibold text-text3">{{ variable.unidad }}</span>
    </p>
  </div>
</template>
