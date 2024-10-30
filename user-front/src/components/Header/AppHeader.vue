<template>
  <v-app-bar :elevation="2" dark rounded :style="{ backgroundColor: palette.steelblue[500] }">
  <template v-slot:prepend>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
  </template>

  <v-app-bar-title><v-btn icon="mdi-home" to="/"></v-btn></v-app-bar-title>

  <template v-slot:append>
    <v-badge :content="contItems">
      <v-btn icon="mdi-cart" to="/cart"></v-btn>
    </v-badge>
    
    <v-btn >
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
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
} from "vuetify/components";
import { SignedIn, SignedOut, SignInButton, UserButton, useClerk } from 'vue-clerk'
import palette from "../../../palette";
import cartStore from '../../store/cartStore';
export default {
  name: "AppHeader",
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VToolbarTitle,
    VSpacer,
    VBtn,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    VBtnGroup,
    VBadge,
  },
  data() {
    return {
      drawer: false,
      user: useClerk(),
      palette,
      contItems: cartStore.state.contCartITems,
      };
    },
    watch: {
      '$store.state.contCartITems': function() {
        this.contItems = cartStore.state.contCartITems;
      }
    },

};

</script>