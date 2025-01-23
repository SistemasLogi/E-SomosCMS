<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-5" elevation="2">
          <v-card-title>
            <h1 class="text-center">¡Bienvenido!</h1>
          </v-card-title>
          <v-card-text>
            <v-img height="250" :src="logoCompany" class="fade-in" />
            <p class="mt-4 text-center">
              Este es el inicio de tu plataforma CMS. ¡Explora las opciones del
              menú para comenzar!
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { logoCompany } from "@/graphql/config";
//
</script>
<style>
.fade-in {
  animation: fadeIn 1.5s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
