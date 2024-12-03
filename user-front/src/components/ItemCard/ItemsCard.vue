<template>
  <v-card
    :loading="loading"
    class="item-card"
    max-width="300"
    outlined
    rounded="lg"
    @click="showItemDetails"
  >
    <!-- Image Carousel -->
    <v-carousel
      v-if="!loading"
      :show-arrows="false"
      progress="primary"
      hide-delimiters
      height="200"
      cycle
    >
      <v-carousel-item
        v-for="image in processedImages"
        :key="image"
        :src="getImageUrl(image)"
        @error="handleImageError"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate></v-progress-circular>
          </v-row>
        </template>
      </v-carousel-item>
    </v-carousel>

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
} from "vuetify/components";

export default {
  name: "ItemsCard",
  props: {
    item: {
      type: Object,
      required: true,
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
  },
  setup(props) {
    const showModal = ref(false);
    const router = useRouter();
    const loading = ref(false);
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const clientStore = useClientStore();
    const cartStore = useCartStore();
    // const isFavorited = ref(false);
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
      cartStore.addToCart(props.item);
    };

    const showItemDetails = () => {
      showModal.value = true;
    };

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
</style>
