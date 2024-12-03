import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./vuetify";
import router from "./router";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);

app.use(vuetify);
app.mount("#app");
