document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // Tant qu'une capture d'écran n'a pas été déposée dans assets/captures/,
  // on retire la balise image pour laisser apparaître le repère sous-jacent
  // plutôt qu'une icône de fichier cassé.
  document.querySelectorAll('.thumb-shot').forEach((shot) => {
    shot.addEventListener('error', () => shot.remove());
    if (shot.complete && shot.naturalWidth === 0) shot.remove();
  });

  // Un réseau social dont l'adresse n'a pas encore été renseignée est retiré,
  // pour ne jamais afficher un lien qui ne mène nulle part.
  document.querySelectorAll('.social-link').forEach((link) => {
    if (link.getAttribute('href').includes('A_COMPLETER')) link.remove();
  });
  document.querySelectorAll('.social-links').forEach((group) => {
    if (!group.querySelector('.social-link')) group.remove();
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const status = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const accessKey = contactForm.querySelector('[name="access_key"]');

    const showStatus = (type, text) => {
      status.className = `form-status ${type}`;
      status.textContent = text;
    };

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      showStatus('', '');

      if (!contactForm.reportValidity()) return;

      // Garde-fou tant que la clé Web3Forms n'a pas été renseignée
      if (!accessKey.value || accessKey.value === 'CLE_WEB3FORMS_A_REMPLACER') {
        showStatus('error', "Le formulaire n'est pas encore configuré. Écrivez-nous sur WhatsApp, nous répondons tout de suite.");
        return;
      }

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm),
        });

        // Web3Forms renvoie normalement du JSON, mais peut répondre en HTML
        // selon le contexte. Dans ce cas le statut HTTP fait foi.
        let sent = response.ok;
        try {
          const result = await response.json();
          sent = response.ok && result.success;
        } catch (parseError) {
          /* réponse non JSON : on s'en tient au statut HTTP */
        }

        if (sent) {
          showStatus('success', 'Message envoyé. Nous vous répondons sous 24 heures.');
          contactForm.reset();
        } else {
          showStatus('error', "L'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp.");
        }
      } catch (error) {
        showStatus('error', 'Connexion impossible. Vérifiez votre réseau ou écrivez-nous sur WhatsApp.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
});
