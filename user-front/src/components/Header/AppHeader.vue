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
              <v-avatar size="32" color="primary">
                <v-img
                  v-if="user?.profile_image"
                  :src="user.profile_image"
                  @error="handleImageError"
                />
                <v-icon v-else :color="palette.lightblue[100]"
                  >mdi-account</v-icon
                >
              </v-avatar>
            </v-btn>
          </template>

          <v-card min-width="250" elevation="4">
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="48" color="primary" class="mr-3">
                  <v-img
                    v-if="user?.profile_image"
                    :src="user.profile_image"
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
                to="/profile"
                prepend-icon="mdi-account-circle"
                title="My Profile"
                @click="userMenu = false"
              />
              <v-list-item
                to="/orders"
                prepend-icon="mdi-package-variant"
                title="My Orders"
                @click="userMenu = false"
              />
              <v-list-item
                to="/favorites"
                prepend-icon="mdi-heart"
                title="Favorites"
                @click="userMenu = false"
              />
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
      <v-card :style="{ backgroundColor: palette.midnightblue[900] }">
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
          {{ isRegisterMode ? "Create Account" : "Login" }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-text-field
              class="mb-3"
              v-if="isRegisterMode"
              v-model="formData.name"
              variant="outlined"
              :color="palette.steelblue[500]"
              :style="{ color: palette.lightblue[50] }"
              label="Name"
              :rules="[rules.required]"
            ></v-text-field>
            <v-text-field
              class="mb-3"
              v-model="formData.email"
              variant="outlined"
              :color="palette.steelblue[500]"
              :style="{ color: palette.lightblue[50] }"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
            ></v-text-field>
            <v-text-field
              class="mb-3"
              v-model="formData.password"
              variant="outlined"
              :color="palette.steelblue[500]"
              :style="{ color: palette.lightblue[50] }"
              label="Password"
              type="password"
              :rules="[rules.required, rules.password]"
            ></v-text-field>
            <v-text-field
              class="mb-3"
              v-if="isRegisterMode"
              v-model="formData.cpf"
              variant="outlined"
              :color="palette.steelblue[500]"
              :style="{ color: palette.lightblue[50] }"
              label="CPF"
              :rules="[rules.required, rules.cpf]"
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
            {{ isRegisterMode ? "Already have an account?" : "Create account" }}
          </v-btn>
          <v-btn
            variant="outlined"
            :color="palette.skyblue[500]"
            @click="handleSubmit"
            :loading="loading"
          >
            {{ isRegisterMode ? "Register" : "Login" }}
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

    const formData = ref({
      name: "",
      email: "",
      password: "",
      cpf: "",
    });
    const cartItemCount = computed(() => cartStore.itemCount);
    const goToCart = () => router.push("/cart");

    const rules = {
      required: (v) => !!v || "Field is required",
      email: (v) => /.+@.+\..+/.test(v) || "Invalid email",
      password: (v) =>
        v.length >= 3 || "Password must be at least 3 characters",
      cpf: (v) => /^\d{11}$/.test(v) || "Invalid CPF",
    };

    const handleSubmit = async () => {
      if (!form.value.validate()) return;

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
      } finally {
        loading.value = false;
      }
    };

    const toggleMode = () => {
      isRegisterMode.value = !isRegisterMode.value;
      form.value?.reset();
    };

    const logout = async () => {
      await authApi.logout();
      clientsStore.logout();
      userMenu.value = false;
    };

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
    };
  },
};
</script>

<style scoped>
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
</style>
