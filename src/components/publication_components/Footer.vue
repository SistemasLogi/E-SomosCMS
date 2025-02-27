<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Editar Pie de Pagina</h2>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          <p style="color: black">
            En esta sección podrás editar el datos relacionados al pie de
            pagina.
          </p>
        </v-alert>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-row class="ma-2">
        <v-col cols="12" v-if="loadingData">
          <v-skeleton-loader
            class="mx-auto border"
            type="table-tfoot"
          ></v-skeleton-loader>
        </v-col>
        <!-- Menú para pantallas grandes -->
        <v-col cols="12" v-if="!loadingData">
          <v-card variant="tonal">
            <v-row class="mb-5">
              <v-col cols="12" sm="6" lg="3">
                <v-card-title>
                  <v-icon color="primary"> mdi-map-marker-outline </v-icon
                  >Dirección
                </v-card-title>
                <v-card-subtitle
                  v-for="entry in mergedSections.find(
                    (s) => s.section_title === 'Dirección'
                  )?.entryes"
                  :key="entry.entry_title"
                >
                  {{ entry.entry_title }}
                </v-card-subtitle>
                <v-card-subtitle
                  v-if="
                    mergedSections.find((s) => s.section_title === 'Dirección')
                      ?.entryes.length === 0
                  "
                  class="text-grey"
                >
                  Sin información disponible
                </v-card-subtitle>
                <div class="d-flex justify-center mt-3">
                  <v-btn
                    class="text-none"
                    color="primary"
                    rounded="lg"
                    size="small"
                    append-icon="mdi-pencil"
                    @click="
                      openDialogAddEntry(
                        mergedSections.find(
                          (s) => s.section_title === 'Dirección'
                        )
                      )
                    "
                    >Editar
                    <v-tooltip activator="parent" location="bottom"
                      >Editar sección Dirección</v-tooltip
                    >
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <v-card-title>
                  <v-icon color="primary"> mdi-phone-outline </v-icon>Contacto
                </v-card-title>
                <v-card-subtitle
                  v-for="entry in mergedSections.find(
                    (s) => s.section_title === 'Contacto'
                  )?.entryes"
                  :key="entry.entry_title"
                >
                  <b>{{ entry.entry_title }}:</b> {{ entry.entry_complement }}
                </v-card-subtitle>
                <v-card-subtitle
                  v-if="
                    mergedSections.find((s) => s.section_title === 'Contacto')
                      ?.entryes.length === 0
                  "
                  class="text-grey"
                >
                  Sin información disponible
                </v-card-subtitle>
                <div class="d-flex justify-center mt-3">
                  <v-btn
                    class="text-none"
                    color="primary"
                    rounded="lg"
                    size="small"
                    append-icon="mdi-pencil"
                    @click="
                      openDialogAddEntry(
                        mergedSections.find(
                          (s) => s.section_title === 'Contacto'
                        )
                      )
                    "
                    >Editar
                    <v-tooltip activator="parent" location="bottom"
                      >Editar sección Contacto</v-tooltip
                    >
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <v-img
                  height="60%"
                  class="mx-auto mt-2"
                  :src="`${graphqlImagesUrl}/${
                    mergedSections.find((s) => s.section_title === 'ISO')
                      ?.url_header_image
                  }`"
                  v-if="
                    mergedSections.find((s) => s.section_title === 'ISO')
                      ?.url_header_image
                  "
                ></v-img>
                <v-card-subtitle v-else class="text-grey"
                  >Sin imagen disponible</v-card-subtitle
                >
                <div class="d-flex justify-center mt-3">
                  <v-btn
                    class="text-none"
                    color="primary"
                    rounded="lg"
                    size="small"
                    append-icon="mdi-pencil"
                    @click="
                      openDialogAddEntry(
                        mergedSections.find((s) => s.section_title === 'ISO')
                      )
                    "
                    >Editar
                    <v-tooltip activator="parent" location="bottom"
                      >Editar sección ISO</v-tooltip
                    >
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <v-card-title>Redes Sociales</v-card-title>
                <v-avatar
                  v-for="(entry, index) in mergedSections.find(
                    (s) => s.section_title === 'Redes Sociales'
                  )?.entryes"
                  :key="index"
                  :image="`${graphqlImagesUrl}img-social/${entry.entry_title}.png`"
                  size="40"
                  style="cursor: pointer"
                  @click="openDialogLinkSocial(entry)"
                  v-tooltip:top="'Editar enlace ' + entry.entry_title"
                ></v-avatar>
                <div class="d-flex justify-center mt-3">
                  <v-btn
                    class="text-none"
                    color="primary"
                    rounded="lg"
                    size="small"
                    append-icon="mdi-pencil"
                    @click="
                      openDialogAddEntry(
                        mergedSections.find(
                          (s) => s.section_title === 'Redes Sociales'
                        )
                      )
                    "
                    >Editar
                    <v-tooltip activator="parent" location="bottom"
                      >Editar sección Redes Sociales</v-tooltip
                    >
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
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

  <!-- Dialogo de Editar Contenido de Entrada -->
  <v-dialog v-model="visibleDialogEntry" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogEntry }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogEntry"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="isAddressExist">
        <v-card>
          <v-card-title class="text-h6"> Lineas Guardadas </v-card-title>
          <v-card-text v-for="(line, index) in entryAddressExist" :key="index"
            >{{ line.entry_title }}
            <v-icon color="primary"> mdi-pencil </v-icon>
            <v-icon color="danger"> mdi-trash-can </v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="isContactExist">
        <v-card>
          <v-card-title class="text-h6"> Datos Guardados </v-card-title>
          <v-card-text v-for="(line, index) in entryContactExist" :key="index"
            ><b>{{ line.entry_title }}:</b> {{ line.entry_complement }}
            <v-icon color="primary"> mdi-pencil </v-icon>
            <v-icon color="danger"> mdi-trash-can </v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" v-if="imgEditUpload">
        <v-card>
          <v-img
            class="bg-grey-lighten-2"
            max-height="125"
            :src="imgEditUpload"
          ></v-img>
          <v-card-title class="text-h6"> Imagen Actual </v-card-title>
        </v-card>
      </v-col>

      <v-card-text>
        <v-form ref="formEntry">
          <!-- Sección Imagen ISO-->
          <v-col cols="12" v-if="isImage">
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
          <!-- Sección Dirección -->
          <v-col cols="12" v-if="isAddress">
            <v-alert class="mb-2" type="info" variant="tonal">
              <p style="color: black">
                Puedes crear o modificar una linea de texto en esta sección.
              </p>
            </v-alert>
            <v-text-field
              v-model="setTitleEntry"
              label="Linea de texto"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.required, rules.maxLengthRule(60)]"
            ></v-text-field>
          </v-col>
          <!-- Sección Contacto -->
          <v-col cols="12" v-if="isContact">
            <v-alert class="mb-2" type="info" variant="tonal">
              <p style="color: black">
                Puedes crear o modificar una linea de texto en esta sección, la
                etiqueta es la parte antes de los ":" por ejemplo "Telefono,
                Celular, Correo, etc ".
              </p>
            </v-alert>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="setTitleEntry"
                  label="Etiqueta"
                  color="primary"
                  base-color="primary"
                  density="comfortable"
                  variant="solo-filled"
                  clearable
                  suffix=":"
                  :rules="[rules.required, rules.maxLengthRule(30)]"
                ></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="setTextEntry"
                  label="Campo datos"
                  color="primary"
                  base-color="primary"
                  density="comfortable"
                  variant="solo-filled"
                  clearable
                  :rules="[rules.required, rules.maxLengthRule(100)]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <!-- Sección Redes Sociales -->
          <v-col cols="12" v-if="isLinks">
            <v-alert class="mb-2" type="info" variant="tonal">
              <p style="color: black">
                Puedes crear o modificar un enlace a redes sociales en esta
                sección.
              </p>
            </v-alert>
            <v-select
              v-model="selectedIcon"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              label="Tipos de Enlaces"
              :items="itemsIcons"
              item-title="title"
              item-value="value"
              clearable
              :rules="[rules.required]"
            >
            </v-select>
            <v-text-field
              v-model="setUrlLink"
              label="Url del Enlace"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.required, rules.urlRule, rules.maxLengthRule(150)]"
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
          @click="closeDialogEntry"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEntry"
          @click="validateDataFormEntry"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Editar Enlaces de redes sociales -->
  <v-dialog v-model="visibleDialogLinks" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogLinks }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogLinks"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-col cols="12" v-if="linksExist">
        <v-card>
          <v-card-title class="text-h6"> Enlace Actual </v-card-title>
          <v-card-subtitle class="d-flex justify-center align-center">
            <!-- Mostrar enlace de redes sociales -->
            <v-avatar
              :image="`${graphqlImagesUrl}img-social/${linkTargetSelected.entry_title}.png`"
              size="60"
            ></v-avatar>
          </v-card-subtitle>
        </v-card>
      </v-col>

      <v-card-text>
        <v-form ref="formLinks">
          <v-col cols="12">
            <v-select
              v-model="selectedIconEdit"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              label="Tipos de Enlaces"
              :items="itemsIcons"
              item-title="title"
              item-value="value"
              clearable
              :rules="[rules.required]"
            >
            </v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="setUrlLinkEdit"
              label="Url del Enlace"
              color="primary"
              base-color="primary"
              density="comfortable"
              variant="solo-filled"
              clearable
              :rules="[rules.required, rules.urlRule, rules.maxLengthRule(150)]"
            ></v-text-field>
          </v-col>
        </v-form>
        <v-col
          cols="12"
          class="d-flex justify-center align-center"
          v-if="linksExist"
        >
          <v-btn
            class="text-none"
            rounded="lg"
            text="Eliminar Enlace"
            variant="flat"
            color="danger"
            @click="openDialogConfirmDeleteLink"
          ></v-btn>
        </v-col>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogLinks"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnEditLinks"
          @click="validateDataFormLinks"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Confirmar Eliminar Enlace de redes sociales -->
  <v-dialog v-model="visibleDialogConfirmLink" max-width="600px" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Confirmar...
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogConfirmLink"
        ></v-btn>
      </v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert :title="titleConfirmDeleteLink" type="warning" variant="tonal"
          ><p style="color: black">
            {{ textDialogConfirmDeleteLink }}
          </p></v-alert
        >
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="primary"
          text
          @click="closeDialogConfirmLink"
          >No
        </v-btn>
        <v-btn
          color="primary"
          text="Si"
          variant="tonal"
          :loading="loadingBtnDeleteLink"
          @click="executeDeleteEntryLink"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { shallowRef, ref, onMounted, computed } from "vue";
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
const loadingData = ref(false);
const links = ref([]);
const itemsIcons = ref([]);
const sections = ref([]);
const visibleDialogEntry = ref(false);
const titleDialogEntry = ref("");
const loadingBtnEntry = ref(false);
const errorMessage = ref("");
const formEntry = ref(null);
const sectionThis = ref({});
const setTitleEntry = ref("");
const setTextEntry = ref("");
const setUrlLink = ref("");
const selectedIcon = ref(null);
const isAddressExist = ref(false);
const isContactExist = ref(false);
const linksExist = ref(false);
const isLinks = ref(false);
const isAddress = ref(false);
const isContact = ref(false);
const isImage = ref(false);
const imgEditUpload = ref(null);
const uploadedFile = ref(null);
const entryIdThis = ref(null);
const linkTargetSelected = ref({});
const visibleDialogLinks = ref(false);
const titleDialogLinks = ref("");
const loadingBtnEditLinks = ref(false);
const formLinks = ref(null);
const selectedIconEdit = ref(null);
const setUrlLinkEdit = ref("");
const visibleDialogConfirmLink = ref(false);
const titleConfirmDeleteLink = ref("");
const textDialogConfirmDeleteLink = ref("");
const loadingBtnDeleteLink = ref(false);
const entryAddressExist = ref([]);
const entryContactExist = ref([]);
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
  youtubeRule: (value) => {
    const youtubePattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)$/;
    return youtubePattern.test(value) || "URL de YouTube inválida";
  },
});
// Estructura base sin IDs fijos
const defaultSections = [
  {
    id: null,
    cms_item_id: null,
    section_title: "Dirección",
    section_type: "div",
    section_description: "1",
    entryes: [],
  },
  {
    id: null,
    cms_item_id: null,
    section_title: "Contacto",
    section_type: "div",
    section_description: "2",
    entryes: [],
  },
  {
    id: null,
    cms_item_id: null,
    section_title: "ISO",
    section_type: "img",
    url_header_image: "",
    section_description: "3",
  },
  {
    id: null,
    cms_item_id: null,
    section_title: "Redes Sociales",
    section_type: "icon",
    section_description: "4",
    entryes: [],
  },
];

const getDataIcons = async () => {
  const initialQuery = PublicationPublicQueries.getIconsBootstrapList;
  try {
    const response = await axios.post(graphqlServerUrl, {
      query: initialQuery,
    });

    const { data } = response;

    if (data && data.data && data.data.getIconsBootstrap) {
      // Transformar la respuesta para el select
      itemsIcons.value = data.data.getIconsBootstrap.map((icon) => ({
        title: icon.icon_name, // Texto visible
        value: icon.icon_name, // Valor interno
      }));

      console.log(itemsIcons.value);
    } else {
      handleError({
        code: "500",
        message: "Error al obtener los iconos",
      });
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

const getDataFooter = async (id) => {
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
        console.log(cms_items);

        const itemCms = cms_items[0];
        sections.value = cms_items[0].sections || [];

        loadingData.value = false;

        console.log(links.value); // Verifica que los datos se actualizan correctamente
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

// Actualizar o crear una sección sin imagen
const upsertSectionWithOutImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  sectionType
) => {
  loadingBtnEditHeader.value = true;
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
        return section.id;
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

// Actualizar o crear una sección con imagen
const updateSectionWithImage = async (
  sectionId,
  cmsItemId,
  sectionTitle,
  fileImgHeader,
  sectionType
) => {
  loadingBtnEntry.value = true;
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
        await getDataFooter(7);
        closeDialogEntry();
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

// Actualizar o crear una entrada
const upsertEntry = async (entryId, sectionId, entryTitle, entryComplement) => {
  loadingBtnEntry.value = true;
  loadingBtnEditLinks.value = true;
  const updateMutation = PublicationMutations.setUpsertEntry({
    id: entryId,
    section_id: sectionId,
    entry_title: entryTitle,
    entry_complement: entryComplement,
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
      const { status_code, status_message, entry } = dataMutation.upsertEntry;

      if (status_code === 200 || status_code === 201) {
        await getDataFooter(7);
        closeDialogEntry();
        closeDialogLinks();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          upsertEntry(entryId, sectionId, entryTitle, entryComplement)
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar o crear el enlace",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        upsertEntry(entryId, sectionId, entryTitle, entryComplement)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const deleteEntryData = async (entryId) => {
  loadingBtnDeleteLink.value = true;
  const deleteMutation = PublicationMutations.setDeleteEntry(entryId);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  console.log(deleteMutation);
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
      const { status_code, status_message } = dataMutation.deleteEntry;

      if (status_code === 200) {
        await getDataFooter(7);
        closeDialogConfirmLink();
        closeDialogLinks();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => deleteEntryData(entryId));
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar la sección",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() => deleteEntryData(entryId));
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const executeDeleteEntryLink = async () => {
  await deleteEntryData(linkTargetSelected.value.id);
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

// Fusionar las secciones recibidas con las secciones por defecto
const mergedSections = computed(() => {
  return defaultSections.map((defaultSection) => {
    const existingSection = sections.value.find(
      (sec) => sec.section_title === defaultSection.section_title
    );
    return existingSection
      ? { ...defaultSection, ...existingSection }
      : defaultSection;
  });
});

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const openDialogAddEntry = async (section) => {
  console.log(section); // Aquí ves toda la información de la sección
  if (section) {
    console.log("Título de la sección:", section.section_title);
    console.log("Entradas:", section.entryes);
    console.log("id de la sección:", section.id);

    sectionThis.value = section;

    switch (section.section_title) {
      case "Dirección":
        titleDialogEntry.value = "Editar Dirección";
        isAddress.value = true;
        if (section.entryes.length > 0) {
          isAddressExist.value = true;
          entryAddressExist.value = section.entryes;
        }
        break;

      case "Contacto":
        titleDialogEntry.value = "Editar Contacto";
        isContact.value = true;
        if (section.entryes.length > 0) {
          isContactExist.value = true;
          entryContactExist.value = section.entryes;
        }

        break;

      case "ISO":
        titleDialogEntry.value = "Editar ISO";
        isImage.value = true;
        imgEditUpload.value = `${graphqlImagesUrl}${section.url_header_image}`;
        break;

      case "Redes Sociales":
        titleDialogEntry.value = "Editar Redes Sociales";
        isLinks.value = true;
        break;

      default:
        titleDialogEntry.value = "Editar Sección";
        break;
    }
  } else {
    console.log("No se encontró información de la sección.");
  }
  visibleDialogEntry.value = true;
};

const validateDataFormEntry = async () => {
  let idSection = sectionThis.value.id;

  console.log(sectionThis.value);
  const { valid } = await formEntry.value.validate();

  if (!valid) {
    return;
  }

  if (sectionThis.value.section_type === "img") {
    // Validar que se ha cargado un archivo
    if (!uploadedFile.value) {
      errorMessage.value = "El archivo es requerido.";
      return;
    }

    // Validar que el archivo sea una instancia de File
    if (!(uploadedFile.value instanceof File)) {
      errorMessage.value = "El archivo seleccionado no es válido."; // Mensaje de error si no es un archivo válido
      return;
    }

    // Validar el formato del archivo (tipo MIME)
    if (!allowedFormats.includes(uploadedFile.value.type)) {
      errorMessage.value = "Formato de imagen no válido. Use JPG, PNG o JPEG."; // Mensaje de error si el formato no es válido
      return;
    }

    await updateSectionWithImage(
      idSection,
      7,
      sectionThis.value.section_title,
      uploadedFile.value,
      sectionThis.value.section_type
    );
  } else {
    if (idSection === null) {
      console.log("Esta sección aún no tiene un ID asignado.");
      idSection = await upsertSectionWithOutImage(
        null,
        7,
        sectionThis.value.section_title,
        sectionThis.value.section_type
      );

      if (!idSection) {
        console.error("No se pudo crear la sección.");
        return; // Detiene la ejecución si no se creó correctamente
      }
    }

    if (sectionThis.value.section_type === "icon") {
      console.log("Selecciono: ", selectedIcon.value);
      await upsertEntry(
        entryIdThis.value,
        idSection,
        selectedIcon.value,
        setUrlLink.value
      );
    } else {
      await upsertEntry(
        entryIdThis.value,
        idSection,
        setTitleEntry.value,
        setTextEntry.value
      );
    }
  }
};

const validateDataFormLinks = async () => {
  console.log(linkTargetSelected.value);
  const { valid } = await formLinks.value.validate();
  if (valid) {
    console.log("Formulario válido");

    if (linksExist.value) {
      console.log("edit");
      const entryId = linkTargetSelected.value.id;
      const sectionId = linkTargetSelected.value.section_id;
      const entryTitle = selectedIconEdit.value;
      const entryComplement = setUrlLinkEdit.value;
      await upsertEntry(entryId, sectionId, entryTitle, entryComplement);
    }
  }
};

const openDialogLinkSocial = (social) => {
  linksExist.value = true;
  linkTargetSelected.value = {};

  //linksSelected.value = link;
  titleDialogLinks.value = "Editar link de " + social.entry_title;
  linkTargetSelected.value = social;
  setUrlLinkEdit.value = social.entry_complement;
  // Asignar el valor al select (entryTitle coincide con icon_name)
  selectedIconEdit.value = social.entry_title;
  visibleDialogLinks.value = true;
  console.log(social);
};

const openDialogConfirmDeleteLink = () => {
  titleConfirmDeleteLink.value = "Eliminar enlace";
  textDialogConfirmDeleteLink.value =
    "¿Estás seguro de eliminar el enlace de " +
    linkTargetSelected.value.entry_title;
  visibleDialogConfirmLink.value = true;
};

const closeDialogEntry = () => {
  visibleDialogEntry.value = false;
  isAddress.value = false;
  isContact.value = false;
  isImage.value = false;
  isLinks.value = false;
  setTitleEntry.value = "";
  setTextEntry.value = "";
  selectedIcon.value = null;
  loadingBtnEntry.value = false;
  imgEditUpload.value = null;
  selectedIcon.value = null;
  setUrlLink.value = "";
};

const closeDialogLinks = () => {
  visibleDialogLinks.value = false;
  setUrlLinkEdit.value = "";
  selectedIconEdit.value = null;
  loadingBtnEditLinks.value = false;
  linkTargetSelected.value = {};
};

const closeDialogConfirmLink = () => {
  visibleDialogConfirmLink.value = false;
  loadingBtnDeleteLink.value = false;
};

const closeDialog = () => {
  closeDialogEntry();
  closeDialogLinks();
  visibleError.value = false;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await getDataFooter(7);
    await getDataIcons();
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

.circular-image {
  width: 150px; /* Asegura que el ancho y la altura sean iguales */
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #1c8c81; /* Opcional: añade un borde */
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
