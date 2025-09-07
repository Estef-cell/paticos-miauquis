
const ALLOWED_DOMAINS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];

const showError = (el, message) => {
  el.classList.add('is-invalid');
  el.dataset.error = message;
};

const clearError = (el) => {
  el.classList.remove('is-invalid');
  el.removeAttribute('data-error');
};

const validateEmail = (el) => {
  clearError(el);
  const value = el.value.trim();
  if (el.required && !value) {
    showError(el, 'El email es requerido.');
    return false;
  }
  if (value) {
    if (value.length > 100) {
      showError(el, 'El email no debe exceder los 100 caracteres.');
      return false;
    }
    const domain = value.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      showError(el, `El dominio no es válido. Permitidos: ${ALLOWED_DOMAINS.join(', ')}`);
      return false;
    }
  }
  return true;
};

const validatePassword = (el) => {
  clearError(el);
  const value = el.value;
  if (el.required && !value) {
    showError(el, 'La contraseña es requerida.');
    return false;
  }
  if (value && (value.length < 4 || value.length > 10)) {
    showError(el, 'La contraseña debe tener entre 4 y 10 caracteres.');
    return false;
  }
  return true;
};

const validatePasswordMatch = (passEl, confirmPassEl) => {
  clearError(confirmPassEl);
  if (passEl.value !== confirmPassEl.value) {
    showError(confirmPassEl, 'Las contraseñas no coinciden.');
    return false;
  }
  return true;
};

const validateRequired = (el, name, maxLength) => {
  clearError(el);
  const value = el.value.trim();
  if (el.required && !value) {
    showError(el, `El campo ${name} es requerido.`);
    return false;
  }
  if (value && value.length > maxLength) {
    showError(el, `El campo ${name} no debe exceder los ${maxLength} caracteres.`);
    return false;
  }
  return true;
};

export const initValidation = (formId, rules) => {
  const form = document.getElementById(formId);
  if (!form) return;

  const elements = rules.map(rule => ({ el: document.getElementById(rule.id), rule }));

  elements.forEach(({ el, rule }) => {
    if (!el) return;
    el.addEventListener('input', () => {
      switch (rule.type) {
        case 'email': validateEmail(el); break;
        case 'password': validatePassword(el); break;
        case 'required': validateRequired(el, rule.name, rule.maxLength); break;
        case 'password-confirm':
          const passEl = document.getElementById(rule.matchWith);
          validatePassword(el);
          if (passEl.value) validatePasswordMatch(passEl, el);
          break;
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    elements.forEach(({ el, rule }) => {
      if (!el) return;
      let fieldValid = true;
      switch (rule.type) {
        case 'email': fieldValid = validateEmail(el); break;
        case 'password': fieldValid = validatePassword(el); break;
        case 'required': fieldValid = validateRequired(el, rule.name, rule.maxLength); break;
        case 'password-confirm':
          const passEl = document.getElementById(rule.matchWith);
          fieldValid = validatePassword(el) && validatePasswordMatch(passEl, el);
          break;
      }
      if (!fieldValid) isValid = false;
    });

    if (isValid) {
      const successMessage = form.dataset.successMessage || 'Formulario enviado con éxito (demo).';
      Swal.fire({
        title: '¡Éxito!',
        text: successMessage,
        icon: 'success'
      });
      form.reset();
      elements.forEach(({ el }) => clearError(el));
    }
  });
};
