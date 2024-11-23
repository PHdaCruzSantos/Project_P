<template>
  <v-container>
    <v-toolbar
      :color="palette.slategray[700]"
      flat
      class="d-flex justify-around align-center mb-4 border-radius rounded px-2 elevation-3"
    >
      <v-toolbar-title>Stores</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip start>
        <template v-slot:activator>
          <v-btn
            variant="outlined"
            class="hover1"
            :color="palette.lightblue[300]"
            @click="addStore(userId)"
          >
            <v-icon>mdi-plus</v-icon>
            New Sotore
          </v-btn>
        </template>
        <span>Add a new store</span>
      </v-tooltip>
    </v-toolbar>
    <v-row
      v-if="isLoggedIn && !isLoading"
      v-for="store in stores"
      :key="store.id"
      class="mb-4"
    >
      <v-col cols="12">
        <v-card :color="palette.slategray[300]" class="elevation-3">
          <!-- Cabeçalho da Loja -->
          <v-card-title> </v-card-title>

          <!-- Tabela de Itens -->
          <v-card-text>
            <v-toolbar
              :color="palette.slategray[600]"
              flat
              class="d-flex justify-around align-center mb-4 border-radius rounded px-2 elevation-3"
            >
              <v-row class="align-center">
                <v-col cols="6">
                  <v-icon class="pr-2">mdi-store</v-icon>
                </v-col>
                <v-col cols="6">
                  <div class="text-h6">{{ store.name }}</div>
                  <div class="text-subtitle-1 text-secondary">
                    {{ store.address }}
                  </div>
                </v-col>
                <v-col cols="6" class="text-start">
                  <v-btn
                    variant="outlined"
                    :color="palette.warning[100]"
                    @click="editStore(store.id)"
                  >
                    <v-icon class="pr-2"> mdi-store-edit </v-icon>
                    Edit Store
                  </v-btn>
                </v-col>
              </v-row>
              <v-toolbar-title>Items</v-toolbar-title>
              <v-spacer></v-spacer>
              <div style="flex-basis: 20%">
                <v-btn
                  variant="outlined"
                  class="hover1"
                  :color="palette.lightblue[100]"
                  @click="addItem(store.id)"
                >
                  <v-icon class="pr-2">mdi-plus</v-icon>
                  New Item
                </v-btn>
              </div>
            </v-toolbar>
            <div
              class="table-responsive"
              :style="{ backgroundColor: palette.slategray[100] }"
            >
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th v-for="header in headers" :key="header.text">
                      {{ header.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in store.items" :key="item.id">
                    <!-- Linha do Item Principal -->
                    <tr
                      :class="{ inactive: item.status === 'inactive' }"
                      :style="{ opacity: loadingSwitch[item.id] ? 0.5 : 1 }"
                      class="border-radius rounded"
                    >
                      <td
                        class="border-radius rounded"
                        :color="palette.skyblue[200]"
                      >
                        <div class="d-flex align-center">
                          <v-icon
                            size="small"
                            class="ma-2"
                            @click="toggleVariants(item.id)"
                          >
                            {{
                              expandedItems.includes(item.id)
                                ? "mdi-chevron-down"
                                : "mdi-chevron-right"
                            }}
                          </v-icon>
                          {{ item.name }}
                        </div>
                      </td>
                      <td>{{ item.description }}</td>
                      <td class="text-center">
                        R$ {{ item.price.toFixed(2) }}
                      </td>
                      <td class="text-center">
                        <!-- //REVIEW - O switch não está funcionando corretamenten
                        como toggle de status do item -->
                        <v-switch
                          v-if="!loadingSwitch[item.id]"
                          :v-model="!!item.status"
                          @change="toggleStatus(item)"
                          :label="
                            item.status === 'active' ? 'Active' : 'Inactive'
                          "
                          color="primary"
                        >
                          <v-progress-circular
                            v-if="loadingSwitch[item.id]"
                            indeterminate
                            color="primary"
                            size="20"
                          ></v-progress-circular>
                        </v-switch>
                      </td>
                      <td class="text-center">
                        <v-icon
                          size="large"
                          class="ma-2"
                          @click="viewItem(item.id)"
                          color="primary"
                          >mdi-eye</v-icon
                        >
                      </td>
                    </tr>

                    <!-- Variantes do Item -->
                    <tr
                      v-for="variant in item.variants"
                      :key="variant.id"
                      v-if="expandedItems.includes(item.id)"
                      class="variant-row border-radius rounded"
                    >
                      <td
                        :style="{ backgroundColor: palette.skyblue[50] }"
                        class="pl-5"
                      >
                        ↳ {{ variant.variant_name }}
                      </td>
                      <td ::style="{ backgroundColor: palette.skyblue[50] }">
                        {{ variant.description || "No description" }}
                      </td>
                      <td
                        :style="{ backgroundColor: palette.skyblue[50] }"
                        class="text-end"
                      >
                        R$
                        {{ variant.price ? variant.price.toFixed(2) : "N/A" }}
                      </td>
                      <td
                        :style="{ backgroundColor: palette.skyblue[50] }"
                        class="text-end"
                      >
                        <span v-if="variant.quantity > 0" class="text-success">
                          {{ variant.quantity }} in stock
                        </span>
                        <span v-else class="text-error">Out of stock</span>
                      </td>
                    </tr>
                  </template>

                  <!-- Mensagem Caso Não Haja Itens -->
                  <tr v-if="store.items.length === 0">
                    <td colspan="5" class="text-center">
                      <v-alert type="info" elevation="1" icon="mdi-alert">
                        No items found in this store.
                      </v-alert>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Skeleton Loader -->
    <v-row v-if="isLoading" class="mt-4">
      <v-col cols="12">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
      <v-col cols="12">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStoresStore } from "../../stores/storesStore";
import { useUserStore } from "../../stores/useStore";
import { useRouter } from "vue-router";
import itemsApi from "../../utils/api/items";
import {
  VBtn,
  VCard,
  VCardTitle,
  VCardText,
  VCol,
  VContainer,
  VRow,
  VToolbar,
  VTextField,
  VToolbarTitle,
  VSpacer,
  VTooltip,
  VIcon,
  VAlert,
  VSkeletonLoader,
  VSwitch,
  VProgressCircular,
  VHover,
} from "vuetify/components";
import palette from "../../../palette";

export default {
  name: "ProductsList",
  components: {
    VBtn,
    VCard,
    VCardTitle,
    VCardText,
    VCol,
    VContainer,
    VRow,
    VToolbar,
    VTextField,
    VToolbarTitle,
    VSpacer,
    VTooltip,
    VIcon,
    VAlert,
    VSkeletonLoader,
    VSwitch,
    VProgressCircular,
    VHover,
  },
  setup() {
    const storesStore = useStoresStore();
    const userStore = useUserStore();
    const router = useRouter();
    const userId = userStore.user.user.id;
    const stores = ref([]);
    const expandedItems = ref([]);
    const isLoading = ref(true);
    const loadingSwitch = ref({}); // Track switch loaders for items

    const headers = [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Price", value: "price" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "actions" },
    ];

    const fetchStoresWithItems = async () => {
      try {
        const storesData = storesStore.stores;
        for (const store of storesData) {
          const itemsResponse = await itemsApi.getItemsInStore(store.id);
          for (const item of itemsResponse) {
            const variantsResponse = await itemsApi.getAllVariantsItem(item.id);
            item.variants = variantsResponse;
          }
          store.items = itemsResponse;
          store.search = "";
          console.log(storesData);
        }
        stores.value = storesData;
      } catch (error) {
        console.error("Failed to fetch stores with items:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const toggleVariants = (itemId) => {
      if (expandedItems.value.includes(itemId)) {
        expandedItems.value = expandedItems.value.filter((id) => id !== itemId);
      } else {
        expandedItems.value.push(itemId);
      }
    };

    const toggleStatus = async (item) => {
      if (loadingSwitch.value[item.id]) return; // Prevent multiple updates
      loadingSwitch.value[item.id] = true;
      const newStatus = item.status ? "inactive" : "active";
      try {
        await itemsApi.updateItem(item.id, { status: newStatus });
        item.status = newStatus; // Update status in UI
      } catch (error) {
        console.error("Failed to update item status:", error);
      } finally {
        loadingSwitch.value[item.id] = false;
      }
    };

    const viewItem = (itemId) =>
      router.push({ name: "ItemInfoView", params: { itemId } });

    const addItem = (storeId) =>
      router.push({ name: "AddItemView", params: { storeId } });

    const addStore = (userId) =>
      router.push({ name: "AddStoreView", params: { userId } });

    const editStore = (storeId) =>
      router.push({ name: "EditStoreView", params: { storeId } });

    const isLoggedIn = computed(() => userStore.isLoggedIn);

    onMounted(() => {
      if (!isLoggedIn.value) {
        router.push("/login");
      } else {
        fetchStoresWithItems();
        console.log(userStore.user.user.id);
      }
    });

    return {
      stores,
      headers,
      expandedItems,
      isLoading,
      loadingSwitch,
      isLoggedIn,
      toggleVariants,
      toggleStatus,
      viewItem,
      addItem,
      userId,
      addStore,
      palette,
      editStore,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

table {
  width: 100%;
  border-spacing: 0 10px;
}

tbody tr.inactive {
  background-color: #e19999;
  opacity: 0.6;
}
tbody tr.inactive:hover {
  background-color: #d36666;
}

tbody tr:hover {
  background-color: #b3e1f3;
}

td {
  padding: 12px;
}

.variant-row td {
  font-size: 0.9rem;
  background-color: #f4f4f4;
  color: #666;
  border-left: 4px solid #004aad;
}
.variant-row td:last-child {
  border-right: 4px solid #004aad;
}
.v-switch {
  transform: scale(0.9);
}

.ma-2 {
  margin: 0 4px;
}
.hover1:hover {
  color: #f5f5f5;
}
</style>
