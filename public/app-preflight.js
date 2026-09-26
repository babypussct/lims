// Runs before Angular to apply the saved theme and safely consume the legacy
// Google Drive OAuth fragment. Kept in a standalone file so production CSP can
// reject inline JavaScript.
(function () {
  try {
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      var themeMeta = document.querySelector('meta[name="theme-color"]');
      if (themeMeta) themeMeta.setAttribute('content', '#111322');
    }
  } catch (_) {}

  var hash = window.location.hash || '';
  var handled = false;
  if (hash.charAt(1) !== '/') {
    var params = new URLSearchParams(hash.substring(1));
    var idToken = params.get('id_token');
    var token = params.get('access_token');
    var expiresIn = params.get('expires_in');
    var oauthError = params.get('error');

    if (idToken) {
      sessionStorage.removeItem('__gd_token');
      sessionStorage.removeItem('__gd_expiry');
      sessionStorage.removeItem('__google_id_token');
      sessionStorage.setItem('__google_redirect_error', 'legacy_google_redirect');
      handled = true;
    } else if (token) {
      sessionStorage.setItem('__gd_token', token);
      sessionStorage.setItem(
        '__gd_expiry',
        String(Date.now() + (parseInt(expiresIn || '3600', 10) - 300) * 1000)
      );
      handled = true;
    } else if (oauthError) {
      sessionStorage.setItem('__google_redirect_error', oauthError);
      handled = true;
    }
  }

  if (handled) {
    var route = sessionStorage.getItem('__gd_route') || '#/';
    sessionStorage.removeItem('__gd_route');
    var safeRoute = route.indexOf('#/') === 0 ? route : '#/';
    window.location.replace(window.location.pathname + safeRoute);
  }
})();
