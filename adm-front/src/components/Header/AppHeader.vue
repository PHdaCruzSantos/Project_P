<template>
  <VAppBar app color="primary" dark>
    <VAppBarNavIcon @click="drawer = !drawer" />
    <VToolbarTitle>App</VToolbarTitle>
    <VSpacer />
    <VBtn text to="/">Home</VBtn>
    <VBtn text to="/about">About</VBtn>
    <VBtn text to="/cart">Cart</VBtn>
    <VSpacer />
    <VBtnGroup>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton @click="handleUSerSignIn" />
    </SignedIn>
    </VBtnGroup>

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
  VBtnGroup
} from "vuetify/components";
import { SignedIn, SignedOut, SignInButton, UserButton, useClerk } from 'vue-clerk'
import useDatabase from '../../utils/useDatabase';
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
    VBtnGroup
  },
  data() {
    return {
      drawer: false,
      user: useClerk()
    };
  },
  methods: {
      handleUSerSignIn() {
        if (this.user) {
          const userData = {
            email: this.user.email,
            name: this.user.fullName,
          }
          console.log("user", userData)
          useDatabase().saveOrUpdateUser(userData)

      };
    },
  },
};
</script>