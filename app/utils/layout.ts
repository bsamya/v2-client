//options used in default.vue to create the sidebar menu and top nav
export const menuOptions = [
  { text: 'Dashboard', to: '/' },
  { text: 'Users', to: '/' },
  { text: 'Projects', to: '/' },
  { text: 'Tasks', to: '/' },
  { text: 'Settings', to: '/' },
]

const companyStore = useCompanyStore();
export const footerOptions = computed(() => {
  if (companyStore.activeCompany === null) return [
    { icon: 'mdi-domain', text: 'companies', to: '/companies' },
    { icon: "mdi-frequently-asked-questions", text: "faq", to: "/faq" },
    { icon: "mdi-help-circle", text: "help", to: "/help" },
    { icon: "mdi-logout", text: "signout", to: "/" },
  ]

  return [
    { icon: 'mdi-view-dashboard', text: 'dashboard', to: `/company/dashboard` },
    { icon: 'mdi-domain', text: 'companies', to: '/companies' },
    { icon: 'mdi-cog', text: 'applications', to: `/company/applications` },
    { icon: 'mdi-package-variant', text: 'products', to: `/company/products` },
    { icon: 'mdi-account-group', text: 'users', to: '/company/users' },
    { icon: "mdi-frequently-asked-questions", text: "faq", to: "/faq" },
    { icon: "mdi-help-circle", text: "help", to: "/help" },
    { icon: "mdi-logout", text: "signout", to: "/" },
  ]
});
