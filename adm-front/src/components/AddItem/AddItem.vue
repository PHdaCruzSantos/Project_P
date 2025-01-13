<template>
  <v-main class="d-flex justify-center align-center" style="height: 100%">
    <v-container>
      <v-card class="elevation-3 mx-auto" max-width="800px">
        <!-- Título -->
        <v-card-title class="text-h5 font-weight-bold">
          <v-icon @click="goBack" :style="{ color: palette.lightblue[300] }">
            mdi-arrow-left
          </v-icon>
          Add New Item into <span class="text-primary">{{ storeName }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <!-- Formulário -->
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <!-- Nome -->
            <v-text-field
              v-model="name"
              :rules="[(v) => !!v || 'Name is required']"
              label="Item Name"
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
              :rules="[(v) => !!v || 'Description is required']"
              label="Description"
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
                    (v) => !!v || 'Price is required',
                    (v) =>
                      /^\d+(\.\d{1,2})?$/.test(v) ||
                      'Price must be a valid number',
                  ]"
                  label="Price (R$)"
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
              <!-- Type -->
              <v-col cols="6">
                <v-select
                  v-model="type"
                  :items="types"
                  :rules="[(v) => !!v || 'Type is required']"
                  label="Type"
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

            <!-- Inputs lado a lado -->
            <v-row>
              <!-- Categoria -->
              <v-col cols="6">
                <v-select
                  v-model="category"
                  :items="categories"
                  :rules="[(v) => !!v || 'Category is required']"
                  label="Category"
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
                  :rules="[(v) => !!v || 'Status is required']"
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
                (v) => v?.length > 0 || 'At least one image is required',
              ]"
              label="Upload Images"
              variant="outlined"
              dense
              class="styled-input"
              @change="handleImageChange"
              required
            >
              <template #prepend>
                <v-icon color="blue">mdi-image-multiple</v-icon>
              </template>
              <template v-slot:selection="{ fileNames }">
                <v-chip
                  v-for="fileName in fileNames"
                  :key="fileName"
                  class="me-2"
                  color="primary"
                  size="small"
                  label
                >
                  {{ fileName }}
                </v-chip>
              </template>
            </v-file-input>

            <!-- Visualização das Imagens -->
            <v-row v-if="imagePreviews.length" class="mt-4">
              <v-col cols="12" class="text-center">
                <div class="preview-container">
                  <v-row dense>
                    <v-col
                      v-for="(preview, index) in imagePreviews"
                      :key="index"
                      cols="4"
                    >
                      <v-img
                        :src="preview"
                        aspect-ratio="16/9"
                        contain
                        class="mb-2"
                      ></v-img>
                      <v-btn small text color="red" @click="removeImage(index)">
                        Remove
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Ações -->
        <v-card-actions>
          <v-btn color="grey darken-1" text @click="clearForm"> Clear </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!valid" color="blue darken-2" @click="handleSubmit">
            Submit
          </v-btn>
        </v-card-actions>
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
        storeName.value = response.name;
        storeDescription.value = response.description;
        storeImage.value = response.image;
        storeStatus.value = response.status;

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
          router.push({ path: `/store/${props.storeId}` });
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
