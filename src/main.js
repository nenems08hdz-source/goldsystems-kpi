import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './main.css'

// 1. Importa tu clase de notificaciones
import Notify from './utils/Notify' 
// 2. Importa el CSS de toastr (necesario para que se vea bien)
import 'toastr/build/toastr.min.css'

const app = createApp(App)

// 3. Instancia la clase y asígnala a la configuración global de Vue
app.config.globalProperties.$notify = new Notify()

app.use(createPinia())
app.use(router)

app.mount('#app')
