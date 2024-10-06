<template>
  <VAppBar app color="primary" dark>
    <VAppBarNavIcon @click="drawer = !drawer" />
    <VToolbarTitle>App</VToolbarTitle>
    <VSpacer />
    <VBtn text to="/">Home</VBtn>
    <VBtn text to="/about">About</VBtn>
    <VBtn text to="/cart">Cart</VBtn>
    <VSpacer />
    <VBtn text to="/">Login</VBtn>
    <VBtn text to="/">Register</VBtn>
  </VAppBar>
</template>

<script>
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VToolbarTitle,
  VSpacer,
  VBtn,
} from "vuetify/components";

export default {
  name: "AppHeader",
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VToolbarTitle,
    VSpacer,
    VBtn,
  },
};
</script>