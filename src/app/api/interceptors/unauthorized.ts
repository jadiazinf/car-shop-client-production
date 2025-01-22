export function handleUnauthorized() {
  if (!window.location.pathname.match("/auth"))
    window.location.href = "/user-session";
}
