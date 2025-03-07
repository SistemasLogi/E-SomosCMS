<template>
  <v-container>
    <v-row class="mt-12 ml-2">
      <h2>Usuarios del sistema</h2>
    </v-row>
    <v-card class="mt-5">
      <v-col cols="12">
        <v-card-title>
          <v-row>
            <v-col cols="12" lg="8">
              <v-btn
                class="text-none"
                color="primary"
                rounded="lg"
                append-icon="mdi-account-multiple-plus"
                @click="openDialogUserData(null, false)"
                >Nuevo
              </v-btn>
            </v-col>
            <v-col cols="12" lg="4">
              <v-text-field
                v-model="search"
                density="compact"
                color="primary"
                base-color="primary"
                label="Buscar en hoja activa"
                prepend-inner-icon="mdi-magnify"
                flat
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table
          :search="search"
          :headers="headers"
          :items="itemsCollaborators"
          :loading="loading"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              class="me-2"
              size="large"
              color="primary"
              v-tooltip:top="'Editar datos de usuario'"
              @click="openDialogUserData(item, true)"
            >
              mdi-pencil-box
            </v-icon>
            <v-icon
              size="large"
              color="primary"
              v-tooltip:top="'Gestionar permisos'"
              @click="openDialogPermissions(item)"
            >
              mdi-account-lock-open
            </v-icon>
          </template>

          <template v-slot:item.collaborator_status="{ item }">
            <v-chip
              :color="item.collaborator_status ? 'green' : 'red'"
              :text="item.collaborator_status ? 'Activo' : 'Inactivo'"
              class="text-uppercase"
              size="small"
              label
            ></v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-container>

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

  <!-- Dialogo de Crear o Editar Usuario -->
  <v-dialog v-model="visibleDialogUserData" max-width="900" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ titleDialogUserData }}
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogUserData"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-form ref="formUserData">
          <v-alert class="mb-2" type="info" variant="tonal">
            <p style="color: black">
              Ingresa los datos del usuario que deseas crear, el usuario de
              ingreso y la contraseña seran iguales al N° Documento y se crean
              automáticamente.
            </p>
            <p class="mt-2" style="color: black">
              Los usuarios creados como "Administrador" se les otorgan todos los
              permisos autómaticamente, para el caso de los usuarios "Pulicador"
              debes configurar sus permisos en el siguiente paso.
            </p>
          </v-alert>
          <v-row class="mt-4">
            <v-col cols="12" lg="6">
              <v-select
                v-model="selectedRole"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                label="Roles"
                :items="itemsRoles"
                item-title="title"
                item-value="value"
                clearable
                :rules="[rules.required]"
              >
              </v-select>
            </v-col>

            <v-col cols="12" lg="6">
              <v-text-field
                v-model="setDocumentNumber"
                label="N° Documento"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                clearable
                :rules="[rules.required, rules.numberRule]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="6">
              <v-text-field
                v-model="setUserName"
                label="Nombre completo"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                clearable
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="6">
              <v-text-field
                v-model="setEmail"
                label="Correo electronico"
                color="primary"
                base-color="primary"
                density="comfortable"
                variant="solo-filled"
                clearable
                :rules="[rules.required, rules.emailRule]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" lg="6" v-if="isEditUser">
              <v-switch
                v-model="modelStatus"
                :label="modelStatus ? 'Activo' : 'Inactivo'"
                hide-details
                color="primary"
                inset
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogUserData"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnUserData"
          @click="validateDataFormUserData"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Asignar Permisos -->
  <v-dialog fullscreen v-model="visibleDialogPermissions" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        Asignar permisos
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialogPermissions"
        ></v-btn>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <h2>
          Nombre del usuario: <strong>{{ nameUserPermissions }}</strong>
        </h2>

        <v-card elevation="1" rounded="lg">
          <v-card-text>
            <template
              v-for="(permission, index) in filteredPermissions"
              :key="permission.id"
            >
              <div class="d-flex justify-space-between align-center py-2">
                <h4>{{ permission.permission_name }}</h4>
                <v-switch
                  v-model="selectedPermissions[permission.id]"
                  :label="
                    selectedPermissions[permission.id]
                      ? 'Asignado'
                      : 'No asignado'
                  "
                  hide-details
                  color="primary"
                ></v-switch>
              </div>

              <!-- Agrega un divisor entre elementos, excepto en el último -->
              <v-divider
                v-if="index < filteredPermissions.length - 1"
              ></v-divider>
            </template>
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-divider class="mt-2"></v-divider>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          rounded="lg"
          text="Cancelar"
          @click="closeDialogPermissions"
        ></v-btn>

        <v-btn
          class="text-none"
          color="primary"
          rounded="lg"
          text="Guardar"
          variant="flat"
          :loading="loadingBtnPermissions"
          @click="validateDataFormPermissions"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialogo de Información -->
  <v-dialog v-model="visibleDialogInfo" persistent max-width="500px">
    <v-card>
      <v-card-title class="headline">Información</v-card-title>
      <v-divider class="mt-3"></v-divider>
      <v-card-text
        ><v-alert type="info" variant="tonal">
          <p style="color: black">
            No se pueden actualizar los permisos de un Administrador.
          </p>
        </v-alert>
      </v-card-text>
      <v-divider class="mt-3"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" text @click="closeDialogInfo"
          >Cerrar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import {
  checkLocalStorageData,
  getTokenRefreshKeyCollaborator,
} from "@/graphql/utils";
import { UserCollaboratorQueries } from "@/graphql/queries/user_queries";
import { graphqlServerUrl } from "@/graphql/config";
import { UserMutations } from "@/graphql/mutations/user_mutations";

const router = useRouter();

const search = ref("");
const textDialog = ref("");
const codeError = ref("");
const visibleError = ref(false);
const loading = ref(true);
const itemsCollaborators = ref([]);
const visibleDialogUserData = ref(false);
const titleDialogUserData = ref("");
const loadingBtnUserData = ref(false);
const formUserData = ref(null);
const selectedRole = ref(null);
const itemsRoles = ref([]);
const setDocumentNumber = ref("");
const setUserName = ref("");
const setEmail = ref("");
const modelStatus = ref(true);
const permissionStatus = ref(true);
const isEditUser = ref(false);
const idUser = ref(null);
const visibleDialogPermissions = ref(false);
const itemsPermissions = ref([]);
const nameUserPermissions = ref("");
const loadingBtnPermissions = ref(false);
const visibleDialogInfo = ref(false);
const headers = ref([
  {
    title: "Id",
    align: "start",
    sortable: false,
    key: "id",
  },
  { title: "Nombre", key: "collaborator_name" },
  { title: "Numero C.C", key: "document_number" },
  { title: "Email", key: "collaborator_email" },
  { title: "Estado", key: "collaborator_status" },
  { title: "Rol", key: "rol_name" },
  { title: "Acciones", key: "actions" },
]);
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

const selectedPermissions = ref({});

// Inicializa los switches en `false` (No asignado)
itemsPermissions.value.forEach((permission) => {
  selectedPermissions[permission.id] = false;
});

// Filtrar los permisos para ocultar "Acceso a administración de usuarios"
const filteredPermissions = computed(() => {
  return itemsPermissions.value.filter(
    (permission) =>
      permission.permission_name !== "Acceso a administración de usuarios" &&
      permission.permission_name !== "Acceso a publicaciones"
  );
});

const dataUserCollaborator = async () => {
  try {
    const initialQuery = UserCollaboratorQueries.getCollaboratorUserData();
    const token = localStorage.TokenCollaboratorCms;
    const headers = {
      Authorization: `Bearer ${token}`, // Agrega el token como un encabezado de autorización
    };

    const datos = await axios.post(
      graphqlServerUrl,
      {
        query: initialQuery,
      },
      { headers }
    );
    //console.log(datos);
    try {
      if (datos.data && datos.data.data) {
        const dataQuery = datos.data.data;

        if (dataQuery.collaboratorUserData) {
          const { status_code, status_message, collaborator_user } =
            dataQuery.collaboratorUserData;

          if (status_code === 200) {
            //console.log(collaborator_user);

            itemsCollaborators.value = collaborator_user.map((user) => ({
              id: user.id,
              collaborator_name: user.collaborator_name,
              document_number: user.document_number,
              collaborator_email: user.collaborator_email,
              collaborator_status: user.collaborator_status,
              rol_name: user.roles?.rol_name || "Sin rol",
              roles_id: user.roles_id,
              permissions: user.permissionCollaborator,
            }));
            loading.value = false;
          } else {
            //console.log(status_message);
            errors.push({ code: status_code, message: status_message });
          }
        } else {
          handleError({
            code: 500,
            message: "Error obteniendo los datos del usuarios",
          });
        }
      } else {
        //console.log(datos.data.errors[0].extensions.debugMessage);
        if (
          datos.data.errors[0].extensions.debugMessage == "Token has expired"
        ) {
          await refreshTokenAndRetry(() => dataUserCollaborator());
        } else {
          handleError({ code: 500, message: "Unexpected error" });
        }
      }
    } catch (error) {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => dataUserCollaborator());
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

const dataRoles = async () => {
  try {
    const initialQuery = UserCollaboratorQueries.getRolesList;
    const token = localStorage.TokenCollaboratorCms;
    const headers = {
      Authorization: `Bearer ${token}`, // Agrega el token como un encabezado de autorización
    };

    const datos = await axios.post(
      graphqlServerUrl,
      {
        query: initialQuery,
      },
      { headers }
    );
    //console.log(datos);
    try {
      if (datos.data && datos.data.data) {
        const dataQuery = datos.data.data;

        if (dataQuery.getRoles) {
          //console.log(dataQuery.getRoles);
          // Mapea la respuesta al formato correcto para v-select
          itemsRoles.value = dataQuery.getRoles.map((role) => ({
            value: role.id,
            title: role.rol_name,
          }));
        } else {
          handleError({
            code: 500,
            message: "Error obteniendo los roles",
          });
        }
      } else {
        //console.log(datos.data.errors[0].extensions.debugMessage);
        if (
          datos.data.errors[0].extensions.debugMessage == "Token has expired"
        ) {
          await refreshTokenAndRetry(() => dataRoles());
        } else {
          handleError({ code: 500, message: "Unexpected error" });
        }
      }
    } catch (error) {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => dataRoles());
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

const dataPermissions = async () => {
  try {
    const initialQuery = UserCollaboratorQueries.getPermissionList;
    const token = localStorage.TokenCollaboratorCms;
    const headers = {
      Authorization: `Bearer ${token}`, // Agrega el token como un encabezado de autorización
    };

    const datos = await axios.post(
      graphqlServerUrl,
      {
        query: initialQuery,
      },
      { headers }
    );
    //console.log(datos);
    try {
      if (datos.data && datos.data.data) {
        const dataQuery = datos.data.data;

        if (dataQuery.permissionList) {
          const { status_code, status_message, permissions } =
            dataQuery.permissionList;

          if (status_code === 200) {
            //console.log(permissions);
            itemsPermissions.value = permissions;
          } else {
            //console.log(status_message);
            errors.push({ code: status_code, message: status_message });
          }
        } else {
          handleError({
            code: 500,
            message: "Error obteniendo lista de permisos",
          });
        }
      } else {
        //console.log(datos.data.errors[0].extensions.debugMessage);
        if (
          datos.data.errors[0].extensions.debugMessage == "Token has expired"
        ) {
          await refreshTokenAndRetry(() => dataPermissions());
        } else {
          handleError({ code: 500, message: "Unexpected error" });
        }
      }
    } catch (error) {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() => dataPermissions());
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
};

const createUser = async (
  roleId,
  documentNumber,
  collaboratorName,
  collaboratorEmail,
  collaboratorStatus,
  user,
  password
) => {
  loadingBtnUserData.value = true;
  const updateMutation = UserMutations.createCollaboratorUser({
    roles_id: roleId,
    document_number: documentNumber,
    collaborator_name: collaboratorName,
    collaborator_email: collaboratorEmail,
    collaborator_status: collaboratorStatus,
    user: user,
    password: password,
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
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, collaborator_user } =
        dataMutation.createCollaboratorUser;

      if (status_code === 200 || status_code === 201) {
        //console.log(collaborator_user);
        await dataUserCollaborator();
        closeDialogUserData();

        if (collaborator_user.roles_id !== 1) {
          openDialogPermissions(collaborator_user);
        }
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          createUser(
            roleId,
            documentNumber,
            collaboratorName,
            collaboratorEmail,
            collaboratorStatus,
            user,
            password
          )
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al crear el usuario",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        createUser(
          roleId,
          documentNumber,
          collaboratorName,
          collaboratorEmail,
          collaboratorStatus,
          user,
          password
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const updateUser = async (
  idUser,
  roleId,
  documentNumber,
  collaboratorName,
  collaboratorEmail,
  collaboratorStatus,
  user,
  password
) => {
  loadingBtnUserData.value = true;
  const updateMutation = UserMutations.updateCollaboratorUser({
    id: idUser,
    roles_id: roleId,
    document_number: documentNumber,
    collaborator_name: collaboratorName,
    collaborator_email: collaboratorEmail,
    collaborator_status: collaboratorStatus,
    user: user,
    password: password,
  });

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  //console.log(updateMutation);

  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, collaborator_user } =
        dataMutation.updateCollaboratorUser;

      if (status_code === 200 || status_code === 201) {
        //console.log(collaborator_user);
        await dataUserCollaborator();
        closeDialogUserData();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updateUser(
            idUser,
            roleId,
            documentNumber,
            collaboratorName,
            collaboratorEmail,
            collaboratorStatus,
            user,
            password
          )
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar el usuario",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        updateUser(
          idUser,
          roleId,
          documentNumber,
          collaboratorName,
          collaboratorEmail,
          collaboratorStatus,
          user,
          password
        )
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const updatePermissions = async (userId, permissions_array) => {
  loadingBtnPermissions.value = true;
  const updateMutation = UserMutations.updatePermissionsCollaboratorUser({
    user_id: userId,
    permissions: permissions_array,
  });

  //console.log(updateMutation);

  const token = localStorage.TokenCollaboratorCms;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  //console.log(updateMutation);
  const datos = await axios.post(
    graphqlServerUrl,
    {
      query: updateMutation,
    },
    { headers }
  );
  //console.log(datos);
  try {
    if (datos && datos.data && datos.data.data) {
      const dataMutation = datos.data.data;
      const { status_code, status_message, permissionCollaborator } =
        dataMutation.updatePermissionsCollaboratorUser;

      if (status_code === 200 || status_code === 201) {
        await dataUserCollaborator();
        closeDialogUserData();
        closeDialogPermissions();
      } else {
        handleError({
          code: status_code,
          message: status_message,
        });
      }
    } else {
      if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
        await refreshTokenAndRetry(() =>
          updatePermissions(idUser, permissions_array)
        );
      } else {
        handleError({
          code: 500,
          message: "Error inesperado al actualizar permisos",
        });
      }
    }
  } catch (error) {
    if (datos.data.errors[0].extensions.debugMessage == "Token has expired") {
      await refreshTokenAndRetry(() =>
        updatePermissions(idUser, permissions_array)
      );
    } else {
      handleError({ code: 500, message: "Error inesperado en el servidor" });
    }
  }
};

const handleError = (response) => {
  codeError.value = `Error: ${response.code}`;
  textDialog.value = response.message;
  visibleError.value = true;
};

const validateDataFormUserData = async () => {
  const { valid } = await formUserData.value.validate();
  //console.log(modelStatus.value);

  if (valid) {
    if (idUser.value !== null) {
      const status = modelStatus.value === true ? 1 : 0; // Captura el estado del switch

      await updateUser(
        idUser.value,
        selectedRole.value,
        setDocumentNumber.value,
        setUserName.value,
        setEmail.value,
        status, // status
        setDocumentNumber.value, // Usuario es numero de documento
        setDocumentNumber.value // Password es numero de documento
      );
    } else {
      createUser(
        selectedRole.value,
        setDocumentNumber.value,
        setUserName.value,
        setEmail.value,
        1,
        setDocumentNumber.value, // Usuario es numero de documento
        setDocumentNumber.value // Password es numero de documento
      );
    }
  }
};

const validateDataFormPermissions = async () => {
  // Obtener solo los permission_id activados
  const permissionsArray = Object.keys(selectedPermissions.value)
    .filter((key) => selectedPermissions.value[key]) // Filtra solo los activados (true)
    .map(Number); // Convierte las claves a números

  //console.log("Permisos activados:", permissionsArray);

  //console.log(idUser.value);

  // Aquí puedes pasar los permisos a la mutación
  // executeMutation({ user_id: userId.value, permissions: permissionsArray });

  await updatePermissions(idUser.value, permissionsArray);
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
    visible.value = true;
  }
};

const openDialogUserData = (item, isEdit) => {
  if (isEdit) {
    //console.log(item);
    const statusCode = item.collaborator_status === 1 ? true : false; // Captura el estado del switch
    idUser.value = item.id;
    titleDialogUserData.value = "Editar usuario";
    setDocumentNumber.value = item.document_number;
    setUserName.value = item.collaborator_name;
    setEmail.value = item.collaborator_email;
    selectedRole.value = item.roles_id;
    modelStatus.value = statusCode;
    isEditUser.value = true;
  } else {
    titleDialogUserData.value = "Crear usuario";
    setDocumentNumber.value = "";
    setUserName.value = "";
    setEmail.value = "";
    selectedRole.value = null;
    idUser.value = null;
    isEditUser.value = false;
  }

  visibleDialogUserData.value = true;
};

const openDialogPermissions = (item) => {
  if (item.roles_id === 1) {
    //console.log("Administrador");
    openDialogInfo();
  } else if (item.roles_id === 2) {
    visibleDialogPermissions.value = true;
    nameUserPermissions.value = item.collaborator_name;
    idUser.value = item.id;
    //console.log(item);

    // Resetear el estado de los permisos
    selectedPermissions.value = {};

    // Determinar dónde están los permisos
    const permissionsArray =
      item.permissions || item.permissionCollaborator || [];

    // Marcar como "true" los permisos asignados
    permissionsArray.forEach((perm) => {
      selectedPermissions.value[perm.permission_id] = true;
    });

    //console.log("Permisos asignados:", selectedPermissions.value);
  }
};

const openDialogInfo = () => {
  visibleDialogInfo.value = true;
};

const closeDialogUserData = () => {
  titleDialogUserData.value = "";
  setDocumentNumber.value = "";
  setUserName.value = "";
  setEmail.value = "";
  selectedRole.value = null;
  isEditUser.value = false;
  idUser.value = null;
  modelStatus.value = true;
  loadingBtnUserData.value = false;
  visibleDialogUserData.value = false;
};

const closeDialogPermissions = () => {
  nameUserPermissions.value = "";
  idUser.value = null;
  loadingBtnPermissions.value = false;
  visibleDialogPermissions.value = false;
};

const closeDialogInfo = () => {
  visibleDialogInfo.value = false;
};

const closeDialog = () => {
  closeDialogUserData();
  closeDialogPermissions();
  closeDialogInfo();
  visibleError.value = false;
};

onMounted(async () => {
  const tokenExists = checkLocalStorageData("TokenCollaboratorCms");

  // Lógica basada en si el token existe o no
  if (tokenExists) {
    //console.log("EXISTE");
    await dataUserCollaborator();
    await dataRoles();
    await dataPermissions();
  } else {
    router.push("/");
  }
});
</script>
