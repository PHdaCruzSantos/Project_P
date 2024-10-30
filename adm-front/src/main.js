import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./vuetify";
import router from "./router";

import { clerkPlugin } from "vue-clerk";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}


const app = createApp(App);
app.use(router);
app.use(clerkPlugin, {
    publishableKey: PUBLISHABLE_KEY
});
app.use(vuetify);
app.mount("#app");
