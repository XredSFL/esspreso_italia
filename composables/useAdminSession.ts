const adminSessionKey = 'espresso-admin-session'

export function useAdminSession() {
  const session = useCookie<string | null>(adminSessionKey, {
    path: '/',
    sameSite: 'lax',
  })

  function setAdminSession() {
    session.value = '1'
    refreshCookie(adminSessionKey)
  }

  function clearAdminSession() {
    session.value = null
    refreshCookie(adminSessionKey)
  }

  return {
    session,
    isLoggedIn: computed(() => session.value === '1'),
    setAdminSession,
    clearAdminSession,
  }
}