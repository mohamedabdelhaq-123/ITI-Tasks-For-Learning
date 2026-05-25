import { createApp } from 'vue' // app factory
import { createPinia } from 'pinia'
import './style.css' // glob styling
import App from './App.vue' // root component
import router from './router'

const app = createApp(App) /// create instance of app

// use plugins (middleware) for app
app.use(createPinia()) // pinia for storage and state management
app.use(router)

app.mount('#app') // mount app to DOM element with id app (in index.html )


// 1. entry point file for vue proj