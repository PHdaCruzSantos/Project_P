<template>
  <VMain>
    <!-- Informações do Usuário e Lista de Itens -->
    <UserInfo v-if="userStore.isLoggedIn" :user="userStore.user.user" />
    <div v-else class="guest-view">
      <!-- Banner Principal -->
      <v-container class="welcome-banner">
        <v-row>
          <v-col cols="12" class="text-center">
            <h1 class="display-1">
              Welcome to <span class="seletto-brand">Seletto</span>
            </h1>
            <p class="subtitle-1">
              The ultimate marketplace for discovering amazing products and
              deals!
            </p>
            <v-btn
              class="mt-4"
              color="primary"
              large
              @click="navigateToRegister"
            >
              Create Your Account Now
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- Benefícios da Plataforma -->
      <v-container class="benefits-section">
        <v-row>
          <!-- Taxas Baixas -->
          <v-col cols="12" md="4" class="text-center">
            <v-img
              :src="`${URL_BACKEND}/upload/images/pequenataxa.png`"
              class="benefit-img"
              alt="Low Fees"
            />
            <h3 class="text-h6">Low Fees</h3>
            <p>
              Enjoy one of the lowest fees in the market, allowing you to
              maximize your profits.
            </p>
          </v-col>

          <!-- Fácil de Usar -->
          <v-col cols="12" md="4" class="text-center">
            <v-img
              src="/path/to/facil-uso-image.png"
              class="benefit-img"
              alt="Easy to Use"
            />
            <h3 class="text-h6">User-Friendly</h3>
            <p>
              Manage your store effortlessly with our intuitive and modern
              interface.
            </p>
          </v-col>

          <!-- Crescimento Parceiro -->
          <v-col cols="12" md="4" class="text-center">
            <v-img
              src="/path/to/crescimento-parceiro-image.png"
              class="benefit-img"
              alt="Partner Growth"
            />
            <h3 class="text-h6">Partner Growth</h3>
            <p>
              Join a thriving community and watch your business grow with our
              tools and support.
            </p>
          </v-col>
        </v-row>
      </v-container>

      <!-- Call to Action -->
      <v-container class="cta-container glass-card">
        <v-row>
          <v-col cols="12" md="6">
            <h3 class="text-h5">Already have an account?</h3>
            <p>Login now to start shopping and enjoy personalized offers.</p>
            <v-btn color="primary" @click="navigateToLogin" large>Login</v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-img
              :src="`${URL_BACKEND}/upload/images/sejaparceiro.png`"
              class="cta-img"
              alt="Join Seletto"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </VMain>
</template>

<script>
import {
  VMain,
  VContainer,
  VRow,
  VCol,
  VCard,
  VImg,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VBtn,
} from "vuetify/components";
import UserInfo from "../components/UserInfo/UserInfo.vue";
import { useUserStore } from "../stores/useStore";
import { useRouter } from "vue-router";

export default {
  name: "HomeView",
  components: {
    VMain,
    VContainer,
    VRow,
    VCol,
    VCard,
    VImg,
    VCardTitle,
    VCardSubtitle,
    VCardText,
    VCardActions,
    VBtn,
    UserInfo,
  },
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const navigateToLogin = () => {
      router.push("/login");
    };

    const navigateToRegister = () => {
      router.push("/register");
    };

    return {
      userStore,
      URL_BACKEND,
      navigateToLogin,
      navigateToRegister,
    };
  },
};
</script>

<style scoped>
.guest-view {
  text-align: center;
  background: linear-gradient(120deg, #f9f9f9 0%, #e6f7ff 100%);
  padding-bottom: 40px;
}

.welcome-banner {
  background: linear-gradient(
    90deg,
    rgba(33, 150, 243, 0.8),
    rgba(0, 188, 212, 0.8)
  );
  color: white;
  padding: 40px 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.seletto-brand {
  font-weight: bold;
  color: #ff4081;
}

.benefits-section {
  margin-top: 40px;
}

.benefit-img {
  border-radius: 8px;
  margin-bottom: 16px;
  max-width: 80%;
  height: auto;
}

.cta-container {
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(15px);
}

.glass-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cta-img {
  border-radius: 12px;
  max-width: 100%;
}
</style>
