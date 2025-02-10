<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title class="success--text pa-4 text-center">
            <v-icon large color="success" class="mr-2">mdi-check-circle</v-icon>
            Pagamento Confirmado!
          </v-card-title>

          <v-card-text class="text-center pa-4">
            <p class="text-h6 mb-4">Obrigado pela sua compra!</p>
            <p class="mb-4">
              Seu pedido foi confirmado e será processado em breve.
            </p>

            <v-divider class="my-4"></v-divider>

            <div class="text-left mb-4">
              <h3 class="text-h6 mb-2">Resumo do Pedido</h3>
              <v-list>
                <v-list-item
                  v-for="item in paymentStore.orderItems"
                  :key="item.id"
                >
                  <v-list-item-title>
                    {{ item.name }} x {{ item.quantity }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatPrice(item.price * item.quantity) }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex justify-space-between">
                <span class="text-h6">Total:</span>
                <span class="text-h6">{{
                  formatPrice(paymentStore.totals.grandTotal)
                }}</span>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <v-btn color="primary" block @click="router.push('/')" class="mt-4">
              Voltar para Início
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRouter } from "vue-router";
import { usePaymentStore } from "@/stores/paymentStore";
import { onMounted } from "vue";

import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VDivider,
  VList,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
  VBtn,
  VIcon,
} from "vuetify/components";

export default {
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VDivider,
    VList,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    VBtn,
    VIcon,
  },
  setup() {
    const router = useRouter();
    const paymentStore = usePaymentStore();

    const formatPrice = (value) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    onMounted(() => {
      if (!paymentStore.orderItems.length) {
        router.push("/");
      }
    });
    return { formatPrice, paymentStore, router };
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
