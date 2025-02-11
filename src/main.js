/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Plugins
import { registerPlugins } from '@/plugins'

import * as Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'
import "bootstrap-icons/font/bootstrap-icons.css";

const app = Vue.createApp(App)

registerPlugins(app)

app.use(VueAxios, axios)

app.mount('#app')
