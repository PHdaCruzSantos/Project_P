<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <v-card>
      <v-layout>
        <!-- Left side - Image Gallery -->
        <v-navigation-drawer permanent width="450" class="pa-0">
          <v-carousel height="450" hide-delimiters show-arrows="hover" cycle>
            <v-carousel-item
              v-for="image in processedImages"
              :key="image"
              :src="getImageUrl(image)"
              cover
              @error="handleImageError"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary" />
                </v-row>
              </template>
            </v-carousel-item>
          </v-carousel>
        </v-navigation-drawer>

        <!-- Right side - Product Info -->
        <v-main class="bg-background">
          <v-container>
            <!-- Header with Title and Actions -->
            <div class="d-flex justify-space-between align-center mb-4">
              <div>
                <h2 class="text-h4 font-weight-bold">{{ item.name }}</h2>
                <div class="text-h5 primary--text mt-2">
                  {{ formatPrice(selectedVariant?.price || item.price) }}
                </div>
              </div>
              <v-btn
                icon="mdi-heart"
                variant="text"
                @click="handleFavorite"
                :color="isFavorite ? 'error' : 'grey'"
              />
            </div>

            <!-- Tabs for Different Sections -->
            <v-tabs v-model="activeTab" grow>
              <v-tab value="details">Details</v-tab>
              <v-tab value="variants">Variants</v-tab>
              <v-tab value="reviews">Reviews</v-tab>
            </v-tabs>

            <v-window v-model="activeTab" class="mt-4">
              <!-- Details Tab -->
              <v-window-item value="details">
                <v-card flat>
                  <v-card-text>
                    <!-- Description -->
                    <div class="text-body-1 mb-4">{{ item.description }}</div>

                    <!-- Stock Status -->
                    <v-chip
                      :color="item.status === 'active' ? 'success' : 'error'"
                      :text="
                        item.status === 'active' ? 'In Stock' : 'Out of Stock'
                      "
                      class="mb-4"
                    />

                    <!-- Promotions -->
                    <div v-if="itemInfo?.promotions?.length" class="mt-4">
                      <h3 class="text-h6 font-weight-bold mb-2">
                        Active Promotions
                      </h3>
                      <v-list density="comfortable">
                        <v-list-item
                          v-for="promo in itemInfo.promotions"
                          :key="promo.id"
                          :subtitle="promo.description"
                          class="mb-2"
                        >
                          <template v-slot:prepend>
                            <v-icon color="error">mdi-tag</v-icon>
                          </template>
                          <template v-slot:title>
                            <span class="text-error font-weight-bold"
                              >{{ promo.discount }}% OFF</span
                            >
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-text>
                </v-card>
              </v-window-item>

              <!-- Variants Tab -->
              <v-window-item value="variants">
                <v-card flat>
                  <v-card-text>
                    <div v-if="itemInfo?.variants?.length">
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                          v-for="variant in itemInfo.variants"
                          :key="variant.id"
                        >
                          <v-card
                            :class="{
                              'selected-variant':
                                selectedVariant?.id === variant.id,
                            }"
                            @click="selectVariant(variant)"
                            elevation="2"
                            class="pa-4 variant-card"
                          >
                            <div
                              class="d-flex justify-space-between align-center"
                            >
                              <div>
                                <div class="text-subtitle-1 font-weight-bold">
                                  {{ variant.name }}
                                </div>
                                <div class="text-h6 primary--text">
                                  {{ formatPrice(variant.price) }}
                                </div>
                              </div>
                              <v-icon
                                v-if="selectedVariant?.id === variant.id"
                                color="primary"
                              >
                                mdi-check-circle
                              </v-icon>
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>
                    <v-alert v-else type="info" text="No variants available" />
                  </v-card-text>
                </v-card>
              </v-window-item>

              <!-- Reviews Tab -->
              <v-window-item value="reviews">
                <v-card flat>
                  <v-card-text>
                    <div class="d-flex align-center mb-4">
                      <v-rating
                        :model-value="averageRating"
                        color="warning"
                        half-increments
                        readonly
                      />
                      <span class="text-body-1 ml-2">
                        ({{ itemInfo?.reviews?.length || 0 }} reviews)
                      </span>
                    </div>

                    <v-expansion-panels v-if="itemInfo?.reviews?.length">
                      <v-expansion-panel
                        v-for="review in itemInfo.reviews"
                        :key="review.id"
                      >
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-rating
                              :model-value="review.rating"
                              color="warning"
                              density="compact"
                              half-increments
                              readonly
                              size="small"
                            />
                            <span class="ml-2">{{ review.client_name }}</span>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          {{ review.comment }}
                          <div class="text-caption mt-1">
                            {{
                              new Date(review.created_at).toLocaleDateString()
                            }}
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <v-alert v-else type="info" text="No reviews yet" />
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>

            <!-- Action Buttons -->
            <v-card-actions class="mt-4">
              <v-btn
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!item.status === 'active' || !clientStore.isLoggedIn"
                @click="addToCart"
              >
                <v-icon left>mdi-cart-plus</v-icon>
                Add to Cart
                {{ selectedVariant ? `- ${selectedVariant.name}` : "" }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-main>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, defineEmits, watch } from "vue";
import { useClientStore } from "@/stores/clientsStore";
import { useCartStore } from "@/stores/cartStore";
import itemsApi from "@/utils/api/itemsApi";

import {
  VCard,
  VCardText,
  VCardActions,
  VBtn,
  VChip,
  VList,
  VListItem,
  VRating,
  VCarousel,
  VCarouselItem,
  VProgressCircular,
  VRow,
  VCol,
  VDialog,
  VDivider,
  VIcon,
  VWindow,
  VWindowItem,
  VTabs,
  VTab,
  VNavigationDrawer,
  VLayout,
  VMain,
  VExpansionPanel,
  VExpansionPanels,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VExpandTransition,
  VExpandXTransition,
  VContainer,
  VAlert,
} from "vuetify/components";

export default {
  name: "InfoItem",
  components: {
    VCard,
    VCardText,
    VCardActions,
    VBtn,
    VChip,
    VList,
    VListItem,
    VRating,
    VCarousel,
    VCarouselItem,
    VProgressCircular,
    VRow,
    VCol,
    VDialog,
    VDivider,
    VIcon,
    VWindow,
    VWindowItem,
    VTabs,
    VTab,
    VNavigationDrawer,
    VLayout,
    VMain,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelTitle,
    VAlert,
    VContainer,
    VExpansionPanelText,
    VExpandXTransition,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const clientStore = useClientStore();
    const cartStore = useCartStore();
    const loading = ref(false);
    const itemInfo = ref(null);
    const selectedVariant = ref(null);
    const activeTab = ref("details");

    const dialog = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const fetchItemInfo = async () => {
      try {
        loading.value = true;
        const data = await itemsApi.getAllInfoItem(props.item.id);
        itemInfo.value = data;
        // console.log("Item info:", data);
      } catch (error) {
        console.error("Failed to fetch item info:", error);
      } finally {
        loading.value = false;
      }
    };
    watch(
      () => props.modelValue,
      async (newValue) => {
        if (newValue) {
          await fetchItemInfo();
        } else {
          selectedVariant.value = null;
          activeTab.value = "details";
        }
      }
    );
    const processedImages = computed(() => {
      if (!props.item.image_names) return [];
      return props.item.image_names.split(",").map((img) => img.trim());
    });

    const isFavorite = computed(() => {
      if (!clientStore.currentUser?.fav_items) return false;
      return clientStore.currentUser.fav_items.includes(props.item.id);
    });

    const getImageUrl = (image) => {
      return `${URL_BACKEND}/upload/images/${image}`;
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    };

    const handleFavorite = async () => {
      if (!clientStore.isLoggedIn) return;
      await clientStore.toggleFavorite(props.item.id);
    };

    const addToCart = () => {
      if (!clientStore.isLoggedIn) return;
      cartStore.addToCart(props.item);
    };

    const handleImageError = (event) => {
      event.target.src =
        "https://via.placeholder.com/400x400?text=Image+Not+Found";
    };

    const closeDialog = () => {
      emit("update:modelValue", false);
    };

    const averageRating = computed(() => {
      if (!itemInfo.value?.reviews?.length) return 0;
      const sum = itemInfo.value.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return sum / itemInfo.value.reviews.length;
    });

    return {
      dialog,
      processedImages,
      isFavorite,
      getImageUrl,
      formatPrice,
      handleFavorite,
      addToCart,
      handleImageError,
      closeDialog,
      clientStore,
      loading,
      itemInfo,
      selectedVariant,
      averageRating,
      activeTab,
    };
  },
};
</script>

<style scoped>
.v-dialog {
  border-radius: 16px;
}

.v-card {
  overflow: hidden;
}

.v-carousel {
  border-radius: 0;
}
.v-expansion-panels {
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .v-carousel {
    height: 300px !important;
  }
}
.variant-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.variant-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.selected-variant {
  border: 2px solid var(--v-primary-base);
  background-color: var(--v-primary-lighten5);
}

.v-window {
  min-height: 300px;
}
</style>
