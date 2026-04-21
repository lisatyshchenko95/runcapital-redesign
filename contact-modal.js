/* Run Capital Partners — Global contact modal.
   Intercepts every mailto: click and shows a universal dialog so users
   without a configured mail client can still read & copy the address. */
(function () {
  if (window.__RCP_CONTACT_MODAL__) return;
  window.__RCP_CONTACT_MODAL__ = true;

  var CSS = [
    '.rcp-cm__backdrop{position:fixed;inset:0;background:rgba(6,6,8,0.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;z-index:9999;padding:24px;opacity:0;transition:opacity .22s ease;}',
    '.rcp-cm__backdrop.is-open{display:flex;opacity:1;}',
    '.rcp-cm__dialog{background:#0e0e10;color:#f5efe1;border:1px solid rgba(201,168,76,0.35);border-radius:14px;max-width:480px;width:100%;padding:36px 32px 32px;box-shadow:0 24px 80px rgba(0,0,0,0.55);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;transform:translateY(8px);transition:transform .22s ease;}',
    '.rcp-cm__backdrop.is-open .rcp-cm__dialog{transform:translateY(0);}',
    '.rcp-cm__eyebrow{font-size:10.5px;letter-spacing:0.22em;text-transform:uppercase;color:#c9a84c;font-weight:600;margin:0 0 12px;}',
    '.rcp-cm__title{font-family:"Playfair Display",Georgia,serif;font-size:26px;font-weight:500;line-height:1.2;margin:0 0 10px;color:#fff;}',
    '.rcp-cm__sub{font-size:13.5px;line-height:1.55;color:rgba(245,239,225,0.7);margin:0 0 22px;}',
    '.rcp-cm__email-wrap{background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.28);border-radius:8px;padding:14px 16px;margin:0 0 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;}',
    '.rcp-cm__email{font-family:"SF Mono",Menlo,Consolas,monospace;font-size:14.5px;color:#e0c874;word-break:break-all;user-select:all;}',
    '.rcp-cm__copy-inline{background:transparent;border:1px solid rgba(201,168,76,0.5);color:#e0c874;font-size:10.5px;letter-spacing:0.14em;text-transform:uppercase;padding:7px 12px;border-radius:4px;cursor:pointer;font-weight:600;white-space:nowrap;transition:all .15s ease;flex-shrink:0;}',
    '.rcp-cm__copy-inline:hover{background:rgba(201,168,76,0.15);border-color:#c9a84c;}',
    '.rcp-cm__copy-inline.is-copied{background:#c9a84c;color:#0e0e10;border-color:#c9a84c;}',
    '.rcp-cm__actions{display:flex;flex-direction:column;gap:10px;}',
    '.rcp-cm__btn{display:block;width:100%;padding:14px 18px;border-radius:6px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-weight:600;cursor:pointer;text-align:center;text-decoration:none;transition:all .18s ease;border:1px solid transparent;font-family:inherit;box-sizing:border-box;}',
    '.rcp-cm__btn--primary{background:linear-gradient(180deg,#d6b35a 0%,#b8933f 100%);color:#0e0e10;border-color:#c9a84c;}',
    '.rcp-cm__btn--primary:hover{background:linear-gradient(180deg,#e0c068 0%,#c9a34a 100%);transform:translateY(-1px);}',
    '.rcp-cm__btn--ghost{background:transparent;color:rgba(245,239,225,0.8);border-color:rgba(245,239,225,0.22);}',
    '.rcp-cm__btn--ghost:hover{border-color:rgba(245,239,225,0.5);color:#fff;}',
    '.rcp-cm__close{position:absolute;top:14px;right:14px;width:32px;height:32px;border:none;background:transparent;color:rgba(245,239,225,0.6);font-size:22px;line-height:1;cursor:pointer;border-radius:4px;transition:color .15s ease;}',
    '.rcp-cm__close:hover{color:#fff;}',
    '.rcp-cm__foot{margin-top:22px;padding-top:18px;border-top:1px solid rgba(245,239,225,0.08);font-size:11.5px;color:rgba(245,239,225,0.5);line-height:1.5;text-align:center;}',
    '.rcp-cm__foot a{color:#c9a84c;text-decoration:none;border-bottom:1px solid rgba(201,168,76,0.3);}',
    '@media (max-width:520px){.rcp-cm__dialog{padding:28px 22px 22px;border-radius:12px;}.rcp-cm__title{font-size:22px;}.rcp-cm__email-wrap{flex-direction:column;align-items:stretch;gap:10px;}.rcp-cm__copy-inline{width:100%;}}'
  ].join('');

  function injectStyles() {
    var s = document.createElement('style');
    s.id = 'rcp-cm-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function decodeParam(v) { try { return decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { return v; } }

  function parseMailto(href) {
    var m = /^mailto:([^?]*)(\?(.*))?$/i.exec(href || '');
    if (!m) return null;
    var to = decodeParam(m[1] || '');
    var q = m[3] || '';
    var out = { to: to, cc: '', subject: '', body: '' };
    if (q) {
      q.split('&').forEach(function (pair) {
        var idx = pair.indexOf('=');
        if (idx < 0) return;
        var k = pair.slice(0, idx).toLowerCase();
        var v = decodeParam(pair.slice(idx + 1));
        if (k === 'cc') out.cc = v;
        else if (k === 'subject') out.subject = v;
        else if (k === 'body') out.body = v;
      });
    }
    return out;
  }

  function buildDialog() {
    var wrap = document.createElement('div');
    wrap.className = 'rcp-cm__backdrop';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'rcp-cm-title');
    wrap.innerHTML =
      '<div class="rcp-cm__dialog" style="position:relative;">' +
        '<button type="button" class="rcp-cm__close" aria-label="Close">&times;</button>' +
        '<p class="rcp-cm__eyebrow" data-rcp-eyebrow>Contact</p>' +
        '<h2 class="rcp-cm__title" id="rcp-cm-title">Get in touch</h2>' +
        '<p class="rcp-cm__sub" data-rcp-sub>Send us a message at the address below. We reply within one business day.</p>' +
        '<div class="rcp-cm__email-wrap">' +
          '<span class="rcp-cm__email" data-rcp-email>info@runcapital.partners</span>' +
          '<button type="button" class="rcp-cm__copy-inline" data-rcp-copy>Copy</button>' +
        '</div>' +
        '<div class="rcp-cm__actions">' +
          '<a class="rcp-cm__btn rcp-cm__btn--primary" data-rcp-mailto data-rcp-skip href="#">Open in Email App</a>' +
          '<button type="button" class="rcp-cm__btn rcp-cm__btn--ghost" data-rcp-close>Close</button>' +
        '</div>' +
        '<div class="rcp-cm__foot">If nothing opens, copy the address and email us from your preferred client.<br>General inquiries: <a href="mailto:info@runcapital.partners" data-rcp-skip>info@runcapital.partners</a></div>' +
      '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  var dialog, backdrop, els, lastFocus;

  function init() {
    injectStyles();
    backdrop = buildDialog();
    els = {
      eyebrow: backdrop.querySelector('[data-rcp-eyebrow]'),
      sub: backdrop.querySelector('[data-rcp-sub]'),
      email: backdrop.querySelector('[data-rcp-email]'),
      copyBtn: backdrop.querySelector('[data-rcp-copy]'),
      mailtoBtn: backdrop.querySelector('[data-rcp-mailto]'),
      closeBtn: backdrop.querySelector('.rcp-cm__close'),
      dismiss: backdrop.querySelector('[data-rcp-close]')
    };

    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) close(); });
    els.closeBtn.addEventListener('click', close);
    els.dismiss.addEventListener('click', close);
    els.copyBtn.addEventListener('click', function () { copyEmail(els.email.textContent); });
    els.mailtoBtn.addEventListener('click', function () {
      // If the OS doesn't handle mailto (no mail app), the page stays visible.
      // Detect this and nudge the user toward Copy.
      var startedAt = Date.now();
      var hid = false;
      var onHide = function () { hid = true; };
      document.addEventListener('visibilitychange', onHide, { once: true });
      window.addEventListener('blur', onHide, { once: true });
      setTimeout(function () {
        document.removeEventListener('visibilitychange', onHide);
        window.removeEventListener('blur', onHide);
        if (hid || Date.now() - startedAt > 2000) return;
        // Still here — no mail app handled the link.
        els.sub.textContent = 'No mail app opened. Tap "Copy" above to copy the address, then paste it into your email or messaging app.';
        els.sub.style.color = '#e0a84c';
        els.copyBtn.focus();
      }, 900);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) close();
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
      if (!a) return;
      if (a.hasAttribute('data-rcp-skip')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault();
      open(a.getAttribute('href'), a);
    }, true);
  }

  function open(href, triggerEl) {
    var parsed = parseMailto(href) || { to: 'info@runcapital.partners' };
    els.email.textContent = parsed.to || 'info@runcapital.partners';
    els.mailtoBtn.setAttribute('href', href);

    var subject = parsed.subject || '';
    var niceSubject = subject.replace(/^Inquiry\s*[-–]\s*/i, '').trim();
    if (niceSubject) {
      els.eyebrow.textContent = niceSubject;
    } else {
      els.eyebrow.textContent = triggerEl && triggerEl.textContent ? triggerEl.textContent.trim().replace(/\s*[→➔➜]+\s*$/, '') : 'Contact';
    }

    var subParts = ['Send us a message at the address below.'];
    if (parsed.cc) subParts.push('CC: ' + parsed.cc);
    subParts.push('We reply within one business day.');
    els.sub.textContent = subParts.join(' ');
    els.sub.style.color = '';

    els.copyBtn.classList.remove('is-copied');
    els.copyBtn.textContent = 'Copy';

    lastFocus = document.activeElement;
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { els.copyBtn.focus(); }, 60);
  }

  function close() {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  function copyEmail(text) {
    var done = function () {
      els.copyBtn.classList.add('is-copied');
      els.copyBtn.textContent = 'Copied';
      setTimeout(function () {
        els.copyBtn.classList.remove('is-copied');
        els.copyBtn.textContent = 'Copy';
      }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      } catch (e) {
        els.copyBtn.textContent = 'Select & copy';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
