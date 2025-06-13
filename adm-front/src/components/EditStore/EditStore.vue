<template>
  <v-container class="py-8">
    <v-card class="elevation-4 rounded-lg mx-auto" max-width="900px">
      <!-- Header com gradiente -->
      <v-toolbar flat :color="palette.lightblue[50]" class="rounded-t-lg">
        <v-btn icon @click="goBack" variant="text" class="mr-2">
          <v-icon :color="palette.lightblue[700]" size="medium"
            >mdi-arrow-left</v-icon
          >
        </v-btn>
        <v-toolbar-title class="text-h5 font-weight-bold">
          Edição de Loja
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="updateStoreInfo"
          :disabled="!isFormValid"
          variant="tonal"
          prepend-icon="mdi-content-save"
          class="px-4"
        >
          Salvar Alterações
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
          <v-tab value="info">
            <v-icon start>mdi-store</v-icon>
            Informações Básicas
          </v-tab>
          <v-tab value="media">
            <v-icon start>mdi-image</v-icon>
            Imagens da Loja
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Tab de Informações Básicas -->
          <v-window-item value="info">
            <v-form ref="form" @submit.prevent="updateStoreInfo">
              <v-sheet class="pa-4 rounded-lg bg-grey-lighten-5 mb-6">
                <h3 class="text-subtitle-1 mb-4 font-weight-medium">
                  <v-icon start color="primary" class="mr-2"
                    >mdi-information-outline</v-icon
                  >
                  Dados da Loja
                </h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="store.name"
                      :label="storePlaceholder.name"
                      :rules="[rules.required]"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-store"
                      hide-details="auto"
                      class="mb-3"
                      placeholder="Nome da Loja"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="store.cnpj"
                      :label="storePlaceholder.cnpj"
                      placeholder="CPF/CNPJ da Loja"
                      :rules="[rules.required]"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-identifier"
                      hide-details="auto"
                      class="mb-3"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="store.email"
                      :label="storePlaceholder.email"
                      placeholder="Email de Contato*"
                      :rules="[rules.required, rules.email]"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-email"
                      hide-details="auto"
                      class="mb-3"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="store.address"
                      :label="storePlaceholder.address"
                      placeholder="Endereço"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-map-marker"
                      hide-details="auto"
                      class="mb-3"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-form>
          </v-window-item>

          <!-- Tab de Imagens -->
          <v-window-item value="media">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-item>
                    <v-card-title class="text-subtitle-1">
                      <v-icon start color="primary" class="mr-2"
                        >mdi-image</v-icon
                      >
                      Logomarca da Loja
                    </v-card-title>
                  </v-card-item>

                  <v-card-text class="text-center pt-0">
                    <v-hover v-slot="{ isHovering, props }">
                      <v-img
                        v-bind="props"
                        :src="
                          logoPreview ||
                          `${URL_BACKEND}/upload/images/${store.logo}`
                        "
                        alt="Store Logo"
                        class="store-image mx-auto rounded elevation-1"
                        max-height="180"
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
                            @click="$refs.logoInput.$el.click()"
                          ></v-btn>
                        </v-overlay>
                      </v-img>
                    </v-hover>

                    <div class="mt-3 px-3">
                      <v-file-input
                        ref="logoInput"
                        v-model="newLogo"
                        label="Atualizar Logomarca"
                        accept="image/*"
                        @change="handleLogoChange"
                        prepend-icon="mdi-camera"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-file-input>

                      <v-btn
                        v-if="newLogo"
                        color="primary"
                        variant="tonal"
                        block
                        class="mt-3"
                        @click="updateLogo"
                        :loading="uploading.logo"
                        prepend-icon="mdi-cloud-upload"
                      >
                        Atualizar Logomarca
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4">
                  <v-card-item>
                    <v-card-title class="text-subtitle-1">
                      <v-icon start color="primary" class="mr-2"
                        >mdi-panorama</v-icon
                      >
                      Banner da Loja
                    </v-card-title>
                  </v-card-item>

                  <v-card-text class="text-center pt-0">
                    <v-hover v-slot="{ isHovering, props }">
                      <v-img
                        v-bind="props"
                        :src="
                          bannerPreview ||
                          `${URL_BACKEND}/upload/images/${store.banner}`
                        "
                        alt="Store Banner"
                        class="store-image mx-auto rounded elevation-1"
                        max-height="180"
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
                            @click="$refs.bannerInput.$el.click()"
                          ></v-btn>
                        </v-overlay>
                      </v-img>
                    </v-hover>

                    <div class="mt-3 px-3">
                      <v-file-input
                        ref="bannerInput"
                        v-model="newBanner"
                        label="Atualizar Banner"
                        accept="image/*"
                        @change="handleBannerChange"
                        prepend-icon="mdi-image"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-file-input>

                      <v-btn
                        v-if="newBanner"
                        color="primary"
                        variant="tonal"
                        block
                        class="mt-3"
                        @click="updateBanner"
                        :loading="uploading.banner"
                        prepend-icon="mdi-cloud-upload"
                      >
                        Atualizar Banner
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider class="mt-4"></v-divider>

      <v-card-actions class="pa-4">
        <v-btn
          color="error"
          variant="text"
          @click="clearForm"
          prepend-icon="mdi-refresh"
        >
          Limpar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="updateStoreInfo"
          :disabled="!isFormValid"
          :loading="isSaving"
          variant="elevated"
          prepend-icon="mdi-content-save"
        >
          Atualizar Informações da Loja
        </v-btn>
      </v-card-actions>
    </v-card>

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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import storesApi from "@/utils/api/stores";
import palette from "../../../palette";
import {
  VContainer,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VCardItem,
  VRow,
  VCol,
  VImg,
  VForm,
  VTextField,
  VFileInput,
  VBtn,
  VDivider,
  VIcon,
  VTabs,
  VTab,
  VWindow,
  VWindowItem,
  VToolbar,
  VToolbarTitle,
  VSheet,
  VHover,
  VOverlay,
  VProgressCircular,
  VSnackbar,
  VSpacer,
} from "vuetify/components";
import uploadsApi from "../../utils/api/uploads";

export default {
  name: "EditStore",
  props: {
    storeId: {
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
    VRow,
    VCol,
    VImg,
    VForm,
    VTextField,
    VFileInput,
    VBtn,
    VDivider,
    VIcon,
    VTabs,
    VTab,
    VWindow,
    VWindowItem,
    VToolbar,
    VToolbarTitle,
    VSheet,
    VHover,
    VOverlay,
    VProgressCircular,
    VSnackbar,
    VSpacer,
  },
  setup(props) {
    const router = useRouter();
    const form = ref(null);
    const store = ref({
      name: "",
      address: "",
      email: "",
      cnpj: "",
      logo: "",
      banner: "",
    });

    const storePlaceholder = {};

    const newLogo = ref(null);
    const newBanner = ref(null);
    const logoPreview = ref("");
    const bannerPreview = ref("");
    const uploading = ref({ logo: false, banner: false });
    const isLoading = ref(false);
    const isSaving = ref(false);
    const activeTab = ref("info");
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

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

    const rules = {
      required: (v) => !!v || "Campo obrigatório",
      email: (v) => /.+@.+\..+/.test(v) || "Email inválido",
    };

    const isFormValid = computed(() => {
      return store.value.name && store.value.email && store.value.cnpj;
    });

    const handleLogoChange = (file) => {
      if (file) {
        logoPreview.value = URL.createObjectURL(file);
      }
    };

    const handleBannerChange = (file) => {
      if (file) {
        bannerPreview.value = URL.createObjectURL(file);
      }
    };

    const updateLogo = async () => {
      if (!newLogo.value) return;
      uploading.value.logo = true;
      try {
        const uploadResponse = await uploadsApi.uploadFile(newLogo.value);

        if (uploadResponse.message) {
          await storesApi.updateStore(props.storeId, {
            logo: newLogo.value.name,
          });
          store.value.logo = newLogo.value.name;
          showMessage("Logomarca atualizada com sucesso!");
        }
      } catch (error) {
        console.error("Failed to update logo:", error);
        showMessage("Falha ao atualizar logomarca: " + error.message, "error");
      } finally {
        uploading.value.logo = false;
      }
    };

    const updateBanner = async () => {
      if (!newBanner.value) return;
      uploading.value.banner = true;
      try {
        const uploadResponse = await uploadsApi.uploadFiles(newBanner.value);

        if (uploadResponse.message) {
          await storesApi.updateStore(props.storeId, {
            banner: newBanner.value.name,
          });
          store.value.banner = newBanner.value.name;
          showMessage("Banner atualizado com sucesso!");
        }
      } catch (error) {
        console.error("Failed to update banner:", error);
        showMessage("Falha ao atualizar banner: " + error.message, "error");
      } finally {
        uploading.value.banner = false;
      }
    };

    const updateStoreInfo = async () => {
      if (!isFormValid.value) return;

      isSaving.value = true;
      try {
        // Handle logo upload if exists
        if (newLogo.value) {
          await updateLogo();
        }

        // Handle banner upload if exists
        if (newBanner.value) {
          await updateBanner();
        }

        // Update store information
        await storesApi.updateStore(props.storeId, {
          name: store.value.name,
          address: store.value.address,
          email: store.value.email,
          cnpj: store.value.cnpj,
        });

        showMessage("Loja atualizada com sucesso!");
      } catch (error) {
        console.error("Failed to update store:", error);
        showMessage("Falha ao atualizar informações da loja", "error");
      } finally {
        isSaving.value = false;
      }
    };

    const fetchStoreDetails = async () => {
      isLoading.value = true;
      try {
        const response = await storesApi.getStore(props.storeId);
        store.value = response;
        storePlaceholder.name = store.value.store.name;
        storePlaceholder.email = store.value.store.email;
        storePlaceholder.cnpj = store.value.store.cpf_cnpj;
        storePlaceholder.address = store.value.store.address;
        store.value.logo = store.value.store.logo;
        store.value.banner = store.value.store.banner;
        logoPreview.value = `${URL_BACKEND}/upload/images/${store.value.logo}`;
        bannerPreview.value = `${URL_BACKEND}/upload/images/${store.value.banner}`;
        console.log("Store details fetched successfully:", store.value.store);
      } catch (error) {
        console.error("Failed to fetch store details:", error);
        showMessage("Falha ao carregar dados da loja", "error");
      } finally {
        isLoading.value = false;
      }
    };

    const clearForm = () => {
      if (
        confirm(
          "Deseja realmente limpar todos os campos? As alterações não salvas serão perdidas."
        )
      ) {
        fetchStoreDetails();
        newLogo.value = null;
        newBanner.value = null;
        logoPreview.value = "";
        bannerPreview.value = "";
        showMessage("Formulário restaurado", "info");
      }
    };

    const goBack = () => {
      if (
        newLogo.value ||
        newBanner.value ||
        (store.value.name !== "" &&
          store.value.email !== "" &&
          store.value.cnpj !== "")
      ) {
        if (confirm("Deseja sair sem salvar as alterações?")) {
          router.go(-1);
        }
      } else {
        router.go(-1);
      }
    };

    onMounted(fetchStoreDetails);

    return {
      store,
      form,
      newLogo,
      newBanner,
      logoPreview,
      bannerPreview,
      uploading,
      isLoading,
      isSaving,
      activeTab,
      snackbar,
      rules,
      isFormValid,
      handleLogoChange,
      handleBannerChange,
      updateLogo,
      updateBanner,
      updateStoreInfo,
      clearForm,
      goBack,
      palette,
      URL_BACKEND,
      storePlaceholder,
    };
  },
};
</script>

<style scoped>
.store-image {
  max-width: 100%;
  height: 180px;
  margin: 16px auto;
  transition: all 0.3s ease;
  object-fit: contain;
  background-color: #f5f5f5;
}

.v-card {
  transition: all 0.3s ease;
}

.theme--dark .store-image {
  background-color: #424242;
}

.v-btn {
  letter-spacing: 0.5px;
}

.v-overlay__scrim {
  border-radius: 8px;
}
</style>
