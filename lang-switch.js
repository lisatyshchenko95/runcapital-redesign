// ---- Language switcher (EN / IT) ----
// Reads `data-en` / `data-it` attributes on any element and swaps textContent.
// Also supports `data-en-html` / `data-it-html` (innerHTML) and
// `data-en-placeholder` / `data-it-placeholder` (form placeholders).
// State persisted in localStorage under `rcp_lang`.
//
// To translate any new content, add the matching attributes:
//   <h1 data-en="Hello" data-it="Ciao">Hello</h1>
//   <p data-en-html="Hi <strong>there</strong>" data-it-html="Ciao a <strong>tutti</strong>">Hi <strong>there</strong></p>
//   <input data-en-placeholder="Email" data-it-placeholder="Indirizzo email">
//
// Include on every page: <script defer src="lang-switch.js"></script>
(function () {
  var STORE_KEY = 'rcp_lang';

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text != null) el.textContent = text;
    });
    document.querySelectorAll('[data-en-html]').forEach(function (el) {
      var html = el.getAttribute('data-' + lang + '-html');
      if (html != null) el.innerHTML = html;
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      var ph = el.getAttribute('data-' + lang + '-placeholder');
      if (ph != null) el.setAttribute('placeholder', ph);
    });
    document.querySelectorAll('.lang-switch__opt').forEach(function (opt) {
      opt.classList.toggle('lang-switch__opt--active', opt.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved === 'it') applyLang('it');

    var switcher = document.getElementById('langSwitch');
    if (!switcher) return;
    switcher.addEventListener('click', function (e) {
      e.preventDefault();
      var clicked = e.target.closest('.lang-switch__opt');
      var current = document.documentElement.lang === 'it' ? 'it' : 'en';
      if (clicked && clicked.getAttribute('data-lang')) {
        applyLang(clicked.getAttribute('data-lang'));
      } else {
        applyLang(current === 'en' ? 'it' : 'en');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
