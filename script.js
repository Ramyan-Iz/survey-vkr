// ============================================================
// ВАЖНО: замени этот URL на свой из Google Apps Script
// (после развёртывания веб-приложения)
// ============================================================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyxvvwo8fqMbJly-Y9FddxY2gQixBxYy6TS-0n5gZHHt2amhAprJZ5P2qZe5oSHhWng/exec";

let currentStep = 0;
const steps = document.querySelectorAll(".step");

// Показать текущий шаг и обновить прогресс-бар
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  const progress = (index / (steps.length - 1)) * 100;
  document.getElementById("progressBar").style.width = progress + "%";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Валидация текущего шага (простая: все radio в блоке выбраны)
function validateCurrentStep() {
  const activeStep = steps[currentStep];

  // Проверка согласия на шаге 0
  if (currentStep === 0) {
    const consent = document.getElementById("consent");
    if (!consent.checked) {
      alert("Пожалуйста, подтвердите согласие на участие.");
      return false;
    }
  }

  // Проверка radio-вопросов (если они есть на шаге)
  const questions = activeStep.querySelectorAll(".question");
  for (const q of questions) {
    const name = q.dataset.name;
    const answered = activeStep.querySelector(`input[name="${name}"]:checked`);
    if (!answered) {
      q.scrollIntoView({ behavior: "smooth", block: "center" });
      q.style.outline = "2px solid #ef4444";
      setTimeout(() => (q.style.outline = "none"), 1500);
      alert("Пожалуйста, ответьте на все вопросы этого блока.");
      return false;
    }
  }

  return true;
}

// Переход вперёд
function nextStep() {
  if (!validateCurrentStep()) return;

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

// Переход назад
function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}

// Сбор данных формы в объект
function collectFormData() {
  const form = document.getElementById("surveyForm");
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    // Если поле встречается несколько раз (checkbox) — собираем в массив
    if (data[key]) {
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  // Добавляем timestamp
  data.timestamp = new Date().toISOString();

  return data;
}

// Отправка в Google Apps Script
async function submitForm() {
  // Валидация последнего шага (если нужно)
  if (!validateCurrentStep()) return;

  const data = collectFormData();

  // Блокируем кнопку, чтобы не отправили дважды
  const submitBtn = document.querySelector(".btn-submit");
  submitBtn.disabled = true;
  submitBtn.textContent = "Отправляем...";

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // важно для Apps Script
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data).toString(),
    });

    // Переход на финальный экран
    currentStep = steps.length - 1;
    showStep(currentStep);
  } catch (error) {
    alert("Не удалось отправить данные. Проверьте соединение и попробуйте снова.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить";
    console.error(error);
  }
}

// Инициализация
showStep(0);