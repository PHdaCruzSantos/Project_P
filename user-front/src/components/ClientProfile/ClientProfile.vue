<template>
  <v-container>
    <v-row>
      <!-- Profile Header -->
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar size="100" color="primary">
                <v-img
                  v-if="client?.profile_image"
                  :src="client.profile_image"
                />
                <v-icon v-else size="48">mdi-account</v-icon>
              </v-avatar>
              <div class="ml-4">
                <h2 class="text-h4">{{ client?.name }}</h2>
                <p class="text-subtitle-1">{{ client?.email }}</p>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Main Content -->
      <v-col cols="12">
        <v-card>
          <v-tabs v-model="activeTab" grow>
            <v-tab value="info">Personal Info</v-tab>
            <v-tab value="addresses">Addresses</v-tab>
            <v-tab value="orders">Orders</v-tab>
            <v-tab value="favorites">Favorites</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Personal Info Tab -->
            <v-window-item value="info">
              <v-card-text>
                <v-form @submit.prevent="updatePersonalInfo">
                  <v-text-field
                    v-model="editedClient.name"
                    label="Name"
                    :rules="[(v) => !!v || 'Name is required']"
                  />
                  <v-text-field
                    v-model="editedClient.email"
                    label="Email"
                    type="email"
                    :rules="[(v) => !!v || 'Email is required']"
                  />
                  <v-text-field
                    v-model="editedClient.cpf"
                    label="CPF"
                    :rules="[(v) => !!v || 'CPF is required']"
                    mask="###.###.###-##"
                  />
                  <v-btn color="primary" type="submit" :loading="loading">
                    Update Profile
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-window-item>

            <!-- Addresses Tab -->
            <v-window-item value="addresses">
              <v-card-text>
                <v-btn
                  color="primary"
                  class="mb-4"
                  @click="showAddAddressDialog"
                >
                  Add New Address
                </v-btn>

                <v-row>
                  <v-col
                    v-for="address in addresses"
                    :key="address.id"
                    cols="12"
                    md="6"
                  >
                    <v-card variant="outlined">
                      <v-card-text>
                        <p><strong>CEP:</strong> {{ address.cep }}</p>
                        <p><strong>Address:</strong> {{ address.address }}</p>
                        <p><strong>City:</strong> {{ address.city }}</p>
                        <p><strong>State:</strong> {{ address.state }}</p>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          variant="text"
                          color="primary"
                          @click="editAddress(address)"
                        >
                          Edit
                        </v-btn>
                        <v-btn
                          variant="text"
                          color="error"
                          @click="deleteAddress(address.id)"
                        >
                          Delete
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-window-item>

            <!-- Orders Tab -->
            <v-window-item value="orders">
              <v-card-text>
                <v-timeline>
                  <v-timeline-item
                    v-for="order in orders"
                    :key="order.id"
                    size="small"
                  >
                    <template v-slot:opposite>
                      {{ formatDate(order.created_at) }}
                    </template>
                    <v-card>
                      <v-card-title class="text-h6">
                        Order #{{ order.id }}
                      </v-card-title>
                      <v-card-text>
                        <p>Status: {{ order.status }}</p>
                        <p>Total: {{ formatPrice(order.total) }}</p>
                        <v-chip :color="getStatusColor(order.status)">
                          {{ order.status }}
                        </v-chip>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-window-item>

            <!-- Favorites Tab -->
            <v-window-item value="favorites">
              <v-card-text>
                <v-row v-if="!loadingFavorites && favoriteItems.length">
                  <v-col
                    v-for="favoriteItem in favoriteItems"
                    :key="favoriteItem.item.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card class="h-100">
                      <v-img
                        :src="getImageUrl(favoriteItem.item.image_names)"
                        height="200"
                        cover
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="grey-lighten-2"
                            />
                          </v-row>
                        </template>
                      </v-img>

                      <v-card-title class="text-truncate">
                        {{ favoriteItem.item.name }}
                      </v-card-title>

                      <v-card-text>
                        <div class="d-flex align-center mb-2">
                          <v-rating
                            :model-value="Number(favoriteItem.averageRating)"
                            color="warning"
                            density="compact"
                            half-increments
                            readonly
                            size="small"
                          />
                          <span class="text-caption ms-2">
                            ({{ favoriteItem.reviews.length }} reviews)
                          </span>
                        </div>

                        <div class="text-h6 mb-2 primary--text">
                          {{ formatPrice(favoriteItem.item.price) }}
                        </div>

                        <div class="text-truncate mb-2">
                          {{ favoriteItem.item.description }}
                        </div>

                        <v-chip
                          :color="
                            favoriteItem.item.status === 'active'
                              ? 'success'
                              : 'error'
                          "
                          size="small"
                          class="mt-2"
                        >
                          {{ favoriteItem.item.status }}
                        </v-chip>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn
                          prepend-icon="mdi-cart-plus"
                          color="primary"
                          variant="text"
                          :disabled="favoriteItem.item.status !== 'active'"
                          @click="cartStore.addToCart(favoriteItem.item)"
                        >
                          Add to Cart
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          icon
                          color="error"
                          @click="
                            clientStore.toggleFavorite(favoriteItem.item.id)
                          "
                        >
                          <v-icon>mdi-heart</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

                <v-progress-circular
                  v-else-if="loadingFavorites"
                  indeterminate
                  class="ma-4"
                />

                <v-alert
                  v-else
                  type="info"
                  text="No favorite items yet"
                  class="ma-4"
                />
              </v-card-text>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- Address Dialog -->
    <v-dialog v-model="addressDialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editedAddress.id ? "Edit Address" : "Add Address" }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveAddress">
            <v-text-field
              v-model="editedAddress.cep"
              label="CEP"
              mask="#####-###"
            />
            <v-text-field v-model="editedAddress.address" label="Address" />
            <v-text-field v-model="editedAddress.city" label="City" />
            <v-text-field v-model="editedAddress.state" label="State" />
            <v-btn color="primary" type="submit" :loading="loading">
              Save
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardText,
  VAvatar,
  VImg,
  VIcon,
  VForm,
  VTextField,
  VBtn,
  VTabs,
  VTab,
  VWindow,
  VWindowItem,
  VTimeline,
  VTimelineItem,
  VCardTitle,
  VCardActions,
  VChip,
  VDialog,
} from "vuetify/components";

import { ref, onMounted } from "vue";
import { useClientStore } from "@/stores/clientsStore";
import { useCartStore } from "@/stores/cartStore";
import clientsApi from "@/utils/api/clientsApi";
import itemsApi from "@/utils/api/itemsApi";
import { useRouter } from "vue-router";

export default {
  name: "ClientProfile",
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardText,
    VAvatar,
    VImg,
    VIcon,
    VForm,
    VTextField,
    VBtn,
    VTabs,
    VTab,
    VWindow,
    VWindowItem,
    VTimeline,
    VTimelineItem,
    VCardTitle,
    VCardActions,
    VChip,
    VDialog,
  },
  setup() {
    const clientStore = useClientStore();
    const cartStore = useCartStore();
    const loading = ref(false);
    const addressDialog = ref(false);
    const activeTab = ref("info");
    const addresses = ref([]);
    const orders = ref([]);
    const favoriteItems = ref([]);
    const router = useRouter();
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const client = ref(null);
    const editedClient = ref({});
    const loadingFavorites = ref(false);
    const editedAddress = ref({
      cep: "",
      address: "",
      city: "",
      state: "",
      country: "Brasil",
    });

    const showAddAddressDialog = () => {
      editedAddress.value = {
        cep: "",
        address: "",
        city: "",
        state: "",
        country: "Brasil",
      };
      addressDialog.value = true;
    };

    const editAddress = (address) => {
      editedAddress.value = { ...address };
      addressDialog.value = true;
    };

    const getImageUrl = (imageNames) => {
      if (!imageNames) return "";
      const firstImage = imageNames.split(",")[0].trim();
      return `${URL_BACKEND}/upload/images/${firstImage}`;
    };

    const saveAddress = async () => {
      try {
        loading.value = true;
        if (editedAddress.value.id) {
          await clientsApi.updateAddress(
            clientStore.currentUser.id,
            editedAddress.value.id,
            editedAddress.value
          );
        } else {
          await clientsApi.createAddress(
            clientStore.currentUser.id,
            editedAddress.value
          );
        }
        await loadClientData();
        addressDialog.value = false;
      } catch (error) {
        console.error("Failed to save address:", error);
      } finally {
        loading.value = false;
      }
    };

    const deleteAddress = async (addressId) => {
      try {
        loading.value = true;
        await clientsApi.deleteAddress(clientStore.currentUser.id, addressId);
        await loadClientData();
      } catch (error) {
        console.error("Failed to delete address:", error);
      } finally {
        loading.value = false;
      }
    };

    const updatePersonalInfo = async () => {
      try {
        loading.value = true;
        await clientsApi.updateClient(
          clientStore.currentUser.id,
          editedClient.value
        );
        await loadClientData();
      } catch (error) {
        console.error("Failed to update profile:", error);
      } finally {
        loading.value = false;
      }
    };

    const loadClientData = async () => {
      try {
        loading.value = true;
        const userData = await clientsApi.getClient(clientStore.currentUser.id);
        client.value = userData;
        editedClient.value = { ...userData };

        const addressesData = await clientsApi.getClientAddresses(
          clientStore.currentUser.id
        );
        addresses.value = addressesData;

        loadingFavorites.value = true;
        if (userData.fav_items) {
          const favoriteIds = userData.fav_items.split(",").filter((id) => id); // Remove empty strings
          try {
            const itemPromises = favoriteIds.map((id) =>
              itemsApi.getAllInfoItem(id)
            );
            console.log("itemPromises", itemPromises);
            favoriteItems.value = await Promise.all(itemPromises);
            console.log("favoriteItems", favoriteItems.value[0].item.name);
          } catch (error) {
            console.error("Failed to load favorite items:", error);
            favoriteItems.value = [];
          }
        } else {
          favoriteItems.value = [];
        }
      } catch (error) {
        console.error("Failed to load client data:", error);
      } finally {
        loading.value = false;
        loadingFavorites.value = false;
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("pt-BR");
    };

    onMounted(async () => {
      if (clientStore.currentUser) {
        await loadClientData();
      } else {
        router.push("/");
      }
    });

    return {
      client,
      editedClient,
      editedAddress,
      loading,
      addressDialog,
      activeTab,
      addresses,
      orders,
      favoriteItems,
      showAddAddressDialog,
      editAddress,
      saveAddress,
      deleteAddress,
      updatePersonalInfo,
      formatPrice,
      formatDate,
      URL_BACKEND,
      getImageUrl,
      loadingFavorites,
    };
  },
};
</script>
