<template>
  <v-container class="py-5">
    <!-- User Information -->
    <v-card class="elevation-3 mb-4">
      <v-card-title class="text-h6 font-weight-bold"
        >User Information</v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <strong>Name:</strong>
                <span v-if="user.name">{{ user.name }}</span>
                <v-skeleton-loader v-else type="text"></v-skeleton-loader>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <strong>Email:</strong>
                <span v-if="user.email">{{ user.email }}</span>
                <v-skeleton-loader v-else type="text"></v-skeleton-loader>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-avatar
                  size="50"
                  :image="`${URL_BACKEND}/upload/images/${user.profile_image}.png`"
                  class="rounded-circle"
                  v-if="user.profile_image"
                >
                </v-avatar>
                <v-skeleton-loader v-else type="avatar"></v-skeleton-loader>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <!-- Dashboard -->
    <v-card class="elevation-3">
      <v-card-title class="text-h6 font-weight-bold">Dashboard</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <!-- Total Stores -->
          <v-col cols="12" md="4">
            <v-card outlined class="info-card text-center">
              <v-card-title>
                <v-skeleton-loader
                  v-if="!dashboardData.totalStores"
                  type="text"
                ></v-skeleton-loader>
                <template v-else>
                  <strong>Total Stores</strong>
                </template>
              </v-card-title>
              <v-card-text>
                <v-skeleton-loader
                  v-if="!dashboardData.totalStores"
                  type="heading"
                ></v-skeleton-loader>
                <template v-else>
                  <span class="info-value">{{
                    dashboardData.totalStores
                  }}</span>
                </template>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Active Stores -->
          <v-col cols="12" md="4">
            <v-card outlined class="info-card text-center">
              <v-card-title>
                <v-skeleton-loader
                  v-if="!dashboardData.activeStores"
                  type="text"
                ></v-skeleton-loader>
                <template v-else>
                  <strong>Active Stores</strong>
                </template>
              </v-card-title>
              <v-card-text>
                <v-skeleton-loader
                  v-if="!dashboardData.activeStores"
                  type="heading"
                ></v-skeleton-loader>
                <template v-else>
                  <span class="info-value">{{
                    dashboardData.activeStores
                  }}</span>
                </template>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Pending Approvals -->
          <v-col cols="12" md="4">
            <v-card outlined class="info-card text-center">
              <v-card-title>
                <v-skeleton-loader
                  v-if="!dashboardData.pendingApprovals"
                  type="text"
                ></v-skeleton-loader>
                <template v-else>
                  <strong>Pending Approvals</strong>
                </template>
              </v-card-title>
              <v-card-text>
                <v-skeleton-loader
                  v-if="!dashboardData.pendingApprovals"
                  type="heading"
                ></v-skeleton-loader>
                <template v-else>
                  <span class="info-value">{{
                    dashboardData.pendingApprovals
                  }}</span>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
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
} from "vuetify/components";

export default {
  name: "UserDashboard",
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
  },
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
  setup(props) {
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    console.log(props.user.profile_image);
    return {
      URL_BACKEND,
    };
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.info-card {
  background-color: #f5f5f5;
  padding: 16px;
}

.info-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
}

.v-avatar {
  border: 2px solid #ddd;
}
</style>
