<template>
  <v-app-bar
    :elevation="2"
    dark
    rounded
    :style="{ backgroundColor: palette.steelblue[500] }"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title><v-btn icon="mdi-home" to="/"></v-btn></v-app-bar-title>
      <v-spacer></v-spacer>
      <h2 v-if="user.isLoggedIn">OI, {{ user.userName }}</h2>
    </template>

    <template v-slot:append>
      <v-badge :content="0" color="secondary">
        <v-btn icon to="/">
          <v-icon icon="mdi-bell"></v-icon>
        </v-btn>
      </v-badge>
      <login-dialog v-if="!user.isLoggedIn" />
      <v-btn v-else icon to="/">
        <v-icon @click="handleClearUser" icon="mdi-logout"></v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VToolbarTitle,
  VSpacer,
  VBtn,
  VBadge,
  VBtnGroup,
  VIcon,
  VDialog,
  VCard,
  VCardText,
  VCardActions,
  VToolbar,
  VTextField,
  VRow,
  VCol,
  VSelect,
  VAutocomplete,
  VDivider,
} from "vuetify/components";
import palette from "../../../palette";
import cartStore from "../../stores/cartStore";
import LoginDialog from "../LoginBtn/Login.vue";
import { useUserStore } from "../../stores/useStore";

export default {
  name: "AppHeader",
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VToolbarTitle,
    VSpacer,
    VBtn,
    VBtnGroup,
    VBadge,
    VIcon,
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VToolbar,
    VTextField,
    VRow,
    VCol,
    VSelect,
    VAutocomplete,
    VDivider,
    LoginDialog,
  },
  data() {
    return {
      drawer: false,
      palette,
      contItems: cartStore.state.contCartITems,
      user: useUserStore(),
    };
  },
  methods: {
    handleClearUser() {
      this.user.clearUser();
    },
  },
  watch: {
    "$store.state.contCartITems": function () {
      this.contItems = cartStore.state.contCartITems;
    },
  },
};
</script>
