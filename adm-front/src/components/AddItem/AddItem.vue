<template>
  <v-main class="d-flex justify-center align-center" style="height: 100%">
    <v-container>
      <v-card class="elevation-3 mx-auto" max-width="800px">
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold">
          <v-icon @click="goBack" :style="{ color: palette.lightblue[300] }">
            mdi-arrow-left
          </v-icon>
          Adicionar novo item à:
          <span class="text-primary">{{ storeName }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Formulário -->
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <!-- Nome -->
            <v-text-field
              v-model="name"
              :rules="[(v) => !!v || 'Nome é obrigatório']"
              label="Nome do Item"
              variant="outlined"
              dense
              class="styled-input"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-tag</v-icon>
              </template>
            </v-text-field>

            <!-- Descrição -->
            <v-text-field
              v-model="description"
              :rules="[(v) => !!v || 'Descrição é obrigatória']"
              label="Descrição"
              variant="outlined"
              dense
              class="styled-input"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-text-box</v-icon>
              </template>
            </v-text-field>

            <v-row>
              <!-- Preço -->
              <v-col cols="6">
                <v-text-field
                  v-model="price"
                  :rules="[
                    (v) => !!v || 'Preço é obrigatório',
                    (v) =>
                      /^\d+(\.\d{1,2})?$/.test(v) ||
                      'Preço deve ser um número válido',
                  ]"
                  label="Preço (R$)"
                  variant="outlined"
                  dense
                  clearable
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-currency-usd</v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <!-- Tipo -->
              <v-col cols="6">
                <v-select
                  v-model="type"
                  :items="[
                    { text: 'Comida', value: 'food' },
                    { text: 'Bebida', value: 'drink' },
                    { text: 'Sobremesa', value: 'dessert' },
                  ]"
                  :rules="[(v) => !!v || 'Tipo é obrigatório']"
                  label="Tipo"
                  variant="outlined"
                  dense
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-food</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <!-- Categoria -->
              <v-col cols="6">
                <v-select
                  v-model="category"
                  :items="categories"
                  :rules="[(v) => !!v || 'Categoria é obrigatória']"
                  label="Categoria"
                  variant="outlined"
                  dense
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-shape</v-icon>
                  </template>
                </v-select>
              </v-col>

              <!-- Status -->
              <v-col cols="6">
                <v-select
                  v-model="status"
                  :items="statuses"
                  :rules="[(v) => !!v || 'Status é obrigatório']"
                  label="Status"
                  variant="outlined"
                  dense
                  class="styled-input"
                  required
                >
                  <template #prepend>
                    <v-icon color="blue">mdi-check-circle</v-icon>
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- Imagens -->
            <v-file-input
              v-model="images"
              multiple
              accept="image/*"
              :rules="[
                (v) => v?.length > 0 || 'Pelo menos uma imagem é obrigatória',
              ]"
              label="Enviar Imagens"
              variant="outlined"
              dense
              class="styled-input"
              @change="handleImageChange"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-image-multiple</v-icon>
              </template>
            </v-file-input>

            <!-- Botões de Ação -->
            <v-card-actions>
              <v-btn color="grey darken-1" text @click="clearForm"
                >Limpar</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!valid"
                color="blue darken-2"
                @click="handleSubmit"
              >
                Salvar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import itemsApi from "../../utils/api/items";
import storesApi from "../../utils/api/stores";
import uploadApi from "@/utils/api/uploads";
import { useRouter } from "vue-router";
import palette from "../../../palette";
import {
  VMain,
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VDivider,
  VForm,
  VTextField,
  VSelect,
  VFileInput,
  VRow,
  VCol,
  VImg,
  VCardActions,
  VSpacer,
  VBtn,
  VIcon,
  VChip,
} from "vuetify/components";

export default {
  name: "AddItem",
  components: {
    VMain,
    VContainer,
    VCard,
    VCardTitle,
    VCardText,
    VDivider,
    VForm,
    VTextField,
    VSelect,
    VFileInput,
    VRow,
    VCol,
    VImg,
    VCardActions,
    VSpacer,
    VBtn,
    VIcon,
    VChip,
  },
  props: {
    storeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const valid = ref(false);
    const name = ref("");
    const description = ref("");
    const price = ref("");
    const category = ref("");
    const type = ref([]);
    const images = ref([]); // Array for multiple images
    const status = ref("active");
    const types = ref(["food", "drink", "dessert"]);
    const categories = ref([]);
    const categoriesObj = ref({});
    const statuses = ref(["active", "inactive"]);

    const storeName = ref("");
    const storeDescription = ref("");
    const storeImage = ref("");
    const storeStatus = ref("");

    const router = useRouter();
    const fetchCategories = async () => {
      try {
        const response = await itemsApi.getAllCategories();
        categoriesObj.value = response;
        categories.value = categoriesObj.value.map((category) => category.name);
        console.log("categories", categories.value);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    const fatchStoreInfos = async () => {
      try {
        const response = await storesApi.getStore(props.storeId);
        console.log("storeInfos", response);
        storeName.value = response.store.name;
        storeDescription.value = response.store.description;
        storeImage.value = response.store.image;
        storeStatus.value = response.store.status;

        console.log("storeInfos", response);
      } catch (error) {
        console.error("Failed to fetch store infos:", error);
      }
    };

    const clearForm = () => {
      name.value = "";
      description.value = "";
      price.value = "";
      types.value = "";
      category.value = "";
      images.value = [];
      status.value = "active";
    };

    const goBack = () => {
      router.go(-1);
    };

    const handleSubmit = async () => {
      if (valid.value) {
        try {
          // First upload images
          const uploadedFiles = await uploadApi.uploadFiles(images.value);

          const item = {
            name: name.value,
            description: description.value,
            price: parseFloat(price.value),
            category_id: categoriesObj.value.find(
              (cat) => cat.name === category.value
            ).id,
            type: types.value,
            image_names: uploadedFiles.files, // Use returned filenames
            status: status.value,
          };

          // Then create item
          await itemsApi.addItem(props.storeId, item);
          clearForm();
          router.back();
        } catch (error) {
          console.error("Failed to add item:", error);
        }
      }
    };

    // Update image handlers
    const handleImageChange = () => {
      if (images.value && images.value.length > 0) {
        imagePreviews.value = [];
        Array.from(images.value).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    };

    watch(images, handleImageChange);
    const addImage = (file) => {
      images.value.push(file);
    };

    const imagePreviews = computed(
      () => images.value.map((file) => URL.createObjectURL(file)),
      console.log("images", images.value)
    );

    const removeImage = (index) => {
      images.value.splice(index, 1);
    };

    onMounted(() => {
      fetchCategories();
      fatchStoreInfos();
    });

    return {
      valid,
      name,
      description,
      price,
      type,
      category,
      images,
      status,
      types,
      categories,
      statuses,
      imagePreviews,
      storeName,
      storeDescription,
      storeImage,
      storeStatus,

      palette,
      handleSubmit,
      clearForm,
      removeImage,
      addImage,
      handleImageChange,
      goBack,
    };
  },
};
</script>

<style scoped>
.preview-container {
  border: 1px dashed #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
}

.v-chip {
  margin: 5px;
}

.v-main {
  background: #f9f9f9;
}
</style>
