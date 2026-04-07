export const IDENTITY_CONFIG  = {
    authority: import.meta.env.VITE_Authority, 
    client_id: import.meta.env.VITE_ClientId, 
    redirect_uri: import.meta.env.VITE_RedirectUri, 
    response_type: import.meta.env.VITE_ResponseType,
    scope: import.meta.env.VITE_Scope, 
    post_logout_redirect_uri: import.meta.env.VITE_PostLogoutRedirectUri, 
  };

  export const METADATA_OIDC = {
    issuer: "https://identityserver",
    jwks_uri: import.meta.env.VITE_Authority + "/.well-known/openid-configuration/jwks",
    authorization_endpoint: import.meta.env.VITE_Authority + "/connect/authorize",
    token_endpoint: import.meta.env.VITE_Authority + "/connect/token",
    userinfo_endpoint: import.meta.env.VITE_Authority + "/connect/userinfo",
    end_session_endpoint: import.meta.env.VITE_Authority + "/connect/endsession",
    check_session_iframe: import.meta.env.VITE_Authority + "/connect/checksession",
    revocation_endpoint: import.meta.env.VITE_Authority + "/connect/revocation",
    introspection_endpoint: import.meta.env.VITE_Authority + "/connect/introspect"
};