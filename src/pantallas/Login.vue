<script setup>
const handleLogin = () => {
  alert("Iniciando sesión...");
};
</script>

<template>
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

  <div class="login-page">
    <div class="main-container">
      <div class="welcome-side">
        <h1>Bienvenido</h1>
      </div>

      <div class="form-side">
        <h2 class="form-title">Iniciar Sesion</h2>
        
        <div class="form-content-wrapper">
          <form @submit.prevent="handleLogin">
            <div class="input-group">
              <i class="fi fi-sr-envelope"></i>
              <input type="email" placeholder="Email" required />
            </div>
            
            <div class="input-group">
              <i class="fi fi-sr-lock"></i>
              <input type="password" placeholder="Password" required />
            </div>

            <button 
            @click="$router.push('/')"
            type="submit" class="glow-btn"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
   <div class="absolute bottom-8 left-8 text-[11px] text-white font-medium tracking-wider uppercase opacity-60 z-50">
  v1.0.0
</div>
</template>

<style scoped>
/* Configuración Global */
.login-page {
  background-color: #08040e;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
}

/* Panel Izquierdo con Diagonal */
.welcome-side {
  width: 55%; 
  background: #7429ec;
  /* 0 0: arriba-izq | 100% 0: arriba-der | 90% 100%: punto inferior más a la derecha | 0% 100%: abajo-izq */
  clip-path: polygon(0 0, 100% 0, 65% 100%, 0% 100%);
  display: flex;
  justify-content: center; 
  align-items: center;    
  padding: 40px;
  font-size: 30px;
  font-weight: bold;
}

/* Panel Derecho: Estructura para fijar el título arriba */
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