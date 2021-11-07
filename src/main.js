import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.js'

import './style/index.scss'
import Message from '@/utils/resetMessage'
window.Message = Message

const app = createApp(App)
app.use(router)

app.mount('#app')
