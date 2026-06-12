export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAdminSession()

  if (to.path === '/admin/login') {
    return
  }

  if (!isLoggedIn.value) {
    return navigateTo('/admin/login')
  }
})