// export function validProfile(form, formInput, span) {
//   if (!formInput.validity.valid) {
//     span.classList.add("popup__validation_visible");
//     span.textContent = formInput.validationMessage;
//   } else {
//     span.classList.remove("popup__validation_visible");
//   }
// }

// Получение элемента для отображения ошибки
function getErrorElement(input) {
  const inputName = input.getAttribute("name");
  return document.querySelector(`#span__${inputName}-validation`);
}

// Показать ошибку
function showInputError(input, errorElement, errorMessage, config) {
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

// Скрыть ошибку
function hideInputError(input, errorElement, config) {
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
}

// Функция проверки валидности одного поля
function checkInputValidity(form, input, config) {
  const errorElement = getErrorElement(input);

  if (!input.validity.valid) {
    showInputError(input, errorElement, input.validationMessage, config);
  } else {
    hideInputError(input, errorElement, config);
  }
}

// Проверка валидности всех полей формы
function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

// Переключение состояния кнопки
function toggleButtonState(inputs, button, config) {
  if (hasInvalidInput(inputs)) {
    button.classList.add(config.inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(config.inactiveButtonClass);
    button.disabled = false;
  }
}

// Установка слушателей событий для формы
function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, button, config);
    });
  });

  // Установить начальное состояние кнопки
  toggleButtonState(inputs, button, config);
}

// Включение валидации для всех форм
function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    setEventListeners(form, config);
  });
}

// Очистка валидации формы
function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    const errorElement = getErrorElement(input);
    hideInputError(input, errorElement, config);
  });

  // Проверить состояние кнопки после очистки ошибок
  toggleButtonState(inputs, button, config);
}

// Экспорт переиспользуемых функций
export {
  enableValidation,
  checkInputValidity,
  toggleButtonState,
  clearValidation,
};
