// ============================================
// Анимация появления секций при скролле
// ИСПРАВЛЕНО: threshold 0.01, rootMargin 0px, fallback, проверка при load
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
  threshold: 0.01,
  rootMargin: '0px 0px 0px 0px'
});

sections.forEach(section => observer.observe(section));

// Fallback: через 1.8с все секции видимы
setTimeout(() => {
  document.querySelectorAll('[data-section]').forEach(s => s.classList.add('is-visible'));
}, 1800);

// Проверка при загрузке
window.addEventListener('load', () => {
  document.querySelectorAll('[data-section]').forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top < window.innerHeight) s.classList.add('is-visible');
  });
});

// ============================================
// Полоса-зелье при скролле
// ============================================
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const fill = document.getElementById('potionFill');
  if (fill) fill.style.height = progress + '%';
});

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
