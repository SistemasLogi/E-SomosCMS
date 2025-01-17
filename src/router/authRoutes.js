export default [
  {
    path: "/", // Ruta para que las tiendas creen su cuenta en LOGI
    name: "Authentication",
    component: () =>
      import("@/components/authentication_components/LoginCollaborator.vue"),
  },
];
