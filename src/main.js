import './assets/main.css'

import { createApp } from 'vue'
import store from './stores'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import { initDB } from './api/indexedDB'

const app = createApp(App)

app.use(ElementPlus)
app.use(store)
app.use(router)

initDB()

app.mount('#app')
