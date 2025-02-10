<template>
  <v-container>
    <v-card class="elevation-3 mx-auto" max-width="800px">
      <!-- Título -->
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon @click="goBack" :style="{ color: palette.lightblue[300] }">
          mdi-arrow-left
        </v-icon>
        Edição de Item
      </v-card-title>

      <v-divider></v-divider>

      <!-- Formulário -->
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <!-- Imagem Principal -->
            <v-col cols="6" class="d-flex align-center justify-center">
              <v-img
                v-if="itemData.image"
                :src="`${URL_BACKEND}/upload/images/${itemData.image}`"
                alt="Item Image"
                class="main-item-image"
                contain
              ></v-img>
            </v-col>

            <!-- Informações -->
            <v-col cols="6">
              <v-text-field
                v-model="itemData.name"
                label="Nome do Item"
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="itemData.description"
                label="Descrição"
                outlined
                dense
              ></v-text-field>

              <v-text-field
                v-model="itemData.price"
                label="Preço (R$)"
                type="number"
                outlined
                dense
              ></v-text-field>

              <v-select
                v-model="itemData.category"
                :items="categories"
                label="Categoria"
                outlined
                dense
              ></v-select>

              <v-file-input
                v-model="newImages"
                label="Enviar Imagens"
                outlined
                dense
                multiple
                @change="handleImageChange"
              ></v-file-input>

              <!-- Preview de Imagens -->
              <v-row dense v-if="allImagePreviews.length" class="mt-4">
                <v-col
                  cols="4"
                  v-for="(preview, index) in allImagePreviews"
                  :key="index"
                >
                  <v-img :src="preview" max-height="100px" />
                  <v-btn small text color="red" @click="removeImage(index)">
                    Remover
                  </v-btn>
                </v-col>
              </v-row>

              <v-select
                v-model="itemData.status"
                :items="statuses"
                label="Status"
                outlined
                dense
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- Ações -->
      <v-card-actions>
        <v-btn color="grey darken-1" text @click="clearForm">Limpar</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-2" @click="handleSubmit"
          >Salvar Mudanças</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import itemsApi from "@/utils/api/items";
import { useRouter } from "vue-router";
import palette from "../../../palette";
import {
  VContainer,
  VCard,
  VCardTitle,
  VDivider,
  VCardText,
  VForm,
  VRow,
  VCol,
  VImg,
  VTextField,
  VSelect,
  VFileInput,
  VBtn,
  VSpacer,
  VCardActions,
  VIcon,
} from "vuetify/components";

export default {
  name: "EditItem",
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  components: {
    VContainer,
    VCard,
    VCardTitle,
    VDivider,
    VCardText,
    VForm,
    VRow,
    VCol,
    VImg,
    VIcon,
    VTextField,
    VSelect,
    VFileInput,
    VBtn,
    VSpacer,
    VCardActions,
  },
  setup(props) {
    const valid = ref(false);
    const itemData = ref({
      name: "",
      description: "",
      price: "",
      category: "",
      status: "available",
    });
    const categories = ref([]);
    const statuses = ref(["available", "unavailable"]);
    const existingImagePreviews = ref([]);
    const newImages = ref([]);
    const allImagePreviews = ref([]);
    const router = useRouter();
    const itemId = props.itemId;
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const fetchItemDetails = async () => {
      try {
        const response = await itemsApi.getAllInfoItem(props.itemId);
        itemData.value = {
          name: response.item.name,
          description: response.item.description,
          price: response.item.price,
          category: response.item.category,
          status: response.item.status,
          image: response.item.image_names,
        };
        console.log(itemData.value.image);
        allImagePreviews.value = [...existingImagePreviews.value];
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await itemsApi.getAllCategories();
        categories.value = response.map((cat) => cat.name);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const handleImageChange = () => {
      newImages.value.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          allImagePreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    };

    const removeImage = (index) => {
      if (index < existingImagePreviews.value.length) {
        existingImagePreviews.value.splice(index, 1);
      } else {
        newImages.value.splice(index - existingImagePreviews.value.length, 1);
      }
      allImagePreviews.value = [
        ...existingImagePreviews.value,
        ...newImages.value.map((file) => URL.createObjectURL(file)),
      ];
    };

    const clearForm = () => {
      itemData.value = {
        name: "",
        description: "",
        price: "",
        category: "",
        status: itemData.value.status,
      };
      existingImagePreviews.value = [];
      newImages.value = [];
      allImagePreviews.value = [];
    };

    const handleSubmit = async () => {
      if (valid.value) {
        const updatedData = {
          ...itemData.value,
          images: newImages.value.map((file) => file.name),
        };
        try {
          await itemsApi.updateItem(itemId, updatedData);
          router.push({ name: "ItemInfoView", params: { itemId } });
        } catch (error) {
          console.error("Failed to update item:", error);
        }
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    onMounted(() => {
      fetchItemDetails();
      fetchCategories();
    });

    return {
      valid,
      itemData,
      categories,
      statuses,
      existingImagePreviews,
      newImages,
      allImagePreviews,
      fetchItemDetails,
      handleImageChange,
      removeImage,
      clearForm,
      handleSubmit,
      goBack,
      palette,
      URL_BACKEND,
    };
  },
};
</script>

<style scoped>
.v-card {
  padding: 20px;
}

.main-item-image {
  border-radius: 8px;
  max-width: 100%;
}

.v-btn {
  margin: 5px;
}
</style>
