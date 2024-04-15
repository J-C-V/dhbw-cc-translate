import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css';
import App from './App.vue'

const app = createApp(App);
app.use(PrimeVue);

app.mount('#app')
