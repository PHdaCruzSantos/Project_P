<template>
  <v-container>
    <v-row>
      <!-- Metrics Cards -->
      <v-col cols="12" md="4" v-for="store in stores" :key="store.id">
        <v-card class="metrics-card">
          <v-card-title class="d-flex align-center">
            {{ store.name }}
            <v-spacer></v-spacer>
            <v-chip :color="store.status === 'active' ? 'success' : 'warning'">
              {{ store.status }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h6">Total Orders</div>
                  <div class="text-h4">
                    {{ store.metrics?.totalOrders || 0 }}
                  </div>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="text-center">
                  <div class="text-h6">Revenue</div>
                  <div class="text-h4">
                    {{ formatCurrency(store.metrics?.totalRevenue || 0) }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Orders List -->
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            Recent Orders
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search orders"
              single-line
              hide-details
              density="compact"
              class="max-w-xs"
            ></v-text-field>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="processedOrders"
            :search="search"
            :loading="loading"
            :items-per-page="10"
          >
            <!-- Order ID -->
            <template #[`item.id`]="{ item }">
              <div class="font-weight-medium">
                #{{ item.raw.id.substring(0, 8) }}
              </div>
            </template>

            <!-- Customer Info -->
            <template #[`item.customer`]="{ item }">
              <div class="d-flex flex-column">
                <span class="font-weight-medium">{{
                  item.raw.client.name
                }}</span>
                <span class="text-caption">{{ item.raw.client.email }}</span>
              </div>
            </template>

            <!-- Items -->
            <template #[`item.items`]="{ item }">
              <div class="d-flex flex-column">
                <div
                  v-for="(orderItem, index) in item.raw.items"
                  :key="index"
                  class="mb-1"
                >
                  <span class="font-weight-medium"
                    >{{ orderItem.quantity }}x</span
                  >
                  {{ orderItem.item_name }}
                </div>
              </div>
            </template>

            <!-- Payment -->
            <template #[`item.payment`]="{ item }">
              <div class="d-flex flex-column">
                <v-chip
                  size="small"
                  :color="getPaymentMethodColor(item.raw.payment_method)"
                  class="mb-1"
                >
                  {{ item.raw.payment_method.toUpperCase() }}
                </v-chip>
                <span class="font-weight-medium">{{
                  formatCurrency(item.raw.total_amount)
                }}</span>
              </div>
            </template>

            <!-- Status -->
            <template #[`item.status`]="{ item }">
              <v-chip :color="getStatusColor(item.raw.status)" size="small">
                {{ item.raw.status }}
              </v-chip>
            </template>

            <!-- Date -->
            <template #[`item.created_at`]="{ item }">
              <div class="d-flex flex-column">
                <span>{{ formatDate(item.raw.created_at) }}</span>
                <span class="text-caption">{{
                  formatTime(item.raw.created_at)
                }}</span>
              </div>
            </template>

            <!-- Actions -->
            <template #actions="{ item }">
              <v-btn
                icon="mdi-eye"
                size="small"
                color="primary"
                variant="text"
                @click="viewOrderDetails(item.raw)"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                color="warning"
                variant="text"
                @click="openStatusUpdate(item.raw)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Order Details Dialog -->
    <v-dialog v-model="showOrderDetails" max-width="800">
      <v-card v-if="selectedOrder">
        <v-card-title class="d-flex align-center bg-primary text-white">
          Order Details #{{ selectedOrder.id.substring(0, 8) }}
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            @click="showOrderDetails = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <!-- Customer Information -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-subtitle-1"
                  >Customer Information</v-card-title
                >
                <v-card-text>
                  <div class="d-flex flex-column gap-2">
                    <div>
                      <div class="text-caption">Name</div>
                      <div class="font-weight-medium">
                        {{ selectedOrder.client.name }}
                      </div>
                    </div>
                    <div>
                      <div class="text-caption">Email</div>
                      <div>{{ selectedOrder.client.email }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Shipping Information -->
            <v-col cols="12" md="6">
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="text-subtitle-1"
                  >Shipping Information</v-card-title
                >
                <v-card-text>
                  <div class="d-flex flex-column gap-2">
                    <div>
                      <div class="text-caption">Address</div>
                      <div>{{ selectedOrder.shipping_address }}</div>
                    </div>
                    <div>
                      <div class="text-caption">Tracking Code</div>
                      <div>
                        {{ selectedOrder.tracking_code || "Not available" }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Order Items -->
            <v-col cols="12">
              <v-card variant="outlined">
                <v-card-title class="text-subtitle-1">Order Items</v-card-title>
                <v-card-text>
                  <v-table density="comfortable">
                    <thead>
                      <tr>
                        <th scope="col" class="text-right">Item</th>
                        <th scope="col" class="text-right">Quantity</th>
                        <th scope="col" class="text-right">Price</th>
                        <th scope="col" class="text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selectedOrder.items" :key="item.id">
                        <td>{{ item.item_name }}</td>
                        <td class="text-right">{{ item.quantity }}</td>
                        <td class="text-right">
                          {{ formatCurrency(item.price) }}
                        </td>
                        <td class="text-right">
                          {{ formatCurrency(item.price * item.quantity) }}
                        </td>
                      </tr>
                      <tr class="grey lighten-4">
                        <td colspan="3" class="text-right font-weight-bold">
                          Shipping
                        </td>
                        <td class="text-right">
                          {{ formatCurrency(selectedOrder.shipping_price) }}
                        </td>
                      </tr>
                      <tr class="grey lighten-4">
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right font-weight-bold">
                          {{ formatCurrency(selectedOrder.total_amount) }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Status Update Dialog -->
    <v-dialog v-model="showStatusUpdate" max-width="400">
      <v-card>
        <v-card-title>Update Order Status</v-card-title>
        <v-card-text>
          <v-select
            v-model="newStatus"
            :items="statusOptions"
            label="Select Status"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showStatusUpdate = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="updateStatus">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/useStore";
import ordersApi from "@/utils/api/ordersApi";
import storesApi from "@/utils/api/stores";

export default {
  name: "StoreOrders",
  setup() {
    const userStore = useUserStore();
    const loading = ref(false);
    const stores = ref([]);
    const search = ref("");
    const showOrderDetails = ref(false);
    const showStatusUpdate = ref(false);
    const selectedOrder = ref(null);
    const newStatus = ref("");

    const headers = [
      { title: "Order ID", key: "id", width: "120" },
      { title: "Customer", key: "customer" },
      { title: "Items", key: "items" },
      { title: "Payment", key: "payment", width: "150" },
      { title: "Status", key: "status", width: "120" },
      { title: "Date", key: "created_at", width: "150" },
      { title: "Actions", key: "actions", width: "100", sortable: false },
    ];

    const statusOptions = [
      "pending",
      "processing",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const processedOrders = computed(() => {
      const allOrders = stores.value.reduce((acc, store) => {
        if (store.orders?.data) {
          return [...acc, ...store.orders.data];
        }
        return acc;
      }, []);

      return allOrders;
    });

    const getStatusColor = (status) => {
      const colors = {
        pending: "warning",
        processing: "info",
        confirmed: "success",
        shipped: "purple",
        delivered: "green",
        cancelled: "error",
      };
      return colors[status?.toLowerCase()] || "grey";
    };

    const getPaymentMethodColor = (method) => {
      const colors = {
        pix: "success",
        credit: "primary",
        debit: "info",
        boleto: "warning",
      };
      return colors[method] || "grey";
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value || 0);
    };

    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("pt-BR");
    };

    const formatTime = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const loadData = async () => {
      try {
        loading.value = true;
        const userStores = await storesApi.getStores(userStore.user.id);

        const storesWithOrders = await Promise.all(
          userStores.map(async (store) => {
            try {
              const orders = await ordersApi.getStoreOrders(store.id);
              const metrics = {
                totalOrders: orders.total || 0,
                totalRevenue:
                  orders.data?.reduce(
                    (sum, order) => sum + order.total_amount,
                    0
                  ) || 0,
              };

              return {
                ...store,
                metrics,
                orders,
              };
            } catch (error) {
              console.error(`Error loading data for store ${store.id}:`, error);
              return {
                ...store,
                metrics: { totalOrders: 0, totalRevenue: 0 },
                orders: { data: [], total: 0 },
              };
            }
          })
        );

        stores.value = storesWithOrders;
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        loading.value = false;
      }
    };

    const viewOrderDetails = (order) => {
      selectedOrder.value = order;
      showOrderDetails.value = true;
    };

    const openStatusUpdate = (order) => {
      selectedOrder.value = order;
      newStatus.value = order.status.toLowerCase();
      showStatusUpdate.value = true;
    };

    const updateStatus = async () => {
      try {
        loading.value = true;
        await ordersApi.updateOrderStatus(
          selectedOrder.value.id,
          newStatus.value
        );
        await loadData(); // Reload data
        showStatusUpdate.value = false;
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadData);

    return {
      loading,
      stores,
      processedOrders,
      search,
      headers,
      statusOptions,
      showOrderDetails,
      showStatusUpdate,
      selectedOrder,
      newStatus,
      getStatusColor,
      getPaymentMethodColor,
      formatCurrency,
      formatDate,
      formatTime,
      viewOrderDetails,
      openStatusUpdate,
      updateStatus,
    };
  },
};
</script>

<style scoped>
.metrics-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: transform 0.2s;
}

.metrics-card:hover {
  transform: translateY(-5px);
}
</style>
