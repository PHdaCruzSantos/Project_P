<template>
  <v-container>
    <!-- Filters -->
    <v-row class="d-flex align-center">
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          variant="outlined"
          dense
          :color="palette.brand.main"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
          dense
          :color="palette.brand.main"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" justify="center" align="center" class="my-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <!-- Items Grid -->
    <v-row v-else>
      <v-col
        v-for="item in paginatedItems"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ItemsCard :item="item" />
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-row v-if="!loading && totalPages > 1">
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @update:model-value="handlePageChange"
          rounded="circle"
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- No Items Message -->
    <v-row v-if="!loading && filteredItems.length === 0">
      <v-col cols="12" class="text-center">
        <v-alert type="info">No items found</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import ItemsCard from "@/components/ItemCard/ItemsCard.vue";
import itemsApi from "@/utils/api/itemsApi";
import palette from "../../../palette";

import {
  VContainer,
  VRow,
  VCol,
  VSelect,
  VProgressCircular,
  VPagination,
  VAlert,
} from "vuetify/components";

export default {
  name: "ItemList",
  components: {
    ItemsCard,
    VContainer,
    VRow,
    VCol,
    VSelect,
    VProgressCircular,
    VPagination,
    VAlert,
  },
  setup() {
    const items = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = ref(12);
    const selectedCategory = ref(null);
    const categories = ref(["All", "Electronics", "Clothing", "Books"]);
    const sortBy = ref("name");
    const sortOptions = ["name", "price-low", "price-high", "rating"];

    // Fetch items
    const fetchItems = async () => {
      loading.value = true;
      try {
        const response = await itemsApi.getAllItems();
        items.value = response;
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        loading.value = false;
      }
    };

    // Filter and sort items
    const filteredItems = computed(() => {
      let result = [...items.value];

      // Apply category filter
      if (selectedCategory.value && selectedCategory.value !== "All") {
        result = result.filter(
          (item) => item.category === selectedCategory.value
        );
      }

      // Apply sorting
      switch (sortBy.value) {
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        default:
          result.sort((a, b) => a.name.localeCompare(b.name));
      }

      return result;
    });

    // Pagination
    const totalPages = computed(() =>
      Math.ceil(filteredItems.value.length / itemsPerPage.value)
    );

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredItems.value.slice(start, end);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    onMounted(fetchItems);

    return {
      items,
      loading,
      currentPage,
      itemsPerPage,
      selectedCategory,
      categories,
      sortBy,
      sortOptions,
      filteredItems,
      paginatedItems,
      totalPages,
      handlePageChange,
      palette,
    };
  },
};
</script>

<style scoped>
.v-container {
  max-width: 1440px;
  margin: 0 auto;
}

.v-row {
  margin: 0;
}

.v-col {
  padding: 12px;
}

.v-card {
  height: 100%;
}
</style>
