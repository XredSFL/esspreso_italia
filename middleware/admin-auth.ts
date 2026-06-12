export default defineNuxtRouteMiddleware((to) => {
  // Prototype mode: admin pages are open so the CMS can be demoed immediately.
  // Keep the middleware in place for the later auth pass, but do not block access now.
  if (to.path === '/admin/login') {
    return
  }
})