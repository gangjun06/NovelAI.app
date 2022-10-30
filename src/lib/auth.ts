export const setRedirect = () => {
  localStorage.setItem('auth-redirect-to', location.pathname + location.search)
}
export const loadRedirect = () => {
  const to = localStorage.getItem('auth-redirect-to') ?? ''
  localStorage.removeItem('auth-redirect-to')
  return to
}
