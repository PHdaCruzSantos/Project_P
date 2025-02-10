<template>
  <v-container>
    <!-- Payment Header -->
    <div class="d-flex align-center mb-6">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="$router.push('/shipping')"
      >
        Voltar às Compras
      </v-btn>
      <v-divider vertical class="mx-4" />
      <h1 class="text-h4 font-weight-medium">Pagamento</h1>
    </div>

    <!-- Payment Progress -->

    <v-row>
      <v-col cols="12" md="8">
        <!-- Payment Section -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-qrcode" class="mr-2" color="primary" />
            <span class="text-h5">Pagamento por PIX</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <template v-if="!pixCode">
              <v-progress-circular indeterminate color="primary" class="mb-4" />
              <div class="text-body-1">Gegando código QR do PIX...</div>
            </template>

            <template v-else>
              <div class="text-center">
                <img
                  :src="`data:image/png;base64,${pixCode.qrCodeImage}`"
                  alt="PIX QR Code"
                  class="mx-auto mb-4 qr-code"
                />

                <v-btn
                  color="primary"
                  class="mb-4"
                  prepend-icon="mdi-content-copy"
                  @click="copyPixCode"
                >
                  Copiar Código do PIX
                </v-btn>

                <v-alert
                  v-if="copied"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                >
                  Código do PIX copiado para a área de transferência
                </v-alert>

                <div class="text-body-2 mb-2">
                  Expira em: {{ formatExpirationDate(pixCode.expirationDate) }}
                </div>

                <div class="text-body-1 mb-4">
                  Pagamento por PIX é processado em até 5 minutos
                </div>

                <v-progress-linear
                  v-if="paymentStatus === 'pending'"
                  indeterminate
                  color="primary"
                />
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Order Summary -->
        <v-card>
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-receipt" class="mr-2" color="primary" />
            <span class="text-h6">Resumo do Pedido</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between mb-2">
              <span>Subtotal:</span>
              <span>{{ formatPrice(orderTotal) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Envio:</span>
              <span>{{ formatPrice(shippingTotal) }}</span>
            </div>
            <v-divider class="my-4" />
            <div class="d-flex justify-space-between text-h6">
              <span>Total:</span>
              <span class="text-primary">{{ formatPrice(grandTotal) }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useShippingStore } from "@/stores/shippingStore";
import { usePaymentStore } from "@/stores/paymentStore";
import { useClientStore } from "@/stores/clientsStore";
import paymentApi from "@/utils/api/paymentApi";
import orderApi from "@/utils/api/orderApi";

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
  VStepper,
  VStepperHeader,
  VStepperActions,
  VStepperItem,
} from "vuetify/components";

export default {
  name: "Payment",
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
    VStepper,
    VStepperHeader,
    VStepperActions,
    VStepperItem,
  },
  setup() {
    const router = useRouter();
    const shippingStore = useShippingStore();
    const paymentStore = usePaymentStore();
    const clientsStore = useClientStore();
    const pixCode = ref(null);
    const copied = ref(false);
    const paymentStatus = ref("pending");
    const error = ref(null);

    const orderTotal = computed(() => paymentStore.totals.itemsTotal);
    const shippingTotal = computed(() => paymentStore.totals.shippingTotal);
    const grandTotal = computed(() => paymentStore.totals.grandTotal);

    const formatOrderData = (
      paymentStore,
      clientsStore,
      pixPaymentId = null
    ) => {
      // Calculate totals per store
      const storeOrders = paymentStore.stores.map((store) => {
        const storeTotal = store.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const shippingCost = store.shipping_rate?.price || 0;

        return {
          store_id: store.store_id,
          items: store.items.map((item) => ({
            item_id: item.id,
            quantity: item.quantity,
            price: item.price,
            item_name: item.name,
          })),
          subtotal: storeTotal,
          shipping_price: shippingCost,
          total: storeTotal + shippingCost,
        };
      });
      console.log(paymentStore.shippingDetails);
      // Create order data structure
      return {
        clients_id: clientsStore.currentUser.id,
        payment_id: pixPaymentId,
        status: "pending",
        total_amount: paymentStore.totals.grandTotal,
        payment_method: "pix",
        shipping_address: paymentStore.shippingDetails.address.address,
        shipping_price: paymentStore.totals.shippingTotal,
        items: storeOrders.reduce(
          (allItems, store) => [...allItems, ...store.items],
          []
        ),
        store_orders: storeOrders,
      };
    };

    const formatPaymentData = () => {
      console.log(paymentStore.stores);
      if (!Array.isArray(paymentStore.stores)) {
        throw new Error("Stores data is not in the expected format");
      }

      const split = paymentStore.stores.map((store, i) => {
        if (!store[i].wallet_id) {
          throw new Error(`Wallet ID not found for store ${store.store_id}`);
        }
        const storeTotal = store.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const items = store.items.map((item) => {
          return {
            storeId: item.store_id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          };
        });
        console.log(items);

        return {
          items: items,
          walletId: store[i].wallet_id,
          fixedValue: storeTotal,
        };
      });

      return {
        clientId: clientsStore.currentUser.id,
        value: grandTotal.value,
        split: split,
        items: split.reduce((items, store) => items.concat(store.items), []),
      };
    };

    const initializePayment = async () => {
      try {
        const paymentData = formatPaymentData();
        const paymentResponse = await paymentApi.createPayment(paymentData);

        const orderData = formatOrderData(
          paymentStore,
          clientsStore,
          paymentResponse.id
        );
        const orderResponse = await orderApi.createOrder(orderData);
        console.log(orderResponse);

        pixCode.value = {
          qrCodeImage: paymentResponse.pix.encodedImage,
          code: paymentResponse.pix.code,
          expirationDate: paymentResponse.pix.expirationDate,
        };

        startPaymentCheck(paymentResponse.id, orderResponse.id);
      } catch (error) {
        console.error("Payment initialization failed:", error);
      }
    };

    const copyPixCode = async () => {
      try {
        await navigator.clipboard.writeText(pixCode.value.code);
        copied.value = true;
        setTimeout(() => (copied.value = false), 3000);
      } catch (error) {
        console.error("Failed to copy PIX code:", error);
      }
    };

    const startPaymentCheck = async (paymentId, orderId) => {
      const checkInterval = setInterval(async () => {
        try {
          const status = await paymentApi.getPaymentStatus(paymentId);
          paymentStatus.value = status;

          if (status === "RECEIVED" || status === "CONFIRMED") {
            // Update order status when payment is confirmed
            let resOrder = await orderApi.updateOrderStatus(orderId, status);
            clearInterval(checkInterval);
            // await router.push("/order-confirmation");
          } else if (status === "FAILED" || status === "CANCELLED") {
            // Update order status when payment fails
            let resOrder = await orderApi.updateOrderStatus(orderId, status);
            clearInterval(checkInterval);
            error.value = "Payment failed or cancelled";
          }
        } catch (err) {
          console.error("Payment status check failed:", err);
          error.value = "Failed to check payment status";
        }
      }, 5000);
    };

    const formatPrice = (value) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    const formatExpirationDate = (date) => {
      return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    onMounted(() => {
      if (!paymentStore.orderItems.length) {
        router.push("/cart");
        return;
      }

      if (!paymentStore.stores || !Array.isArray(paymentStore.stores)) {
        console.error("Stores data is not in the expected format");
        return;
      }

      initializePayment();
    });

    return {
      pixCode,
      copied,
      paymentStatus,
      orderTotal,
      shippingTotal,
      grandTotal,
      copyPixCode,
      formatPrice,
      error,
      formatExpirationDate,
    };
  },
};
</script>
