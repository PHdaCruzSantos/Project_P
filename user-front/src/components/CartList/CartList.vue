<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VCard :loading="loading">
          <VCardTitle class="d-flex justify-space-between align-center">
            <span>Carrinho de compras</span>
            <div class="text-subtitle-1">
              Total Selecionado: R$ {{ selectedTotal }}
            </div>
          </VCardTitle>

          <VCardText>
            <div class="cart-table-container">
              <template v-if="Object.keys(groupedItems).length">
                <div
                  v-for="group in groupedItems"
                  :key="group.store_id"
                  class="mb-6"
                >
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title
                      class="d-flex justify-space-between align-center"
                    >
                      <v-avatar
                        :image="group.storeLogo"
                        size="50"
                        class="rounded-circle"
                      ></v-avatar>
                      <div>
                        <v-icon icon="mdi-store" class="mr-2" />
                        {{ group.storeName }}
                      </div>
                      <v-checkbox
                        :model-value="
                          group.items.every((item) =>
                            selectedItems.has(item.id)
                          )
                        "
                        @change="toggleStoreSelection(group.items)"
                        label="Select all store items"
                        hide-details
                        density="compact"
                      />
                    </v-card-title>

                    <VTable fixed-header>
                      <thead>
                        <tr>
                          <th scope="col">Selecionar</th>
                          <th scope="col">Imagem</th>
                          <th scope="col">Produto</th>
                          <th scope="col">Preço (R$)</th>
                          <th scope="col">Quantidade</th>
                          <th scope="col">Total</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in group.items" :key="item.id">
                          <td>
                            <v-checkbox
                              :model-value="selectedItems.has(item.id)"
                              @change="toggleSelection(item.id)"
                              hide-details
                              density="compact"
                            />
                          </td>
                          <td class="p-2">
                            <VAvatar
                              :image="getImageUrl(item.image_names)"
                              @error="handleImageLoadError"
                            />
                          </td>
                          <td>
                            <div class="font-weight-medium">
                              {{ item.name }}
                            </div>
                            <div class="text-caption">
                              {{ item.description }}
                            </div>
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
                  </v-card>
                </div>
              </template>

              <VAlert v-else type="info" class="mt-4">
                Seu carrinho está vazio.
              </VAlert>
            </div>
          </VCardText>

          <VDivider />

          <VCardActions class="justify-space-between">
            <VBtn to="/" variant="text" prepend-icon="mdi-arrow-left">
              Continuar Comprando
            </VBtn>
            <VBtn
              color="primary"
              :disabled="!selectedItems.size"
              @click="checkout"
              append-icon="mdi-cart-checkout"
            >
              Comprar Items Selecionados ({{ selectedItems.size }})
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useClientStore } from "@/stores/clientsStore";
import { useShippingStore } from "@/stores/shippingStore";

import clientsApi from "@/utils/api/clientsApi";
import itemsApi from "@/utils/api/itemsApi";
import storeApi from "@/utils/api/storeApi";
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
  VSelect,
  VCheckbox,
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
    VSelect,
    VCheckbox,
  },

  setup() {
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const router = useRouter();
    const clientStore = useClientStore();
    const shippingStore = useShippingStore();
    const selectedItems = ref(new Set());
    const storeInfos = ref(new Map());
    const groupedItems = computed(() => {
      const groups = {};
      cartItems.value.forEach((item) => {
        if (!groups[item.store_id]) {
          groups[item.store_id] = {
            store_id: item.store_id,
            storeName: storeInfos.value.get(item.store_id)?.name,
            storeLogo: `${URL_BACKEND}/upload/images/${
              storeInfos.value.get(item.store_id)?.logo
            }`,
            items: [],
          };
        }
        groups[item.store_id].items.push(item);
      });
      return groups;
    });

    const loadStoreInfo = async (storeId) => {
      try {
        const store = await storeApi.getStore(storeId);
        storeInfos.value.set(storeId, store.store); // use sotre.wallet para pegar o wallet id
        console.log(store.store);
      } catch (error) {
        console.error("Failed to load store info", error);
      }
    };

    // Local state
    const loading = ref(false);
    const cartItems = ref([]);
    const error = ref(null);
    const selectedTotal = computed(() => {
      const total = cartItems.value
        .filter((item) => selectedItems.value.has(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      return formatPrice(total);
    });

    // Computed values
    const cartTotal = computed(() => {
      const total = cartItems.value.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return formatPrice(total);
    });

    // Add method to handle selection
    const toggleSelection = (itemId) => {
      const set = selectedItems.value;
      if (set.has(itemId)) {
        set.delete(itemId);
      } else {
        set.add(itemId);
      }
    };

    // Add method to handle store selection
    const toggleStoreSelection = (storeItems) => {
      const itemIds = storeItems.map((item) => item.id);
      const allSelected = itemIds.every((id) => selectedItems.value.has(id));

      if (allSelected) {
        // Deselect all items from this store
        itemIds.forEach((id) => selectedItems.value.delete(id));
      } else {
        // Select all items from this store
        itemIds.forEach((id) => selectedItems.value.add(id));
      }
    };

    // Methods
    const loadCartItems = async () => {
      if (!clientStore.currentUser?.id) return;

      try {
        loading.value = true;
        const cartData = await clientsApi.getCartByClientId(
          clientStore.currentUser.id
        );
        // Fetch full item details for each cart item
        const itemsWithDetails = await Promise.all(
          cartData.map(async (cartItem) => {
            const itemDetails = await itemsApi.getAllInfoItem(
              cartItem.items_id
            );
            if (!storeInfos.value.has(itemDetails.item.store_id)) {
              await loadStoreInfo(itemDetails.item.store_id);
            }
            return {
              ...itemDetails.item,
              quantity: cartItem.quantity,
            };
          })
        );

        cartItems.value = itemsWithDetails;
      } catch (err) {
        error.value = "Failed to load cart items";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const updateQuantity = async (item, change) => {
      try {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          await removeFromCart(item);
          return;
        }

        // Update local state immediately for responsiveness
        item.quantity = newQuantity;

        // Update server
        if (change > 0) {
          await clientsApi.addCartItem(clientStore.currentUser.id, item.id);
        } else {
          await clientsApi.removeCartItem(clientStore.currentUser.id, item.id);
        }
      } catch (err) {
        console.error("Failed to update quantity:", err);
        // Revert local change on error
        await loadCartItems();
      }
    };

    const removeFromCart = async (item) => {
      try {
        // Remove locally first
        cartItems.value = cartItems.value.filter((i) => i.id !== item.id);

        // Then remove from server
        await clientsApi.removeCartItem(clientStore.currentUser.id, item.id);
      } catch (err) {
        console.error("Failed to remove item:", err);
        // Reload cart on error
        await loadCartItems();
      }
    };

    const checkout = () => {
      const selectedProducts = cartItems.value.filter((item) =>
        selectedItems.value.has(item.id)
      );
      shippingStore.setSelectedProducts(selectedProducts);
      router.push({ name: "ShippingView" });
    };

    const formatPrice = (value) => {
      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    const getImageUrl = (image) => {
      return `${URL_BACKEND}/upload/images/${image}`;
    };

    const handleImageLoadError = (event) => {
      event.target.src = "https://via.placeholder.com/50x50";
    };

    // Initialize cart on mount
    onMounted(() => {
      if (clientStore.isLoggedIn) {
        loadCartItems();
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
      loading,
      groupedItems,
      selectedTotal,
      selectedItems,
      toggleSelection,
      toggleStoreSelection,
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
