<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title class="text-h5">Delivery Address</v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedAddress"
          :items="addresses"
          item-title="address"
          item-value="cep"
          label="Select delivery address"
          :loading="loadingAddresses"
          return-object
        >
          <template v-slot:append-item>
            <v-divider class="mb-2"></v-divider>
            <v-list-item>
              <v-btn
                color="primary"
                variant="text"
                block
                to="/profile?tab=addresses"
              >
                Add New Address
              </v-btn>
            </v-list-item>
          </template>
        </v-select>
      </v-card-text>
    </v-card>

    <!-- Items grouped by store -->
    <template v-for="(group, storeId) in itemsByStore" :key="storeId">
      <v-card class="mb-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ group.storeName }}</span>
          <v-chip>{{ group.items.length }} items</v-chip>
        </v-card-title>

        <v-card-text>
          <!-- Items list -->
          <v-list>
            <v-list-item
              v-for="item in group.items"
              :key="item.id"
              :title="item.name"
              :subtitle="`Quantity: ${item.quantity}`"
            >
              <template v-slot:prepend>
                <v-avatar size="48">
                  <v-img :src="getImageUrl(item.image_names)" cover />
                </v-avatar>
              </template>
              <template v-slot:append>
                {{ formatPrice(item.price * item.quantity) }}
              </template>
            </v-list-item>
          </v-list>

          <!-- Shipping options -->
          <v-card-text v-if="selectedAddress">
            <div class="text-subtitle-1 mb-2">Shipping Options</div>
            <v-radio-group
              v-model="selectedShipping[storeId]"
              v-if="shippingRates[storeId]?.length"
            >
              <v-radio
                v-for="rate in shippingRates[storeId]"
                :key="rate.id"
                :value="rate"
                :label="`${rate.name} - ${formatPrice(rate.price)} 
                         (${rate.delivery_time} days)`"
              />
            </v-radio-group>
            <v-progress-circular
              v-else-if="loadingShipping[storeId]"
              indeterminate
            />
            <v-alert
              v-else
              type="warning"
              text="Select a delivery address to see shipping options"
            />
          </v-card-text>

          <!-- Store subtotal -->
          <v-divider class="my-2" />
          <div class="d-flex justify-space-between pa-4">
            <span>Subtotal:</span>
            <span>{{ formatPrice(calculateStoreSubtotal(group.items)) }}</span>
          </div>
          <div
            v-if="selectedShipping[storeId]"
            class="d-flex justify-space-between pa-4"
          >
            <span>Shipping:</span>
            <span>{{ formatPrice(selectedShipping[storeId].price) }}</span>
          </div>
        </v-card-text>
      </v-card>
    </template>

    <!-- Order Summary -->
    <v-card class="mt-4">
      <v-card-title>Order Summary</v-card-title>
      <v-card-text>
        <div class="d-flex justify-space-between mb-2">
          <span>Items Total:</span>
          <span>{{ formatPrice(calculateTotal()) }}</span>
        </div>
        <div class="d-flex justify-space-between mb-2">
          <span>Shipping Total:</span>
          <span>{{ formatPrice(calculateShippingTotal()) }}</span>
        </div>
        <v-divider class="my-2" />
        <div class="d-flex justify-space-between text-h6">
          <span>Grand Total:</span>
          <span>{{ formatPrice(calculateGrandTotal()) }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          size="large"
          :disabled="!canProceed"
          @click="proceedToPayment"
        >
          Proceed to Payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useClientStore } from "@/stores/clientsStore";
import clientsApi from "@/utils/api/clientsApi";
import shippingApi from "@/utils/api/shippingApi";
import {
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VSelect,
  VDivider,
  VListItem,
  VBtn,
  VList,
  VAvatar,
  VImg,
  VRadioGroup,
  VRadio,
  VProgressCircular,
  VAlert,
  VChip,
  VCardActions,
} from "vuetify/components";

export default {
  name: "Shipping",
  components: {
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VSelect,
    VDivider,
    VListItem,
    VBtn,
    VList,
    VAvatar,
    VImg,
    VRadioGroup,
    VRadio,
    VProgressCircular,
    VAlert,
    VChip,
    VCardActions,
  },

  setup(props) {
    const cartStore = useCartStore();
    const clientStore = useClientStore();

    const addresses = ref([]);
    const selectedAddress = ref(null);
    const loadingAddresses = ref(false);
    const loadingShipping = ref({});
    const shippingRates = ref({});
    const selectedShipping = ref({});
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    // Group items by store
    const itemsByStore = computed(() => {
      const groups = {};
      cartStore.items.forEach((item) => {
        if (!groups[item.store_id]) {
          groups[item.store_id] = {
            storeName: `Store ${item.store_id}`, // Replace with actual store name
            items: [],
          };
        }
        groups[item.store_id].items.push(item);
      });
      return groups;
    });

    // Load customer addresses
    const loadAddresses = async () => {
      try {
        loadingAddresses.value = true;
        addresses.value = await clientsApi.getClientAddresses(
          clientStore.currentUser.id
        );
        if (addresses.value.length) {
          selectedAddress.value = addresses.value[0];
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        loadingAddresses.value = false;
      }
    };

    // Calculate shipping for a store
    const calculateStoreShipping = async (storeId, items) => {
      if (!selectedAddress.value) return;

      loadingShipping.value[storeId] = true;
      try {
        const shippingData = {
          from: {
            postal_code: "05402-100", // Should come from store data
          },
          to: {
            postal_code: selectedAddress.value.cep.replace("-", ""),
          },
          products: items.map((item) => ({
            id: item.id,
            width: item.width || 11,
            height: item.height || 17,
            length: item.length || 11,
            weight: item.weight || 0.3,
            insurance_value: item.price,
            quantity: item.quantity,
          })),
          options: {
            receipt: false,
            own_hand: false,
          },
          services: "1,2",
        };

        const rates = await shippingApi.calculateShipping(shippingData);
        shippingRates.value[storeId] = rates;
      } catch (error) {
        console.error("Failed to calculate shipping:", error);
      } finally {
        loadingShipping.value[storeId] = false;
      }
    };

    // Watch for address changes
    watch(selectedAddress, () => {
      Object.keys(itemsByStore.value).forEach((storeId) => {
        calculateStoreShipping(storeId, itemsByStore.value[storeId].items);
      });
    });

    // Calculate totals
    const calculateStoreSubtotal = (items) => {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };
    const formatPrice = (price) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    };

    const getImageUrl = (image) => {
      return `${URL_BACKEND}/upload/images/${image}`;
    };

    const calculateTotal = () => {
      return Object.values(itemsByStore.value).reduce(
        (sum, group) => sum + calculateStoreSubtotal(group.items),
        0
      );
    };

    const calculateShippingTotal = () => {
      return Object.values(selectedShipping.value).reduce(
        (sum, shipping) => sum + shipping.price,
        0
      );
    };

    const calculateGrandTotal = () => {
      return calculateTotal() + calculateShippingTotal();
    };

    const canProceed = computed(() => {
      return (
        selectedAddress.value &&
        Object.keys(itemsByStore.value).every(
          (storeId) => selectedShipping.value[storeId]
        )
      );
    });

    const proceedToPayment = () => {
      // Save shipping details to cart store
      cartStore.$patch({
        shipping: {
          address: selectedAddress.value,
          rates: selectedShipping.value,
          total: calculateShippingTotal(),
        },
      });

      // Navigate to payment
      router.push("/checkout/payment");
    };

    onMounted(() => {
      loadAddresses();
    });

    return {
      addresses,
      selectedAddress,
      loadingAddresses,
      loadingShipping,
      shippingRates,
      selectedShipping,
      itemsByStore,
      calculateStoreSubtotal,
      calculateTotal,
      calculateShippingTotal,
      calculateGrandTotal,
      canProceed,
      proceedToPayment,
      getImageUrl,
      formatPrice,
      URL_BACKEND,
    };
  },
};
</script>
