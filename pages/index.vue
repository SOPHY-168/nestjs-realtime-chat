<script setup lang="ts">
type HealthResponse = {
  status: string
  services: {
    database: string
    redis: string
  }
  timestamp: string
}

const config = useRuntimeConfig()

const health = ref<HealthResponse | null>(null)
const loading = ref(false)
const error = ref('')

async function checkHealth() {
  loading.value = true
  error.value = ''

  try {
    health.value = await $fetch<HealthResponse>(
      `${config.public.apiBase}/health`
    )
  } catch {
    health.value = null
    error.value = 'Cannot connect to backend'
  } finally {
    loading.value = false
  }
}

onMounted(checkHealth)
</script>

<template>
  <main class="page">
    <section class="card">
      <h1>NestJS Real-Time Chat</h1>

      <p>Nuxt 4 + NestJS + PostgreSQL + Redis</p>

      <div class="status">
        <span>Backend</span>
        <strong>
          {{ health?.status === 'ok' ? 'Connected' : 'Disconnected' }}
        </strong>
      </div>

      <div class="status">
        <span>PostgreSQL</span>
        <strong>{{ health?.services.database ?? 'Unknown' }}</strong>
      </div>

      <div class="status">
        <span>Redis</span>
        <strong>{{ health?.services.redis ?? 'Unknown' }}</strong>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button :disabled="loading" @click="checkHealth">
        {{ loading ? 'Checking...' : 'Check Connection' }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0f172a;
  color: white;
  font-family: Arial, sans-serif;
}

.card {
  width: min(400px, 90%);
  padding: 32px;
  border-radius: 16px;
  background: #1e293b;
}

h1 {
  margin-top: 0;
  font-size: 26px;
}

.status {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
}

.status strong {
  color: #4ade80;
}

button {
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: #f87171;
}
</style>