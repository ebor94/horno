<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { hornoApi } from '@/api/hornoApi';
import { mensajeDeError } from '@/api/http';
import { VARIABLES, GRUPOS } from '@/config/variables';
import KpiCard from '@/components/KpiCard.vue';
import EstadoRegistro from '@/components/EstadoRegistro.vue';

const INTERVALO_MS = 30000;
const datos = ref({ lectura: null, minutosSinDatos: null });
const cargando = ref(false);
const error = ref('');
const actualizado = ref(null);
let temporizador = null;
// Número de la última consulta lanzada: solo esa puede actualizar el estado.
let ultimaConsulta = 0;

async function cargar() {
  // Un refresco lento no debe pisar a uno posterior: solo la última consulta escribe
  // el estado y libera "cargando".
  const id = ++ultimaConsulta;
  cargando.value = true;
  try {
    const respuesta = await hornoApi.ultima();
    if (id === ultimaConsulta) {
      datos.value = respuesta;
      actualizado.value = new Date();
      error.value = '';
    }
  } catch (err) {
    if (id === ultimaConsulta) error.value = mensajeDeError(err, 'No se pudo consultar la última lectura');
  } finally {
    if (id === ultimaConsulta) cargando.value = false;
  }
}

// Con la pestaña oculta no consulta; al volver, actualiza de inmediato.
function programar() {
  clearInterval(temporizador);
  temporizador = null;
  if (document.visibilityState === 'visible') temporizador = setInterval(cargar, INTERVALO_MS);
}
function alCambiarVisibilidad() {
  if (document.visibilityState === 'visible') cargar();
  programar();
}

onMounted(() => {
  cargar();
  programar();
  document.addEventListener('visibilitychange', alCambiarVisibilidad);
});
onUnmounted(() => {
  clearInterval(temporizador);
  document.removeEventListener('visibilitychange', alCambiarVisibilidad);
});

const variablesDe = (grupo) => VARIABLES.filter((v) => v.grupo === grupo);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <EstadoRegistro class="flex-1" :minutos="datos.minutosSinDatos" :registrado-en="datos.lectura?.registrado_en ?? null" :sin-conexion="Boolean(error)" />
      <button type="button" class="sv-btn-secondary" :disabled="cargando" @click="cargar">
        <ArrowPathIcon :class="['h-4 w-4', cargando && 'animate-spin']" /> Actualizar
      </button>
    </div>

    <p v-if="error" class="rounded-sv bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{{ error }}</p>

    <section v-for="grupo in GRUPOS" :key="grupo.clave">
      <h2 class="mb-3 font-serif text-lg font-bold text-primary-800">{{ grupo.titulo }}</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard v-for="v in variablesDe(grupo.clave)" :key="v.campo" :variable="v" :valor="datos.lectura?.[v.campo] ?? null" />
      </div>
    </section>

    <p class="text-xs text-text3">
      Se actualiza cada 30 segundos.
      <span v-if="actualizado">Última consulta: {{ actualizado.toLocaleTimeString('es-CO') }}.</span>
    </p>
  </div>
</template>
