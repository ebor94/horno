<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { mensajeDeError } from '@/api/http';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const logo = `${import.meta.env.BASE_URL}logo-olivos.webp`;

const usuario = ref('');
const password = ref('');
const cargando = ref(false);
const error = ref('');

async function entrar() {
  error.value = '';
  if (!usuario.value.trim() || !password.value) {
    error.value = 'Escribe tu usuario de red y tu contraseña';
    return;
  }
  cargando.value = true;
  try {
    await auth.login(usuario.value.trim(), password.value);
    // Solo rutas internas: un "next" que empiece con "//" apuntaría a otro host.
    const next = route.query.next;
    const destino = typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/monitoreo';
    router.replace(destino);
  } catch (err) {
    error.value = mensajeDeError(err, 'No se pudo iniciar sesión');
    password.value = '';
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-800 via-primary-700 to-primary-500 p-4">
    <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
      <div class="mb-6 text-center">
        <img :src="logo" alt="Los Olivos" class="mx-auto mb-4 h-16 w-auto" />
        <h1 class="font-serif text-2xl font-bold text-primary-800">Horno INCOL</h1>
        <p class="mt-1 text-sm text-text3">Monitoreo de temperaturas y emisiones</p>
      </div>

      <form class="space-y-4" @submit.prevent="entrar">
        <div>
          <label for="usuario" class="sv-label">Usuario de red</label>
          <input id="usuario" v-model="usuario" class="sv-input" autocomplete="username" autofocus placeholder="jperez" />
        </div>
        <div>
          <label for="password" class="sv-label">Contraseña</label>
          <input id="password" v-model="password" type="password" class="sv-input" autocomplete="current-password" />
          <p class="mt-1 text-xs text-text3">Usa el mismo usuario y clave de Windows.</p>
        </div>
        <p v-if="error" class="rounded-sv bg-red-50 px-3 py-2 text-sm text-danger" role="alert">{{ error }}</p>
        <button type="submit" class="sv-btn-primary w-full py-2.5" :disabled="cargando">
          {{ cargando ? 'Validando…' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>
