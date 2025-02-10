<template>
  <v-main class="animated-background overflow-hidden my-0">
    <!-- ... existing background shapes code ... -->
    <div v-if="userStore.isLoggedIn">
      <UserInfo />
    </div>
    <div v-else class="guest-view">
      <!-- Hero Section -->
      <v-container class="welcome-banner">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="text-h2 font-weight-bold mb-6">
              Bem-vindo à <span class="seletto-brand">Seletto</span>
            </h1>
            <p class="text-h5 font-weight-regular mb-8">
              Junte-se ao nosso marketplace exclusivo e transforme sua jornada
              empresarial
            </p>
            <v-btn
              x-large
              :color="palette.brand.main"
              elevation="2"
              class="text-h6 px-4 py-2"
              @click="navigateToRegister"
            >
              Comece Sua História de Sucesso
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- Benefits Section -->
      <v-container class="benefits-section">
        <v-row class="text-center mb-12">
          <v-col cols="12">
            <h2 class="text-h3 font-weight-bold mb-3">
              Por que escolher a Seletto?
            </h2>
            <p class="text-h6 text-medium-emphasis">
              Descubra as vantagens que nos tornam a escolha preferida dos
              vendedores
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="4">
            <v-hover v-slot="{ hover }">
              <v-card
                class="benefit-card fill-height"
                :elevation="hover ? 8 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-img
                  :src="`${URL_BACKEND}/upload/images/LowFees.png`"
                  height="200"
                  class="benefit-img"
                  cover
                ></v-img>
                <v-card-title class="text-h5 font-weight-bold">
                  Taxas Competitivas
                </v-card-title>
                <v-card-text class="text-body-1">
                  <p class="mb-4">
                    Taxas de comissão líderes de mercado começando em apenas 5%
                  </p>
                  <p>
                    Mantenha mais dos seus ganhos enquanto cresce seu negócio
                    com nossa estrutura de taxas transparente
                  </p>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>

          <v-col cols="12" md="4">
            <v-hover v-slot="{ hover }">
              <v-card
                class="benefit-card fill-height"
                :elevation="hover ? 8 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-img
                  :src="`${URL_BACKEND}/upload/images/UserFriendly.png`"
                  height="200"
                  class="benefit-img"
                  cover
                ></v-img>
                <v-card-title class="text-h5 font-weight-bold">
                  Plataforma Inteligente
                </v-card-title>
                <v-card-text class="text-body-1">
                  <p class="mb-4">
                    Painel intuitivo com ferramentas poderosas de análise
                  </p>
                  <p>
                    Gerencie estoque, acompanhe vendas e faça seu negócio
                    crescer com nossa plataforma moderna
                  </p>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>

          <v-col cols="12" md="4">
            <v-hover v-slot="{ hover }">
              <v-card
                class="benefit-card fill-height"
                :elevation="hover ? 8 : 2"
                :class="{ 'on-hover': hover }"
              >
                <v-img
                  :src="`${URL_BACKEND}/upload/images/PartnerGrowth.png`"
                  height="200"
                  class="benefit-img"
                  cover
                ></v-img>
                <v-card-title class="text-h5 font-weight-bold">
                  Suporte ao Crescimento
                </v-card-title>
                <v-card-text class="text-body-1">
                  <p class="mb-4">Equipe dedicada ao sucesso dos parceiros</p>
                  <p>
                    Acesse ferramentas de marketing, recursos de treinamento e
                    suporte personalizado para acelerar seu crescimento
                  </p>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>

      <!-- CTA Section -->
      <v-container class="cta-section mt-16">
        <v-card class="cta-card overflow-hidden">
          <v-row no-gutters>
            <v-col cols="12" md="6" class="d-flex align-center">
              <div class="pa-12">
                <h3 class="text-h4 font-weight-bold mb-6">
                  Pronto para Começar?
                </h3>
                <p class="text-h6 mb-8">
                  Junte-se a milhares de vendedores de sucesso que confiam na
                  Seletto para o crescimento de seus negócios
                </p>
                <div class="d-flex gap-4">
                  <v-btn
                    x-large
                    :color="palette.brand.main"
                    @click="navigateToRegister"
                    class="text-h6 px-8"
                  >
                    Cadastre-se Agora
                  </v-btn>
                  <v-btn
                    x-large
                    outlined
                    :color="palette.brand.main"
                    @click="navigateToLogin"
                    class="text-h6 px-8"
                  >
                    Entrar
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-img
                :src="`${URL_BACKEND}/upload/images/sejaparceiro.png`"
                class="cta-img"
                height="100%"
                cover
              ></v-img>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </div>
  </v-main>
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
  VCardText,
  VBtn,
  VHover,
} from "vuetify/components";
import UserInfo from "../components/UserInfo/UserInfo.vue";
import { useUserStore } from "../stores/useStore";
import { useRouter } from "vue-router";
import palette from "../../palette"; // Ajuste o caminho conforme necessário

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
    VCardText,
    VBtn,
    VHover,
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
      palette,
    };
  },
};
</script>

<style scoped>
.animated-background {
  min-height: 100vh;
  background: linear-gradient(135deg, #a5c0e8 0%, #e4e9f2 100%);
  position: relative;
  overflow: hidden;
}

.background-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);

  animation: float 20s infinite;
}

.shape-1 {
  background: rgba(64, 169, 255, 0.4);
  width: 500px;
  height: 500px;
  top: -250px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  background: rgba(128, 108, 255, 0.4);
  width: 400px;
  height: 400px;
  top: 50%;
  right: -200px;
  animation-delay: -5s;
}

.shape-3 {
  background: rgba(255, 64, 129, 0.4);
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: 30%;
  animation-delay: -10s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(20px);
  }
  50% {
    transform: translateY(20px) translateX(-20px);
  }
  75% {
    transform: translateY(20px) translateX(20px);
  }
}

.guest-view {
  position: relative;
  z-index: 1;
}

.welcome-banner {
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  margin-top: 40px;
}

.seletto-brand {
  background: linear-gradient(45deg, #004aad, #66b2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 900;
}

.benefits-section {
  margin-top: 80px;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-radius: 16px;
}

.benefit-card.on-hover {
  transform: translateY(-8px);
}

.benefit-img {
  border-radius: 16px 16px 0 0;
  transition: transform 0.3s ease;
}

.cta-section {
  margin-bottom: 80px;
}

.cta-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
}

.cta-img {
  border-radius: 0 24px 24px 0;
}

@media (max-width: 960px) {
  .cta-img {
    border-radius: 0 0 24px 24px;
  }

  .welcome-banner {
    margin-top: 20px;
    padding: 40px 20px;
  }

  .benefits-section {
    margin-top: 40px;
  }
}
</style>
