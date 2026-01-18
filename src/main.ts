import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(VueDnDKitPlugin);

app.mount('#app');
