<template>
  <VApp id="App">
    <AppHeader />
    <VMain>
      <router-view />
    </VMain>
  </VApp>
</template>

<script>
import AppHeader from "./components/Header/AppHeader.vue";
import { VApp, VMain } from "vuetify/components";

export default {
  name: "App",
  components: {
    AppHeader,
    VApp,
    VMain,
  },
};
</script>

<style>
/* Definindo a transição para views */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
