<template>
  <v-container>
    <div v-if="isLoading" class="d-flex justify-center align-center pa-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="!stores.length" class="empty-state pa-8">
      <v-card class="text-center pa-6">
        <v-icon size="64" color="grey">mdi-store-off</v-icon>
        <h2 class="text-h5 mt-4 mb-2">No Stores Found</h2>
        <p class="text-body-1 mb-4 text-grey">
          Você ainda não criou nenhuma loja. Comece criando sua primeira loja!
        </p>
        <v-btn color="primary" @click="addStore" prepend-icon="mdi-plus">
          Criar Loja
        </v-btn>
      </v-card>
    </div>
    <v-toolbar
      v-else
      :color="palette.slategray[700]"
      flat
      class="d-flex justify-around align-center mb-4 border-radius rounded px-2 elevation-3"
    >
      <v-toolbar-title>Lojas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip start>
        <template v-slot:activator>
          <v-btn variant="outlined" class="hover1" @click="addStore(userId)">
            <v-icon>mdi-plus</v-icon>
            Nova Loja
          </v-btn>
        </template>
        <span>Adicionar nova loja</span>
      </v-tooltip>
    </v-toolbar>
    <v-row v-for="store in stores" :key="store.id" class="mb-4">
      <v-col cols="12">
        <v-card :color="palette.slategray[300]" class="elevation-3">
          <!-- Tabela de Itens -->
          <v-card-text>
            <v-toolbar
              :color="palette.slategray[600]"
              flat
              class="d-flex justify-around align-center mb-4 border-radius rounded px-2 elevation-3"
            >
              <v-col cols="1">
                <v-avatar
                  :image="`${URL_BACKEND}/upload/images/${store.logo}`"
                  size="50"
                  class="rounded-circle"
                >
                  <!-- Fallback caso a imagem não carregue -->
                  <template v-slot:placeholder>
                    <v-icon size="large">mdi-store</v-icon>
                  </template>
                </v-avatar>
              </v-col>
              <v-row class="align-center">
                <v-col cols="5">
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
                    Editar Loja
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
                  Adicionar Novo Item
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
                    <th
                      v-for="header in headers"
                      :key="header.text"
                      class="text-center"
                    >
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
                          :model-value="item.status === 'active'"
                          @update:model-value="toggleStatus(item)"
                          density="compact"
                          :color="palette.lightblue[400]"
                          :true-value="true"
                          :false-value="false"
                          class="status-switch"
                        >
                          <template v-slot:label>
                            <span
                              :class="
                                item.status === 'active'
                                  ? 'text-success'
                                  : 'text-error'
                              "
                            >
                              {{
                                item.status === "active" ? "Active" : "Inactive"
                              }}
                            </span>
                          </template>
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
                        Esta loja ainda não possui itens cadastrados.
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
import { useUserStore } from "@/stores/useStore";
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
  VAvatar,
} from "vuetify/components";
import palette from "../../../palette";
import storesApi from "../../utils/api/stores";

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
    VAvatar,
  },
  setup() {
    const storesStore = useStoresStore();
    const userStore = useUserStore();
    const router = useRouter();
    const userId = userStore.user.id;
    const stores = ref([]);
    const expandedItems = ref([]);
    const isLoading = ref(true);
    const loadingSwitch = ref({}); // Track switch loaders for items
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const headers = [
      { text: "Nome", value: "name" },
      { text: "Descrição", value: "description" },
      { text: "Preço (R$)", value: "price" },
      { text: "Status", value: "status" },
      { text: "Ações", value: "actions" },
    ];

    const fatchSotres = async () => {
      try {
        const resStore = await storesApi.getStores(userId);
        if (resStore) {
          storesStore.setStores(resStore);
        } else {
          storesStore.setStores([]); // Set empty array if no stores
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        storesStore.setStores([]);
      }
    };

    const fetchStoresWithItems = async () => {
      try {
        await fatchSotres();
      } catch (error) {
        console.log("sem lojas");
      }
      try {
        const storesData = storesStore.stores;
        for (const store of storesData) {
          const itemsResponse = await itemsApi.getItemsInStore(store.id);
          console.log(store.logo);
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
      if (loadingSwitch.value[item.id]) return;

      loadingSwitch.value[item.id] = true;
      const oldStatus = item.status;
      const newStatus = item.status === "active" ? "inactive" : "active";

      try {
        await itemsApi.updateItem(item.id, { status: newStatus });
        item.status = newStatus;
        fetchStoresWithItems();
      } catch (error) {
        console.error("Failed to update item status:", error);
        item.status = oldStatus; // Revert on error
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
        router.push("/");
        alert("oiii");
      } else {
        fetchStoresWithItems();
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
      URL_BACKEND,
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

/* Updated inactive item styling */
tbody tr.inactive {
  border: 2px solid #dc3545 !important;
  background-color: rgba(220, 53, 69, 0.05);
  transition: all 0.3s ease;
}

tbody tr.inactive:hover {
  background-color: rgba(220, 53, 69, 0.1);
  border-color: #c82333 !important;
}

tbody tr.inactive td {
  border-top: 2px solid #dc3545;
  border-bottom: 2px solid #dc3545;
}

tbody tr.inactive td:first-child {
  border-left: 2px solid #dc3545;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

tbody tr.inactive td:last-child {
  border-right: 2px solid #dc3545;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
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

.status-switch {
  display: flex;
  justify-content: center;

  margin: 0;
  padding: 0;
}

:deep(.v-switch__track) {
  opacity: 0.5;
}

:deep(.v-switch--active .v-switch__track) {
  opacity: 1;
}

/* Enhanced switch styling for inactive state */
:deep(.v-switch:not(.v-switch--active) .v-switch__track) {
  color: #f00018 !important;
  opacity: 0.7;
}

.ma-2 {
  margin: 0 4px;
}

.hover1:hover {
  color: #f5f5f5;
}
</style>
