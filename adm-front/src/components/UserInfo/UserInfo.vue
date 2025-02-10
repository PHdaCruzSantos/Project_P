<template>
  <v-container>
    <v-row class="mb-4 d-flex justify-center">
      <!-- User Profile Card -->
      <v-col cols="12" md="6">
        <v-card class="info-card">
          <v-card-text class="text-center">
            <v-skeleton-loader v-if="loading" type="image" />
            <v-avatar :image="userImageUrl" v-else size="120" class="mb-4">
            </v-avatar>
            <h2 class="text-h5 mb-2">{{ userName }}</h2>
            <p class="text-subtitle-1">{{ userEmail }}</p>
            <v-btn color="primary" class="mt-4" @click="editProfile">
              Editar Prefíl
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Stats Cards -->
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="info-card">
              <v-card-text class="text-center">
                <v-icon size="36" color="primary" class="mb-2">
                  mdi-store
                </v-icon>
                <h3 class="text-h6">Total de Lojas</h3>
                <p class="text-h4">{{ dashboardData.totalStores || 0 }}</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="info-card">
              <v-card-text class="text-center">
                <v-icon size="36" color="success" class="mb-2">
                  mdi-store-check
                </v-icon>
                <h3 class="text-h6">Lojas Ativas</h3>
                <p class="text-h4">{{ dashboardData.activeStores || 0 }}</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="info-card">
              <v-card-text class="text-center">
                <v-icon size="36" color="warning" class="mb-2">
                  mdi-clock-outline
                </v-icon>
                <h3 class="text-h6">Aprovações Pendentes</h3>
                <p class="text-h4">{{ dashboardData.pendingApprovals || 0 }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Edit Profile Form -->
        <v-card v-if="isEditing" class="info-card mt-4">
          <v-card-title class="text-h5">Editar Prefíl</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveProfile">
              <v-text-field
                v-model="editedName"
                label="Name"
                outlined
                class="mb-4"
              />
              <v-text-field
                v-model="editedEmail"
                label="Email"
                outlined
                class="mb-4"
              />
              <v-file-input
                v-model="editedImage"
                label="Profile Image"
                outlined
                class="mb-4"
                accept="image/*"
              />
              <v-btn type="submit" color="primary" class="mr-4"> Salvar </v-btn>
              <v-btn color="secondary" @click="cancelEdit">Cancelar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- skelleton for future dashboad -->
        <v-card class="info-card mt-4">
          <v-card-title class="text-h5">Dashboard</v-card-title>
          <v-card-text>
            <v-skeleton-loader type="text" />
          </v-card-text>

          <v-card-text>
            <v-skeleton-loader type="text" />
          </v-card-text>

          <v-card-text>
            <v-skeleton-loader type="text" />
          </v-card-text>

          <v-card-text>
            <v-skeleton-loader type="text" />
          </v-card-text>
        </v-card>

        <!-- <v-col cols="12" md="8">
          <store-orders />
        </v-col> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VAvatar,
  VSkeletonLoader,
  VRow,
  VCol,
  VIcon,
  VImg,
  VBtn,
  VForm,
  VTextField,
  VFileInput,
} from "vuetify/components";

import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useStore";
import usersApi from "@/utils/api/users";
import uploads from "../../utils/api/uploads";
import StoreOrders from "../StoreOrders/StoreOrders.vue";

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
        totalStores: null,
        activeStores: null,
        pendingApprovals: null,
      }),
    },
  },
  components: {
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VAvatar,
    VSkeletonLoader,
    VRow,
    VCol,
    VIcon,
    VImg,
    VBtn,
    VForm,
    VTextField,
    VFileInput,
    StoreOrders,
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

    const userImageUrl = computed(() => {
      return userStore.user?.profile_image
        ? `${URL_BACKEND}/images/${userStore.user.profile_image}`
        : `${URL_BACKEND}/images/default-avatar.png`;
    });

    const userName = computed(() => userStore.user?.name || "User");
    const userEmail = computed(() => userStore.user?.email || "");

    const editProfile = () => {
      isEditing.value = true;
      editedName.value = userName.value;
      editedEmail.value = userEmail.value;
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    const saveProfile = async () => {
      try {
        loading.value = true;
        const formData = new FormData();
        formData.append("name", editedName.value);
        formData.append("email", editedEmail.value);

        // Check if there's a file to upload
        if (editedImage.value && editedImage.value.length > 0) {
          const uploadResponse = await uploads.uploadFiles(editedImage.value);
          if (uploadResponse.imageName) {
            formData.append("profile_image", uploadResponse.imageName);
          }
        }

        console.log("formData", formData.value);
        const updatedUser = await usersApi.updateUser(
          userStore.user.id,
          formData
        );
        userStore.setUser(updatedUser);
        fetchUserData();
        isEditing.value = false;
      } catch (err) {
        error.value = "Failed to update profile";
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
        error.value = "Failed to load user data";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchUserData);

    return {
      loading,
      error,
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
  transition: transform 0.2s;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card:hover {
  transform: translateY(-5px);
}

.v-card {
  margin-bottom: 20px;
}

.v-avatar {
  border: 3px solid #004aad;
}

.v-btn {
  text-transform: none;
  font-weight: bold;
}

.v-form {
  padding: 20px;
}
</style>
