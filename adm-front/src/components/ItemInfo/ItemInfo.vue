<template>
  <v-container fluid class="pa-0">
    <!-- Header Bar -->
    <v-app-bar flat :color="palette.slategray[700]" height="64">
      <v-container class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" @click="goBack" variant="text"></v-btn>
        <v-toolbar-title class="text-h5 ml-4">{{ item?.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="editItem"
          v-if="userStore.isLoggedIn"
          prepend-icon="mdi-pencil"
        >
          Edit Item
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-container fluid class="mt-4">
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <v-row>
            <!-- Image Gallery -->
            <v-col cols="12" md="4">
              <v-card class="mb-6">
                <v-carousel
                  v-if="item?.image_names"
                  hide-delimiters
                  height="300"
                  :show-arrows="false"
                >
                  <v-carousel-item
                    v-for="image in item.image_names.split(',')"
                    :key="image"
                    :src="`${URL_BACKEND}/upload/images/${image.trim()}`"
                    contain
                    class="bg-grey-lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey-lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-carousel-item>
                </v-carousel>
              </v-card>
            </v-col>

            <!-- Description -->
            <v-col cols="6">
              <v-card elevation="2" class="pa-6 mb-5" height="300">
                <div class="d-flex align-center mb-4">
                  <v-icon icon="mdi-text-box" class="mr-2"></v-icon>
                  <div class="text-h6">Product Description</div>
                </div>
                <div class="text-body-1">{{ item?.description }}</div>
                <div class="mb-3 d-flex flex-row ma-5">
                  <v-col col="6">
                    <div class="text-subtitle-1 font-weight-bold ma-2">
                      Category
                    </div>
                    <v-chip
                      :color="palette.lightblue[300]"
                      class="mb-4"
                      size="large"
                    >
                      {{ item?.category_id }}
                    </v-chip>
                  </v-col>
                  <v-col col="6">
                    <div class="text-subtitle-1 font-weight-bold ma-2">
                      Type
                    </div>
                    <v-chip :color="palette.lightblue[300]" size="large">
                      {{ item?.type }}
                    </v-chip>
                  </v-col>
                </div>
              </v-card>
            </v-col>

            <!-- Price and Basic Info -->
            <v-col cols="12">
              <v-card class="mb-6 pa-4">
                <div class="text-h4 mb-4">{{ formatPrice(item?.price) }}</div>
                <div class="d-flex align-center mb-4">
                  <v-chip
                    :color="item?.status === 'active' ? 'success' : 'error'"
                    class="mr-2"
                  >
                    {{ item?.status }}
                  </v-chip>
                  <v-rating
                    :value="averageRating"
                    readonly
                    half-increments
                    color="warning"
                    size="small"
                  ></v-rating>
                  <span class="ml-2">({{ reviews?.length || 0 }} reviews)</span>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="text-body-1 mb-4">{{ item?.description }}</div>

                <div class="d-flex align-center mb-2">
                  <v-icon color="grey" class="mr-2">mdi-tag</v-icon>
                  <span>Category: {{ item?.category_id }}</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon color="grey" class="mr-2">mdi-shape</v-icon>
                  <span>Type: {{ item?.type }}</span>
                </div>
              </v-card>
            </v-col>

            <!-- Discounts Section -->
            <v-col cols="12" md="6" class="sticky-card">
              <v-card class="mb-6">
                <v-card-title class="d-flex align-center">
                  <v-icon left color="success">mdi-tag-multiple</v-icon>
                  Available Discounts
                </v-card-title>
                <v-card-text>
                  <v-chip-group>
                    <v-chip
                      v-for="discount in discounts"
                      :key="discount.id"
                      color="success"
                      outlined
                      class="ma-1"
                    >
                      {{ discount.name }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Reviews Section -->
            <v-col cols="12" md="6">
              <v-card class="mb-6">
                <v-card-title class="d-flex align-center">
                  <v-icon left color="warning">mdi-star</v-icon>
                  Customer Reviews
                  <v-spacer></v-spacer>
                  <span class="text-h6">{{ averageRating }}/5</span>
                </v-card-title>

                <v-card-text>
                  <v-list v-if="reviews?.length">
                    <v-list-item
                      v-for="review in reviews"
                      :key="review.id"
                      class="mb-4"
                    >
                      <v-list-item-content>
                        <div class="d-flex align-center mb-2">
                          <v-avatar
                            :color="palette.lightblue[100]"
                            size="40"
                            class="mr-3"
                          >
                            <v-icon>mdi-account</v-icon>
                          </v-avatar>
                          <div>
                            <div class="text-subtitle-1 font-weight-medium">
                              <template v-if="loadingNames">
                                <v-progress-circular
                                  indeterminate
                                  size="20"
                                  width="2"
                                  color="primary"
                                ></v-progress-circular>
                              </template>
                              <template v-else>
                                By
                                {{
                                  clientReviewNames[review.clients_id] ||
                                  "Anonymous"
                                }}
                              </template>
                            </div>
                            <div class="d-flex align-center">
                              <v-rating
                                :model-value="review.rating"
                                :length="5"
                                readonly
                                dense
                                half-increments
                                color="warning"
                                size="x-small"
                              ></v-rating>
                              <span class="text-caption ml-2">
                                {{
                                  new Date(
                                    review.created_at
                                  ).toLocaleDateString()
                                }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="text-body-1 ml-13">
                          {{ review.comment }}
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-alert
                    v-else
                    type="info"
                    text="No reviews yet"
                    class="mt-2"
                  ></v-alert>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Variants Section -->
            <v-col cols="12">
              <v-card class="mb-6">
                <v-card-title class="d-flex align-center">
                  <v-icon left color="primary">mdi-palette-swatch</v-icon>
                  Available Variants
                </v-card-title>
                <v-card-text>
                  <v-table v-if="variants?.length">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Color</th>
                        <th scope="col">Size</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="variant in variants"
                        :key="variant.id"
                        :class="{
                          'grey lighten-4': variant.status !== 'active',
                        }"
                      >
                        <td>
                          <div class="d-flex align-center">
                            <v-avatar
                              size="32"
                              :color="palette.lightblue[100]"
                              class="mr-2"
                            >
                              <v-icon size="small">mdi-cube-outline</v-icon>
                            </v-avatar>
                            {{ variant.name }}
                          </div>
                        </td>
                        <td>{{ formatPrice(variant.price) }}</td>
                        <td>
                          <v-chip
                            :color="variant.stock > 0 ? 'success' : 'error'"
                            size="small"
                          >
                            {{
                              variant.stock > 0
                                ? `${variant.stock} units`
                                : "Out of stock"
                            }}
                          </v-chip>
                        </td>
                        <td>
                          <v-chip :color="variant.color" size="small">
                            {{ variant.color }}
                          </v-chip>
                        </td>
                        <td>{{ variant.size }}</td>
                        <td>
                          <v-chip
                            :color="
                              variant.status === 'active' ? 'success' : 'error'
                            "
                            size="small"
                          >
                            {{ variant.status }}
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-alert
                    v-else
                    type="info"
                    text="No variants available"
                    class="mt-2"
                  ></v-alert>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<script>
import { ref, onMounted, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/useStore";
import itemsApi from "../../utils/api/items";
import clientApi from "../../utils/api/clienteApi";
import palette from "../../../palette";

import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VToolbar,
  VBtn,
  VIcon,
  VSpacer,
  VCarousel,
  VCarouselItem,
  VCardTitle,
  VCardText,
  VChip,
  VDataTable,
  VList,
  VListItem,
  VImg,
  VListItemTitle,
  VListItemSubtitle,
  VRating,
  VAvatar,
} from "vuetify/components";

export default {
  name: "ItemInfo",
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VToolbar,
    VBtn,
    VIcon,
    VSpacer,
    VCarousel,
    VCarouselItem,
    VCardTitle,
    VCardText,
    VChip,
    VDataTable,
    VList,
    VListItem,
    VImg,
    VListItemTitle,
    VListItemSubtitle,
    VRating,
    VAvatar,
  },
  setup(props) {
    const router = useRouter();
    const userStore = useUserStore();
    const item = ref({});
    const store = ref({});
    const variants = ref([]);
    const reviews = ref([]);
    const salesStats = ref({});
    const clientReviewNames = ref({});
    const discounts = ref([]);
    const averageRating = ref(0);
    const loadingNames = ref(true);
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const variantHeaders = [
      { text: "Name", value: "name" },
      { text: "Price", value: "price" },
      { text: "Stock", value: "stock" },
      { text: "Status", value: "status" },
    ];

    const formatPrice = (price) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    };
    const calculateAverageRating = computed(() => {
      if (!reviews.value?.length) return 0;
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.value.length;
    });

    const fetchClientNames = async () => {
      loadingNames.value = true;
      if (!reviews.value?.length) return;

      try {
        // Get unique client IDs from reviews
        const uniqueClientIds = [
          ...new Set(reviews.value.map((review) => review.clients_id)),
        ];

        // Fetch all client names in parallel
        const clientPromises = uniqueClientIds.map(async (clientId) => {
          try {
            const client = await clientApi.getClientById(clientId);
            return { clientId, name: client.name };
          } catch (error) {
            console.error(
              `Failed to fetch client name for ID ${clientId}:`,
              error
            );
            return { clientId, name: "Anonymous" };
          }
        });

        const clients = await Promise.all(clientPromises);

        // Store client names in ref
        clients.forEach(({ clientId, name }) => {
          clientNames.value[clientId] = name;
        });
      } catch (error) {
        console.error("Failed to fetch client names:", error);
      } finally {
        loadingNames.value = false;
      }
    };

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const fetchItemDetails = async () => {
      try {
        const itemData = await itemsApi.getAllInfoItem(props.itemId);

        item.value = itemData.item;
        variants.value = itemData.stock;
        discounts.value = itemData.discounts;
        reviews.value = itemData.reviews;
        console.log("Reviews fetched:", reviews.value);
        averageRating.value = itemData.averageRating
          ? parseFloat(itemData.averageRating)
          : 0;
        console.log("Item details fetched:", itemData);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      }
    };

    const goBack = () => router.go(-1);
    const editItem = () => router.push(`/edit-item/${props.itemId}`);

    onMounted(async () => {
      await fetchItemDetails();
      await fetchClientNames();
    });
    onBeforeMount(() => {
      if (!userStore.isLoggedIn) {
        router.push("/");
      }
    });

    return {
      item,
      store,
      variants,
      salesStats,
      averageRating,
      variantHeaders,

      userStore,
      formatPrice,
      goBack,
      editItem,
      palette,
      URL_BACKEND,
      discounts,
      reviews,
      calculateAverageRating,
      formatDate,
      clientReviewNames,
      loadingNames,
    };
  },
};
</script>

<style scoped>
.v-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-table th {
  background-color: #f5f5f5 !important;
  color: #333 !important;
  font-weight: 600;
}

.v-table td {
  padding: 12px 16px;
}

.v-list-item {
  border-bottom: 1px solid #eee;
}

.v-list-item:last-child {
  border-bottom: none;
}
.sticky-card {
  position: sticky;
  top: 84px; /* 64px app-bar height + 20px padding */
}

.v-card {
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
}

.v-chip {
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 1264px) {
  .sticky-card {
    position: relative;
    top: 0;
  }
}
</style>
