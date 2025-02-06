<template>
  <v-container>
    <v-row>
      <!-- User Profile Card -->
      <v-col cols="12" md="4">
        <v-card class="info-card">
          <v-card-text class="text-center">
            <v-skeleton-loader v-if="loading" type="image" />
            <v-avatar v-else size="120" class="mb-4">
              <v-img
                :src="userImageUrl"
                :alt="userName"
                @error="handleImageError"
              />
            </v-avatar>
            <h2 class="text-h5 mb-2">{{ userName }}</h2>
            <p class="text-subtitle-1">{{ userEmail }}</p>
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
                <h3 class="text-h6">Total Stores</h3>
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
                <h3 class="text-h6">Active Stores</h3>
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
                <h3 class="text-h6">Pending Approvals</h3>
                <p class="text-h4">{{ dashboardData.pendingApprovals || 0 }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
  VDivider,
  VList,
  VListItem,
  VListItemTitle,
  VAvatar,
  VSkeletonLoader,
  VRow,
  VCol,
  VIcon,
  VImg,
} from "vuetify/components";

import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useStore";
import usersApi from "@/utils/api/users";

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
    VDivider,
    VList,
    VListItem,
    VListItemTitle,
    VAvatar,
    VSkeletonLoader,
    VRow,
    VCol,
    VIcon,
    VImg,
  },
  setup() {
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const userStore = useUserStore();
    const loading = ref(false);
    const error = ref(null);

    const userImageUrl = computed(() => {
      return userStore.user?.profile_image
        ? `${URL_BACKEND}/${userStore.user.profile_image}`
        : `${URL_BACKEND}/default-avatar.png`;
    });

    const userName = computed(() => userStore.user?.name || "User");
    const userEmail = computed(() => userStore.user?.email || "");

    const handleImageError = (event) => {
      event.target.src = `${URL_BACKEND}/default-avatar.png`;
    };

    const fetchUserData = async () => {
      try {
        loading.value = true;
        const userData = await usersApi.getUserById(userStore.user.user.id);
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
      handleImageError,
    };
  },
};
</script>

<style scoped>
.info-card {
  border-radius: 12px;
  transition: transform 0.2s;
}

.info-card:hover {
  transform: translateY(-5px);
}

.v-card {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}
</style>
