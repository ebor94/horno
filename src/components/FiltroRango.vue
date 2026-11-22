<script setup>
import { ref, onMounted } from 'vue';
import { PRESETS, rangoPreset, rangoPersonalizado, aInputLocal } from '@/utils/rangos';

const props = defineProps({ inicial: { type: String, default: '24h' } });
const emit = defineEmits(['cambio']);

const activo = ref(props.inicial);
const desdeLocal = ref('');
const hastaLocal = ref('');
const error = ref('');

function elegir(clave) {
  activo.value = clave;
  error.value = '';
  const rango = rangoPreset(clave);
  desdeLocal.value = aInputLocal(rango.desde);
  hastaLocal.value = aInputLocal(rango.hasta);
  emit('cambio', { ...rango, clave });
}

function aplicarPersonalizado() {
  const r = rangoPersonalizado(desdeLocal.value, hastaLocal.value);
  if (r.error) {
    error.value = r.error;
    return;
  }
  error.value = '';
  activo.value = 'personalizado';
  emit('cambio', { ...r, clave: 'personalizado' });
}

// Vuelve a calcular el preset activo con la hora actual (para "Actualizar").
function refrescar() {
  if (activo.value === 'personalizado') aplicarPersonalizado();
  else elegir(activo.value);
}

onMounted(() => elegir(props.inicial));
defineExpose({ refrescar });
</script>

<template>
  <div class="sv-card flex flex-wrap items-end gap-3 p-4">
    <div class="flex flex-wrap gap-1 rounded-sv bg-gray-100 p-1">
      <button
        v-for="p in PRESETS" :key="p.clave" type="button"
        :class="['rounded-md px-3 py-1.5 text-sm font-semibold transition', activo === p.clave ? 'bg-white text-primary-700 shadow' : 'text-text2 hover:text-primary-700']"
        @click="elegir(p.clave)"
      >{{ p.texto }}</button>
    </div>
    <div>
      <label class="sv-label" for="filtro-desde">Desde</label>
      <input id="filtro-desde" v-model="desdeLocal" type="datetime-local" class="sv-input" />
    </div>
    <div>
      <label class="sv-label" for="filtro-hasta">Hasta</label>
      <input id="filtro-hasta" v-model="hastaLocal" type="datetime-local" class="sv-input" />
    </div>
    <button type="button" :class="activo === 'personalizado' ? 'sv-btn-primary' : 'sv-btn-secondary'" @click="aplicarPersonalizado">Aplicar</button>
    <slot />
    <p v-if="error" class="w-full text-sm text-danger" role="alert">{{ error }}</p>
  </div>
</template>
