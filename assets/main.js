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

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      const to = 'sunutech.niang@gmail.com';
      const finalSubject = subject || 'Demande de projet — Site vitrine';
      const bodyLines = [
        name ? `Nom : ${name}` : '',
        email ? `Email : ${email}` : '',
        '',
        message || '',
      ].filter((line) => line !== '');
      const body = bodyLines.join('\n');
      const url = `mailto:${to}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    });
  }
});
