const adminSessionKey = 'espresso-admin-session'

export function useAdminSession() {
  const session = useCookie<string | null>(adminSessionKey)

  function setAdminSession() {
    session.value = '1'
  }

  function clearAdminSession() {
    session.value = null
  }

  return {
    session,
    isLoggedIn: computed(() => session.value === '1'),
    setAdminSession,
    clearAdminSession,
  }
}