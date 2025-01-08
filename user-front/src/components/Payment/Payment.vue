<template>
  <v-container>
    <!-- Payment Header -->
    <div class="d-flex align-center mb-6">
      <v-btn
        variant="text"
        prepend-icon="mdi-arrow-left"
        @click="$router.push('/shipping')"
      >
        Back to Shipping
      </v-btn>
      <v-divider vertical class="mx-4" />
      <h1 class="text-h4 font-weight-medium">Payment</h1>
    </div>

    <!-- Payment Progress -->

    <v-row>
      <v-col cols="12" md="8">
        <!-- Payment Section -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-qrcode" class="mr-2" color="primary" />
            <span class="text-h5">PIX Payment</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <template v-if="!pixCode">
              <v-progress-circular indeterminate color="primary" class="mb-4" />
              <div class="text-body-1">Generating PIX code...</div>
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
                  Copy PIX Code
                </v-btn>

                <v-alert
                  v-if="copied"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                >
                  PIX code copied to clipboard!
                </v-alert>

                <div class="text-body-2 mb-2">
                  Expires in: {{ formatExpirationDate(pixCode.expirationDate) }}
                </div>

                <div class="text-body-1 mb-4">
                  Payment will be automatically confirmed once processed.
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
            <span class="text-h6">Order Summary</span>
          </v-card-title>

          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between mb-2">
              <span>Subtotal:</span>
              <span>{{ formatPrice(orderTotal) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Shipping:</span>
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
    console.log(paymentStore);
    const formatPaymentData = () => {
      return {
        clientId: clientsStore.currentUser.id,
        value: paymentStore.totals.grandTotal,
        items: paymentStore.orderItems.map((item) => ({
          name: item.name,
          value: item.price,
          quantity: item.quantity,
        })),
      };
    };

    const initializePayment = async () => {
      try {
        const paymentData = formatPaymentData();
        const response = await paymentApi.createPayment(paymentData);
        console.log(response);

        pixCode.value = {
          qrCodeImage: response.pix.encodedImage,
          code: response.pix.code,
          expirationDate: response.pix.expirationDate,
        };

        startPaymentCheck(response.id);
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

    const startPaymentCheck = async (paymentId) => {
      const checkInterval = setInterval(async () => {
        try {
          const status = await paymentApi.getPaymentStatus(paymentId);
          paymentStatus.value = status;

          if (status === "RECEIVED" || status === "CONFIRMED") {
            clearInterval(checkInterval);
            await router.push("/order-confirmation");
          } else if (status === "FAILED" || status === "CANCELLED") {
            clearInterval(checkInterval);
            error.value = "Payment failed or cancelled";
          }
        } catch (err) {
          console.error("Payment status check failed:", err);
          error.value = "Failed to check payment status";
        }
      }, 5000); // Check every 5 seconds
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
