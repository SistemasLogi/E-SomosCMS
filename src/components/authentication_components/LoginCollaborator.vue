<template>
  <v-card rounded="0">
    <v-row class="g-0">
      <!-- Columna del formulario -->
      <v-col
        class="col-form full-height"
        cols="12"
        lg="4"
        order="1"
        order-lg="2"
      >
        <v-responsive class="align-center text-center fill-height pa-4">
          <v-row class="align-center">
            <v-col cols="12">
              <h1 class="mb-1">Iniciar sesión</h1>
              <h3 class="mb-6">¡Ingresa aquí!</h3>
            </v-col>
          </v-row>

          <v-form ref="formRef">
            <v-row justify="center">
              <v-col cols="10">
                <v-text-field
                  v-model="setUser"
                  :rules="[rules.required]"
                  append-inner-icon="mdi-account"
                  bg-color="white"
                  color="primary"
                  label="Usuario"
                  variant="outlined"
                  density="compact"
                  class="mb-4"
                ></v-text-field>
                <v-text-field
                  v-model="setPassword"
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  :type="show1 ? 'text' : 'password'"
                  bg-color="white"
                  color="primary"
                  label="Contraseña"
                  @click:append-inner="show1 = !show1"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <v-row justify="center" dense>
            <v-col cols="10">
              <v-btn
                color="primary"
                block
                class="lowercase-button"
                :loading="loading"
                @click="browseDashboard"
              >
                Iniciar sesión
              </v-btn>
              <span class="mt-2 text-danger">
                <em>{{ message }}</em>
              </span>
            </v-col>
            <v-col cols="10">
              <v-row justify="center">
                <v-col class="mt-3" cols="5">
                  <v-divider thickness="1"></v-divider>
                </v-col>
                <v-col cols="2">
                  <p class="text-medium-emphasis">o</p>
                </v-col>
                <v-col class="mt-3" cols="5">
                  <v-divider thickness="1"></v-divider>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-responsive>
      </v-col>

      <!-- Columna de la imagen -->
      <v-col
        class="col-image full-height d-flex justify-center align-center"
        cols="12"
        lg="8"
        order="2"
        order-lg="1"
      >
        <img :src="logoCompany" alt="Ealimentacion" class="responsive-image" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import ealimentacion from "@/assets/ealimentacion.png";
import { UserAuthQueries } from "@/graphql/queries/auth_queries";
import { graphqlServerUrl, logoCompany } from "@/graphql/config";
import axios from "axios";

const router = useRouter();
const setUser = ref("");
const formRef = ref(null);
const setPassword = ref("");
const loading = ref(false);
const show1 = ref(false);
const message = ref("");
const rules = ref({
  required: (value) => !!value || "Requerido",
});

const getTokenWithUserPassword = async (user, password) => {
  loading.value = true;
  message.value = "";
  const initialQuery = UserAuthQueries.getTokenAuth(user, password);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const {
        status_code,
        status_message,
        accessToken,
        encryptedKey,
        permissions,
      } = data.data.loginCollaborator;

      if (status_code === 200) {
        localStorage.setItem("TokenCollaboratorCms", accessToken);
        localStorage.setItem("EncryptedKeyCollaboratorCms", encryptedKey);
        localStorage.setItem(
          "AccessCollaboratorCms",
          JSON.stringify(permissions)
        );
        router.push("/colaboradores");
      } else {
        message.value = status_message;
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    loading.value = false;
  }
};

const browseDashboard = async () => {
  const { valid } = await formRef.value.validate();
  if (valid) {
    getTokenWithUserPassword(setUser.value, setPassword.value);
  }
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}

.col-form {
  background-color: #eeeeee;
  padding: 1rem;
}

.col-image {
  background-color: #c5c5c5;
}

.responsive-image {
  max-width: 100%;
  max-height: 50%;
}

.lowercase-button {
  text-transform: none;
}
</style>
