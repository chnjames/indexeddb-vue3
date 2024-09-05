import './assets/main.css'

import { createApp } from 'vue'
import store from './stores'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import { initDB } from './api/indexedDB'

const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})
app.use(store)
app.use(router)

initDB().then(r => {
    console.log('initDB', r)
})

app.mount('#app')
