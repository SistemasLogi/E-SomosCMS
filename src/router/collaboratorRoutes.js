export default [
    {
      path: "/colaboradores",
      name: "AplicationMain",
      component: () =>
        import("@/components/MainAplication.vue"),
      children: [
        {
          path: "",
          name: "DashboardInitial",
          component: () =>
            import("@/components/general_components/Dashboard.vue"),          
        },
        {
          path: "dashboard",
          name: "Dashboard",
          component: () =>
            import("@/components/general_components/Dashboard.vue"),          
        },
        {
          path: "top-menu",
          name: "MenuSuperior",
          component: () =>
            import("@/components/publication_components/TopMenu.vue"),          
        },
        {
          path: "slider-principal",
          name: "PrincipalSlider",
          component: () =>
            import("@/components/publication_components/SliderPrincipal.vue"),          
        },
      ]
    },
  ];