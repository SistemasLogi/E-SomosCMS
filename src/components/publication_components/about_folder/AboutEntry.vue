<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Pagina Nosotros</h2>
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
          <h2 class="text-h4 font-weight-bold">{{ sectionTitle }}</h2>
          <v-img class="mx-auto" :src="imagenBanner"></v-img>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="mt-5 pa-4">
      <v-container style="max-width: 1400px">
        <v-row justify="center" class="mt-5 mb-5" v-if="loadingData">
          <v-col cols="12" lg="3">
            <v-skeleton-loader
              class="mx-auto border"
              type="card, list-item-two-line"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" lg="3">
            <v-card class="mx-auto">
              <v-list density="compact">
                <v-list-subheader
                  ><h2><b>Lista</b></h2>
                </v-list-subheader>
                <v-divider></v-divider>

                <v-list-item
                  v-for="(item, i) in itemEntry"
                  :key="i"
                  :value="item"
                  color="primary"
                  prepend-icon="mdi-arrow-right-circle-outline"
                  :active="selectedIndex === i"
                  @click="selectedIndex = i"
                >
                  <v-list-item-title
                    v-text="item.entry_title"
                  ></v-list-item-title>
                </v-list-item>
                <v-list-item
                  color="primary"
                  base-color="primary"
                  prepend-icon="mdi-pen-plus"
                  @click=""
                >
                  <v-list-item-title
                    ><b>Agregar a la lista</b></v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col cols="12" lg="9">
            <template v-for="(entry, index) in selectedEntries" :key="index">
              <!-- Renderizar imágenes -->
              <v-col v-if="entry.file_type === 'img'" cols="12">
                <v-row>
                  <v-col cols="10">
                    <v-img class="mx-auto" :src="entry.url_file"></v-img>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Editar imagen'"
                      @click="editEntry(entry)"
                    >
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Eliminar imagen'"
                      @click="deleteEntry(entry)"
                    >
                      <v-icon color="danger">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Renderizar títulos -->
              <v-col v-else-if="entry.content_type?.startsWith('h')" cols="12">
                <v-row>
                  <v-col cols="10">
                    <component :is="entry.content_type">{{
                      entry.content
                    }}</component>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Editar título'"
                      @click="editEntry(entry)"
                    >
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Eliminar título'"
                      @click="deleteEntry(entry)"
                    >
                      <v-icon color="danger">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Renderizar párrafos -->
              <v-col v-else-if="entry.content_type === 'p'" cols="12">
                <v-row>
                  <v-col cols="10">
                    <p>{{ entry.content }}</p>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Editar párrafo'"
                      @click="editEntry(entry)"
                    >
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Eliminar párrafo'"
                      @click="deleteEntry(entry)"
                    >
                      <v-icon color="danger">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Renderizar videos -->
              <v-col v-else-if="entry.content_type === 'video'" cols="12">
                <v-row>
                  <v-col cols="10">
                    <iframe
                      width="100%"
                      height="400"
                      :src="entry.url"
                      frameborder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Editar video'"
                      @click="editEntry(entry)"
                    >
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Eliminar video'"
                      @click="deleteEntry(entry)"
                    >
                      <v-icon color="danger">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Renderizar PDFs -->
              <v-col v-else-if="entry.file_type === 'pdf'" cols="12">
                <v-row>
                  <v-col cols="10">
                    <iframe
                      :src="entry.url_file"
                      width="100%"
                      height="500px"
                    ></iframe>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Editar PDF'"
                      @click="editEntry(entry)"
                    >
                      <v-icon color="primary">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      v-tooltip:top="'Eliminar PDF'"
                      @click="deleteEntry(entry)"
                    >
                      <v-icon color="danger">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </template>
            <v-btn
              v-if="itemEntry.length > 0"
              color="primary"
              size="large"
              rounded="lg"
              block
              class="text-none"
              append-icon="mdi-sticker-plus"
              @click=""
            >
              Agregar Contenido
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>

  <!-- Dialogo de Error -->
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
              label="Título de la cabecera de la página / sección"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.maxLengthRule(100)]"
            ></v-text-field>
            <v-alert type="warning" variant="tonal">
              <p style="color: black">
                Al modificar el titulo se modifica también la sección en la
                página principal.
              </p>
            </v-alert>
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
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { graphqlServerUrl, graphqlImagesUrl } from "@/graphql/config";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { PublicationPublicQueries } from "@/graphql/queries/publication_queries";
import { PublicationMutations } from "@/graphql/mutations/publication_mutations";

const density = shallowRef("compact");
const router = useRouter();
const route = useRoute();

const visibleError = ref(false);
const textDialog = ref("");
const codeError = ref("");
const sectionId = ref(null);
const loadingData = ref(false);
const sectionTitle = ref("");
const cmsItemIdThis = ref(null);
const sectionTypeThis = ref(null);
const imagenBanner = ref(null);
const itemEntry = ref([]);
const orderedEntries = ref([]);
const selectedIndex = ref(0);
const setTitleHeader = ref("");
const imgEdit = ref(null);
const titleDialogHeader = ref("");
const visibleDialogHeader = ref(false);
const errorMessage = ref("");
const loadingBtnEditHeader = ref(false);
const loadingBtnDeleteImage = ref(false);
const uploadedFile = ref(null);
const visibleDialogConfirmHeader = ref(false);
const formHeader = ref(null);
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

const getDataAboutSection = async (id) => {
  loadingData.value = true;
  const initialQuery = PublicationPublicQueries.getSectionList(id);
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data) {
      const { status_code, status_message, sections } = data.data.sectionList;

      if (status_code === 200 && sections.length > 0) {
        console.log(sections);

        sectionTitle.value = sections[0].section_title;
        cmsItemIdThis.value = sections[0].cms_item_id;
        sectionTypeThis.value = sections[0].section_type;

        if (sections[0].url_header_image) {
          imagenBanner.value = `${graphqlImagesUrl}/${sections[0].url_header_image}`;
        }
        itemEntry.value = sections[0].entryes;

        orderedEntries.value = combineAndSortEntries(itemEntry.value);
        console.log(orderedEntries.value);

        loadingData.value = false;
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

const combineAndSortEntries = (entryes) => {
  return entryes.map((entry) => {
    // Combinar contentEntries y fileEntries en un solo array
    const combined = [...entry.contentEntries, ...entry.fileEntries];

    // Ordenar por element_order
    const sortedEntries = combined.sort(
      (a, b) => a.element_order - b.element_order
    );

    // Retornar el objeto de la entrada con el nuevo array ordenado
    return {
      ...entry,
      combinedEntries: sortedEntries,
    };
  });
};

const updateSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  fileImgHeader,
  sectionType
) => {
  loadingBtnEditHeader.value = true;
  const initialMutation = PublicationMutations.setUpsertSection({
    id: sectionId,
    cms_item_id: cmsItemId,
    section_title: sectionTitle,
    img_header: true,
    section_type: sectionType,
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
        img_header: null,
      },
    })
  );
  formData.append("map", JSON.stringify({ 1: ["variables.img_header"] }));
  formData.append("1", fileImgHeader);

  const datos = await axios.post(graphqlServerUrl, formData, { headers });
  console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, section } =
        dataMutation.upsertSection;

      if (status_code === 200 || status_code === 201) {
        await getDataAboutSection(section.id);
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
          updateSectionWithImage(
            sectionId,
            cmsItemId,
            sectionTitle,
            fileImgHeader,
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
        updateSectionWithImage(
          sectionId,
          cmsItemId,
          sectionTitle,
          fileImgHeader,
          sectionType
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

// Eliminar imagen de el encabezado
const deleteimageHeader = async (sectionId) => {
  loadingBtnDeleteImage.value = true;
  const updateMutation = PublicationMutations.setDeleteImageSection(sectionId);

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
        dataMutation.deleteSectionImageHeader;

      if (status_code === 200) {
        await getDataAboutSection(section.id);
        imagenBanner.value = null;
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
        await refreshTokenAndRetry(() => deleteimageHeader(sectionId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteimageHeader(sectionId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteImage = async () => {
  await deleteimageHeader(sectionId.value);
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

const validateDataForm = async () => {
  const { valid } = await formHeader.value.validate();

  if (!valid) {
    return;
  }

  // Validar que se ha cargado un archivo
  if (!uploadedFile.value) {
    //updateItemPage(2, setTitleHeader.value, "");
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

  //updateItemPageWithImage(2, setTitleHeader.value, uploadedFile.value, "");

  updateSectionWithImage(
    sectionId.value,
    cmsItemIdThis.value,
    setTitleHeader.value,
    uploadedFile.value,
    sectionTypeThis.value
  );
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
  setTitleHeader.value = sectionTitle.value;
  imgEdit.value = imagenBanner.value;
  titleDialogHeader.value = "Editar Cabecera";
  visibleDialogHeader.value = true;
};

const openDialogConfirmHeader = () => {
  visibleDialogConfirmHeader.value = true;
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

const closeDialog = () => {
  closeDialogHeader();
  closeDialogConfirmHeader();
  visibleError.value = false;
};

const selectedEntries = computed(() => {
  if (!orderedEntries.value || orderedEntries.value.length === 0) {
    return []; // Si no hay datos, devolvemos un array vacío
  }

  return (
    orderedEntries.value[selectedIndex.value]?.combinedEntries.map((entry) => ({
      ...entry,
      // Concatenar graphqlImagesUrl solo para imágenes y PDFs
      url_file:
        entry.file_type === "img" || entry.file_type === "pdf"
          ? `${graphqlImagesUrl}/${entry.url_file}`
          : entry.url_file,
    })) || []
  );
});

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    sectionId.value = route.params.id;
    console.log("EXISTE ", sectionId.value);
    await getDataAboutSection(sectionId.value);
    //await getDataAboutPage(2);
  } else {
    router.push("/");
  }
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

.responsive-title {
  white-space: normal; /* Permite saltos de línea */
  word-wrap: break-word; /* Rompe palabras largas */
  text-wrap: balance; /* Mejora la distribución del texto */
  max-width: 100%; /* Se adapta al tamaño del contenedor */
  font-size: 1.2rem; /* Ajusta el tamaño del texto */
}
</style>
