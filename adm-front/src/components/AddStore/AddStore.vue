<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title :style="{ backgroundColor: palette.steelblue[200] }">
            <v-row class="align-center">
              <v-col cols="2" class="text-end">
                <v-icon
                  @click="goBack"
                  :style="{ color: palette.lightblue[300] }"
                >
                  mdi-arrow-left
                </v-icon>
              </v-col>
              <v-col cols="4">
                <div class="text-h6">Add Store</div>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-form
              ref="form"
              @submit.prevent="submitForm"
              v-model="valid"
              lazy-validation
            >
              <v-row>
                <v-col cols="12" class="mt-2">
                  <v-text-field
                    variant="outlined"
                    v-model="store.name"
                    label="Name"
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
                    v-model="store.cnpj"
                    variant="outlined"
                    label="CNPJ"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <!-- Logo marca da loja  -->
                <v-col cols="6">
                  <v-file-input
                    v-model="store.logo"
                    accept="image/*"
                    variant="outlined"
                    label="Logo"
                    prepend-icon="mdi-image"
                  ></v-file-input>
                </v-col>
                <!-- Banner da loja  -->
                <v-col cols="6">
                  <v-file-input
                    v-model="store.banner"
                    accept="image/*"
                    variant="outlined"
                    label="Banner"
                    prepend-icon="mdi-image"
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <v-row>
                <v-col cols="12" class="text-end mt-5">
                  <v-btn :disabled="!valid" color="primary" type="submit"
                    >Add Store</v-btn
                  >
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
import { useUserStore } from "../../stores/useStore";
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
  name: "AddStore",
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
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const valid = ref(false);
    const userId = props.userId;
    const userStore = useUserStore();
    const store = ref({
      name: "",
      address: "",
      email: "",
      cnpj: "",
      logo: "",
      banner: "",
    });
    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid.",
    };

    const goBack = () => {
      router.back();
    };

    const submitForm = async () => {
      try {
        await storesApi.addStore(userStore.user.user.id, store.value);
        alert("Store added successfully!");
        router.back();
      } catch (error) {
        console.error("Failed to add store:", error);
        alert("Failed to add store.");
      }
    };

    return {
      store,
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
</style>
