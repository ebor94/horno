import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { publica: true } },
  { path: '/', redirect: '/monitoreo' },
  { path: '/monitoreo', name: 'monitoreo', component: () => import('@/views/MonitoreoView.vue'), meta: { titulo: 'Monitoreo en vivo' } },
  { path: '/graficas', name: 'graficas', component: () => import('@/views/GraficasView.vue'), meta: { titulo: 'Gráficas' } },
  { path: '/registros', name: 'registros', component: () => import('@/views/RegistrosView.vue'), meta: { titulo: 'Registros' } },
  { path: '/:pathMatch(.*)*', redirect: '/monitoreo' },
];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });

router.beforeEach((to) => {
  const auth = useAuthStore();
  const vigente = auth.sesionVigente();
  if (!to.meta.publica && !vigente) {
    if (auth.token) auth.logout();
    return { name: 'login', query: to.fullPath === '/monitoreo' ? {} : { next: to.fullPath } };
  }
  if (to.name === 'login' && vigente) return { name: 'monitoreo' };
  return true;
});

export default router;
