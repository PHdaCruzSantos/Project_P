<template>
  <v-container class="py-8">
    <!-- User Profile Section -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="info-card" elevation="4">
          <v-card-text class="text-center pa-6">
            <v-skeleton-loader
              v-if="loading"
              type="avatar"
              class="mx-auto mb-4"
            />
            <template v-else>
              <v-avatar
                :image="userImageUrl"
                size="75"
                class="mb-4 elevation-4"
              ></v-avatar>
              <h2 class="text-h5 mb-2 font-weight-bold">{{ userName }}</h2>
              <p class="text-subtitle-1 mb-4">{{ userEmail }}</p>
              <v-btn
                color="primary"
                variant="flat"
                prepend-icon="mdi-account-edit"
                @click="editProfile"
              >
                Editar Perfil
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Stats Section -->
      <v-col cols="12" md="8">
        <v-row dense>
          <v-col v-for="(stat, index) in stats" :key="index" cols="12" sm="4">
            <v-card
              class="info-card"
              elevation="2"
              :color="stat.color"
              theme="dark"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="48" class="mb-3">{{ stat.icon }}</v-icon>
                <h3 class="text-h6 font-weight-medium mb-2">
                  {{ stat.title }}
                </h3>
                <p class="text-h3 font-weight-bold">
                  {{ dashboardData[stat.key] || 0 }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Edit Profile Form -->
        <v-expand-transition>
          <v-card v-if="isEditing" class="info-card mt-6" elevation="4">
            <v-card-title class="text-h5 pa-6 pb-0">Editar Perfil</v-card-title>
            <v-card-text class="pa-6">
              <v-form @submit.prevent="saveProfile">
                <v-text-field
                  v-model="editedName"
                  label="Nome"
                  variant="outlined"
                  class="mb-4"
                  :rules="[(v) => !!v || 'Nome é obrigatório']"
                  required
                />
                <v-text-field
                  v-model="editedEmail"
                  label="Email"
                  variant="outlined"
                  class="mb-4"
                  :rules="emailRules"
                  required
                />
                <v-file-input
                  v-model="editedImage"
                  label="Imagem de Perfil"
                  variant="outlined"
                  class="mb-6"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  clearable
                />
                <div class="d-flex justify-end">
                  <v-btn
                    color="secondary"
                    variant="text"
                    class="mr-4"
                    @click="cancelEdit"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    type="submit"
                    color="primary"
                    variant="flat"
                    :loading="loading"
                  >
                    Salvar Alterações
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Dashboard Placeholder -->
        <!-- <v-card class="info-card mt-6" elevation="4">
          <v-card-title class="text-h5 pa-6">Dashboard</v-card-title>
          <v-card-text class="pa-6">
            <v-skeleton-loader type="heading" class="mb-4" />
            <v-skeleton-loader type="paragraph" class="mb-4" />
            <v-skeleton-loader type="image" height="200" />
          </v-card-text>
        </v-card> -->
      </v-col>
    </v-row>

    <!-- Store Orders Section -->
    <v-slide-y-transition>
      <store-orders class="mt-6" />
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useStore";
import usersApi from "@/utils/api/users";
import uploads from "../../utils/api/uploads";
import StoreOrders from "../StoreOrders/StoreOrders.vue";

import {
  VCard,
  VCardText,
  VCardTitle,
  VAvatar,
  VBtn,
  VRow,
  VCol,
  VIcon,
  VForm,
  VTextField,
  VFileInput,
  VExpandTransition,
  VSkeletonLoader,
  VContainer,
} from "vuetify/components";

export default {
  name: "UserInfo",
  props: {
    user: {
      type: Object,
      required: true,
    },
    dashboardData: {
      type: Object,
      default: () => ({
        totalStores: 3,
        activeStores: 2,
        pendingApprovals: 1,
      }),
    },
  },
  components: {
    StoreOrders,
    VCard,
    VCardText,
    VCardTitle,
    VAvatar,
    VBtn,
    VRow,
    VCol,
    VIcon,
    VForm,
    VTextField,
    VFileInput,
    VExpandTransition,
    VSkeletonLoader,
    VContainer,
  },
  setup() {
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const userStore = useUserStore();
    const loading = ref(false);
    const error = ref(null);
    const isEditing = ref(false);
    const editedName = ref("");
    const editedEmail = ref("");
    const editedImage = ref([]);

    const stats = [
      {
        title: "Total de Lojas",
        key: "totalStores",
        icon: "mdi-store",
        color: "primary",
      },
      {
        title: "Lojas Ativas",
        key: "activeStores",
        icon: "mdi-store-check",
        color: "success",
      },
      {
        title: "Lojas Pendentes",
        key: "pendingApprovals",
        icon: "mdi-clock-outline",
        color: "warning",
      },
    ];

    const emailRules = [
      (v) => !!v || "E-mail é obrigatório",
      (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
    ];

    const userImageUrl = computed(() => {
      return userStore.user?.profile_image
        ? `${URL_BACKEND}/upload/images/${userStore.user.profile_image}`
        : `${URL_BACKEND}/upload/images/default-avatar.png`;
    });

    const userName = computed(() => userStore.user?.name || "Usuário");
    const userEmail = computed(() => userStore.user?.email || "");

    const editProfile = () => {
      isEditing.value = true;
      editedName.value = userName.value;
      editedEmail.value = userEmail.value;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const formData = ref({
      name: "",
      email: "",
      profile_image: "",
    });

    const saveProfile = async () => {
      try {
        loading.value = true;
        formData.value.name = editedName.value;
        formData.value.email = editedEmail.value;

        if (editedImage.value.length > 0) {
          const uploadResponse = await uploads.uploadFiles(editedImage.value);
          if (uploadResponse.imageName) {
            formData.value.profile_image = editedImage.value[0].name;
          }
        }

        const updatedUser = await usersApi.updateUser(
          userStore.user.id,
          formData
        );
        userStore.setUser(updatedUser);
        fetchUserData();
        isEditing.value = false;
      } catch (err) {
        error.value = "Falha ao atualizar perfil";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const fetchUserData = async () => {
      try {
        loading.value = true;
        const userData = await usersApi.getUserById(
          userStore.user.user.id || userStore.user.id
        );
        userStore.setUser(userData);
      } catch (err) {
        error.value = "Falha ao carregar dados do usuário";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchUserData);

    return {
      loading,
      error,
      stats,
      emailRules,
      userImageUrl,
      userName,
      userEmail,
      isEditing,
      editedName,
      editedEmail,
      editedImage,
      editProfile,
      cancelEdit,
      saveProfile,
    };
  },
};
</script>

<style scoped>
.info-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.v-avatar {
  border: 4px solid rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
