<template>
  <v-container full fluid :style="{ backgroundColor: palette.dodgerblue[500] }">
    <!-- Cabecalho com acoes de voltar e editaritem -->
    <v-row>
      <v-col cols="12">
        <v-toolbar
          color="transparent"
          flat
          dense
          class="d-flex justify-space-between"
        >
          <v-icon @click="goBack" :style="{ color: palette.lightblue[100] }">
            mdi-arrow-left
          </v-icon>
          <v-toolbar-title class="text-h6" :style="{ color: palette.white }">
            Item Information
          </v-toolbar-title>
          <v-icon
            @click="goToEditItem(itemId)"
            :style="{ color: palette.brand.warning }"
            >mdi-pencil</v-icon
          >
        </v-toolbar>
      </v-col>
    </v-row>

    <!-- Informações Principais -->
    <v-row width="100%">
      <v-col cols="12">
        <v-card class="elevation-3 main-item-card">
          <v-row>
            <!-- Imagem do Item -->
            <v-col cols="12">
              <v-img
                :src="`${URL_BACKEND}/upload/images/${itemImage}`"
                alt="Item Image"
                class="main-item-image"
                contain
              ></v-img>
            </v-col>

            <!-- Informações do Item -->
            <v-col cols="12">
              <v-card-title>
                <h1 class="text-h5">{{ itemName }}</h1>
              </v-card-title>
              <v-card-subtitle>
                <p class="text-body-1">{{ itemDescription }}</p>
              </v-card-subtitle>
              <v-card-text>
                <h3 class="price">R$ {{ itemPrice }}</h3>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Informações Complementares -->
    <v-row class="mt-4">
      <!-- Categorias e Status -->
      <v-col cols="12">
        <v-card class="elevation-2">
          <v-card-title class="text-h6">Details</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <p><strong>Category:</strong> {{ itemCategory }}</p>
              </v-col>
              <v-col cols="6">
                <p><strong>Status:</strong> {{ itemStatus }}</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Variantes -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="elevation-2">
          <v-card-title class="text-h6">Variants</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row
              dense
              v-for="variant in itemVariants"
              :key="variant.id"
              class="mb-2"
            >
              <v-col cols="8">{{ variant.variant_name }}</v-col>
              <v-col cols="4" class="text-end"
                >R$ {{ variant.price.toFixed(2) }}</v-col
              >
              <v-col cols="4" class="text-end"
                >Qty: {{ variant.quantity }}</v-col
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import itemsApi from "../../utils/api/items";
import {
  VForm,
  VTextField,
  VTextarea,
  VSelect,
  VBtn,
  VIcon,
  VImg,
  VRow,
  VCol,
  VDivider,
  VCard,
  VCardTitle,
  VCardText,
  VCardSubtitle,
  VCardActions,
  VSpacer,
  VContainer,
} from "vuetify/components";
import palette from "../../../palette";
import { useRouter } from "vue-router";

export default {
  name: "EditItem",
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  components: {
    VForm,
    VTextField,
    VTextarea,
    VSelect,
    VBtn,
    VIcon,
    VImg,
    VRow,
    VCol,
    VDivider,
    VCard,
    VCardTitle,
    VCardText,
    VCardSubtitle,
    VCardActions,
    VSpacer,
    VContainer,
  },
  setup(props) {
    const valid = ref(false);
    const itemName = ref("");
    const itemDescription = ref("");
    const itemPrice = ref("");
    const itemCategory = ref("");
    const itemImage = ref("");
    const itemStatus = ref("");
    const itemVariants = ref([]);
    const categories = ref([]);
    const statuses = ref(["available", "unavailable"]);
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;
    const itemId = props.itemId;
    const router = useRouter();

    const fetchItemDetails = async () => {
      try {
        const { item, stock } = await itemsApi.getAllInfoItem(props.itemId);
        itemName.value = item.name;
        itemDescription.value = item.description;
        itemPrice.value = item.price;
        itemCategory.value = item.category_id;
        itemStatus.value = item.status;
        itemImage.value = item.image_names;
        itemVariants.value = stock || [];
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await itemsApi.getAllCategories();
        categories.value = response.map((category) => category.name);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const clearForm = () => {
      itemName.value = "";
      itemDescription.value = "";
      itemPrice.value = "";
      itemCategory.value = "";
      itemStatus.value = "available";
    };

    const goBack = () => {
      router.push({ name: "products" });
    };

    const goToEditItem = (itemId) => {
      router.push({ name: "EditItemView", params: { itemId } });
    };

    const handleSubmit = async () => {
      if (valid.value) {
        const updatedItem = {
          name: itemName.value,
          description: itemDescription.value,
          price: parseFloat(itemPrice.value),
          category_id: itemCategory.value,
          status: itemStatus.value,
        };
        try {
          await itemsApi.updateItem(props.itemId, updatedItem);
          await fetchItemDetails(); // Atualiza as informações exibidas
        } catch (error) {
          console.error("Failed to update item:", error);
        }
      }
    };

    onMounted(async () => {
      await fetchItemDetails();
      await fetchCategories();
    });

    return {
      valid,
      itemName,
      itemDescription,
      itemPrice,
      itemCategory,
      itemImage,
      itemStatus,
      itemVariants,
      categories,
      statuses,
      clearForm,
      handleSubmit,
      URL_BACKEND,
      palette,
      goBack,
      goToEditItem,
      itemId,
    };
  },
};
</script>

<style scoped>
/* Estilo Geral */
.v-container {
  max-width: 100%;
  padding: 16px;
}

/* Seção Principal */
.main-item-card {
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Imagem do Item */
.item-image-section {
  flex: 40%;
  max-width: 40%;
  background-color: #f0f4fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-item-image {
  border-radius: 0;
  object-fit: cover;
  width: 100%;
  max-height: 300px;
}

/* Informações do Item */
.item-info-section {
  flex: 60%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-h5 {
  font-weight: bold;
  color: #3d74d5;
  margin-bottom: 8px;
}

.text-body-1 {
  font-size: 1rem;
  color: #636363;
  margin-bottom: 16px;
}

.price {
  font-size: 1.8rem;
  font-weight: bold;
  color: #004aad;
}

/* Detalhes */
.details-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
}

.details-content {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #525252;
}

/* Variantes */
.variants-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
}

.variant-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.variant-row:last-child {
  border-bottom: none;
}

.variant-row span {
  font-size: 0.9rem;
  color: #525252;
}

/* Botões */
.v-btn {
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 16px;
}

.v-btn[color="brand.main"] {
  background-color: #004aad;
  color: white;
  transition: all 0.3s ease-in-out;
}

.v-btn[color="brand.main"]:hover {
  background-color: #003b8b;
}

.v-btn[color="brand.graydark"] {
  color: #636363;
}

.v-btn[color="brand.graydark"]:hover {
  background-color: #f1f1f1;
}

/* Responsividade */
@media (max-width: 768px) {
  .main-item-card {
    flex-direction: column;
  }

  .item-image-section,
  .item-info-section {
    max-width: 100%;
    flex: 100%;
  }

  .main-item-image {
    max-height: 200px;
  }

  .price {
    font-size: 1.5rem;
  }
}
</style>
