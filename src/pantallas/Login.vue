<script setup>
/**
 * Login.vue
 *
 * Pantalla de inicio de sesión.
 * Llama a la API con las credenciales del usuario, guarda el token
 * y rol en el store global (authStore) y redirige al panel principal.
 *
 * @author Mariel Medina <nenem08hdz@gmail.com>
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'

const router = useRouter()
const auth   = useAuthStore()

// Campos del formulario vinculados con v-model
const email    = ref('')
const password = ref('')

// Mensaje de error que se muestra si las credenciales son incorrectas
const error = ref('')

// Controla si la contraseña es visible o no
const verPassword = ref(false)

/**
 * Envía las credenciales a la API.
 * Si son correctas guarda token, usuario y rol en el store
 * y redirige al panel principal.
 * Endpoint: POST /api/login
 */
const handleLogin = async () => {
  error.value = ''

  try {
    const res = await api.post('/login', {
      email:    email.value,
      password: password.value
    })

    auth.setAuth(res.data.token, res.data.user, res.data.role, res.data.permisos ?? [])
    router.push('/')
  } catch (err) {
    error.value = 'Credenciales incorrectas'
  }
}
</script>

<template>
  <div class="login-page">
    
    <div class="absolute top-8 left-8 flex items-center gap-3 z-50">
      <div class="w-10 h-10 bg-[#3f2a52] text-white rounded-xl flex items-center justify-center text-xl shadow-md border border-white/10">
        <i class="fi fi-sr-speedometer-kpi"></i>
      </div>
      
      <div class="flex flex-col text-left">
        <span class="text-white font-black tracking-tight text-lg leading-none">
          KPI360 <span class="text-gray-400 font-medium text-xs block mt-0.5 tracking-wider uppercase">Enterprise</span>
        </span>
      </div>
    </div>

    <div class="main-container">
      <div class="welcome-side">
        <h1>Bienvenido</h1>
      </div>

      <div class="form-side">
        <h2 class="form-title">Iniciar Sesión</h2>
        
        <div class="form-content-wrapper">
          <form @submit.prevent="handleLogin">
            <div class="input-group">
              <i class="fi fi-sr-envelope"></i>
              <input v-model="email"    type="email"    placeholder="Email"    required />
            </div>
            
            <div class="input-group">
              <i class="fi fi-sr-lock"></i>
              <input v-model="password" :type="verPassword ? 'text' : 'password'" placeholder="Password" required />
              <i @click="verPassword = !verPassword" :class="verPassword ? 'fi fi-sr-eye-crossed' : 'fi fi-sr-eye'" style="cursor:pointer; opacity:0.6;"></i>
            </div>

            <p v-if="error" style="color: #ff6b6b; font-size: 0.85rem; margin-bottom: 10px;">{{ error }}</p>
            <button type="submit" class="glow-btn">Entrar</button>
          </form>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-8 text-[11px] text-white font-medium tracking-wider uppercase opacity-60 z-50">
      v1.0.0
    </div>

  </div>
</template>

<style scoped>
/* Reseteo global para limpiar los márgenes del navegador de raíz */
:global(body, html) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #08040e;
  overflow-x: hidden; /* Evita cualquier desborde horizontal accidental */
}

.login-page {
  background-color: #08040e;
  min-height: 100vh;
  width: 100%; /* Cambiado a 100% para acoplarse de forma limpia sin generar barras de scroll */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  position: relative; /* Clave para que el logo y la versión absolutos se alineen con la pantalla */
  padding: 24px;
}

/* Contenedor Principal con Difuminado */
.main-container {
  display: flex;
  width: 900px;
  height: 550px;
  background-color: #120e1a;
  border: 1px solid #7429ec;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(116, 41, 236, 0.3);
  z-index: 10; /* Asegura que la tarjeta no se superponga de forma extraña */
}

/* Panel Izquierdo con Diagonal */
.welcome-side {
  width: 55%; 
  background: #7429ec;
  clip-path: polygon(0 0, 100% 0, 65% 100%, 0% 100%);
  display: flex;
  justify-content: center; 
  align-items: center;    
  padding: 40px;
  font-size: 30px;
  font-weight: bold;
}

/* Panel Derecho */
.form-side {
  width: 45%; 
  display: flex;
  flex-direction: column;
  padding: 60px;
  position: relative;
}

.form-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.form-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Campos de entrada */
.input-group {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #7429ec;
  margin-bottom: 30px;
  padding-bottom: 10px;
  gap: 15px;
}

.input-group input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  width: 100%;
  font-size: 1rem;
}

.input-group input:-webkit-autofill,
.input-group input:-webkit-autofill:hover,
.input-group input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #120e1a inset;
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

/* Botón estilizado */
.glow-btn {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: transparent;
  border: 2px solid #7429ec;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: 0.3s;
}

.glow-btn:hover {
  background: #7429ec;
  box-shadow: 0 0 15px #7429ec;
}
</style>