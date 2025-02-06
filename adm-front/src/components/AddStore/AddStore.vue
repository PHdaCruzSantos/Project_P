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
                <v-col cols="12" md="6">
                  <v-text-field
                    variant="outlined"
                    v-model="store.name"
                    label="Store Name"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="store.email"
                    variant="outlined"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    :aria-placeholder="userStore.user.email"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="store.address"
                    variant="outlined"
                    label="Address"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="store.address_number"
                    variant="outlined"
                    label="Address Number"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="store.province"
                    variant="outlined"
                    label="Province"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="store.postal_code"
                    variant="outlined"
                    label="Postal Code"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="store.mobile_phone"
                    variant="outlined"
                    label="Mobile Phone"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="store.cpf_cnpj"
                    variant="outlined"
                    label="CPF/CNPJ"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="store.company_type"
                    :items="companyTypes"
                    variant="outlined"
                    label="Company Type"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="store.income_value"
                    variant="outlined"
                    label="Income Value"
                    type="number"
                    prefix="R$"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="store.logo"
                    multiple
                    dense
                    accept="image/*"
                    variant="outlined"
                    label="Logo"
                    prepend-icon="mdi-image"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="store.banner"
                    accept="image/*"
                    variant="outlined"
                    label="Banner"
                    prepend-icon="mdi-image"
                  ></v-file-input>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <v-row>
                <v-col cols="12" class="text-end">
                  <v-btn
                    :disabled="!valid"
                    color="primary"
                    type="submit"
                    size="large"
                  >
                    Add Store
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/useStore";
import storesApi from "../../utils/api/stores";
import uploadFileApi from "@/utils/api/uploads";
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
  VSelect,
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
    VSelect,
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
    const userStore = useUserStore();
    const companyTypes = ["MEI", "ME", "EPP", "EIRELI", "LTDA"];
    // const images = ref([FILE]);

    const store = ref({
      name: "",
      address: "",
      address_number: "",
      province: "",
      postal_code: "",
      income_value: null,
      email: "",
      cpf_cnpj: "",
      logo: null,
      company_type: "",
      mobile_phone: "",
      banner: null,
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
        // const uploadFile = await uploadFileApi.uploadFiles(images.value);
        const formData = {
          name: store.value.name,
          address: store.value.address,
          address_number: store.value.address_number,
          province: store.value.province,
          postal_code: store.value.postal_code,
          income_value: store.value.income_value,
          email: store.value.email || userStore.user.email,
          cpf_cnpj: store.value.cpf_cnpj,
          logo: store.value.logo,
          company_type: store.value.company_type,
          mobile_phone: store.value.mobile_phone,
          banner: store.value.banner || "",
        };
        console.log(formData);

        await storesApi.addStore(userStore.user.id, formData);
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
      companyTypes,
      userStore,
    };
  },
};
</script>

<style scoped>
.v-row {
  margin: 0;
}

.v-col {
  padding: 8px;
}
</style>
