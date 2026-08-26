/* Preview access gate.
   NOTE: this is a client-side gate for keeping a work-in-progress preview
   out of casual view. It is NOT real security — the page source is still
   downloadable. Do not rely on it to protect anything sensitive. */
(function () {
  var KEY = 'wl-preview-access';
  var TOKEN = 'md1ou2-16rfzpt';

  function hash(s) {
    var h1 = 0x811c9dc5, h2 = 0x1000193;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      h1 = (h1 ^ c) * 16777619 >>> 0;
      h2 = ((h2 << 5) + h2 + c) >>> 0;
    }
    return (h1 >>> 0).toString(36) + '-' + (h2 >>> 0).toString(36);
  }

  try { if (localStorage.getItem(KEY) === TOKEN) return; } catch (e) {}

  var de = document.documentElement;
  de.style.visibility = 'hidden';

  function build() {
    de.style.visibility = '';

    var wrap = document.createElement('div');
    wrap.setAttribute('data-wl-gate', '');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#0E0E0C;' +
      'display:flex;align-items:center;justify-content:center;padding:24px;' +
      "font-family:'Inter Tight',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;" +
      '-webkit-font-smoothing:antialiased;';

    var card = document.createElement('form');
    card.style.cssText = 'width:100%;max-width:420px;display:flex;flex-direction:column;gap:22px;';

    var kicker = document.createElement('span');
    kicker.textContent = 'WENDI / LEV';
    kicker.style.cssText = "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;" +
      'letter-spacing:0.2em;text-transform:uppercase;color:#EFEDE6;font-weight:500;';

    var sub = document.createElement('span');
    sub.textContent = 'Private preview';
    sub.style.cssText = "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;" +
      'letter-spacing:0.22em;text-transform:uppercase;color:#5cbf8f;margin-top:-16px;';

    var h1 = document.createElement('h1');
    h1.textContent = 'enter the password to continue.';
    h1.style.cssText = 'margin:0;font-weight:300;font-size:clamp(26px,5vw,38px);line-height:1.05;' +
      'letter-spacing:-0.035em;color:#EFEDE6;text-transform:lowercase;';

    var label = document.createElement('label');
    label.style.cssText = 'display:flex;flex-direction:column;gap:9px;';
    var lt = document.createElement('span');
    lt.textContent = 'Password';
    lt.style.cssText = "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9.5px;" +
      'letter-spacing:0.2em;text-transform:uppercase;color:#918F88;';
    var input = document.createElement('input');
    input.type = 'password';
    input.autocomplete = 'current-password';
    input.setAttribute('aria-label', 'Preview password');
    input.style.cssText = 'background:transparent;border:0;border-bottom:1px solid rgba(239,237,230,0.28);' +
      "color:#EFEDE6;font-family:'Inter Tight',sans-serif;font-size:17px;padding:10px 0;outline:none;min-height:44px;";
    input.addEventListener('focus', function () { input.style.borderBottomColor = '#5cbf8f'; });
    input.addEventListener('blur', function () { input.style.borderBottomColor = 'rgba(239,237,230,0.28)'; });
    label.appendChild(lt);
    label.appendChild(input);

    var err = document.createElement('span');
    err.style.cssText = "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:10px;" +
      'letter-spacing:0.16em;text-transform:uppercase;color:#ff6b6b;min-height:14px;';
    err.setAttribute('role', 'status');

    var btn = document.createElement('button');
    btn.type = 'submit';
    btn.textContent = 'Enter →';
    btn.style.cssText = 'align-self:flex-start;display:inline-flex;align-items:center;gap:10px;' +
      'min-height:48px;padding:0 26px;background:#5cbf8f;color:#0B120E;border:0;cursor:pointer;' +
      "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.2em;" +
      'text-transform:uppercase;font-weight:500;transition:background .3s ease;';
    btn.addEventListener('mouseenter', function () { btn.style.background = '#6fd0a0'; });
    btn.addEventListener('mouseleave', function () { btn.style.background = '#5cbf8f'; });

    var note = document.createElement('p');
    note.textContent = 'Preview example. All copy, figures, hours, and other details are placeholder and subject to change until the final content is approved.';
    note.style.cssText = 'margin:8px 0 0;font-size:13px;line-height:1.6;color:#B5B2A9;max-width:52ch;';

    card.appendChild(kicker);
    card.appendChild(sub);
    card.appendChild(h1);
    card.appendChild(label);
    card.appendChild(err);
    card.appendChild(btn);
    card.appendChild(note);
    wrap.appendChild(card);

    card.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim().toLowerCase();
      if (hash(v) === TOKEN) {
        try { localStorage.setItem(KEY, TOKEN); } catch (_) {}
        wrap.parentNode && wrap.parentNode.removeChild(wrap);
        document.body.style.overflow = '';
      } else {
        err.textContent = 'Incorrect password';
        input.value = '';
        input.focus();
      }
    });

    document.body.appendChild(wrap);
    document.body.style.overflow = 'hidden';
    input.focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
