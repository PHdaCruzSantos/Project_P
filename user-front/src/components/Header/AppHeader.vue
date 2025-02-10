<template>
  <v-app-bar
    :elevation="2"
    dark
    rounded
    :style="{ backgroundColor: palette.midnightblue[100] }"
  >
    <v-app-bar-title>
      <v-avatar
        class="ml-3"
        :image="`${URL_BACKEND}/upload/images/seletto_logo.png`"
      />

      <v-divider
        :color="palette.dodgerblue[400]"
        :thickness="2"
        class="border-opacity-100"
        inset
        vertical
      ></v-divider>
      <v-btn
        :color="palette.brand.logo"
        icon="mdi-home"
        to="/"
        class="mr-2"
      ></v-btn>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <template v-slot:append>
      <v-btn
        v-if="isLoggedIn"
        icon
        @click="goToCart"
        :badge="cartItemCount > 0"
        :badge-content="cartItemCount.toString()"
        :badge-color="palette.brand.logo"
      >
        <v-icon :color="palette.brand.logo">mdi-cart</v-icon>
      </v-btn>

      <template v-if="isLoggedIn">
        <v-menu
          v-model="userMenu"
          :close-on-content-click="false"
          transition="slide-y-transition"
          offset="5"
        >
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="ml-2">
              <v-avatar
                v-if="user.profile_image"
                size="40"
                :image="`${URL_BACKEND}/upload/images/${user.profile_image}`"
                color="primary"
                class="rounded-circle"
              >
              </v-avatar>
              <v-icon v-else :color="palette.lightblue[100]"
                >mdi-account</v-icon
              >
            </v-btn>
          </template>

          <v-card min-width="250" elevation="4">
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="48" color="primary" class="mr-3">
                  <v-img
                    v-if="user?.profile_image"
                    :src="`${URL_BACKEND}/upload/images/${user.profile_image}`"
                    @error="handleImageError"
                  />
                  <v-icon v-else size="32" :color="palette.lightblue[100]">
                    mdi-account
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ user?.name }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ user?.email }}
                  </div>
                </div>
              </div>
            </v-card-text>

            <v-divider />

            <v-list density="compact" nav>
              <v-list-item
                prepend-icon="mdi-account-circle"
                title="Meu Perfil"
                @click="(userMenu = false), goToProfile('info')"
              />
              <!-- <v-list-item
                prepend-icon="mdi-package-variant"
                title="My Orders"
                @click="(userMenu = false), goToProfile('orders')"
              />
              <v-list-item
                prepend-icon="mdi-heart"
                title="Favorites"
                @click="(userMenu = false), goToProfile('favorites')"
              /> -->
              <v-divider />
              <v-list-item
                @click="logout"
                prepend-icon="mdi-logout"
                title="Logout"
                color="error"
              />
            </v-list>
          </v-card>
        </v-menu>
      </template>

      <template v-else>
        <v-btn
          :color="palette.lightblue[900]"
          variant="outlined"
          @click="showLoginModal = true"
          class="mx-2"
        >
          Login
        </v-btn>
      </template>
    </template>

    <!-- Login Modal -->
    <v-dialog v-model="showLoginModal" max-width="400">
      <v-card :style="{ backgroundColor: palette.slategray[900] }">
        <!-- Botão X no canto superior direito -->
        <v-icon
          :color="palette.teal[200]"
          class="close-btn"
          @click="showLoginModal = false"
        >
          mdi-close
        </v-icon>
        <v-card-title
          :style="{ color: palette.lightblue[100] }"
          class="text-center"
        >
          {{ isRegisterMode ? "Criar Conta" : "Login" }}
        </v-card-title>
        <v-card-text>
          <v-alert
            v-if="formError"
            type="error"
            variant="tonal"
            :color="palette.danger"
            closable
            class="mb-5"
            @click:close="formError = null"
          >
            {{ formError }}
          </v-alert>
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-text-field
              class="mb-3 custom-input"
              v-if="isRegisterMode"
              v-model="formData.name"
              variant="outlined"
              :color="palette.steelblue[500]"
              label="Nome Completo"
              :rules="[rules.required]"
              :error-messages="fieldErrors.name"
            ></v-text-field>
            <v-text-field
              class="mb-3 custom-input"
              v-model="formData.email"
              variant="outlined"
              :color="palette.steelblue[500]"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              :error-messages="fieldErrors.email"
            ></v-text-field>
            <v-text-field
              class="mb-3 custom-input"
              v-model="formData.password"
              variant="outlined"
              :color="palette.steelblue[500]"
              label="Senha"
              type="password"
              @keypress="handleSubmit"
              :rules="[rules.required, rules.password]"
              :error-messages="fieldErrors.password"
            ></v-text-field>
            <v-text-field
              class="mb-3 custom-input"
              v-if="isRegisterMode"
              v-model="formData.cpf"
              variant="outlined"
              :color="palette.steelblue[500]"
              label="CPF"
              :rules="[rules.required, rules.cpf]"
              :error-messages="fieldErrors.cpf"
              @input="formatCPF"
              maxlength="14"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :color="palette.skyblue[200]"
            variant="outlined"
            text
            @click="toggleMode"
          >
            {{ isRegisterMode ? "Já Possui uma Conta?" : "Criar Conta" }}
          </v-btn>
          <v-btn
            variant="outlined"
            :color="palette.skyblue[500]"
            @click="handleSubmit"
            :loading="loading"
          >
            {{ isRegisterMode ? "Registrar" : "Login" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { ref, computed } from "vue";
import { useClientStore } from "@/stores/clientsStore";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import authApi from "@/utils/api/authApi";
import palette from "../../../palette";

import {
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VSpacer,
  VIcon,
  VBadge,
  VAvatar,
  VMenu,
  VCard,
  VList,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
  VDivider,
  VDialog,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VForm,
  VTextField,
  VHover,
  VAlert,
} from "vuetify/components";

export default {
  name: "AppHeader",
  components: {
    VAppBar,
    VAppBarNavIcon,
    VAppBarTitle,
    VSpacer,
    VIcon,
    VBadge,
    VAvatar,
    VMenu,
    VCard,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VDivider,
    VDialog,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VForm,
    VTextField,
    VHover,
    VAlert,
  },
  setup() {
    const clientsStore = useClientStore();
    const cartStore = useCartStore();
    const router = useRouter();
    const showLoginModal = ref(false);
    const isRegisterMode = ref(false);
    const loading = ref(false);
    const userMenu = ref(false);
    const form = ref(null);
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const formError = ref(null);
    const fieldErrors = ref({
      name: null,
      email: null,
      password: null,
      cpf: null,
    });

    const clearErrors = () => {
      formError.value = null;
      fieldErrors.value = {
        name: null,
        email: null,
        password: null,
        cpf: null,
      };
    };
    const formData = ref({
      name: "",
      email: "",
      password: "",
      cpf: "",
    });
    const cartItemCount = computed(() => cartStore.itemCount);
    const goToCart = () => router.push("/cart");

    const formatCPF = (event) => {
      // Remove any non-digit character
      let value = event.target.value.replace(/\D/g, "");

      // Limit to 11 digits
      value = value.substring(0, 11);

      // Format CPF as user types (xxx.xxx.xxx-xx)
      let formattedValue = value;
      if (value.length > 3) {
        formattedValue = value.substring(0, 3) + "." + value.substring(3);
      }
      if (value.length > 6) {
        formattedValue =
          formattedValue.substring(0, 7) + "." + value.substring(6);
      }
      if (value.length > 9) {
        formattedValue =
          formattedValue.substring(0, 11) + "-" + value.substring(9);
      }

      // Update the input field with formatted value
      event.target.value = formattedValue;

      // Store only numbers in form data
      formData.value.cpf = value;
    };

    const rules = {
      required: (v) => !!v || "Field is required",
      email: (v) => /.+@.+\..+/.test(v) || "Invalid email",
      password: (v) =>
        v.length >= 3 || "Password must be at least 3 characters",
      cpf: (v) => /^\d{14}$/.test(v.replace(/\D/g, "")) || "Invalid CPF",
    };

    const handleSubmit = async () => {
      if (!form.value.validate()) return;

      clearErrors();
      loading.value = true;

      try {
        if (isRegisterMode.value) {
          await authApi.register(formData.value);
        }

        const { token, user } = await authApi.login({
          email: formData.value.email,
          password: formData.value.password,
        });

        clientsStore.setUser(user);
        clientsStore.setToken(token);
        cartStore.initCart(clientsStore.currentUser.id);
        showLoginModal.value = false;
      } catch (error) {
        console.error("Auth error:", error);

        // Handle specific error cases
        if (error.message === "Invalid credentials") {
          formError.value = "Invalid email or password";
        } else if (error.message === "User not found") {
          fieldErrors.value.email = "Email not found";
        } else if (error.message.includes("Password")) {
          fieldErrors.value.password = "Invalid password";
        } else if (error.message.includes("Email already exists")) {
          fieldErrors.value.email = "Email already registered";
        } else {
          formError.value = "An error occurred. Please try again.";
        }
      } finally {
        loading.value = false;
      }
    };

    const goToProfile = (tab) => {
      console.log(tab);
      router.push({
        name: "ClientProfileView",
        params: tab ? { tab } : {},
      });
    };

    const toggleMode = () => {
      isRegisterMode.value = !isRegisterMode.value;
      clearErrors();
      form.value?.reset();
    };

    const logout = async () => {
      await authApi.logout();
      clientsStore.logout();
      userMenu.value = false;
    };

    console.log(clientsStore.user);

    return {
      showLoginModal,
      isRegisterMode,
      loading,
      formData,
      rules,
      form,
      userMenu,
      handleSubmit,
      toggleMode,
      logout,
      palette,
      isLoggedIn: computed(() => clientsStore.isLoggedIn),
      user: computed(() => clientsStore.user),
      cartItemCount: computed(() => cartStore.itemCount),
      URL_BACKEND,
      goToCart,
      goToProfile,
      formError,
      fieldErrors,
      clearErrors,
      formatCPF,
    };
  },
};
</script>

<style scoped>
:deep(.v-alert) {
  margin-bottom: 16px;
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
.v-list-item {
  min-height: 44px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-primary), 0.05);
}

.v-card-text {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.v-menu {
  display: inline-block;
}

.v-list-item {
  min-height: 44px;
}

.v-list-item:hover {
  background-color: rgb(var(--v-theme-primary), 0.05);
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

/* Force white text for filled inputs */
:deep(.v-field__input) {
  color: white !important;
}

/* Override browser autofill styles */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0 30px transparent inset !important;
  transition: background-color 5000s ease-in-out 0s;
  background-color: transparent !important;
}

/* Firefox autofill override */
:deep(input:-moz-autofill),
:deep(input:-moz-autofill-preview) {
  filter: none !important;
  box-shadow: 0 0 0 30px transparent inset !important;
  -moz-text-fill-color: white !important;
}

/* Edge autofill override */
:deep(input:-ms-input-placeholder) {
  color: white !important;
}

/* Ensure input text remains white when focused */
:deep(.v-field.v-field--focused .v-field__input) {
  color: white !important;
}

/* Style for input when it has value */
:deep(.v-field--active) {
  color: white !important;
}

/* Override vuetify's default input styles */
:deep(.v-text-field input) {
  color: white !important;
}

:deep(.v-text-field .v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-text-field.v-input--is-focused .v-label) {
  color: white !important;
}

/* Remove input background color */
:deep(.v-field__input) {
  background-color: transparent !important;
}
</style>
