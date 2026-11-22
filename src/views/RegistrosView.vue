<script setup>
import { ref, computed } from 'vue';
import { ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { hornoApi } from '@/api/hornoApi';
import { mensajeDeError } from '@/api/http';
import { descargarBlob, nombreDesdeCabecera, mensajeDeErrorBlob } from '@/utils/descarga';
import FiltroRango from '@/components/FiltroRango.vue';
import TablaLecturas from '@/components/TablaLecturas.vue';

const TAMANO = 50;
const rango = ref(null);
const pagina = ref(1);
const resultado = ref({ filas: [], total: 0 });
const cargando = ref(false);
const descargando = ref(false);
const error = ref('');
// Número de la última consulta lanzada: solo esa puede actualizar el estado.
let ultimaConsulta = 0;

const totalPaginas = computed(() => Math.max(1, Math.ceil(resultado.value.total / TAMANO)));
const desdeFila = computed(() => (resultado.value.total ? (pagina.value - 1) * TAMANO + 1 : 0));
const hastaFila = computed(() => Math.min(pagina.value * TAMANO, resultado.value.total));

async function cargar() {
  if (!rango.value) return;
  // Si el usuario cambia de rango o de página mientras una consulta sigue en curso, la
  // respuesta anterior puede llegar después. Solo la última consulta escribe el estado.
  const id = ++ultimaConsulta;
  cargando.value = true;
  error.value = '';
  try {
    const respuesta = await hornoApi.listar({ ...rango.value, pagina: pagina.value, tamano: TAMANO });
    if (id === ultimaConsulta) resultado.value = respuesta;
  } catch (err) {
    if (id === ultimaConsulta) error.value = mensajeDeError(err, 'No se pudieron cargar los registros');
  } finally {
    if (id === ultimaConsulta) cargando.value = false;
  }
}

function alCambiarRango({ desde, hasta }) {
  rango.value = { desde, hasta };
  pagina.value = 1;
  cargar();
}

function irA(n) {
  pagina.value = Math.min(Math.max(1, n), totalPaginas.value);
  cargar();
}

async function descargar() {
  descargando.value = true;
  error.value = '';
  try {
    const r = await hornoApi.excel(rango.value.desde, rango.value.hasta);
    descargarBlob(r.data, nombreDesdeCabecera(r.headers['content-disposition'], 'horno_incol.xlsx'));
  } catch (err) {
    error.value = await mensajeDeErrorBlob(err, 'No se pudo generar el Excel');
  } finally {
    descargando.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <FiltroRango inicial="24h" @cambio="alCambiarRango">
      <button type="button" class="sv-btn-primary" :disabled="descargando || !resultado.total" @click="descargar">
        <ArrowDownTrayIcon class="h-4 w-4" /> {{ descargando ? 'Generando…' : 'Descargar Excel' }}
      </button>
    </FiltroRango>

    <p v-if="error" class="rounded-sv bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{{ error }}</p>

    <div :class="['sv-card overflow-hidden transition-opacity', cargando && 'opacity-60']">
      <TablaLecturas :filas="resultado.filas" />
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-text2">
        <span>{{ desdeFila }}–{{ hastaFila }} de {{ resultado.total.toLocaleString('es-CO') }} lecturas</span>
        <div class="flex items-center gap-2">
          <button type="button" class="sv-btn-secondary px-2 py-1" :disabled="pagina <= 1 || cargando" aria-label="Página anterior" @click="irA(pagina - 1)">
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          <span>Página {{ pagina }} de {{ totalPaginas }}</span>
          <button type="button" class="sv-btn-secondary px-2 py-1" :disabled="pagina >= totalPaginas || cargando" aria-label="Página siguiente" @click="irA(pagina + 1)">
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
