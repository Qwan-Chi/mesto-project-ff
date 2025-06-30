const VALIDATION_PATTERNS = {
  placeName: /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/,
};

const ERROR_MESSAGES = {
  placeName:
    "Название может содержать только латинские и кириллические буквы, знаки дефиса и пробелы",
};

function getErrorElement(input) {
  const inputName = input.getAttribute("name");

  if (inputName === "place-name") {
    return document.querySelector("#span__place-name-validation");
  }

  return document.querySelector(`#span__${inputName}-validation`);
}

function validatePlaceName(input) {
  if (!VALIDATION_PATTERNS.placeName.test(input.value)) {
    return ERROR_MESSAGES.placeName;
  }
  return "";
}

function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

function showInputError(input, errorElement, errorMessage, config) {
  if (!errorElement) {
    console.warn(`Error element not found for input: ${input.name}`);
    return;
  }

  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(input, errorElement, config) {
  if (!errorElement) {
    console.warn(`Error element not found for input: ${input.name}`);
    return;
  }

  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
}

function checkInputValidity(form, input, config) {
  const errorElement = getErrorElement(input);

  if (!errorElement) {
    console.warn(`Error element not found for input: ${input.name}`);
    return;
  }

  let errorMessage = "";

  if (!input.validity.valid) {
    errorMessage = input.validationMessage;
  }

  if (input.name === "place-name" && input.value.trim() !== "") {
    const customError = validatePlaceName(input);
    if (customError) {
      errorMessage = customError;
      input.setCustomValidity(customError);
    } else {
      input.setCustomValidity("");
    }
  }

  if (errorMessage) {
    showInputError(input, errorElement, errorMessage, config);
  } else {
    hideInputError(input, errorElement, config);
  }
}

function toggleButtonState(inputs, button, config) {
  if (!button) {
    console.warn("Submit button not found");
    return;
  }

  const isFormInvalid = hasInvalidInput(inputs);

  button.classList.toggle(config.inactiveButtonClass, isFormInvalid);
  button.disabled = isFormInvalid;
}

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, config);
      toggleButtonState(inputs, button, config);
    });
  });

  toggleButtonState(inputs, button, config);
}

function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    setEventListeners(form, config);
  });
}

function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.setCustomValidity("");

    const errorElement = getErrorElement(input);
    if (errorElement) {
      hideInputError(input, errorElement, config);
    }
  });

  toggleButtonState(inputs, button, config);
}

export {
  enableValidation,
  checkInputValidity,
  toggleButtonState,
  clearValidation,
};
