<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Edit Store</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="store.name"
                    variant="outlined"
                    label="Name"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="store.description"
                    variant="outlined"
                    label="Description"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="store.address"
                    variant="outlined"
                    label="Address"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="store.phone"
                    variant="outlined"
                    label="Phone"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="store.email"
                    variant="outlined"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="store.website"
                    variant="outlined"
                    label="Website"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-file-input
                    v-model="storeImage"
                    accept="image/*"
                    variant="outlined"
                    label="Image"
                    prepend-icon="mdi-image"
                    @change="storeImageUploadChange"
                  ></v-file-input>
                </v-col>
                <v-col cols="6">
                  <v-img
                    v-if="storeImagePreview"
                    :src="storeImagePreview"
                    width="100"
                    height="100"
                    contain
                  ></v-img>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn @click="goBack" color="primary">
                    <v-icon>mdi-arrow-left</v-icon>
                    Back
                  </v-btn>
                  <v-btn type="submit" color="primary">
                    <v-icon>mdi-content-save</v-icon>
                    Save
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import storesApi from "../../utils/api/stores";
import palette from "../../../palette";
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VTextField,
  VBtn,
  VIcon,
  VForm,
  VDivider,
  VFileInput,
} from "vuetify/components";

export default {
  name: "EditStore",
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VTextField,
    VBtn,
    VIcon,
    VForm,
    VDivider,
    VFileInput,
  },
  props: {
    storeId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const valid = ref(false);
    const storeId = props.storeId;
    const store = ref({
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      image: "",
    });
    const storeImage = ref(null);
    const storeImagePreview = ref(null);
    const storeImageError = ref(null);
    const storeImageLoading = ref(false);
    const storeImageUpload = ref(false);
    const storeImageUploadLoading = ref(false);
    const storeImageUploadProgress = ref(0);
    const storeImageUploadSuccess = ref(false);
    const storeImageUploadError = ref(false);
    const storeImageUploadErrorMessage = ref(null);
    const storeImageUploadSuccessMessage = ref(null);
    const storeImageUploadSuccessTimeout = ref(null);
    const storeImageUploadErrorTimeout = ref(null);
    const storeImageUploadSuccessTimeoutDuration = 5000;
    const storeImageUploadErrorTimeoutDuration = 5000;
    const storeImageUploadSuccessTimeoutCallback = () => {
      storeImageUploadSuccess.value = false;
      storeImageUploadSuccessMessage.value = null;
    };
    const storeImageUploadErrorTimeoutCallback = () => {
      storeImageUploadError.value = false;
      storeImageUploadErrorMessage.value = null;
    };
    const storeImageUploadProgressCallback = (progressEvent) => {
      storeImageUploadProgress.value = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
    };
    const storeImageUploadSuccessCallback = (response) => {
      storeImageUploadSuccess.value = true;
      storeImageUploadSuccessMessage.value = response.data.message;
      storeImageUploadSuccessTimeout.value = setTimeout(
        storeImageUploadSuccessTimeoutCallback,
        storeImageUploadSuccessTimeoutDuration
      );
    };
    const storeImageUploadErrorCallback = (error) => {
      storeImageUploadError.value = true;
      storeImageUploadErrorMessage.value = error.response.data.message;
      storeImageUploadErrorTimeout.value = setTimeout(
        storeImageUploadErrorTimeoutCallback,
        storeImageUploadErrorTimeoutDuration
      );
    };
    const storeImageUploadCancel = () => {
      storeImageUploadError.value = false;
      storeImageUploadErrorMessage.value = null;
      storeImageUploadSuccess.value = false;
      storeImageUploadSuccessMessage.value = null;
      storeImageUploadProgress.value = 0;
      storeImageUploadLoading.value = false;
      storeImageUploadErrorTimeout.value = clearTimeout(
        storeImageUploadErrorTimeout.value
      );
      storeImageUploadSuccessTimeout.value = clearTimeout(
        storeImageUploadSuccessTimeout.value
      );
    };
    const storeImageUploadSubmit = async () => {
      storeImageUploadLoading.value = true;
      try {
        const response = await storesApi.uploadStoreImage(
          storeId,
          storeImage.value,
          storeImageUploadProgressCallback
        );
        storeImageUploadSuccessCallback(response);
      } catch (error) {
        storeImageUploadErrorCallback(error);
      } finally {
        storeImageUploadCancel();
      }
    };
    const storeImageUploadChange = (event) => {
      storeImage.value = event.target.files[0];
      storeImagePreview.value = URL.createObjectURL(storeImage.value);
    };
    const storeImageUploadClear = () => {
      storeImage.value = null;
      storeImagePreview.value = null;
    };
    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
    };

    const goBack = () => {
      router.back();
    };

    const submitForm = async () => {
      try {
        await storesApi.editStore(storeId, store.value);
        alert("Store edited successfully!");
        router.back();
      } catch (error) {
        console.error("Failed to edit store:", error);
        alert("Failed to edit store.");
      }
    };

    onMounted(async () => {
      try {
        const response = await storesApi.getStore(storeId);
        store.value = response.data.store;
      } catch (error) {
        console.error("Failed to get store:", error);
        alert("Failed to get store.");
      }
    });

    return {
      store,
      storeImage,
      storeImagePreview,
      storeImageError,
      storeImageLoading,
      storeImageUpload,
      storeImageUploadLoading,
      storeImageUploadProgress,
      storeImageUploadSuccess,
      storeImageUploadError,
      storeImageUploadErrorMessage,
      storeImageUploadSuccessMessage,
      storeImageUploadSuccessTimeout,
      storeImageUploadErrorTimeout,
      storeImageUploadSuccessTimeoutDuration,
      storeImageUploadErrorTimeoutDuration,
      storeImageUploadSuccessTimeoutCallback,
      storeImageUploadErrorTimeoutCallback,
      storeImageUploadProgressCallback,
      storeImageUploadSuccessCallback,
      storeImageUploadErrorCallback,
      storeImageUploadCancel,
      storeImageUploadSubmit,
      storeImageUploadChange,
      storeImageUploadClear,
      rules,
      goBack,
      submitForm,
      palette,
      valid,
    };
  },
};
</script>

<style scoped>
v-row {
  margin: 5px;
}

v-col {
  margin: 5px;
}

v-card {
  margin: 5px;
}

v-card-title {
  margin: 5px;
}

v-card-text {
  margin: 5px;
}

v-text-field {
  margin: 5px;
}

v-btn {
  margin: 5px;
}

v-icon {
  margin: 5px;
}

v-divider {
  margin: 5px;
}

v-file-input {
  margin: 5px;
}
</style>
