// ============================================
// Анимация появления секций при скролле
// ============================================
const sections = document.querySelectorAll('[data-section]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

sections.forEach(section => observer.observe(section));

// ============================================
// Отправка (заглушка — подключи свой Apps Script)
// ============================================
const form = document.getElementById('prettyForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('.submit');
  const originalText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Отправляем…</span>';

  // Здесь будет твой fetch на Apps Script
  // Пока — имитация задержки
  await new Promise(resolve => setTimeout(resolve, 800));

  submitBtn.innerHTML = '<span>Спасибо</span><span class="submit-arrow">✓</span>';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }, 3000);
});