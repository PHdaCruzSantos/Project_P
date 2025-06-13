<template>
  <v-app-bar
    :elevation="2"
    dark
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
        class="mr-5"
      >
        Meus Produtos
      </v-btn>
      <v-btn
        prepend-icon="mdi-sale"
        variant="outlined"
        v-if="isLoggedIn"
        to="/promos"
        :color="palette.dodgerblue[400]"
        class="mr-5"
      >
        Minhas Promoções
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

      <!-- Login Dialog -->
      <v-dialog v-model="showLoginDialog" max-width="400">
        <v-card :style="{ backgroundColor: palette.slategray[900] }">
          <v-icon
            :color="palette.teal[200]"
            class="close-btn"
            @click="showLoginDialog = false"
          >
            mdi-close
          </v-icon>

          <v-card-title :color="palette.lightblue[100]" class="text-center">
            <span class="headline" :style="{ color: palette.steelblue[200] }">
              Login
            </span>
          </v-card-title>

          <v-card-text>
            <v-alert
              v-if="formError"
              type="error"
              variant="tonal"
              closable
              :color="palette.danger[50]"
              class="mb-3"
              @click:close="formError = null"
            >
              {{ formError }}
            </v-alert>
            <v-alert
              v-if="formSuccess"
              type="success"
              variant="tonal"
              closable
              :color="palette.success[100]"
              class="mb-3"
              @click:close="formSuccess = null"
            >
              {{ formSuccess }}
            </v-alert>

            <v-form ref="Form" @submit.prevent="handleSubmit">
              <v-text-field
                v-if="isRegisterMode"
                v-model="formData.name"
                label="Nome"
                variant="outlined"
                :color="palette.steelblue[500]"
                class="mb-3 custom-input"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="formData.email"
                label="Email"
                variant="outlined"
                :color="palette.steelblue[500]"
                class="mb-3 custom-input"
                type="email"
                :rules="[rules.required, rules.email]"
                :error-messages="fieldErrors.email"
                required
              ></v-text-field>
              <v-text-field
                v-if="isRegisterMode"
                v-model="formData.cpf"
                label="CPF"
                variant="outlined"
                :color="palette.steelblue[500]"
                class="mb-3 custom-input"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-text-field
                v-model="formData.password"
                label="Senha"
                type="password"
                :color="palette.steelblue[500]"
                class="mb-3 custom-input"
                variant="outlined"
                :rules="[rules.required, rules.password]"
                :error-messages="fieldErrors.password"
                @keyup.enter="handleSubmit"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions class="px-6 pb-4">
            <v-btn
              :loading="isLoggingIn"
              :color="palette.dodgerblue[400]"
              variant="outlined"
              @click="toggleMode"
            >
              {{ isRegisterMode ? "Já Possui uma conta?" : "Criar Conta" }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :loading="isLoggingIn"
              :color="palette.dodgerblue[300]"
              variant="outlined"
              @click="handleSubmit"
            >
              {{ isRegisterMode ? "Registar-se" : "Login" }}
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
  VAlert,
  VForm,
} from "vuetify/components";
import palette from "../../../palette";
import { useRouter } from "vue-router";
import cartStore from "../../stores/cartStore";
import { useUserStore } from "../../stores/useStore";
import auth from "../../utils/api/auth";
import userApi from "@/utils/api/users";
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
    VAlert,
    VForm,
  },
  setup() {
    const userStore = useUserStore();
    const showLoginDialog = ref(false);
    const isRegisterMode = ref(false);
    const Form = ref(null);
    const isLoggingIn = ref(false);
    const router = useRouter();
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const formData = ref({
      name: "",
      email: "",
      password: "",
      cpf: "",
    });

    const formError = ref(null);
    const formSuccess = ref(null);
    const fieldErrors = ref({
      email: null,
      password: null,
    });

    const rules = {
      required: (v) => !!v || "Field is required",
      email: (v) => /.+@.+\..+/.test(v) || "Invalid email",
      password: (v) =>
        v.length >= 3 || "Password must be at least 3 characters",
      cpf: (v) => /^\d{11}$/.test(v) || "Invalid CPF",
    };

    const clearErrors = () => {
      formError.value = null;
      fieldErrors.value = {
        email: null,
        password: null,
      };
    };

    const handleSubmit = async () => {
      if (!Form.value?.validate()) return;

      clearErrors();
      isLoggingIn.value = true;

      try {
        if (isRegisterMode.value) {
          await userApi.createUser(formData.value);
          isRegisterMode.value = false;
          formSuccess.value = "Account created successfully. Please login.";
          formData.value = { email: formData.value.email, password: "" };
        }
        const user = await auth.loginUser({
          email: formData.value.email,
          password: formData.value.password,
        });
        userStore.setUser(user);
        showLoginDialog.value = false;
        router.push({ name: "Home" });
      } catch (error) {
        console.error("Failed to login user:", error);

        // Handle specific error cases
        if (error.message === "Invalid credentials") {
          formError.value = "Invalid email or password";
        } else if (error.message === "User not found") {
          fieldErrors.value.email = "Email not found";
        } else if (error.message.includes("Password")) {
          fieldErrors.value.password = "Invalid password";
        } else {
          formError.value = "An error occurred. Please try again.";
        }
      } finally {
        isLoggingIn.value = false;
      }
    };

    const handleLogout = async () => {
      try {
        await auth.logout();
        userStore.clearUser();
        router.push("/");
      } catch (error) {
        console.error("Failed to logout user:", error);
      }
    };

    const toggleMode = () => {
      isRegisterMode.value = !isRegisterMode.value;
      clearErrors();
      Form.value?.reset();
    };
    const cartItemCount = computed(() => cartStore.state.contCartITems);
    const isLoggedIn = computed(() => userStore.isLoggedIn);

    return {
      showLoginDialog,
      formData,
      isLoggingIn,
      handleSubmit,
      handleLogout,
      cartItemCount,
      isLoggedIn,
      palette,
      URL_BACKEND,
      Form,
      formError,
      fieldErrors,
      formSuccess,
      rules,
      clearErrors,
      toggleMode,
      isRegisterMode,
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

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  transition: transform 0.3s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}

:deep(.v-alert) {
  margin-bottom: 16px;
}

:deep(.custom-input) {
  color: white !important;
}

:deep(.custom-input .v-field__input) {
  color: white !important;
}

:deep(.custom-input .v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.custom-input .v-field__outline) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-field__input) {
  color: white !important;
}

:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0 30px transparent inset !important;
  transition: background-color 5000s ease-in-out 0s;
  background-color: transparent !important;
}

:deep(input:-moz-autofill),
:deep(input:-moz-autofill-preview) {
  filter: none !important;
  box-shadow: 0 0 0 30px transparent inset !important;
  -moz-text-fill-color: white !important;
}

:deep(input:-ms-input-placeholder) {
  color: white !important;
}

:deep(.v-field.v-field--focused .v-field__input) {
  color: white !important;
}

:deep(.v-field--active) {
  color: white !important;
}

:deep(.v-text-field input) {
  color: white !important;
}

:deep(.v-text-field .v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-text-field.v-input--is-focused .v-label) {
  color: white !important;
}

:deep(.v-field__input) {
  background-color: transparent !important;
}
</style>
