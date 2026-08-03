export const environment = {
  production: false,
  // When served via `ng serve`, requests to /api are forwarded to the
  // .NET backend by proxy.conf.json, so a relative path works for both
  // dev and prod builds hosted behind the same origin.
  apiBaseUrl: '/api'
};
