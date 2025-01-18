<template>
  <v-card rounded="0">
    <v-row>
      <v-col
        class="col-1 full-height"
        align="center"
        sm="12"
        md="12"
        lg="8"
        order-sm="2"
        order-md="2"
        order-lg="1"
      >
        <!-- Contenido del primer componente -->
        <div class="mt-16">
          <img :src="ealimentacion" alt="Ealimentacion" />
        </div>
      </v-col>

      <v-col
        class="col-2 full-height"
        sm="12"
        md="12"
        lg="4"
        order-sm="1"
        order-md="1"
        order-lg="2"
      >
        <!-- Contenido del segundo componente -->
        <v-responsive class="align-center text-center fill-height">
          <v-row class="align-center">
            <v-col cols="12">
              <h1>Iniciar sesión</h1>
              <h3>¡Ingresa aquí!</h3>
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
                  base-color="primary"
                  label="Usuario"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
                <v-text-field
                  v-model="setPassword"
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  :type="show1 ? 'text' : 'password'"
                  bg-color="white"
                  color="primary"
                  base-color="primary"
                  label="Contraseña"
                  @click:append-inner="show1 = !show1"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <v-row justify="center" dense>
            <v-col aling-self="end" cols="10">
              <v-btn
                color="primary"
                block
                class="lowercase-button"
                :loading="loading"
                >Iniciar sesión</v-btn
              >
            </v-col>
            <span
              ><em>{{ message }}</em></span
            >

            <v-col cols="10">
              <v-row justify="center">
                <v-col class="mt-3" cols="5">
                  <v-divider
                    class="border-opacity-25"
                    thickness="1"
                  ></v-divider>
                </v-col>
                <v-col cols="2">
                  <p class="text-medium-emphasis">o</p>
                </v-col>
                <v-col class="mt-3" cols="5">
                  <v-divider
                    class="border-opacity-25"
                    thickness="1"
                  ></v-divider>
                </v-col>
              </v-row>
            </v-col>            
          </v-row>
        </v-responsive>
      </v-col>
    </v-row>
  </v-card>
</template>
<script setup>
import { useRouter } from "vue-router";
import { ref, watchEffect } from "vue";
import ealimentacion from '@/assets/ealimentacion.png';

const router = useRouter();
const setUser = ref("");
const setPassword = ref("");
const loading = ref(false);
const show1 = ref(false);
const rules = ref({
  required: (value) => !!value || "Requiredo",
});
</script>
<style scoped>
.col-1 {
  background-color: #dad9d7; /* Color de fondo para la primera columna */
}

.col-2 {
  background-color: #eeeeee; /* Color de fondo para la segunda columna */
}
.full-height {
  height: calc(100vh + 24px);
}
</style>
