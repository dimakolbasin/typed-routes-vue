import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import router from '~/router.ts'
import router from '~/router-required-params.ts'

createApp(App).use(router).mount('#app')
