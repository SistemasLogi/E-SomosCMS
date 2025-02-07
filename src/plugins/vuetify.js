/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VFileUpload } from "vuetify/labs/VFileUpload";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VFileUpload, // Registra el componente
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1C8C81",
          secondary: "#8BA629",
          dark: "#261918",
          danger: "#b00020",
        },
      },
    },
  },
});
