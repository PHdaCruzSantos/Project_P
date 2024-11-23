<template>
  <v-app-bar
    :elevation="2"
    dark
    rounded
    :style="{ backgroundColor: palette.steelblue[500] }"
  >
    <template v-slot:prepend>
      <v-app-bar-title><v-btn icon="mdi-home" to="/"></v-btn></v-app-bar-title>

      <v-btn to="/stores">Stores</v-btn>
      <v-btn v-if="isLoggedIn" to="/products">Products</v-btn>
    </template>

    <template v-slot:append>
      <v-btn v-if="!isLoggedIn" @click="showLoginDialog = true"> Login </v-btn>
      <v-btn v-else @click="handleLogout"> Logout </v-btn>
      <v-dialog v-model="showLoginDialog" max-width="500px">
        <v-card :style="{ backgroundColor: palette.steelblue[900] }">
          <!-- Botão X no canto superior direito -->
          <v-icon class="close-btn" @click="showLoginDialog = false">
            mdi-close
          </v-icon>

          <!-- Título -->
          <v-card-title :color="palette.lightblue[100]" class="text-center">
            <span class="headline" :style="{ color: palette.steelblue[200] }">
              Login
            </span>
          </v-card-title>

          <!-- Formulário -->
          <v-card-text>
            <v-form ref="loginForm">
              <v-text-field
                v-model="loginData.email"
                label="Email"
                variant="outlined"
                :color="palette.steelblue[500]"
                :style="{ color: palette.lightblue[50] }"
                required
              ></v-text-field>
              <v-text-field
                v-model="loginData.password"
                label="Password"
                type="password"
                :color="palette.steelblue[500]"
                :style="{ color: palette.lightblue[50] }"
                variant="outlined"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <!-- Botões de ação -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="isLoggingIn"
              color="blue darken-1"
              text
              @click="handleLogin"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-app-bar>
</template>

<script>
import {
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VBtn,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VTextField,
  VSpacer,
  VIcon,
} from "vuetify/components";
import palette from "../../../palette";
import { useRouter } from "vue-router";
import cartStore from "../../stores/cartStore";
import { useUserStore } from "../../stores/useStore";
import auth from "../../utils/api/auth";
import { ref, computed } from "vue";

export default {
  name: "AppHeader",
  components: {
    VAppBar,
    VAppBarNavIcon,
    VAppBarTitle,
    VBtn,
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VTextField,
    VSpacer,
    VIcon,
  },
  setup() {
    const userStore = useUserStore();
    const showLoginDialog = ref(false);
    const loginData = ref({
      email: "",
      password: "",
    });
    const isLoggingIn = ref(false);
    const router = useRouter();

    const handleLogin = async () => {
      isLoggingIn.value = true;
      try {
        const user = await auth.loginUser(loginData.value);
        userStore.setUser(user);
        showLoginDialog.value = false;
        router.push({ name: "Home" });
      } catch (error) {
        console.error("Failed to login user:", error);
      } finally {
        isLoggingIn.value = false;
        router.push("/");
      }
    };

    const handleLogout = async () => {
      try {
        await auth.logout();
        userStore.clearUser();
      } catch (error) {
        console.error("Failed to logout user:", error);
      }
    };

    // const checkAuth = async () => {
    //   try {
    //     const response = await auth.checkAuth();
    //     userStore.setUser(response.user);
    //   } catch (error) {
    //     console.error("Failed to check auth:", error);
    //   }
    // };

    // onMounted(checkAuth);

    const cartItemCount = computed(() => cartStore.state.contCartITems);
    const isLoggedIn = computed(() => userStore.isLoggedIn);

    return {
      showLoginDialog,
      loginData,
      isLoggingIn,
      handleLogin,
      handleLogout,
      cartItemCount,
      isLoggedIn,
      palette,
    };
  },
};
</script>

<style scoped>
.v-app-bar {
  background-color: var(--v-theme-steelblue);
}

.v-btn {
  color: var(--v-theme-lighten5);
}

.v-icon {
  color: var(--v-theme-lighten5);
}

.v-toolbar-title {
  font-weight: bold;
  font-size: 1.5rem;
}

/* Botão X no canto superior direito */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  transition: transform 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}
</style>
