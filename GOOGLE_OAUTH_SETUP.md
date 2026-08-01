# Google OAuth setup

Google sign-in uses Firebase's official `signInWithRedirect()` / `getRedirectResult()`
flow. The Angular app does not parse or exchange Google ID tokens itself.

Google Drive authorization remains a separate authorization-code flow handled by
Vercel. The Drive scope must not be requested as part of normal LIMS sign-in.

The PDF preview flow uses an OAuth 2.0 authorization code redirect. Google
tokens are exchanged by Vercel and stored in an encrypted `HttpOnly` cookie;
Angular never receives the refresh token.

## Firebase Authentication

Enable both the Google provider and the Email/Password provider in Firebase
Authentication. A Google-first user is given the verified Google email as the
initial LIMS login ID and can create a separate LIMS password in the app; the
password is linked to the same Firebase UID and is never synchronized with the
Google password. Do not create a second Firebase account for the same email.

Add every hostname that can serve the app to Firebase Authentication's
authorized domains. For local development, add `localhost` without the port
(`localhost:4200` is not a separate entry):

```text
localhost
nafiqpm6.vercel.app
nafiqpm6-babypusscts-projects.vercel.app
nafiqpm6-git-main-babypusscts-projects.vercel.app
```

Both development and production Firebase configs use `nafiqpm6.vercel.app` as
`authDomain`; this is required because the legacy
`lims-cloud-by-otada.firebaseapp.com/__/firebase/init.json` endpoint returns
404. `vercel.json` must continue proxying `/__/auth/*` to the Firebase Hosting helper
domain.
The matching `/__/firebase/init.json` is served from
`public/__/firebase/init.json` with the same Firebase web configuration so the
helper can initialize correctly when third-party storage is restricted.
The security header `X-Frame-Options: DENY` must not apply to `/__/auth/*` or
`/__/firebase/*`; Firebase loads these helper endpoints in an iframe during the
redirect flow. The application routes remain protected by `DENY`.

## Google Cloud Console

The existing OAuth 2.0 **Web application** client is used by the separate Drive
authorization-code flow. Keep this exact authorized redirect URI:

```text
https://nafiqpm6.vercel.app/api/oauth/google/callback
```

Keep this authorized JavaScript origin:

```text
https://nafiqpm6.vercel.app
```

If Drive is used from another owned origin, add that origin explicitly. Do not
use wildcard origins, and do not configure the Angular Firebase login to request
the Drive scope.

## Vercel environment variables

Configure these variables for Production (and Preview only if its callback URI
is also registered in Google Cloud):

```text
GOOGLE_OAUTH_CLIENT_ID=498845778988-loivmvvd0k0bh7pis4p50d8a0qsglc8j.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=<Google Cloud web client secret>
GOOGLE_OAUTH_REDIRECT_URI=https://nafiqpm6.vercel.app/api/oauth/google/callback
APP_ORIGIN=https://nafiqpm6.vercel.app
OAUTH_COOKIE_SECRET=<at least 32 random bytes, base64 or hex text>
```

Generate `OAUTH_COOKIE_SECRET` with a cryptographically secure password tool.
Never add these values to Angular environment files or commit them to Git.

After changing environment variables, redeploy the project. Existing users
will authorize Drive once; later access-token refreshes happen on the server.
