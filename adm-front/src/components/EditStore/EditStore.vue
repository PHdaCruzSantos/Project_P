<template>
  <v-container>
    <v-card class="elevation-3 mx-auto" max-width="800px">
      <!-- Header -->
      <v-card-title class="text-h5 font-weight-bold d-flex align-center">
        <v-icon @click="goBack" :style="{ color: palette.lightblue[300] }">
          mdi-arrow-left
        </v-icon>
        Edição de Loja
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <!-- Store Images Preview -->
        <v-row>
          <v-col cols="12" md="6" class="text-center">
            <p class="text-subtitle-1">Logomarca da Loja</p>
            <v-img
              :src="logoPreview || `${URL_BACKEND}/upload/images/${store.logo}`"
              alt="Store Logo"
              class="store-image mx-auto"
              max-height="150"
              contain
            ></v-img>
            <v-file-input
              v-model="newLogo"
              label="Update Logo"
              accept="image/*"
              @change="handleLogoChange"
              prepend-icon="mdi-camera"
              outlined
              dense
            ></v-file-input>
            <v-btn
              v-if="newLogo"
              color="primary"
              small
              @click="updateLogo"
              :loading="uploading.logo"
            >
              Atualizar Logomarca
            </v-btn>
          </v-col>

          <v-col cols="12" md="6" class="text-center">
            <p class="text-subtitle-1">Banner da Loja</p>
            <v-img
              :src="
                bannerPreview || `${URL_BACKEND}/upload/images/${store.banner}`
              "
              alt="Store Banner"
              class="store-image mx-auto"
              max-height="150"
              contain
            ></v-img>
            <v-file-input
              v-model="newBanner"
              label="Banner da Loja"
              accept="image/*"
              @change="handleBannerChange"
              prepend-icon="mdi-image"
              outlined
              dense
            ></v-file-input>
            <v-btn
              v-if="newBanner"
              color="primary"
              small
              @click="updateBanner"
              :loading="uploading.banner"
            >
              Update Banner
            </v-btn>
          </v-col>
        </v-row>

        <!-- Store Information -->
        <v-form ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="store.name"
                label="Nome da Loja*"
                :rules="[rules.required]"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="store.cnpj"
                label="CNPJ/CPF*"
                :rules="[rules.required]"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="store.email"
                label="Email de Contato*"
                :rules="[rules.required, rules.email]"
                outlined
                dense
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="store.address"
                label="Endereço"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" text @click="clearForm">Limpar</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="updateStoreInfo"
          :disabled="!isFormValid"
        >
          Atualizar Informações da Loja
        </v-btn>
      </v-card-actions>
    </v-card>
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
  VRow,
  VCol,
  VImg,
  VForm,
  VTextField,
  VFileInput,
  VBtn,
  VDivider,
  VIcon,
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
    VRow,
    VCol,
    VImg,
    VForm,
    VTextField,
    VFileInput,
    VBtn,
    VDivider,
    VIcon,
  },
  setup(props) {
    const router = useRouter();
    const store = ref({
      name: "",
      address: "",
      email: "",
      cnpj: "",
      logo: "",
      banner: "",
    });

    const newLogo = ref(null);
    const newBanner = ref(null);
    const logoPreview = ref("");
    const bannerPreview = ref("");
    const uploading = ref({ logo: false, banner: false });
    const URL_BACKEND = import.meta.env.VITE_API_URL_BACKEND;

    const rules = {
      required: (v) => !!v || "Field is required",
      email: (v) => /.+@.+\..+/.test(v) || "Invalid email",
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
          alert("Logo updated successfully!");
        }
      } catch (error) {
        console.error("Failed to update logo:", error);
        alert("Failed to update logo: " + error.message);
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
          alert("Banner updated successfully!");
        }
      } catch (error) {
        console.error("Failed to update banner:", error);
        alert("Failed to update banner: " + error.message);
      } finally {
        uploading.value.banner = false;
      }
    };

    const updateStoreInfo = async () => {
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

        alert("Store updated successfully!");
      } catch (error) {
        console.error("Failed to update store:", error);
        alert("Failed to update store");
      }
    };

    const fetchStoreDetails = async () => {
      try {
        const response = await storesApi.getStore(props.storeId);
        store.value = response;
      } catch (error) {
        console.error("Failed to fetch store details:", error);
      }
    };

    const goBack = () => {
      router.go(-1);
    };

    onMounted(fetchStoreDetails);

    return {
      store,
      newLogo,
      newBanner,
      logoPreview,
      bannerPreview,
      uploading,
      rules,
      isFormValid,
      handleLogoChange,
      handleBannerChange,
      updateLogo,
      updateBanner,
      updateStoreInfo,
      goBack,
      palette,
      URL_BACKEND,
    };
  },
};
</script>

<style scoped>
.store-image {
  border-radius: 8px;
  max-width: 300px;
  margin: 20px auto;
  border: 1px solid #e0e0e0;
}

.v-card {
  padding: 20px;
}

.v-btn {
  margin: 5px;
}
</style>
