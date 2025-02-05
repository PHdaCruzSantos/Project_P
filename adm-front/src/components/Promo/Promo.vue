<template>
  <v-container>
    <!-- Header Toolbar -->
    <v-toolbar
      :color="palette.slategray[700]"
      flat
      class="d-flex justify-around align-center mb-4 border-radius rounded px-2 elevation-3"
    >
      <v-toolbar-title class="text-h5 font-weight-bold">
        <v-icon icon="mdi-ticket-percent" class="mr-2"></v-icon>
        Promotions & Coupons
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip location="start">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            class="hover1 mr-2"
            :color="palette.lightblue[300]"
            @click="createCoupon"
            prepend-icon="mdi-plus"
          >
            New Coupon
          </v-btn>
        </template>
        <span>Create a new discount coupon</span>
      </v-tooltip>
    </v-toolbar>

    <!-- Special Promotions Section -->
    <v-card :color="palette.slategray[300]" class="mb-4 elevation-3">
      <v-card-title class="d-flex align-center py-4 px-6">
        <v-icon icon="mdi-star" class="mr-2" color="amber"></v-icon>
        <span class="text-h6">Special Promotions</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="promo in specialPromotions"
            :key="promo.id"
            cols="12"
            md="4"
          >
            <v-card :color="palette.slategray[100]" class="elevation-2">
              <v-card-title class="text-h6">{{ promo.name }}</v-card-title>
              <v-card-text>
                <p class="mb-4">{{ promo.description }}</p>
                <v-chip color="primary" class="mb-4">
                  Discount: {{ promo.discount }}%
                </v-chip>
                <v-switch
                  v-model="promo.active"
                  :label="promo.active ? 'Active' : 'Inactive'"
                  color="primary"
                  density="comfortable"
                  class="mt-2"
                ></v-switch>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Stores Section with Improved Table -->
    <v-row v-for="store in stores" :key="store.id" class="mb-4">
      <v-col cols="12">
        <v-card :color="palette.slategray[300]" class="elevation-3">
          <!-- Store Header -->
          <v-toolbar
            :color="palette.slategray[600]"
            flat
            class="px-4 py-2 elevation-1"
          >
            <v-avatar
              :image="`${URL_BACKEND}/upload/images/${store.logo}`"
              size="48"
              class="mr-4"
            >
              <template v-slot:placeholder>
                <v-icon size="large" color="grey">mdi-store</v-icon>
              </template>
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold text-white">
                {{ store.name }}
              </div>
              <div class="text-subtitle-2 text-grey-lighten-2">
                Active Coupons: {{ store.coupons?.length || 0 }}
              </div>
            </div>
          </v-toolbar>

          <!-- Improved Coupons Table -->
          <v-card-text class="pa-4">
            <v-progress-linear
              v-if="isLoading"
              indeterminate
              color="primary"
            ></v-progress-linear>

            <v-table
              v-else
              class="elevation-1 rounded"
              :hover="true"
              fixed-header
              height="auto"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="text-left text-subtitle-1 font-weight-bold py-4"
                  >
                    Code
                  </th>
                  <th
                    class="text-left text-subtitle-1 font-weight-bold"
                    scope="col"
                  >
                    Discount
                  </th>
                  <th
                    scope="col"
                    class="text-left text-subtitle-1 font-weight-bold"
                  >
                    Valid Until
                  </th>
                  <th
                    scope="col"
                    class="text-left text-subtitle-1 font-weight-bold"
                  >
                    Products
                  </th>
                  <th
                    scope="col"
                    class="text-left text-subtitle-1 font-weight-bold"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="text-left text-subtitle-1 font-weight-bold"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coupon in store.coupons" :key="coupon.id">
                  <td class="py-3">
                    <v-chip
                      :color="palette.lightblue[100]"
                      class="font-weight-medium"
                      variant="flat"
                    >
                      {{ coupon.code }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip
                      :color="
                        coupon.discount_type === 'percentage'
                          ? 'success'
                          : 'info'
                      "
                      variant="flat"
                      size="small"
                    >
                      {{
                        coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `R$ ${coupon.discount_value}`
                      }}
                    </v-chip>
                  </td>
                  <td>
                    <v-chip
                      size="small"
                      :color="
                        new Date(coupon.end_date) > new Date()
                          ? 'success-lighten-1'
                          : 'error-lighten-1'
                      "
                    >
                      {{ new Date(coupon.end_date).toLocaleDateString() }}
                    </v-chip>
                  </td>
                  <td>
                    <div
                      class="d-flex flex-wrap gap-1"
                      style="max-width: 300px"
                    >
                      <v-chip
                        v-for="product in coupon.products"
                        :key="product.id"
                        size="x-small"
                        variant="outlined"
                        :color="palette.midnightblue[500]"
                        class="ma-1 px-2"
                      >
                        <v-icon size="x-small" start
                          >mdi-package-variant</v-icon
                        >
                        {{ product.name }}
                      </v-chip>
                      <v-chip
                        v-if="!coupon.products?.length"
                        size="x-small"
                        color="grey-lighten-1"
                      >
                        No products selected
                      </v-chip>
                    </div>
                  </td>
                  <td>
                    <v-switch
                      v-model="coupon.status"
                      :color="switchColor(coupon.status)"
                      density="compact"
                      hide-details
                      @change="toggleCouponStatus(store.id, coupon)"
                      :model-value="coupon.status === 'active'"
                    >
                      <template v-slot:label>
                        <span
                          :class="
                            coupon.status === 'active'
                              ? 'text-success'
                              : 'text-error'
                          "
                        >
                          {{
                            coupon.status === "active" ? "active" : "inactive"
                          }}
                        </span>
                      </template>
                    </v-switch>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <v-btn
                        icon="mdi-pencil"
                        variant="text"
                        size="small"
                        color="primary"
                        @click="editCoupon(coupon)"
                      ></v-btn>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        size="small"
                        color="error"
                        @click="deleteCoupon(store.id, coupon.id)"
                      ></v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Improved Create/Edit Dialog -->
    <v-dialog v-model="couponDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          <v-icon start class="mr-2">
            {{ editingCoupon ? "mdi-pencil" : "mdi-plus" }}
          </v-icon>
          {{ editingCoupon ? "Edit Coupon" : "Create New Coupon" }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-form @submit.prevent="saveCoupon">
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="couponForm.storeId"
                  :items="stores"
                  item-title="name"
                  item-value="id"
                  label="Select Store*"
                  required
                  variant="outlined"
                  @update:model-value="loadStoreProducts"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="couponForm.code"
                  label="Coupon Code*"
                  required
                  variant="outlined"
                  placeholder="Enter coupon code"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="couponForm.discountType"
                  :items="[
                    { title: 'Percentage', value: 'percentage' },
                    { title: 'Fixed Amount', value: 'fixed' },
                  ]"
                  item-title="title"
                  item-value="value"
                  label="Discount Type*"
                  required
                  variant="outlined"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="couponForm.value"
                  :label="
                    couponForm.discountType === 'percentage'
                      ? 'Discount (%)*'
                      : 'Discount (R$)*'
                  "
                  type="number"
                  required
                  variant="outlined"
                  :hint="
                    couponForm.discountType === 'percentage'
                      ? 'Enter percentage value'
                      : 'Enter fixed amount'
                  "
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="couponForm.validUntil"
                  label="Valid Until*"
                  type="date"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="couponForm.products"
                  :items="currentStoreProducts"
                  item-title="name"
                  item-value="id"
                  label="Select Products"
                  multiple
                  chips
                  variant="outlined"
                  :disabled="!couponForm.storeId"
                  :hint="
                    !couponForm.storeId
                      ? 'Select a store first'
                      : 'Select applicable products'
                  "
                  persistent-hint
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      :color="palette.midnightblue[500]"
                      size="lg"
                      class="px-2"
                    >
                      <v-icon start size="x-small">mdi-package-variant</v-icon>
                      {{ item.raw.name }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="outlined" @click="couponDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" class="ml-2" @click="saveCoupon">
            {{ editingCoupon ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useStoresStore } from "../../stores/storesStore";
import { useUserStore } from "../../stores/useStore";
import { useRouter } from "vue-router";
import palette from "../../../palette";
import storesApi from "@/utils/api/stores";
import itemsApi from "@/utils/api/items";
import couponsApi from "@/utils/api/coupons";

import {
  VContainer,
  VDialog,
  VCard,
  VCardText,
  VCardActions,
  VCardTitle,
  VForm,
  VSelect,
  VTextField,
  VRow,
  VCol,
  VBtn,
  VSpacer,
  VIcon,
  VToolbar,
  VAvatar,
  VToolbarTitle,
  VSwitch,
  VChip,
  VTooltip,
  VTable,
} from "vuetify/components";

export default {
  name: "PromoManagement",
  components: {
    VSwitch,
    VTable,
    VTooltip,
    VChip,
    VTextField,
    VToolbarTitle,
    VContainer,
    VDialog,
    VCard,
    VCardText,
    VCardActions,
    VCardTitle,
    VForm,
    VSelect,
    VRow,
    VCol,
    VBtn,
    VSpacer,
    VIcon,
    VToolbar,
    VAvatar,
  },
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const stores = ref([]);
    const couponDialog = ref(false);
    const editingCoupon = ref(null);
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const isLoading = ref(false);
    const currentStoreProducts = ref([]);
    // Mock data for special promotions
    const specialPromotions = ref([
      {
        id: 1,
        name: "Black Friday",
        description: "Special discounts for Black Friday",
        discount: 30,
        active: false,
      },
      {
        id: 2,
        name: "Christmas Sale",
        description: "Holiday season special offers",
        discount: 25,
        active: false,
      },
      {
        id: 3,
        name: "Summer Sale",
        description: "Hot deals for the summer",
        discount: 20,
        active: false,
      },
    ]);

    const storeCoupons = ref(new Map());
    const couponForm = ref({
      code: "",
      discountType: "percentage",
      value: 0,
      validUntil: "",
      products: [],
      storeId: null,
    });

    const fetchStoresWithCoupons = async () => {
      try {
        isLoading.value = true;
        // Get stores first
        const resStores = await storesApi.getStores(userStore.user.user.id);

        // Map stores and get their coupons
        const fetchStoreData = async (store) => {
          const storeItems = await itemsApi.getItemsInStore(store.id);
          const storeCoupons = await couponsApi.getAllCoupons(store.id);

          const uniqueCoupons = storeCoupons.reduce((acc, response) => {
            const coupon = response.coupons;

            if (!acc[coupon.id]) {
              acc[coupon.id] = {
                ...coupon,
                products: [],
              };
            }

            if (response.coupon_products && acc[coupon.id].products) {
              const product = storeItems.find(
                (item) => item.id === response.coupon_products.item_id
              );

              // Check if product exists and not already in array
              if (
                product &&
                !acc[coupon.id].products.find((p) => p.id === product.id)
              ) {
                acc[coupon.id].products.push(product);
              }
            }

            return acc;
          }, {});

          console.log(Object.values(uniqueCoupons));
          return {
            ...store,
            items: storeItems || [],
            coupons: Object.values(uniqueCoupons),
          };
        };

        stores.value = await Promise.all((resStores || []).map(fetchStoreData));
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const loadStoreProducts = async (storeId) => {
      try {
        isLoading.value = true;
        const selectedStore = stores.value.find(
          (store) => store.id === storeId
        );
        if (selectedStore?.items) {
          currentStoreProducts.value = selectedStore.items;
        } else {
          const items = await itemsApi.getItemsInStore(storeId);
          currentStoreProducts.value = items;
        }
      } catch (error) {
        console.error("Failed to load store products:", error);
        currentStoreProducts.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const createCoupon = async () => {
      editingCoupon.value = null;
      couponForm.value = {
        code: "",
        discountType: "percentage",
        value: 0,
        validUntil: "",
        products: [],
        storeId: null,
      };
      couponDialog.value = true;
    };

    const editCoupon = async (coupon) => {
      try {
        const couponDetails = await couponsApi.getCouponById(coupon.id);
        editingCoupon.value = couponDetails;
        couponForm.value = {
          code: couponDetails.code,
          discountType: couponDetails.discount_type,
          value: couponDetails.discount_value,
          validUntil: couponDetails.valid_until,
          products: couponDetails.products.map((p) => p.id),
          storeId: couponDetails.store_id,
        };
        couponDialog.value = true;
      } catch (error) {
        console.error("Error fetching coupon details:", error);
      }
    };

    const getItemName = async (itemId) => {
      try {
        const item = await itemsApi.getItemById(itemId);
        return item;
      } catch (error) {
        console.error(`Error fetching item ${itemId}:`, error);
        return null;
      }
    };

    const saveCoupon = async () => {
      try {
        const couponData = {
          code: couponForm.value.code,
          discount_type: couponForm.value.discountType,
          discount_value: couponForm.value.value,
          end_date: couponForm.value.validUntil,
          products: couponForm.value.products,
          store_id: couponForm.value.storeId,
        };

        if (editingCoupon.value) {
          await couponsApi.updateCoupon(editingCoupon.value.id, couponData);
        } else {
          await couponsApi.createCoupon(couponForm.value.storeId, couponData);
        }

        await fetchStoresWithCoupons();
        couponDialog.value = false;
        resetCouponForm();
      } catch (error) {
        console.error("Error saving coupon:", error);
      }
    };

    const resetCouponForm = () => {
      couponForm.value = {
        code: "",
        discountType: "percentage",
        value: 0,
        validUntil: "",
        products: [],
        storeId: null,
      };
      editingCoupon.value = null;
    };

    const deleteCoupon = async (storeId, couponId) => {
      try {
        await couponsApi.deleteCoupon(couponId);
        await fetchStoresWithCoupons();
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    };

    const toggleCouponStatus = async (storeId, coupon) => {
      try {
        await couponsApi.updateCoupon(coupon.id, {
          ...coupon,
          active: !coupon.active,
        });
        await fetchStoresWithCoupons();
      } catch (error) {
        console.error("Error toggling coupon status:", error);
      }
    };
    const switchColor = (status) => {
      return status === "active" ? "success" : "primary";
    };

    onMounted(() => {
      if (!userStore.isLoggedIn) {
        router.push("/login");
      } else {
        fetchStoresWithCoupons();
      }
    });

    return {
      switchColor,
      stores,
      specialPromotions,
      couponDialog,
      couponForm,
      editingCoupon,
      currentStoreProducts,
      createCoupon,
      editCoupon,
      saveCoupon,
      deleteCoupon,
      toggleCouponStatus,
      palette,
      URL_BACKEND,
      loadStoreProducts,
      storeCoupons,
      resetCouponForm,
      isLoading,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

table {
  width: 100%;
  border-spacing: 0 10px;
}

td {
  padding: 12px;
}

.hover1:hover {
  color: #f5f5f5;
}
.products-cell {
  max-width: 250px;
  min-width: 200px;
}

.products-cell .v-chip {
  margin: 2px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-products {
  color: #666;
  font-style: italic;
}
</style>
