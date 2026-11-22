<script setup>
import { ref, computed } from 'vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { hornoApi } from '@/api/hornoApi';
import { mensajeDeError } from '@/api/http';
import { VARIABLES, GRUPOS } from '@/config/variables';
import FiltroRango from '@/components/FiltroRango.vue';
import GraficaSerie from '@/components/GraficaSerie.vue';

const filtro = ref(null);
const serie = ref({ agrupacion: 'crudo', puntos: [] });
const cargando = ref(false);
const error = ref('');
// Número de la última consulta lanzada: solo esa puede actualizar el estado.
let ultimaConsulta = 0;

const DESCRIPCION = {
  crudo: 'Cada punto es una lectura.',
  hora: 'Promedio por hora; la franja muestra el mínimo y el máximo.',
  dia: 'Promedio por día; la franja muestra el mínimo y el máximo.',
};
const descripcion = computed(() => DESCRIPCION[serie.value.agrupacion]);

async function cargar({ desde, hasta }) {
  // Si el usuario cambia el rango mientras una consulta sigue en curso, la respuesta
  // anterior puede llegar después. Solo la última consulta escribe el estado, para
  // que una respuesta vieja no pise la nueva ni apague "cargando" antes de tiempo.
  const id = ++ultimaConsulta;
  cargando.value = true;
  error.value = '';
  try {
    const respuesta = await hornoApi.serie(desde, hasta);
    if (id === ultimaConsulta) serie.value = respuesta;
  } catch (err) {
    if (id === ultimaConsulta) error.value = mensajeDeError(err, 'No se pudo cargar la serie');
  } finally {
    if (id === ultimaConsulta) cargando.value = false;
  }
}

const variablesDe = (grupo) => VARIABLES.filter((v) => v.grupo === grupo);
</script>

<template>
  <div class="space-y-6">
    <FiltroRango ref="filtro" inicial="24h" @cambio="cargar">
      <button type="button" class="sv-btn-secondary" :disabled="cargando" @click="filtro?.refrescar()">
        <ArrowPathIcon :class="['h-4 w-4', cargando && 'animate-spin']" /> Actualizar
      </button>
    </FiltroRango>

    <p v-if="error" class="rounded-sv bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{{ error }}</p>
    <p class="text-sm text-text3">{{ descripcion }} {{ serie.puntos.length }} puntos.</p>

    <div :class="['grid grid-cols-1 gap-6 transition-opacity', cargando && 'opacity-60']">
      <GraficaSerie
        v-for="g in GRUPOS" :key="g.clave"
        :titulo="g.titulo" :puntos="serie.puntos" :agrupacion="serie.agrupacion" :variables="variablesDe(g.clave)"
      />
    </div>
  </div>
</template>
