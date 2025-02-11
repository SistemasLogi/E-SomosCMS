<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Menú Superior</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar el logo ubicado en el menú superior
            para tema claro.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-row class="ma-2">
        <v-col cols="12"><b>Menú Tema Claro</b></v-col>
        <v-col cols="auto">
          <v-btn
            class="text-none"
            color="primary"
            rounded="lg"
            density="comfortable"
            append-icon="mdi-image-edit"
            @click="visibleDialogLight = true"
            >Editar Logo</v-btn
          >
        </v-col>
        <v-col cols="12" v-if="loading">
          <v-skeleton-loader
            class="mx-auto border"
            type="table-tfoot"
          ></v-skeleton-loader>
        </v-col>
        <!-- Menú para pantallas grandes -->
        <v-col cols="12" v-show="!isMobile" v-if="!loading">
          <v-toolbar :elevation="8" rounded="lg">
            <v-toolbar-title>
              <v-img
                :src="logoLight"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <h5 class="pa-2">Inicio</h5>
            <h5 class="pa-2">Nosotros</h5>
            <h5 class="pa-2">Rutas</h5>
            <h5 class="pa-2">Noticias</h5>
            <h5 class="pa-2">Trabaja con Nosotros</h5>
            <h5 class="pa-2">Colaboradores</h5>
          </v-toolbar>
        </v-col>

        <!-- Menú para pantallas pequeñas -->
        <v-col cols="12" v-show="isMobile" v-if="!loading">
          <v-toolbar :elevation="8" rounded="lg">
            <v-toolbar-title>
              <v-img
                :src="logoLight"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-toolbar>
        </v-col>
      </v-row>
    </v-card>

    <v-divider class="border-opacity-25 mt-3"></v-divider>

    <v-row>
      <v-col cols="12" class="mt-5">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar el logo ubicado en el menú superior
            para tema oscuro.
          </p>
        </v-alert>
      </v-col>
    </v-row>

    <v-card class="mt-5">
      <v-row class="ma-2 mt-5">
        <v-col cols="12"><b>Menú Tema Oscuro</b></v-col>
        <v-col cols="auto">
          <v-btn
            class="text-none"
            color="primary"
            rounded="lg"
            density="comfortable"
            append-icon="mdi-image-edit"
            @click="visibleDialogDark = true"
            >Editar Logo</v-btn
          >
        </v-col>
        <v-col cols="12" v-if="loading">
          <v-skeleton-loader
            class="mx-auto border"
            type="table-tfoot"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="12" v-show="!isMobile" v-if="!loading">
          <v-toolbar :elevation="8" rounded="lg" color="#222">
            <v-toolbar-title>
              <v-img
                :src="logoDark"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <h5 class="pa-2">Inicio</h5>
            <h5 class="pa-2">Nosotros</h5>
            <h5 class="pa-2">Rutas</h5>
            <h5 class="pa-2">Noticias</h5>
            <h5 class="pa-2">Trabaja con Nosotros</h5>
            <h5 class="pa-2">Colaboradores</h5>
          </v-toolbar>
        </v-col>
        <v-col cols="12" v-show="isMobile" v-if="!loading">
          <v-toolbar :elevation="8" rounded="lg" color="#222">
            <v-toolbar-title>
              <v-img
                :src="logoDark"
                :width="150"
                aspect-ratio="16/9"
                cover
              ></v-img>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-toolbar>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
  <v-dialog v-model="visibleDialogLight" max-width="500" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        Cargar Logo
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogLight"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-col cols="12">
          <v-file-upload
            title="Arrastra o selecciona un logo"
            :density="density"
            accept="image/png, image/jpeg, image/bmp"
            @change="onFileChange"
          ></v-file-upload>
          <!-- Mostrar el mensaje de error debajo del componente de carga de archivos -->
          <span v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </span>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogLight"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtn"
          @click="validateDataForm(1)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="visibleDialogDark" max-width="500" persistent>
    <v-card rounded="lg" color="dark">
      <v-card-title class="d-flex justify-space-between align-center">
        Cargar Logo
        <v-btn icon="mdi-close" variant="text" @click="closeDialogDark"></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-col cols="12">
          <v-file-upload
            color="dark"
            title="Arrastra o selecciona un logo"
            :density="density"
            accept="image/png, image/jpeg, image/bmp"
            @change="onFileChange"
          ></v-file-upload>
          <span v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </span>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogDark"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtn"
          @click="validateDataForm(2)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="visibleError" max-width="500px">
    <v-card>
      <v-card-title class="headline">Error</v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert
          :text="textDialog"
          :title="codeError"
          type="error"
          variant="tonal"
        ></v-alert
      ></v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" text @click="closeDialog"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";

const density = shallowRef("compact");

const isMobile = ref(false);
const visibleDialogLight = ref(false);
const visibleDialogDark = ref(false);
const visibleError = ref(false);
const loading = ref(true);
const loadingBtn = ref(false);
const logoLight = ref("");
const logoDark = ref("");
const idLight = ref(null);
const idDark = ref(null);
const textDialog = ref("");
const codeError = ref("");
const uploadedFile = ref(null); // Aquí se almacenará el archivo cargado
const allowedFormats = ["image/jpeg", "image/png", "image/bmp", "image/jpg"];
const errorMessage = ref(""); // Estado reactivo para el mensaje de error
const rules = ref({
  imageRule: (value) => {
    // Si no se seleccionó un archivo, la validación pasa porque no es obligatorio
    if (!value) {
      return true;
    }

    // Si es un array (v-file-upload puede devolver arrays si permite múltiples archivos)
    const file = Array.isArray(value) ? value[0] : value;

    // Verificar si el valor es un archivo válido
    if (!(file instanceof File)) {
      return "El archivo cargado no es válido.";
    }

    // Formatos permitidos
    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/bmp",
    ];

    // Validar tipo MIME del archivo
    return (
      allowedFormats.includes(file.type) ||
      "Formato de imagen no válido. Use JPG, PNG o BMP."
    );
  },
});

const router = useRouter();

const getDataMenu = async (id) => {
  const initialQuery = PublicationPublicQueries.getCmsItemList(id);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const { status_code, status_message, cms_items } = data.data.cmsItemList;

      if (status_code === 200 && cms_items.length > 0) {
        const sections = cms_items[0]?.sections || [];
        const lightSection = sections.find(
          (section) => section.section_title === "light"
        );
        const darkSection = sections.find(
          (section) => section.section_title === "dark"
        );

        // Asignar valores a los logos y los IDs de las secciones
        logoLight.value = lightSection
          ? `${graphqlImagesUrl}/${lightSection.url_header_image}`
          : "";
        logoDark.value = darkSection
          ? `${graphqlImagesUrl}/${darkSection.url_header_image}`
          : "";

        idLight.value = lightSection ? lightSection.id : null;
        idDark.value = darkSection ? darkSection.id : null;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    loading.value = false;
  }
};

const updateSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType,
  fileImgHeader
) => {
  loadingBtn.value = true;
  const initialMutation = PublicationMutations.setUpsertSection({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    section_type: sectionType,
    img_header: true,
  });

  //console.log("Query generado:", initialMutation);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  const formData = new FormData();
  formData.append(
    "operations",
    JSON.stringify({
      query: initialMutation,
      variables: {
        img_header: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.img_header"] }));
  formData.append("1", fileImgHeader);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  //console.log(datos.data.data);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200) {
        if (sectionTitle === "light") {
          idLight.value = section.id;
          logoLight.value = `${graphqlImagesUrl}/${section.url_header_image}`;
        } else if (sectionTitle === "dark") {
          idDark.value = section.id;
          logoDark.value = `${graphqlImagesUrl}/${section.url_header_image}`;
        }
        loadingBtn.value = false;
        closeDialogLight();
        closeDialogDark();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateSectionWithImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            sectionType,
            fileImgHeader
          )
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        updateSectionWithImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          sectionType,
          fileImgHeader
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const refreshTokenAndRetry = async (callback) => {
  const encriptedKey = localStorage.EncryptedKeyCollaboratorCms;
  const responseRefresh = await getTokenRefreshKeyCollaborator(encriptedKey);

  if (responseRefresh.code === 200) {
    //console.log(responseRefresh.message);
    await callback();
  } else {
    handleError({
      code: responseRefresh.code,
      message: responseRefresh.message,
    });
  }
};

// Función que maneja el cambio de archivo
const onFileChange = (event) => {
  // Acceder a los archivos seleccionados desde el evento
  const files = event.target.files;

  // Verificar si hay archivos seleccionados
  if (files.length > 0) {
    uploadedFile.value = files[0]; // Tomar el primer archivo
  } else {
    uploadedFile.value = null;
  }

  // Verificar el archivo cargado
  //console.log("Archivo asignado:", uploadedFile.value);
};

// Función para validar los datos del formulario (archivo cargado)
const validateDataForm = async (identifier) => {
  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    errorMessage.value = "No se ha cargado ningún archivo."; // Mensaje de error si no se cargó archivo
    return;
  }

  // Validar que el archivo sea una instancia de File
  if (!(uploadedFile.value instanceof File)) {
    errorMessage.value = "El archivo seleccionado no es válido."; // Mensaje de error si no es un archivo válido
    return;
  }

  // Validar el formato del archivo (tipo MIME)
  if (!allowedFormats.includes(uploadedFile.value.type)) {
    errorMessage.value = "Formato de imagen no válido. Use JPG, PNG o BMP."; // Mensaje de error si el formato no es válido
    return;
  }

  // Si pasa todas las validaciones, entonces se puede continuar
  //console.log("Archivo válido:", uploadedFile.value);

  // 1 = light, 2 = dark
  if (identifier === 1) {
    updateSectionWithImage(
      idLight.value,
      6,
      "light",
      "div",
      uploadedFile.value
    );
  } else if (identifier === 2) {
    updateSectionWithImage(idDark.value, 6, "dark", "div", uploadedFile.value);
  } else {
    console.log("Identificador no válido");
  }
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const closeDialog = () => {
  visibleError.value = false;
  closeDialogDark();
  closeDialogLight();
};

const closeDialogDark = () => {
  visibleDialogDark.value = false;
  errorMessage.value = "";
  uploadedFile.value = null;
  loadingBtn.value = false;
};

const closeDialogLight = () => {
  visibleDialogLight.value = false;
  errorMessage.value = "";
  uploadedFile.value = null;
  loadingBtn.value = false;
};

// Función para detectar el tamaño de la pantalla
const updateScreenSize = () => {
  isMobile.value = window.innerWidth < 960; // Cambia según el breakpoint que desees (960px para lg)
};

// Escucha de eventos de cambio de tamaño
onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataMenu(6);
  } else {
    router.push("/");
  }
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});
</script>

<style scoped>
.error-message {
  display: block;
  font-size: 0.875rem;
  color: #e01304;
  margin-top: 4px;
  padding-left: 16px; /* Le da un pequeño margen izquierdo */
}
</style>
