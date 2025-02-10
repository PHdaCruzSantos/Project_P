<template>
  <v-container>
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <v-stepper-item value="0" title="Shipping" :complete="currentStep > 0">
          <v-icon>mdi-truck-delivery</v-icon>
          Envio do Pedido
        </v-stepper-item>

        <v-divider />

        <v-stepper-item value="1" title="Payment" :complete="currentStep > 1">
          <v-icon>mdi-credit-card</v-icon>
          Pagamento do Pedido
        </v-stepper-item>
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <!-- Shipping Step -->
        <v-stepper-window-item value="0">
          <Shipping
            @shipping-confirmed="handleShippingConfirmed"
            :products="shippingStore.selectedProducts"
          />
        </v-stepper-window-item>

        <!-- Payment Step -->
        <v-stepper-window-item value="1">
          <Payment
            :order-data="orderData"
            @payment-completed="handlePaymentCompleted"
          />
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-container>
</template>
<script>
import { ref, reactive, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useShippingStore } from "@/stores/shippingStore";
import Shipping from "@/components/Shipping/Shipping.vue";
import Payment from "@/components/Payment/Payment.vue";

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
  VStepperWindow,
  VStepperWindowItem,
  VIcon,
} from "vuetify/components";
export default {
  name: "NewOrderView",
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
    VStepperWindow,
    VStepperWindowItem,
    VIcon,

    Shipping,
    Payment,
  },
  setup() {
    const currentStep = ref(0);
    const router = useRouter();
    const shippingStore = useShippingStore();

    const orderData = reactive({
      shipping: null,
      products: [],
    });

    onBeforeMount(() => {
      if (!shippingStore.selectedProducts?.length) {
        router.push("/cart");
      }
      orderData.products = shippingStore.selectedProducts;
    });

    const handleShippingConfirmed = (shippingData) => {
      orderData.shipping = shippingData;
      currentStep.value = 1;
    };

    const handlePaymentCompleted = () => {
      router.push("/order-confirmation");
    };

    return {
      currentStep,
      shippingStore,
      orderData,
      handleShippingConfirmed,
      handlePaymentCompleted,
    };
  },
};
</script>

<style scoped>
.v-stepper {
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}
</style>
