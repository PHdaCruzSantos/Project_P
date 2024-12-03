<template>
  <v-app-bar
    :elevation="2"
    dark
    rounded
    :style="{ backgroundColor: palette.midnightblue[900] }"
  >
    <template v-slot:prepend>
      <v-avatar
        class="mx-3"
        :image="`${URL_BACKEND}/upload/images/seletto_logo.png`"
      />
      <v-divider
        :color="palette.dodgerblue[400]"
        :thickness="2"
        class="border-opacity-100"
        inset
        vertical
      ></v-divider>
      <v-app-bar-title class="mx-3">
        <v-btn icon to="/">
          <v-icon :color="palette.dodgerblue[400]"> mdi-home </v-icon>
        </v-btn>
      </v-app-bar-title>
      <v-btn
        prepend-icon="mdi-shopping"
        variant="outlined"
        v-if="isLoggedIn"
        to="/products"
        :color="palette.dodgerblue[400]"
      >
        Produtos
      </v-btn>
    </template>

    <template v-slot:append>
      <v-btn
        class="mr-3"
        :color="palette.dodgerblue[400]"
        v-if="!isLoggedIn"
        variant="outlined"
        @click="showLoginDialog = true"
        prepend-icon="mdi-login"
      >
        Login
      </v-btn>
      <v-btn
        class="mr-3"
        prepend-icon="mdi-logout"
        :color="palette.dodgerblue[400]"
        v-else
        @click="handleLogout"
      >
        Logout
      </v-btn>
      <v-dialog v-model="showLoginDialog" max-width="500px">
        <v-card :style="{ backgroundColor: palette.steelblue[900] }">
          <!-- Botão X no canto superior direito -->
          <v-icon
            :color="palette.teal[200]"
            class="close-btn"
            @click="showLoginDialog = false"
          >
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
              :color="palette.dodgerblue[300]"
              variant="outlined"
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
  VAvatar,
  VDivider,
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
    VAvatar,
    VDivider,
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
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

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
      URL_BACKEND,
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
