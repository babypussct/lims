# Google OAuth redirect setup

The PDF preview flow uses an OAuth 2.0 authorization code redirect. Google
tokens are exchanged by Vercel and stored in an encrypted `HttpOnly` cookie;
Angular never receives the refresh token.

## Google Cloud Console

Use the existing OAuth 2.0 **Web application** client and add this exact
authorized redirect URI:

```text
https://nafiqpm6.vercel.app/api/oauth/google/callback
```

Keep this authorized JavaScript origin:

```text
https://nafiqpm6.vercel.app
```

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
