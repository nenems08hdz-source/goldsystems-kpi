import { ref } from 'vue'

export function useLoading() {
  const isLoading = ref(false)

  async function cargarConDelay(peticion, delay = 500) {
    const timeout = setTimeout(() => {
      isLoading.value = true
    }, delay)

    try {
      return await peticion()
    } finally {
      clearTimeout(timeout)
      isLoading.value = false
    }
  }

  return { isLoading, cargarConDelay }
}
