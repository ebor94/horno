<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js';
import { etiquetaCompleta } from '@/config/variables';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const props = defineProps({
  titulo: { type: String, required: true },
  puntos: { type: Array, default: () => [] },
  agrupacion: { type: String, default: 'crudo' },
  variables: { type: Array, required: true },
});

const FORMATO_EJE = { crudo: 'DD/MM HH:mm', hora: 'DD/MM HH:00', dia: 'DD/MM/YYYY' };
const conAlfa = (hex, alfa) => `${hex}${Math.round(alfa * 255).toString(16).padStart(2, '0')}`;

const datos = computed(() => {
  const labels = props.puntos.map((p) => dayjs(p.t).format(FORMATO_EJE[props.agrupacion]));
  const datasets = [];
  for (const v of props.variables) {
    const eje = v.eje || 'y';
    const serie = (clave) => props.puntos.map((p) => p[v.campo]?.[clave] ?? null);
    if (props.agrupacion !== 'crudo') {
      // Banda mín–máx: el dataset "máx" se rellena hasta el siguiente ("mín").
      datasets.push({ label: `${etiquetaCompleta(v)} máx`, data: serie('max'), borderColor: 'transparent', backgroundColor: conAlfa(v.color, 0.15), pointRadius: 0, fill: '+1', yAxisID: eje, banda: true });
      datasets.push({ label: `${etiquetaCompleta(v)} mín`, data: serie('min'), borderColor: 'transparent', pointRadius: 0, fill: false, yAxisID: eje, banda: true });
    }
    datasets.push({
      label: etiquetaCompleta(v), data: serie('prom'), borderColor: v.color, backgroundColor: v.color,
      borderWidth: 2, pointRadius: props.puntos.length > 150 ? 0 : 2, tension: 0.25, spanGaps: true, fill: false, yAxisID: eje,
    });
  }
  return { labels, datasets };
});

const opciones = computed(() => {
  const usaY1 = props.variables.some((v) => v.eje === 'y1');
  const unidades = (eje) => [...new Set(props.variables.filter((v) => (v.eje || 'y') === eje && v.unidad).map((v) => v.unidad))].join(' / ');
  const scales = {
    x: { ticks: { maxTicksLimit: 10, maxRotation: 0 }, grid: { display: false } },
    y: { title: { display: Boolean(unidades('y')), text: unidades('y') } },
  };
  if (usaY1) scales.y1 = { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: unidades('y1') } };
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, filter: (item, data) => !data.datasets[item.datasetIndex].banda } },
      tooltip: { filter: (ctx) => !ctx.dataset.banda },
    },
    scales,
  };
});
</script>

<template>
  <div class="sv-card p-5">
    <h3 class="mb-3 font-serif text-base font-bold text-primary-800">{{ titulo }}</h3>
    <div v-if="puntos.length" class="h-72">
      <Line :data="datos" :options="opciones" />
    </div>
    <p v-else class="flex h-72 items-center justify-center text-sm text-text3">No hay lecturas en este rango</p>
  </div>
</template>
