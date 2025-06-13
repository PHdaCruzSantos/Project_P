<template>
  <v-container fluid>
    <!-- Metrics Cards Row -->
    <v-row>
      <v-col cols="12" md="4" v-for="(metric, index) in metrics" :key="index">
        <v-card
          :class="`metrics-card ${getGradientClass(index)}`"
          elevation="3"
        >
          <template v-if="loadingMetrics">
            <v-card-text>
              <v-skeleton-loader
                type="article"
                class="mx-auto"
              ></v-skeleton-loader>
            </v-card-text>
          </template>
          <template v-else>
            <v-card-title class="d-flex justify-space-between align-center">
              {{ metric.title }}
              <v-icon size="24">{{ metric.icon }}</v-icon>
            </v-card-title>
            <v-card-text>
              <div class="text-h4 mb-2">{{ metric.value }}</div>
              <div class="d-flex align-center">
                <v-icon
                  :color="metric.trend >= 0 ? 'success' : 'error'"
                  size="20"
                  class="mr-1"
                >
                  {{ metric.trend >= 0 ? "mdi-arrow-up" : "mdi-arrow-down" }}
                </v-icon>
                <span
                  :class="metric.trend >= 0 ? 'success--text' : 'error--text'"
                >
                  {{ Math.abs(metric.trend) }}% desde o mês passado
                </span>
              </div>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <!-- Orders Management -->
    <v-card class="mt-6 rounded-lg overflow-hidden border border-gray-200">
      <v-card-title class="d-flex align-center bg-gray-50 py-4 px-6">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2"
            >mdi-clipboard-list-outline</v-icon
          >
          <span class="text-h6 font-weight-medium">Pedidos Recentes</span>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Pesquisar pedido"
          placeholder="Digite o código do pedido"
          hide-details
          density="comfortable"
          variant="outlined"
          class="max-w-xs mx-4"
          bg-color="white"
          :loading="loading"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="processedOrders"
        :search="search"
        :loading="loading"
        :items-per-page="10"
        class="elevation-0"
        :loading-text="'Carregando pedidos...'"
        :no-data-text="'Nenhum pedido encontrado'"
      >
        <!-- ID Column -->
        <template v-slot:[`item.id`]="{ item }">
          <div class="font-weight-medium text-primary">#{{ item.id }}</div>
        </template>

        <!-- Cliente Column -->
        <template v-slot:[`item.client.name`]="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="grey lighten-4" class="mr-2">
              <span class="text-caption">{{
                getInitials(item.client?.name)
              }}</span>
            </v-avatar>
            <div>{{ item.client?.name }}</div>
          </div>
        </template>

        <!-- Valor Column -->
        <template v-slot:[`item.total_amount`]="{ item }">
          <div class="font-weight-medium">
            R$ {{ formatCurrency(item.total_amount) }}
          </div>
        </template>

        <!-- Status Column -->
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            text-color="white"
            size="small"
            class="px-2 text-caption text-capitalize"
            pill
          >
            <v-icon size="x-small" start class="mr-1">{{
              getStatusIcon(item.status)
            }}</v-icon>
            {{ item.status.toLowerCase() }}
          </v-chip>
        </template>

        <!-- Data Column -->
        <template v-slot:[`item.created_at`]="{ item }">
          <div class="d-flex align-center">
            <v-icon size="small" color="grey" class="mr-1">mdi-calendar</v-icon>
            {{ item.created_at }}
          </div>
        </template>

        <!-- Actions Column -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex justify-center">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  icon
                  color="primary"
                  variant="text"
                  class="mr-1"
                  @click="openOrderDetails(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <div class="pa-2">Ver detalhes</div>
            </v-tooltip>

            <v-tooltip
              location="top"
              v-if="item.status.toLowerCase() === 'pending'"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  icon
                  color="success"
                  variant="text"
                  class="mx-1"
                  @click="acceptOrder(item)"
                >
                  <v-icon>mdi-check-circle</v-icon>
                </v-btn>
              </template>
              <div class="pa-2">Aceitar pedido</div>
            </v-tooltip>

            <v-tooltip
              location="top"
              v-if="item.status.toLowerCase() === 'confirmed'"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  icon
                  color="info"
                  variant="text"
                  class="mx-1"
                  @click="openNfeDialog(item)"
                >
                  <v-icon>mdi-file-document-outline</v-icon>
                </v-btn>
              </template>
              <div class="pa-2">Emitir NFe</div>
            </v-tooltip>

            <v-tooltip
              location="top"
              v-if="
                ['confirmed', 'processing'].includes(item.status.toLowerCase())
              "
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  icon
                  color="warning"
                  variant="text"
                  class="mx-1"
                  @click="openTrackingDialog(item)"
                >
                  <v-icon>mdi-truck-delivery</v-icon>
                </v-btn>
              </template>
              <div class="pa-2">Adicionar rastreio</div>
            </v-tooltip>
          </div>
        </template>

        <!-- Footer -->
        <template v-slot:bottom>
          <div
            class="d-flex align-center justify-space-between px-4 py-2 bg-gray-50"
          >
            <div class="text-caption text-secondary">
              Total de pedidos: {{ processedOrders.length }}
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- NFe Dialog - Diálogo de Emissão de Nota Fiscal Eletrônica -->
    <v-dialog v-model="nfeDialog" max-width="560px" content-class="rounded-lg">
      <v-card class="rounded-lg">
        <v-toolbar
          density="comfortable"
          color="primary"
          dark
          class="rounded-t-lg"
        >
          <v-icon start class="mx-4">mdi-file-document-outline</v-icon>
          <v-toolbar-title>Emissão de Nota Fiscal Eletrônica</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon size="small" @click="nfeDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <div class="text-subtitle-2 mb-4 text-grey-darken-1">
            <div class="d-flex align-center mb-2">
              <v-icon color="grey" size="small" class="mr-2"
                >mdi-shopping-outline</v-icon
              >
              <span
                >Pedido: <strong>#{{ selectedOrder?.id }}</strong></span
              >
            </div>
            <div class="d-flex align-center">
              <v-icon color="grey" size="small" class="mr-2"
                >mdi-account-outline</v-icon
              >
              <span
                >Cliente:
                <strong>{{ selectedOrder?.client?.name }}</strong></span
              >
            </div>
          </div>

          <v-divider class="mb-6"></v-divider>

          <v-form ref="nfeForm" v-model="nfeFormValid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="nfeData.series"
                  label="Série da NFe"
                  placeholder="Ex: 1"
                  hint="Série de emissão do documento fiscal"
                  persistent-hint
                  required
                  :rules="[(v) => !!v || 'Série é obrigatória']"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-identifier"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="nfeData.number"
                  label="Número da NFe"
                  placeholder="Ex: 000001234"
                  hint="Número do documento fiscal"
                  persistent-hint
                  required
                  :rules="[(v) => !!v || 'Número é obrigatório']"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-numeric"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="nfeData.natureOperation"
                  :items="[
                    'Venda de mercadorias',
                    'Venda de serviços',
                    'Devolução',
                    'Remessa para demonstração',
                  ]"
                  label="Natureza da Operação"
                  required
                  :rules="[(v) => !!v || 'Natureza da operação é obrigatória']"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-tag-outline"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="nfeData.observations"
                  label="Observações"
                  placeholder="Informações adicionais para a nota fiscal"
                  rows="3"
                  auto-grow
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-text-box-outline"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-btn
            variant="outlined"
            color="grey"
            @click="nfeDialog = false"
            prepend-icon="mdi-close"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            @click="emitNfe"
            prepend-icon="mdi-check"
            :loading="loading"
            :disabled="!nfeFormValid"
          >
            Emitir NFe
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Tracking Dialog - Diálogo de Adição de Código de Rastreio -->
    <v-dialog
      v-model="trackingDialog"
      max-width="560px"
      content-class="rounded-lg"
    >
      <v-card class="rounded-lg">
        <v-toolbar
          density="comfortable"
          color="warning"
          dark
          class="rounded-t-lg"
        >
          <v-icon start class="mx-4">mdi-truck-delivery</v-icon>
          <v-toolbar-title>Adicionar Código de Rastreio</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon size="small" @click="trackingDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
          <div class="mb-4">
            <v-chip
              :color="getStatusColor(selectedOrder?.status)"
              text-color="white"
              size="small"
              class="mb-2"
            >
              <v-icon start size="x-small">{{
                getStatusIcon(selectedOrder?.status)
              }}</v-icon>
              {{ selectedOrder?.status?.toLowerCase() }}
            </v-chip>

            <div
              class="d-flex flex-column gap-1 mt-2 text-subtitle-2 text-grey-darken-1"
            >
              <div class="d-flex align-center">
                <v-icon color="grey" size="small" class="mr-2"
                  >mdi-shopping-outline</v-icon
                >
                <span
                  >Pedido: <strong>{{ selectedOrder?.id }}</strong></span
                >
              </div>
              <div class="d-flex align-center">
                <v-icon color="grey" size="small" class="mr-2"
                  >mdi-account-outline</v-icon
                >
                <span
                  >Cliente:
                  <strong>{{ selectedOrder?.client?.name }}</strong></span
                >
              </div>
              <div class="d-flex align-center">
                <v-icon color="grey" size="small" class="mr-2"
                  >mdi-currency-usd</v-icon
                >
                <span
                  >Valor:
                  <strong
                    >R$
                    {{ formatCurrency(selectedOrder?.total_amount) }}</strong
                  ></span
                >
              </div>
            </div>
          </div>

          <v-divider class="mb-6"></v-divider>

          <v-form ref="trackingForm" v-model="trackingFormValid">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="trackingData.carrier"
                  :items="carriers"
                  label="Transportadora"
                  placeholder="Selecione a transportadora"
                  hint="Empresa responsável pela entrega"
                  persistent-hint
                  required
                  :rules="[(v) => !!v || 'Transportadora é obrigatória']"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-truck"
                  menu-icon="mdi-menu-down"
                >
                  <template v-slot:selection="{ item }">
                    <div class="d-flex align-center">
                      <v-icon
                        :color="getCarrierColor(item.value)"
                        class="mr-2"
                        size="small"
                      >
                        {{ getCarrierIcon(item.value) }}
                      </v-icon>
                      {{ item.value }}
                    </div>
                  </template>
                  <template v-slot:item="{ item, props }">
                    <v-list-item
                      v-bind="props"
                      :title="item.value"
                      :prepend-icon="getCarrierIcon(item.value)"
                      :prepend-icon-color="getCarrierColor(item.value)"
                    ></v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="trackingData.code"
                  label="Código de Rastreio"
                  placeholder="Ex: BR12345678901234"
                  hint="Código para rastreamento do pedido"
                  persistent-hint
                  required
                  :rules="[(v) => !!v || 'Código de rastreio é obrigatório']"
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-barcode-scan"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  location="bottom"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="trackingData.estimatedDelivery"
                      label="Previsão de Entrega"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                      variant="outlined"
                      bg-color="grey-lighten-4"
                      density="comfortable"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="trackingData.estimatedDelivery"
                    @update:model-value="menu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="trackingData.observations"
                  label="Observações"
                  placeholder="Informações adicionais sobre a entrega"
                  rows="2"
                  auto-grow
                  variant="outlined"
                  bg-color="grey-lighten-4"
                  density="comfortable"
                  prepend-inner-icon="mdi-text-box-outline"
                ></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-switch
                  v-model="trackingData.notifyCustomer"
                  color="success"
                  label="Notificar cliente sobre o código de rastreio"
                  hint="Um e-mail será enviado ao cliente com as informações de rastreio"
                  persistent-hint
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-btn
            variant="outlined"
            color="grey"
            @click="trackingDialog = false"
            prepend-icon="mdi-close"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="warning"
            variant="elevated"
            @click="saveTracking"
            prepend-icon="mdi-send"
            :loading="loading"
            :disabled="!trackingFormValid"
          >
            Salvar e Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import palette from "../../../palette";
import ordersApi from "../../utils/api/ordersApi"; // Importe a API de pedidos
import storesApi from "../../utils/api/stores"; // Importe a API de lojas
import { useUserStore } from "@/stores/useStore";

import {
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VAvatar,
  VSkeletonLoader,
  VRow,
  VCol,
  VIcon,
  VImg,
  VBtn,
  VForm,
  VTextField,
  VFileInput,
  VDataTable,
  VChip,
  VTooltip,
  VDialog,
  VSelect,
  VTextarea,
  VSwitch,
  VMenu,
  VDatePicker,
  VToolbar,
  VToolbarTitle,
  VToolbarItems,
} from "vuetify/components";

export default {
  name: "StoreOrders",
  components: {
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VAvatar,
    VSkeletonLoader,
    VRow,
    VCol,
    VIcon,
    VImg,
    VBtn,
    VForm,
    VTextField,
    VFileInput,
    VDataTable,
    VChip,
    VTooltip,
    VDialog,
    VSelect,
    VTextarea,
    VSwitch,
    VMenu,
    VDatePicker,
    VToolbar,
    VToolbarTitle,
    VToolbarItems,
  },
  setup() {
    const userStore = useUserStore(); // Store de usuário
    const loading = ref(false);
    const loadingMetrics = ref(true); // Skeleton para métricas
    const search = ref("");
    const nfeDialog = ref(false);
    const trackingDialog = ref(false);
    const selectedOrder = ref(null);
    const orders = ref([]); // Armazenar os pedidos da loja
    const stores = ref([]); // Armazenar as lojas do usuário

    const nfeFormValid = ref(false);
    const trackingFormValid = ref(false);
    const menu = ref(false);

    const nfeData = ref({});
    const trackingData = ref({});

    nfeData.value = {
      series: "",
      number: "",
      natureOperation: "",
      observations: "",
    };

    // Dados adicionais para rastreio
    trackingData.value = {
      carrier: "",
      code: "",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substr(0, 10), // 7 dias a partir de hoje
      observations: "",
      notifyCustomer: true,
    };
    const getCarrierIcon = (carrier) => {
      const icons = {
        Correios: "mdi-mail",
        JadLog: "mdi-truck-fast",
        "Total Express": "mdi-package-variant",
        DHL: "mdi-airplane",
        FedEx: "mdi-package-variant-closed",
      };
      return icons[carrier] || "mdi-truck-delivery";
    };

    const getCarrierColor = (carrier) => {
      const colors = {
        Correios: "yellow-darken-3",
        JadLog: "green-darken-1",
        "Total Express": "blue-darken-1",
        DHL: "red-darken-1",
        FedEx: "purple-darken-1",
      };
      return colors[carrier] || "grey";
    };

    const carriers = ["Correios", "JadLog", "Total Express", "DHL", "FedEx"];

    const fetchStoresAndOrders = async () => {
      try {
        loading.value = true;
        // Primeiro, buscar todas as lojas do usuário
        const userStores = await storesApi.getStores(userStore.user.id);
        stores.value = userStores;

        // Em seguida, buscar os pedidos de cada loja
        const allOrders = await Promise.all(
          userStores.map(async (store) => {
            const storeOrders = await ordersApi.getStoreOrders(store.id);
            return storeOrders.data.map((order) => ({
              ...order,
              store_name: store.name, // Adicionar o nome da loja aos dados do pedido
              store_id: store.id,
            }));
          })
        );

        // Transformar o array de arrays em um único array de pedidos
        orders.value = allOrders.flat();
      } catch (error) {
        console.error("Erro ao buscar lojas e pedidos:", error);
      } finally {
        loading.value = false;
      }
    };

    const metrics = [
      {
        title: "Total de Pedidos",
        value: "1,234",
        trend: 12.5,
        icon: "mdi-shopping",
        gradient: "primary",
      },
      {
        title: "Receita Total",
        value: "R$ 45.678",
        trend: 8.3,
        icon: "mdi-currency-brl",
        gradient: "success",
      },
      {
        title: "Ticket Médio",
        value: "R$ 186",
        trend: -2.1,
        icon: "mdi-chart-line",
        gradient: "info",
      },
    ];

    const headers = [
      { text: "Pedido", value: "id", width: "450px" },
      { text: "Cliente", value: "client.name", width: "80px" }, // Exibir o nome do cliente
      { text: "Valor", value: "total_amount" },
      { text: "Status", value: "status", width: "100px" },
      { text: "Data", value: "created_at", width: "150px" },
      { text: "Ações", value: "actions", sortable: false, width: "150px" },
    ];

    // Processar os pedidos para exibição na tabela
    const processedOrders = computed(() => {
      return orders.value.map((order) => ({
        ...order,
        created_at: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "N/A", // Formatar a data
      }));
    });

    const getInitials = (name) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    };

    const formatCurrency = (value) => {
      if (!value) return "0,00";
      return Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    const getStatusIcon = (status) => {
      const icons = {
        pending: "mdi-clock-outline",
        processing: "mdi-cog-outline",
        confirmed: "mdi-check-circle-outline",
        shipped: "mdi-truck-fast",
        delivered: "mdi-package-variant-closed-check",
        cancelled: "mdi-close-circle-outline",
      };
      return icons[status?.toLowerCase()] || "mdi-help-circle-outline";
    };

    const getGradientClass = (index) => {
      const classes = ["gradient-primary", "gradient-success", "gradient-info"];
      return classes[index % classes.length];
    };

    const getStatusColor = (status) => {
      const colors = {
        pending: palette.warning[300],
        processing: palette.skyblue[300],
        confirmed: palette.success[300],
        shipped: palette.royalblue[300],
        delivered: palette.teal[300],
        cancelled: palette.danger[300],
      };
      return colors[status?.toLowerCase()] || palette.slategray[300];
    };

    const openNfeDialog = (order) => {
      selectedOrder.value = order;
      nfeDialog.value = true;
    };

    const openTrackingDialog = (order) => {
      selectedOrder.value = order;
      trackingDialog.value = true;
    };

    const emitNfe = async () => {
      try {
        loading.value = true;
        // Aqui virá a integração com a API de emissão de NFe
        console.log("Emitindo NFe:", {
          order: selectedOrder.value,
          nfeData: nfeData.value,
        });
        // Atualizar status do pedido
        nfeDialog.value = false;
      } catch (error) {
        console.error("Erro ao emitir NFe:", error);
      } finally {
        loading.value = false;
      }
    };

    const saveTracking = async () => {
      try {
        loading.value = true;
        // Aqui virá a integração com a API de tracking
        console.log("Salvando tracking:", {
          order: selectedOrder.value,
          trackingData: trackingData.value,
        });
        // Atualizar status do pedido
        trackingDialog.value = false;
      } catch (error) {
        console.error("Erro ao salvar tracking:", error);
      } finally {
        loading.value = false;
      }
    };

    const acceptOrder = async (order) => {
      try {
        loading.value = true;
        // Aqui virá a integração com a API de aceitação de pedido
        console.log("Aceitando pedido:", order);
        // Atualizar status do pedido
      } catch (error) {
        console.error("Erro ao aceitar pedido:", error);
      } finally {
        loading.value = false;
      }
    };

    // Buscar os pedidos da loja quando o componente for montado
    onMounted(async () => {
      try {
        loading.value = true;
        fetchStoresAndOrders();
      } catch (error) {
        console.error("Erro ao buscar pedidos da loja:", error);
      } finally {
        loading.value = false;
      }
    });

    // onBeforeMount(fetchStoresAndOrders);

    return {
      loading,
      loadingMetrics,
      search,
      metrics,
      headers,
      nfeDialog,
      trackingDialog,
      nfeData,
      trackingData,
      carriers,
      processedOrders, // Pedidos processados para exibição
      getGradientClass,
      getStatusColor,
      openNfeDialog,
      openTrackingDialog,
      emitNfe,
      saveTracking,
      acceptOrder,

      getInitials,
      formatCurrency,
      getStatusIcon,

      nfeFormValid,
      trackingFormValid,
      menu,
      getCarrierIcon,
      getCarrierColor,
      selectedOrder,
    };
  },
};
</script>

<style scoped>
.metrics-card {
  transition: transform 0.2s;
  border-radius: 12px;
}

.metrics-card:hover {
  transform: translateY(-5px);
}

.gradient-primary {
  background: linear-gradient(
    135deg,
    var(--v-primary-base) 0%,
    var(--v-primary-darken1) 100%
  );
  color: white;
}

.gradient-success {
  background: linear-gradient(
    135deg,
    var(--v-success-base) 0%,
    var(--v-success-darken1) 100%
  );
  color: white;
}

.gradient-info {
  background: linear-gradient(
    135deg,
    var(--v-info-base) 0%,
    var(--v-info-darken1) 100%
  );
  color: white;
}

.v-data-table {
  border-radius: 12px;
}
:deep(.v-data-table) {
  font-size: 14px;
}

:deep(.v-data-table-header) {
  background-color: #f8fafc;
}

:deep(.v-data-table-header th) {
  font-weight: 600 !important;
  color: #475569 !important;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

:deep(.v-data-table .v-data-table__tr:hover) {
  background-color: #f1f5f9;
}

:deep(.v-data-table tbody tr) {
  border-bottom: 1px solid #f1f5f9;
}

:deep(.v-data-table tbody tr:last-child) {
  border-bottom: none;
}
</style>
