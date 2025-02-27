<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Pagina Rutas</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            Puedes editar el título y la imagen del banner de encabezado.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
      <v-col cols="12">
        <v-skeleton-loader
          class="mx-auto border"
          type="text, image"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-card class="mt-5 pa-4 position-relative" v-if="!loadingData">
      <!-- Botón de Editar en la esquina superior derecha -->
      <v-btn
        icon="mdi-pencil"
        variant="text"
        color="primary"
        class="edit-btn"
        v-tooltip:top="'Editar cabecera'"
        @click="openDialogHeader"
      ></v-btn>

      <!-- Título de la sección -->
      <v-row justify="center" class="ma-5">
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 font-weight-bold">{{ cmsTitle }}</h2>
          <v-img class="mx-auto" :src="imagenBanner"></v-img>
        </v-col>
      </v-row>
    </v-card>
    <v-divider class="border-opacity-25 mt-3"></v-divider>
    <v-row class="mt-5">
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás crear o editar secciones y configurar la
            entrada para cada sección.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="real-estate-card mt-5">
      <v-container style="max-width: 1320px">
        <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
          <v-col cols="12" lg="4">
            <v-skeleton-loader
              class="mx-auto border"
              type="avatar, heading, text"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-row justify="center" class="gy-4" v-if="!loadingData">
          <v-col cols="12" md="6" lg="4" v-for="section in sectionRoute">
            <v-card
              class="real-estate-card"
              data-aos="fade-up"
              :data-aos-delay="100"
            >
              <!-- Imagen con ajuste absoluto -->
              <v-img
                :src="graphqlImagesUrl + section.url_card_image"
                alt="Imagen de ruta"
                class="real-estate-img"
              ></v-img>

              <!-- Overlay para degradado -->
              <div class="real-estate-overlay"></div>

              <!-- Contenido en la parte inferior -->
              <v-card-text class="real-estate-content">
                <v-chip variant="outlined" color="primary">
                  <b style="color: aliceblue">Ver Ruta</b>
                </v-chip>
                <h3 class="real-estate-title">{{ section.section_title }}</h3>
              </v-card-text>
            </v-card>
            <!-- Tarjeta para botones de acción -->
            <v-card class="mt-2 d-flex justify-space-around pa-2">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                v-tooltip:top="'Editar sección'"
                @click="openDialogEditSection(section)"
              ></v-btn>
              <v-btn
                icon="mdi-trash-can"
                color="error"
                variant="text"
                v-tooltip:top="'Eliminar sección'"
                @click="openDialogConfirmSection(section)"
              ></v-btn>
              <v-btn
                icon="mdi-file-document-edit"
                color="dark"
                variant="text"
                v-tooltip:top="'Configurar entrada'"
                @click="configureEntry(section)"
              ></v-btn>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="4">
            <v-card
              rounded="lg"
              class="add-card d-flex flex-column align-center text-center pa-4"
              @click="openDialogEditSection(null)"
            >
              <v-btn
                icon="mdi-plus"
                color="primary"
                fab
                class="floating-btn animate-pulse"
              ></v-btn>
              <v-card-title class="responsive-title mt-3"
                >Agregar Nueva Sección de Ruta</v-card-title
              >
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>

  <!-- Dialogo de Error -->
  <v-dialog v-model="visibleError" persistent max-width="500px">
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

  <!-- Dialogo de Editar Imagen o Titulo en la Cabecera -->
  <v-dialog v-model="visibleDialogHeader" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogHeader }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogHeader"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="imgEdit">
        <v-card>
          <v-img
            class="bg-grey-lighten-2"
            max-height="125"
            :src="imgEdit"
          ></v-img>
          <v-card-title
            class="text-h6 d-flex justify-space-between align-center"
          >
            Imagen Actual
            <v-btn
              icon="mdi-trash-can"
              color="error"
              variant="text"
              @click="openDialogConfirmHeader"
              v-tooltip:top="'Eliminar Imagen'"
            ></v-btn>
          </v-card-title>
        </v-card>
      </v-col>

      <v-card-text>
        <v-form ref="formHeader">
          <v-col cols="12">
            <v-file-upload
              title="Arrastra o selecciona una imagen"
              :density="density"
              accept="image/png, image/jpeg, image/bmp"
              @change="onFileChange"
            ></v-file-upload>
            <!-- Mostrar el mensaje de error debajo del componente de carga de archivos -->
            <span v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </span>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="setTitleHeader"
              label="Título de la cabecera de la página"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.maxLengthRule(45)]"
            ></v-text-field>
          </v-col>
        </v-form>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogHeader"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEditHeader"
          @click="validateDataForm"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar imagen en cabecera -->
  <v-dialog v-model="visibleDialogConfirmHeader" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmHeader"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert title="Eliminar Imagen" type="warning" variant="tonal"
          ><p style="color: black">
            Desea eliminar la imagen del encabezado para esta página?
          </p>
        </v-alert>
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmHeader"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteImage"
          @click="executeDeleteImage"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Editar Título o Imagen en sección -->
  <v-dialog v-model="visibleDialogEditSection" max-width="700" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        Editar Sección
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogSection"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="imgEditRoute">
        <v-card>
          <v-img
            class="bg-grey-lighten-2"
            max-height="300"
            :src="imgEditRoute"
          ></v-img>
          <v-card-title class="text-h6"> Imagen Actual </v-card-title>
        </v-card>
      </v-col>

      <v-card-text>
        <v-col cols="12">
          <v-form ref="formSection">
            <v-col cols="12">
              <v-file-upload
                title="Arrastra o selecciona una imagen"
                :density="density"
                accept="image/png, image/jpeg, image/bmp"
                @change="onFileChange"
              ></v-file-upload>
              <!-- Mostrar el mensaje de error debajo del componente de carga de archivos -->
              <span v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </span>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="setTitleSection"
                label="Título sección (nombre ruta)"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                clearable
                :rules="[rules.maxLengthRule(100)]"
                hint="El título de la sección es el mismo que la cabecera de la página de entrada."
              ></v-text-field>
            </v-col>
          </v-form>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogSection"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnSection"
          @click="validateDataFormSection"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar una sección -->
  <v-dialog v-model="visibleDialogConfirmSection" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmSection"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert
          :title="titleConfirmDeleteSection"
          type="warning"
          variant="tonal"
          ><p style="color: black">
            {{ textDialogConfirmDeleteSection }}
          </p>
        </v-alert>
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmSection"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteSection"
          @click="executeDeleteSection"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";

const density = shallowRef("compact");
const router = useRouter();

const codeError = ref("");
const visibleError = ref(false);
const textDialog = ref("");
const cmsTitle = ref("");
const imagenBanner = ref("");
const sectionRoute = ref([]);
const loadingData = ref(false);
const visibleDialogHeader = ref(false);
const titleDialogHeader = ref("");
const imgEdit = ref(null);
const setTitleHeader = ref("");
const loadingBtnEditHeader = ref(false);
const errorMessage = ref("");
const uploadedFile = ref(null);
const visibleDialogConfirmHeader = ref(false);
const loadingBtnDeleteImage = ref(false);
const formHeader = ref(null);
const visibleDialogEditSection = ref(false);
const loadingBtnSection = ref(false);
const imgEditRoute = ref(null);
const setTitleSection = ref("");
const idSectionEdit = ref(null);
const formSection = ref(null);
const visibleDialogConfirmSection = ref(false);
const loadingBtnDeleteSection = ref(false);
const titleConfirmDeleteSection = ref("");
const textDialogConfirmDeleteSection = ref("");
const allowedFormats = ["image/jpeg", "image/png", "image/bmp", "image/jpg"];
const rules = ref({
  required: (value) => !!value || "Requerido.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
  numberRule: (value) => /^\d+$/.test(value) || "Solo se permiten números",
  emailRule: (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) || "Correo electrónico inválido";
  },
  maxLengthRule: (max) => (value) =>
    !value || value.length <= max || `Máximo ${max} caracteres`,
  // Regla para URLs válidas
  urlRule: (value) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(value) || "URL inválida";
  },
});

const getDataRoutePage = async (id) => {
  loadingData.value = true;
  const initialQuery = PublicationPublicQueries.getCmsItemList(id);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const { status_code, status_message, cms_items } = data.data.cmsItemList;

      if (status_code === 200 && cms_items.length > 0) {
        cmsTitle.value = cms_items[0].cms_item_title;
        imagenBanner.value = `${graphqlImagesUrl}${cms_items[0].url_header_image}`;
        sectionRoute.value = cms_items[0].sections;

        loadingData.value = false;

        console.log(cms_items);
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
    loadingData.value = false;
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

const updateItemPageWithImage = async (
  itemId,
  itemTitle,
  fileImgHeader,
  textAdd
) => {
  loadingBtnEditHeader.value = true;
  const initialMutation = PublicationMutations.setUpdateItemWithImage(
    itemId,
    itemTitle,
    textAdd
  );

  console.log("Query generado:", initialMutation);

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
        file_image: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.file_image"] }));
  formData.append("1", fileImgHeader);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, cms_item } =
        dataMutation.updatePrincipalItem;

      if (status_code === 200) {
        await getDataRoutePage(3);
        closeDialogHeader();
        loadingBtnEditHeader.value = false;
        uploadedFile.value = null;
        imgEdit.value = null;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateItemPageWithImage(itemId, itemTitle, fileImgHeader, textAdd)
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
        updateItemPageWithImage(itemId, itemTitle, fileImgHeader, textAdd)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Actualizar la sección de cabecera
const updateItemPage = async (itemId, itemTitle, textAdd) => {
  loadingBtnEditHeader.value = true;
  const updateMutation = PublicationMutations.setUpdateItemWithoutImage(
    itemId,
    itemTitle,
    textAdd
  );

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, cms_item } =
        dataMutation.updatePrincipalItemNotImage;

      if (status_code === 200) {
        await getDataRoutePage(3);
        loadingBtnEditHeader.value = false;
        closeDialogHeader();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateItemPage(itemId, itemTitle, textAdd)
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
        updateItemPage(itemId, itemTitle, textAdd)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const validateDataForm = async () => {
  const { valid } = await formHeader.value.validate();

  if (!valid) {
    return;
  }

  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    updateItemPage(3, setTitleHeader.value, "");
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

  updateItemPageWithImage(3, setTitleHeader.value, uploadedFile.value, "");
};

// Eliminar imagen de el encabezado
const deleteimageHeader = async (itemId) => {
  loadingBtnDeleteImage.value = true;
  const updateMutation = PublicationMutations.setDeleteImageHeaderItem(itemId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, cms_item } =
        dataMutation.deletePrincipalItemImage;

      if (status_code === 200) {
        await getDataRoutePage(3);
        loadingBtnDeleteImage.value = false;
        closeDialogConfirmHeader();
        closeDialogHeader();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteimageHeader(itemId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteimageHeader(itemId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteImage = async () => {
  await deleteimageHeader(3);
};

// Eliminar una sección
const deleteSection = async (sectionId) => {
  loadingBtnDeleteSection.value = true;
  const deleteMutation = PublicationMutations.setDeleteSection(sectionId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: deleteMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message } = dataMutation.deleteSection;

      if (status_code === 200) {
        await getDataRoutePage(3);
        closeDialogConfirmSection();
        loadingBtnDeleteSection.value = false;
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteSection(sectionId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteSection(sectionId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteSection = async () => {
  await deleteSection(idSectionEdit.value);
};

const validateDataFormSection = async () => {
  const { valid } = await formSection.value.validate();

  if (!valid) {
    return;
  }

  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    await upsertSectionWithOutImage(
      idSectionEdit.value,
      3,
      setTitleSection.value,
      "card"
    );
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

  await upsertSectionWithImage(
    idSectionEdit.value,
    3,
    setTitleSection.value,
    "card",
    uploadedFile.value
  );
};

// Actualizar o crear una sección sin imagen
const upsertSectionWithOutImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType
) => {
  loadingBtnSection.value = true;
  const updateMutation = PublicationMutations.setUpsertSectionWithoutImage({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    section_type: sectionType,
  });

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        await getDataRoutePage(3);
        loadingBtnSection.value = false;
        closeDialogSection();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertSectionWithOutImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            sectionType
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
        upsertSectionWithOutImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          sectionType
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const upsertSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType,
  fileImgCard
) => {
  loadingBtnSection.value = true;
  const initialMutation = PublicationMutations.setUpsertSection({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    section_type: sectionType,
    img_card: true,
  });

  console.log("Query generado:", initialMutation);

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
        img_card: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.img_card"] }));
  formData.append("1", fileImgCard);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        await getDataRoutePage(3);
        closeDialogSection();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertSectionWithImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            sectionType,
            fileImgCard
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
        upsertSectionWithImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          sectionType,
          fileImgCard
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const slugify = (text) => {
  return text
    .normalize("NFD") // Normaliza caracteres con tildes
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (acentos, tildes)
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Elimina caracteres especiales
    .trim() // Elimina espacios al inicio y final
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .toLowerCase(); // Convierte a minúsculas
};

const configureEntry = (section) => {
  console.log("Configurar Entrada:", section);
  const cleanTitle = slugify(section.section_title);

  router.push({
    name: "EntryRoute",
    params: { id: section.id, title: cleanTitle },
  });
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

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const openDialogHeader = () => {
  setTitleHeader.value = cmsTitle.value;
  imgEdit.value = imagenBanner.value;
  titleDialogHeader.value = "Editar Cabecera";
  visibleDialogHeader.value = true;
};

const openDialogConfirmHeader = () => {
  visibleDialogConfirmHeader.value = true;
};

const openDialogEditSection = (section) => {
  if (section) {
    imgEditRoute.value = graphqlImagesUrl + section.url_card_image;
    setTitleSection.value = section.section_title;
    visibleDialogEditSection.value = true;
    idSectionEdit.value = section.id;
    console.log(section);
  } else {
    imgEditRoute.value = null;
    visibleDialogEditSection.value = true;
    setTitleSection.value = "";
    idSectionEdit.value = null;
  }
};

const openDialogConfirmSection = (section) => {
  titleConfirmDeleteSection.value = "Eliminar Sección " + section.section_title;
  textDialogConfirmDeleteSection.value =
    "¿Desea eliminar la sección " + section.section_title + "?";
  idSectionEdit.value = section.id;
  visibleDialogConfirmSection.value = true;
};

const closeDialogHeader = () => {
  visibleDialogHeader.value = false;
  setTitleHeader.value = "";
  imgEdit.value = null;
  errorMessage.value = "";
  uploadedFile.value = null;
  loadingBtnEditHeader.value = false;
};

const closeDialogConfirmHeader = () => {
  visibleDialogConfirmHeader.value = false;
  loadingBtnDeleteImage.value = false;
};

const closeDialogSection = () => {
  visibleDialogEditSection.value = false;
  loadingBtnSection.value = false;
  setTitleSection.value = "";
  imgEditRoute.value = null;
  idSectionEdit.value = null;
  uploadedFile.value = null;
  errorMessage.value = "";
};

const closeDialogConfirmSection = () => {
  loadingBtnDeleteSection.value = false;
  visibleDialogConfirmSection.value = false;
};

const closeDialog = () => {
  closeDialogHeader();
  closeDialogConfirmHeader();
  closeDialogSection();
  closeDialogConfirmSection();
  visibleError.value = false;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataRoutePage(3);
  } else {
    router.push("/");
  }
});
</script>
<style scoped>
.real-estate-card {
  position: relative;
  min-height: 500px; /* Tamaño fijo */
  border: none;
  border-radius: 0px;
  overflow: hidden;
}

.real-estate-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Degradado sobre la imagen */
.real-estate-overlay {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 25%,
    rgba(0, 0, 0, 0.9) 75%
  );
  z-index: 2;
}

/* Contenido en la parte inferior */
.real-estate-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  padding: 30px;
}

.sale-rent {
  display: inline-block;
  font-size: 15px;
  font-weight: 500;
  color: white;
  padding: 4px 20px;
  border: 2px solid var(--accent-color);
  border-radius: 50px;
  margin-bottom: 10px;
}

.real-estate-title {
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 0px;
  padding-left: 10px;
  border-left: 3px solid var(--accent-color);
  color: white;
}

.error-message {
  display: block;
  font-size: 0.875rem;
  color: #e01304;
  margin-top: 4px;
  padding-left: 16px; /* Le da un pequeño margen izquierdo */
}

.add-card {
  border: 2px dashed #1c8c81; /* Borde punteado primary */
  background-color: rgba(139, 166, 41, 0.055); /* Fondo con secondary */
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}

.add-card:hover {
  background-color: rgba(139, 166, 41, 0.1); /* Más intenso en hover */
  transform: scale(1.05); /* Efecto de ligera expansión */
}

.floating-btn {
  width: 60px;
  height: 60px;
  color: #261918; /* dark para el ícono */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}

.text-dark {
  color: #261918 !important; /* Texto con dark */
}

.position-relative {
  position: relative;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
