<template>
  <v-container class="py-8">
    <v-card class="elevation-4 rounded-lg mx-auto" max-width="900px">
      <!-- Header com gradiente -->
      <v-toolbar flat :color="palette.lightblue[50]" class="rounded-t-lg">
        <v-btn icon @click="confirmGoBack" variant="text" class="mr-2">
          <v-icon :color="palette.lightblue[700]" size="medium"
            >mdi-arrow-left</v-icon
          >
        </v-btn>
        <v-toolbar-title class="text-h5 font-weight-bold">
          Edição de Item
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="handleSubmit"
          :disabled="!valid"
          :loading="isSaving"
          variant="tonal"
          prepend-icon="mdi-content-save"
          class="px-4"
        >
          Salvar Mudanças
        </v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Loading state -->
      <v-overlay v-model="isLoading" class="align-center justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </v-overlay>

      <v-card-text class="pt-6">
        <!-- Tabs para organizar o conteúdo -->
        <v-tabs
          v-model="activeTab"
          show-arrows
          centered
          slider-color="primary"
          bg-color="grey-lighten-4"
          class="mb-6 rounded"
        >
          <v-tab value="details">
            <v-icon start>mdi-information-outline</v-icon>
            Detalhes do Item
          </v-tab>
          <v-tab value="images">
            <v-icon start>mdi-image-multiple</v-icon>
            Imagens
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Tab de detalhes do produto -->
          <v-window-item value="details">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="handleSubmit"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <v-sheet rounded class="pa-4 mb-4 bg-grey-lighten-5">
                    <h3 class="text-subtitle-1 mb-4 font-weight-medium">
                      <v-icon start color="primary" class="mr-2"
                        >mdi-tag</v-icon
                      >
                      Informações Básicas
                    </h3>

                    <v-text-field
                      v-model="itemData.name"
                      label="Nome do Item*"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-label"
                      :rules="[rules.required]"
                      hide-details="auto"
                      class="mb-3"
                    ></v-text-field>

                    <v-textarea
                      v-model="itemData.description"
                      label="Descrição"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-text-box"
                      auto-grow
                      rows="3"
                      hide-details="auto"
                      class="mb-3"
                    ></v-textarea>

                    <v-text-field
                      v-model="itemData.price"
                      label="Preço (R$)*"
                      type="number"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-cash"
                      :rules="[rules.required, rules.numberValid]"
                      hide-details="auto"
                      class="mb-3"
                    ></v-text-field>
                  </v-sheet>
                </v-col>

                <v-col cols="12" md="6">
                  <v-sheet rounded class="pa-4 mb-4 bg-grey-lighten-5">
                    <h3 class="text-subtitle-1 mb-4 font-weight-medium">
                      <v-icon start color="primary" class="mr-2"
                        >mdi-tune</v-icon
                      >
                      Classificação
                    </h3>

                    <v-select
                      v-model="itemData.category"
                      :items="categories"
                      label="Categoria*"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-shape"
                      :rules="[rules.required]"
                      hide-details="auto"
                      class="mb-3"
                    ></v-select>

                    <v-select
                      v-model="itemData.status"
                      :items="statuses"
                      item-title="label"
                      item-value="value"
                      label="Status"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-check-circle"
                      hide-details="auto"
                      class="mb-3"
                    >
                      <template v-slot:selection="{ item }">
                        <v-chip
                          :color="
                            item.raw.value === 'available' ? 'success' : 'grey'
                          "
                          size="small"
                          class="mr-2"
                        >
                          <v-icon start size="small">
                            {{
                              item.raw.value === "available"
                                ? "mdi-check-circle"
                                : "mdi-block-helper"
                            }}
                          </v-icon>
                          {{ item.raw.label }}
                        </v-chip>
                      </template>
                      <template v-slot:item="{ item, props }">
                        <v-list-item
                          v-bind="props"
                          :prepend-icon="
                            item.raw.value === 'available'
                              ? 'mdi-check-circle'
                              : 'mdi-block-helper'
                          "
                          :subtitle="item.raw.desc"
                        >
                          <template v-slot:prepend>
                            <v-icon
                              :color="
                                item.raw.value === 'available'
                                  ? 'success'
                                  : 'grey'
                              "
                              class="mr-2"
                            >
                              {{
                                item.raw.value === "available"
                                  ? "mdi-check-circle"
                                  : "mdi-block-helper"
                              }}
                            </v-icon>
                          </template>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-sheet>

                  <!-- Imagem principal na primeira tab -->
                  <v-card variant="outlined" class="mb-4">
                    <v-card-item>
                      <v-card-title class="text-subtitle-1">
                        <v-icon start color="primary" class="mr-2"
                          >mdi-image</v-icon
                        >
                        Imagem Principal
                      </v-card-title>
                    </v-card-item>

                    <v-card-text class="text-center pt-0">
                      <v-hover v-slot="{ isHovering, props }">
                        <div v-bind="props" class="d-flex justify-center">
                          <v-img
                            v-if="itemData.image"
                            :src="`${URL_BACKEND}/upload/images/${itemData.image}`"
                            alt="Item Image"
                            class="main-item-image elevation-1 rounded"
                            max-height="180"
                            width="80%"
                            contain
                          >
                            <v-overlay
                              :model-value="isHovering"
                              contained
                              scrim="#036358"
                              class="align-center justify-center"
                              opacity="0.7"
                            >
                              <v-btn
                                color="white"
                                variant="text"
                                icon="mdi-pencil"
                                @click="
                                  () => {
                                    activeTab = 'images';
                                  }
                                "
                              ></v-btn>
                            </v-overlay>
                          </v-img>
                          <v-alert
                            v-else
                            type="info"
                            variant="tonal"
                            border="start"
                            class="mt-2"
                          >
                            Adicione uma imagem na aba "Imagens"
                          </v-alert>
                        </div>
                      </v-hover>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>

          <!-- Tab de imagens -->
          <v-window-item value="images">
            <v-sheet class="pa-4 mb-6 bg-grey-lighten-5 rounded">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-subtitle-1 font-weight-medium">
                  <v-icon start color="primary" class="mr-2"
                    >mdi-image-multiple</v-icon
                  >
                  Gerenciar Imagens
                </h3>

                <v-file-input
                  v-model="newImages"
                  label="Adicionar Imagens"
                  variant="outlined"
                  density="compact"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  multiple
                  hide-details
                  class="max-w-sm"
                  @change="handleImageChange"
                ></v-file-input>
              </div>

              <!-- Imagem Principal -->
              <v-alert
                v-if="!itemData.image && !allImagePreviews.length"
                type="info"
                text="Adicione pelo menos uma imagem para o seu produto"
                variant="tonal"
                class="mb-4"
              ></v-alert>

              <!-- Imagem atual -->
              <v-card v-if="itemData.image" class="mb-4" variant="outlined">
                <v-card-item>
                  <v-card-title class="text-subtitle-1">
                    <v-badge color="success" content="Principal" inline>
                      Imagem Atual
                    </v-badge>
                  </v-card-title>
                </v-card-item>

                <v-card-text>
                  <v-row justify="center">
                    <v-col cols="12" md="6">
                      <v-img
                        :src="`${URL_BACKEND}/upload/images/${itemData.image}`"
                        alt="Item Image"
                        class="rounded elevation-1"
                        height="250"
                        contain
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Novas imagens para upload -->
              <v-card
                v-if="allImagePreviews.length"
                class="mb-4"
                variant="outlined"
              >
                <v-card-item>
                  <v-card-title class="text-subtitle-1">
                    Novas Imagens
                    <v-chip color="primary" size="small" class="ml-2">{{
                      allImagePreviews.length
                    }}</v-chip>
                  </v-card-title>
                </v-card-item>

                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="(preview, index) in allImagePreviews"
                      :key="index"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card variant="flat" class="pa-2 mx-auto">
                        <v-hover v-slot="{ isHovering, props }">
                          <div v-bind="props" class="position-relative">
                            <v-img
                              :src="preview"
                              :aspect-ratio="1"
                              height="150"
                              cover
                              class="rounded elevation-2"
                            >
                              <v-overlay
                                :model-value="isHovering"
                                contained
                                scrim="#036358"
                                class="align-center justify-center"
                                opacity="0.7"
                              >
                                <v-btn
                                  color="error"
                                  variant="text"
                                  icon="mdi-delete"
                                  @click="removeImage(index)"
                                  size="small"
                                ></v-btn>
                              </v-overlay>
                            </v-img>
                          </div>
                        </v-hover>

                        <div class="d-flex justify-center mt-2">
                          <v-radio-group
                            v-model="mainImageIndex"
                            inline
                            density="compact"
                          >
                            <v-radio
                              :value="index"
                              label="Definir como principal"
                            ></v-radio>
                          </v-radio-group>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-sheet>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider class="mt-4"></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          color="error"
          variant="text"
          @click="confirmClearForm"
          prepend-icon="mdi-refresh"
        >
          Limpar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="handleSubmit"
          :disabled="!valid"
          :loading="isSaving"
          variant="elevated"
          prepend-icon="mdi-content-save"
        >
          Salvar Mudanças
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialogs de confirmação -->
    <v-dialog v-model="dialogs.clear" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirmar ação</v-card-title>
        <v-card-text>
          Tem certeza que deseja limpar o formulário? Todas as alterações não
          salvas serão perdidas.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialogs.clear = false"
            >Cancelar</v-btn
          >
          <v-btn color="error" variant="tonal" @click="proceedWithClear"
            >Limpar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.goBack" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirmar ação</v-card-title>
        <v-card-text>
          Deseja sair sem salvar as alterações? Todas as modificações serão
          perdidas.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="dialogs.goBack = false"
            >Cancelar</v-btn
          >
          <v-btn color="primary" variant="tonal" @click="proceedWithGoBack"
            >Sair</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbars para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="snackbar.show = false"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import itemsApi from "@/utils/api/items";
import { useRouter } from "vue-router";
import palette from "../../../palette";
import {
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VCardItem,
  VDivider,
  VForm,
  VRow,
  VCol,
  VImg,
  VIcon,
  VTextField,
  VTextarea,
  VSelect,
  VFileInput,
  VBtn,
  VSpacer,
  VToolbar,
  VToolbarTitle,
  VTabs,
  VTab,
  VWindow,
  VWindowItem,
  VSheet,
  VAlert,
  VChip,
  VBadge,
  VList,
  VListItem,
  VRadioGroup,
  VRadio,
  VOverlay,
  VDialog,
  VSnackbar,
  VProgressCircular,
  VHover,
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
    VCardText,
    VCardActions,
    VCardItem,
    VDivider,
    VForm,
    VRow,
    VCol,
    VImg,
    VIcon,
    VTextField,
    VTextarea,
    VSelect,
    VFileInput,
    VBtn,
    VSpacer,
    VToolbar,
    VToolbarTitle,
    VTabs,
    VTab,
    VWindow,
    VWindowItem,
    VSheet,
    VAlert,
    VChip,
    VBadge,
    VList,
    VListItem,
    VRadioGroup,
    VRadio,
    VOverlay,
    VDialog,
    VSnackbar,
    VProgressCircular,
    VHover,
  },
  setup(props) {
    const valid = ref(false);
    const form = ref(null);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const activeTab = ref("details");
    const mainImageIndex = ref(0);

    const itemData = ref({
      name: "",
      description: "",
      price: "",
      category: "",
      status: "available",
      image: "",
    });

    // Estados transformados para melhor UI
    const categories = ref([]);
    const statuses = ref([
      {
        label: "Disponível",
        value: "available",
        desc: "Item visível e disponível para compra",
      },
      {
        label: "Indisponível",
        value: "unavailable",
        desc: "Item visível mas não disponível para compra",
      },
    ]);

    const existingImagePreviews = ref([]);
    const newImages = ref([]);
    const allImagePreviews = ref([]);
    const router = useRouter();
    const itemId = props.itemId;
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    // Dialogs de confirmação
    const dialogs = ref({
      clear: false,
      goBack: false,
    });

    // Feedback via snackbar
    const snackbar = ref({
      show: false,
      text: "",
      color: "success",
      timeout: 3000,
    });

    const showMessage = (text, color = "success") => {
      snackbar.value.text = text;
      snackbar.value.color = color;
      snackbar.value.show = true;
    };

    // Regras de validação
    const rules = {
      required: (v) => !!v || "Campo obrigatório",
      numberValid: (v) =>
        (v && !isNaN(v) && parseFloat(v) > 0) ||
        "Valor deve ser maior que zero",
    };

    const fetchItemDetails = async () => {
      isLoading.value = true;
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
        allImagePreviews.value = [...existingImagePreviews.value];
        isLoading.value = false;
      } catch (error) {
        console.error("Failed to fetch item details:", error);
        showMessage("Erro ao carregar detalhes do item", "error");
        isLoading.value = false;
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await itemsApi.getAllCategories();
        categories.value = response.map((cat) => cat.name);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showMessage("Erro ao carregar categorias", "error");
      }
    };

    const handleImageChange = () => {
      if (!newImages.value || !newImages.value.length) return;

      // Limpar prévia antiga se houver
      allImagePreviews.value = [];

      // Gerar novas prévias
      newImages.value.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          allImagePreviews.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    };

    const removeImage = (index) => {
      if (index === mainImageIndex.value) {
        mainImageIndex.value = 0;
      } else if (index < mainImageIndex.value) {
        mainImageIndex.value--;
      }

      if (index < existingImagePreviews.value.length) {
        existingImagePreviews.value.splice(index, 1);
      } else {
        const newIndex = index - existingImagePreviews.value.length;
        // Cria uma nova array sem o item a ser removido
        const updatedNewImages = [...newImages.value];
        updatedNewImages.splice(newIndex, 1);
        newImages.value = updatedNewImages;
      }

      allImagePreviews.value.splice(index, 1);
    };

    const confirmClearForm = () => {
      dialogs.value.clear = true;
    };

    const proceedWithClear = () => {
      clearForm();
      dialogs.value.clear = false;
    };

    const confirmGoBack = () => {
      const hasChanges =
        itemData.value.name ||
        itemData.value.description ||
        itemData.value.price ||
        itemData.value.category ||
        allImagePreviews.value.length > 0;

      if (hasChanges) {
        dialogs.value.goBack = true;
      } else {
        goBack();
      }
    };

    const proceedWithGoBack = () => {
      dialogs.value.goBack = false;
      goBack();
    };

    const clearForm = () => {
      itemData.value = {
        name: "",
        description: "",
        price: "",
        category: "",
        status: "available",
        image: "",
      };
      existingImagePreviews.value = [];
      newImages.value = [];
      allImagePreviews.value = [];
      showMessage("Formulário limpo", "info");
    };

    const handleSubmit = async () => {
      if (!valid.value) {
        showMessage("Por favor, verifique os campos obrigatórios", "warning");
        return;
      }

      isSaving.value = true;

      try {
        // Prepara o objeto de atualização
        const updatedData = {
          ...itemData.value,
        };

        // Se temos novas imagens, processa elas
        if (newImages.value.length > 0) {
          // Se houver um índice principal selecionado, use essa imagem como principal
          if (
            mainImageIndex.value !== null &&
            mainImageIndex.value < newImages.value.length
          ) {
            const mainImageFile = newImages.value[mainImageIndex.value];
            updatedData.images = newImages.value.map((file) => file.name);
            updatedData.mainImage = mainImageFile.name;
          } else {
            updatedData.images = newImages.value.map((file) => file.name);
          }
        }

        await itemsApi.updateItem(itemId, updatedData);
        showMessage("Item atualizado com sucesso!", "success");

        // Redireciona após sucesso
        setTimeout(() => {
          router.push({ name: "ItemInfoView", params: { itemId } });
        }, 1500);
      } catch (error) {
        console.error("Failed to update item:", error);
        showMessage("Erro ao atualizar item", "error");
      } finally {
        isSaving.value = false;
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
      form,
      itemData,
      categories,
      statuses,
      existingImagePreviews,
      newImages,
      allImagePreviews,
      isLoading,
      isSaving,
      activeTab,
      dialogs,
      snackbar,
      mainImageIndex,
      URL_BACKEND,
      palette,
      rules,

      // Métodos
      fetchItemDetails,
      handleImageChange,
      removeImage,
      clearForm,
      handleSubmit,
      confirmClearForm,
      proceedWithClear,
      confirmGoBack,
      proceedWithGoBack,
      goBack,
      showMessage,
    };
  },
};
</script>

<style scoped>
.main-item-image {
  max-width: 100%;
  height: 180px;
  transition: all 0.3s ease;
  object-fit: contain;
  background-color: #f5f5f5;
}

.position-relative {
  position: relative;
}

.v-card {
  transition: all 0.3s ease;
}

.theme--dark .main-item-image {
  background-color: #424242;
}

.v-overlay__scrim {
  border-radius: 8px;
}

.max-w-sm {
  max-width: 300px;
}
</style>
