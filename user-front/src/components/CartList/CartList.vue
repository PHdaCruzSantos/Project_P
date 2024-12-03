<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between align-center">
            <span>Shopping Cart</span>
            <span class="text-subtitle-1">Total: R$ {{ cartTotal }}</span>
          </VCardTitle>

          <VCardText>
            <div class="cart-table-container">
              <VTable v-if="cartItems.length" fixed-header>
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartItems" :key="item.id">
                    <td class="p-2">
                      <VAvatar
                        :image="getImageUrl(item.image_names)"
                        @error="handleImageLoadError"
                      />
                    </td>
                    <td>
                      <div class="font-weight-medium">{{ item.name }}</div>
                      <div class="text-caption">{{ item.description }}</div>
                    </td>
                    <td>R$ {{ formatPrice(item.price) }}</td>
                    <td>
                      <div class="d-flex align-center">
                        <VBtn
                          icon="mdi-minus"
                          size="small"
                          variant="text"
                          @click="updateQuantity(item, -1)"
                          :disabled="item.quantity <= 1"
                        />
                        <span class="mx-2">{{ item.quantity }}</span>
                        <VBtn
                          icon="mdi-plus"
                          size="small"
                          variant="text"
                          @click="updateQuantity(item, 1)"
                        />
                      </div>
                    </td>
                    <td class="price">
                      R$ {{ formatPrice(item.price * item.quantity) }}
                    </td>
                    <td>
                      <VBtn
                        icon="mdi-delete"
                        color="error"
                        variant="text"
                        @click="removeFromCart(item)"
                      />
                    </td>
                  </tr>
                </tbody>
              </VTable>

              <VAlert v-else type="info" class="mt-4">
                Your cart is empty
              </VAlert>
            </div>
          </VCardText>

          <VDivider />

          <VCardActions class="justify-space-between">
            <VBtn to="/" variant="text" prepend-icon="mdi-arrow-left">
              Continue Shopping
            </VBtn>
            <VBtn
              color="primary"
              :disabled="!cartItems.length"
              @click="checkout"
              append-icon="mdi-cart-checkout"
            >
              Checkout
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { computed, onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useClientStore } from "@/stores/clientsStore";
import { useRouter } from "vue-router";
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VTable,
  VAvatar,
  VBtn,
  VAlert,
  VDivider,
  VCardActions,
} from "vuetify/components";

export default {
  name: "CartList",

  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VTable,
    VAvatar,
    VBtn,
    VAlert,
    VDivider,
    VCardActions,
  },

  setup() {
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const cartStore = useCartStore();
    const clientStore = useClientStore();
    const router = useRouter();

    const cartItems = computed(() => cartStore.items);
    const cartTotal = computed(() => formatPrice(cartStore.total));

    function formatPrice(value) {
      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    function getImageUrl(image) {
      return `${URL_BACKEND}/upload/images/${image}`;
    }

    const updateQuantity = (item, change) => {
      cartStore.updateItemQuantity(item.id, item.quantity + change);
    };

    function removeFromCart(item) {
      cartStore.removeFromCart(item);
    }

    function checkout() {
      console.log("Proceeding to checkout...");
      router.push({ name: "ShippingView" });
    }

    function handleImageLoadError(event) {
      event.target.src = "https://via.placeholder.com/50x50";
    }

    onMounted(() => {
      if (clientStore.isLoggedIn) {
        cartStore.initCart(clientStore.currentUser.id);
        console.log("Cart initialized for user", clientStore.currentUser.id);
        console.log("Cart initialized for user", cartStore.items);
      }
    });

    return {
      cartItems,
      cartTotal,
      formatPrice,
      getImageUrl,
      updateQuantity,
      removeFromCart,
      checkout,
      handleImageLoadError,
    };
  },
};
</script>

<style scoped>
.cart-table-container {
  max-height: 70vh;
  overflow-y: auto;
}

.price {
  color: green;
  font-weight: bold;
  white-space: nowrap;
}

.v-table {
  background: transparent !important;
}
</style>
