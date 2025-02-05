<template>
  <!-- !FIXME - Review action on card items -->
  <v-card
    :loading="loading"
    :class="['item-card', { 'item-unavailable': item.status !== 'active' }]"
    max-width="300"
    outlined
    rounded="lg"
    @click="showItemDetails"
    :style="cardOpacityStyle"
  >
    <div v-if="item.status !== 'active'" class="unavailable-overlay">
      <v-chip color="error" class="ma-2"> Indisponível </v-chip>
    </div>
    <!-- Image Carousel -->
    <v-carousel
      v-if="!loading"
      :show-arrows="false"
      :progress="item.status === 'active' ? 'primary' : 'error'"
      hide-delimiters
      height="200"
      cycle
    >
      <v-carousel-item
        v-for="image in processedImages"
        :key="image"
        :src="getImageUrl(image)"
        @error="handleImageError"
        :class="{ greyscale: item.status !== 'active' }"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-row>
        </template>
      </v-carousel-item>
    </v-carousel>

    <div class="px-4 pt-2">
      <v-chip
        v-if="item.freeShipping"
        color="success"
        size="small"
        class="mr-2"
      >
        <v-icon start size="small">mdi-truck-fast</v-icon>
        Free Shipping
      </v-chip>
      <v-chip color="black" size="small" class="mr-2" text-color="white">
        <v-icon start size="small">mdi-tag</v-icon>
        Black Friday
      </v-chip>
      <v-chip v-if="item.discount" color="error" size="small">
        <v-icon start size="small">mdi-sale</v-icon>
        {{ item.discount }}% OFF
      </v-chip>
    </div>

    <!-- Content -->
    <v-card-title class="text-subtitle-1 font-weight-bold">
      {{ item.name }}
    </v-card-title>

    <v-card-text>
      <v-row no-gutters align="center" justify="space-between">
        <v-col>
          <div class="text-h6 primary--text">
            {{ formatPrice(item.price) }}
          </div>
        </v-col>
        <v-col class="text-right">
          <v-rating
            v-if="item.rating"
            :value="item.rating"
            color="warning"
            dense
            half-increments
            readonly
            size="small"
          ></v-rating>
        </v-col>
      </v-row>

      <div class="text-caption text-truncate mt-2">
        {{ item.description }}
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        @click.stop="addToCart"
        :disabled="!item.status === 'active' || !clientStore.isLoggedIn"
      >
        <v-icon left>mdi-cart-plus</v-icon>
        Add to Cart
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        variant="text"
        @click.stop="handleFavorite"
        :color="isFavorite ? 'error' : 'grey'"
        :disable="!clientStore.isLoggedIn"
      >
        <v-icon>{{ isFavorite ? "mdi-heart" : "mdi-heart-outline" }}</v-icon>
      </v-btn>
      <v-btn
        :disable="!clientStore.isLoggedIn"
        icon
        variant="text"
        @click.stop="showItemDetails"
      >
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-card-actions>
    <InfoItem v-model="showModal" :item="item" />
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cartStore";
import { useClientStore } from "@/stores/clientsStore";
import clientsApi from "@/utils/api/clientsApi";
import InfoItem from "../InfoItem/InfoItem.vue";

import {
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VIcon,
  VRating,
  VDivider,
  VCarousel,
  VCarouselItem,
  VProgressCircular,
  VRow,
  VCol,
  VSpacer,
  VChip,
} from "vuetify/components";

export default {
  name: "ItemsCard",
  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({
        freeShipping: true,
        isBlackFriday: true,
        discount: 20,
      }),
    },
  },
  components: {
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VIcon,
    VRating,
    VDivider,
    VCarousel,
    VCarouselItem,
    VProgressCircular,
    VRow,
    VCol,
    VSpacer,
    InfoItem,
    VChip,
  },
  setup(props) {
    const showModal = ref(false);
    const router = useRouter();
    const loading = ref(false);
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const clientStore = useClientStore();
    const cartStore = useCartStore();
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
    const handleFavorite = async (e) => {
      e.stopPropagation();
      if (!clientStore.isLoggedIn) return;

      try {
        loading.value = true;
        await clientStore.toggleFavorite(props.item.id);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      } finally {
        loading.value = false;
      }
    };

    const handleImageError = (event) => {
      event.target.src =
        "https://via.placeholder.com/300x200?text=Image+Not+Found";
    };

    const addToCart = () => {
      if (!clientStore.isLoggedIn) {
        return;
      }
      console.log("Adding to cart:", props.item);
      clientsApi.addCartItem(clientStore.currentUser.id, props.item.id);
    };

    const showItemDetails = () => {
      showModal.value = true;
    };

    const cardOpacityStyle = computed(() => ({
      opacity: props.item.status === "active" ? 1 : 0.6,
    }));

    return {
      loading,
      processedImages,
      getImageUrl,
      formatPrice,
      handleImageError,
      addToCart,
      showItemDetails,
      handleFavorite,
      isFavorite,
      clientStore,
      showModal,
      cardOpacityStyle,
    };
  },
};
</script>

<style scoped>
.item-card {
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  line-height: 1.2;
  height: 48px;
  overflow: hidden;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-card {
  position: relative;
  transition: all 0.3s ease;
}

.item-unavailable {
}

.unavailable-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.308);

  z-index: 1;
}

.greyscale {
  filter: grayscale(100%);
}

.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
}

.item-unavailable .price {
  text-decoration: line-through;
  color: #999;
}
</style>
