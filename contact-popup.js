/* ============================================
   RCP Contact Popup
   Intercepts mailto: links and shows a compose form.
   Uses Web3Forms (free, no backend needed) or falls back to mailto.
   ============================================ */
(function () {
  // ---- CONFIG ----
  const DEFAULT_EMAIL = 'info@runcapital.partners';
  const WEB3FORMS_KEY = ''; // Leave empty to use mailto fallback

  // ---- STYLES ----
  const style = document.createElement('style');
  style.textContent = `
    .rcp-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.35s cubic-bezier(0.22,1,0.36,1);
    }
    .rcp-overlay--open { opacity: 1; pointer-events: auto; }

    .rcp-popup {
      background: #0a0a0a;
      border: 1px solid rgba(201,168,76,0.25);
      border-radius: 16px;
      width: 90%; max-width: 520px;
      padding: 48px 44px;
      position: relative;
      transform: translateY(24px) scale(0.97);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,168,76,0.08);
    }
    .rcp-overlay--open .rcp-popup { transform: translateY(0) scale(1); }

    .rcp-popup__close {
      position: absolute; top: 18px; right: 20px;
      background: none; border: none; cursor: pointer;
      color: rgba(247,243,234,0.4); font-size: 24px; line-height: 1;
      transition: color 0.3s;
    }
    .rcp-popup__close:hover { color: #c9a84c; }

    .rcp-popup__to {
      font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
      color: #c9a84c; margin: 0 0 8px; font-weight: 600;
    }
    .rcp-popup__title {
      font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
      font-size: 32px; font-weight: 500; color: #fff;
      margin: 0 0 32px; line-height: 1.15;
    }

    .rcp-form { display: flex; flex-direction: column; gap: 18px; }

    .rcp-field { display: flex; flex-direction: column; gap: 6px; }
    .rcp-field label {
      font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
      color: rgba(247,243,234,0.5); font-weight: 500;
    }
    .rcp-field input, .rcp-field textarea {
      background: rgba(247,243,234,0.06);
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 8px;
      padding: 14px 16px;
      color: #fff; font-size: 15px;
      font-family: 'Inter', -apple-system, sans-serif;
      outline: none;
      transition: border-color 0.3s;
    }
    .rcp-field input:focus, .rcp-field textarea:focus {
      border-color: #c9a84c;
    }
    .rcp-field input::placeholder, .rcp-field textarea::placeholder {
      color: rgba(247,243,234,0.25);
    }
    .rcp-field textarea { resize: vertical; min-height: 100px; }

    .rcp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    .rcp-submit {
      display: inline-block; width: 100%; padding: 16px;
      background: linear-gradient(180deg, #e0c874 0%, #c9a84c 100%);
      color: #141414; font-family: 'Inter', sans-serif;
      font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
      font-weight: 600; border: none; border-radius: 8px; cursor: pointer;
      box-shadow: 0 8px 28px rgba(201,168,76,0.25);
      transition: transform 0.3s, box-shadow 0.3s;
      margin-top: 8px;
    }
    .rcp-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(201,168,76,0.4);
    }
    .rcp-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .rcp-success {
      text-align: center; padding: 40px 0;
    }
    .rcp-success__icon {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(180deg, #e0c874, #c9a84c);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; font-size: 28px; color: #141414;
    }
    .rcp-success__title {
      font-family: 'Cormorant Garamond', 'Playfair Display', serif;
      font-size: 28px; font-weight: 500; color: #fff; margin: 0 0 12px;
    }
    .rcp-success__sub {
      font-size: 15px; color: rgba(247,243,234,0.6); margin: 0;
    }

    @media (max-width: 600px) {
      .rcp-popup { padding: 32px 24px; }
      .rcp-popup__title { font-size: 26px; }
      .rcp-row { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);

  // ---- OVERLAY ----
  const overlay = document.createElement('div');
  overlay.className = 'rcp-overlay';
  overlay.innerHTML = `
    <div class="rcp-popup">
      <button class="rcp-popup__close" aria-label="Close">&times;</button>
      <p class="rcp-popup__to"></p>
      <h2 class="rcp-popup__title">Get in touch.</h2>
      <form class="rcp-form" id="rcpContactForm">
        <div class="rcp-row">
          <div class="rcp-field">
            <label for="rcp-name">Full Name</label>
            <input type="text" id="rcp-name" name="name" placeholder="Your name" required>
          </div>
          <div class="rcp-field">
            <label for="rcp-email">Email</label>
            <input type="email" id="rcp-email" name="email" placeholder="your@email.com" required>
          </div>
        </div>
        <div class="rcp-field">
          <label for="rcp-company">Company <span style="opacity:0.5;text-transform:none;letter-spacing:0;">(optional)</span></label>
          <input type="text" id="rcp-company" name="company" placeholder="Company name">
        </div>
        <div class="rcp-field">
          <label for="rcp-message">Message</label>
          <textarea id="rcp-message" name="message" placeholder="How can we help?" required></textarea>
        </div>
        <input type="hidden" name="to_email" id="rcp-to-email" value="">
        <input type="hidden" name="service" id="rcp-service" value="">
        <button type="submit" class="rcp-submit">Send Message</button>
      </form>
      <div class="rcp-success" style="display:none;">
        <div class="rcp-success__icon">&#10003;</div>
        <h3 class="rcp-success__title">Message sent.</h3>
        <p class="rcp-success__sub">We'll be in touch shortly.</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const popup = overlay.querySelector('.rcp-popup');
  const form = document.getElementById('rcpContactForm');
  const successEl = overlay.querySelector('.rcp-success');
  const toLabel = overlay.querySelector('.rcp-popup__to');
  const toEmailInput = document.getElementById('rcp-to-email');
  const serviceInput = document.getElementById('rcp-service');

  function openPopup(email, service) {
    const to = email || DEFAULT_EMAIL;
    toEmailInput.value = to;
    serviceInput.value = service || '';
    toLabel.textContent = 'To: ' + to;
    form.style.display = '';
    successEl.style.display = 'none';
    form.reset();
    overlay.classList.add('rcp-overlay--open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.classList.remove('rcp-overlay--open');
    document.body.style.overflow = '';
  }

  // Close handlers
  overlay.querySelector('.rcp-popup__close').addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  // Form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.rcp-submit');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    var to = toEmailInput.value || DEFAULT_EMAIL;
    var name = document.getElementById('rcp-name').value;
    var email = document.getElementById('rcp-email').value;
    var company = document.getElementById('rcp-company').value;
    var message = document.getElementById('rcp-message').value;
    var service = serviceInput.value;

    // If Web3Forms key is set, use it
    if (WEB3FORMS_KEY) {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: name,
          email: email,
          company: company,
          message: message,
          to: to,
          subject: service ? 'RCP Inquiry: ' + service : 'RCP General Inquiry',
          from_name: 'Run Capital Partners Website'
        })
      }).then(function (r) { return r.json(); })
        .then(function (data) {
          form.style.display = 'none';
          successEl.style.display = '';
          setTimeout(closePopup, 3000);
        })
        .catch(function () {
          // Fallback to mailto
          fallbackMailto(to, name, email, company, message, service);
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = 'Send Message';
        });
    } else {
      // Mailto fallback
      fallbackMailto(to, name, email, company, message, service);
      form.style.display = 'none';
      successEl.style.display = '';
      btn.disabled = false;
      btn.textContent = 'Send Message';
      setTimeout(closePopup, 3000);
    }
  });

  function fallbackMailto(to, name, email, company, message, service) {
    var subject = encodeURIComponent(service ? 'Inquiry: ' + service : 'General Inquiry');
    var body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n' +
      (company ? 'Company: ' + company + '\n' : '') +
      '\n' + message
    );
    window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
  }

  // ---- INTERCEPT MAILTO LINKS ----
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="mailto:"]');
    if (!link) {
      // Also check buttons/links with "Get in Touch" or "Contact" text
      var cta = e.target.closest('.nav__cta, .sv-cta__btn, [class*="cta"]');
      if (cta && cta.href && cta.href.indexOf('mailto:') === 0) {
        link = cta;
      } else if (cta && cta.href && cta.href.indexOf('#contact') !== -1) {
        e.preventDefault();
        openPopup(DEFAULT_EMAIL, '');
        return;
      }
    }
    if (link && link.href.indexOf('mailto:') === 0) {
      e.preventDefault();
      var email = link.href.replace('mailto:', '').split('?')[0];
      // Try to detect service from page title or nearby text
      var service = document.title.split('—')[0].split('|')[0].trim();
      if (service === 'Run Capital Partners' || service.length > 40) service = '';
      openPopup(email, service);
    }
  });

  // Also intercept "Get in Touch" nav CTA that links to #contact
  document.addEventListener('click', function (e) {
    var navCta = e.target.closest('a[href*="#contact"]');
    if (navCta) {
      e.preventDefault();
      openPopup(DEFAULT_EMAIL, '');
    }
  });
})();
