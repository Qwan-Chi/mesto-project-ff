import "../styles/index.css";
import { openModal, closeModal } from "./modal";
import { createCard } from "./card";
import { enableValidation, clearValidation } from "./validation";
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addCard,
  deleteCard as deleteCardAPI,
  likeCard,
  unlikeCard,
  updateUserAvatar,
} from "./api";

const SELECTORS = {
  profileForm: 'form[name="edit-profile"]',
  cardForm: 'form[name="new-place"]',
  avatarForm: 'form[name="avatar"]',
  editPopup: ".popup_type_edit",
  newCardPopup: ".popup_type_new-card",
  imagePopup: ".popup_type_image",
  avatarPopup: ".popup_type_avatar",
  editButton: ".profile__edit-button",
  addButton: ".profile__add-button",
  avatarButton: ".profile__image",
  closeButtons: ".popup__close",
  profileTitle: ".profile__title",
  profileDescription: ".profile__description",
  profileAvatar: ".profile__image",
  placesList: ".places__list",
};

const VALIDATION_CONFIG = {
  editProfile: {
    formSelector: 'form[name="edit-profile"]',
    inputSelector: 'input[name="name"], input[name="description"]',
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    errorClass: "popup__validation_visible",
  },

  newCard: {
    formSelector: 'form[name="new-place"]',
    inputSelector: 'input[name="place-name"], input[name="link"]',
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    errorClass: "popup__validation_visible",
  },

  avatar: {
    formSelector: 'form[name="avatar"]',
    inputSelector: 'input[name="avatar"]',
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    errorClass: "popup__validation_visible",
  },
};

function getElements() {
  const profileForm = document.forms["edit-profile"];
  const cardForm = document.forms["new-place"];
  const avatarForm = document.forms["avatar"];

  if (!profileForm) {
    console.error('Форма "edit-profile" не найдена');
    return null;
  }
  if (!cardForm) {
    console.error('Форма "new-place" не найдена');
    return null;
  }

  return {
    forms: {
      profile: profileForm,
      card: cardForm,
      avatar: avatarForm,
    },

    popups: {
      edit: document.querySelector(SELECTORS.editPopup),
      newCard: document.querySelector(SELECTORS.newCardPopup),
      image: document.querySelector(SELECTORS.imagePopup),
      avatar: document.querySelector(SELECTORS.avatarPopup),
    },

    profile: {
      title: document.querySelector(SELECTORS.profileTitle),
      description: document.querySelector(SELECTORS.profileDescription),
      avatar: document.querySelector(SELECTORS.profileAvatar),
    },

    placesList: document.querySelector(SELECTORS.placesList),
  };
}

const elements = getElements();

if (!elements) {
  console.error("Не удалось найти необходимые элементы DOM");
  throw new Error("Критическая ошибка: отсутствуют необходимые элементы DOM");
}

function getInputs() {
  if (!elements.forms.profile || !elements.forms.card) {
    console.error("Формы не найдены, не могу получить инпуты");
    return null;
  }

  return {
    profile: {
      name: elements.forms.profile.elements?.name,
      description: elements.forms.profile.elements?.description,
    },

    card: {
      name: elements.forms.card.elements?.["place-name"],
      link: elements.forms.card.elements?.link,
    },

    avatar: elements.forms.avatar?.elements?.avatar,
  };
}

const inputs = getInputs();

let currentUser = {};

function renderLoading(button, isLoading, loadingText = "Сохранение...") {
  if (!button) {
    console.error("Кнопка не найдена для renderLoading");
    return;
  }

  if (isLoading) {
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent;
    }
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || "Сохранить";
  }
}

function updateProfileDisplay(userData) {
  if (elements.profile.title) {
    elements.profile.title.textContent = userData.name;
  }
  if (elements.profile.description) {
    elements.profile.description.textContent = userData.about;
  }
  if (elements.profile.avatar) {
    elements.profile.avatar.style.backgroundImage = `url(${userData.avatar})`;
  }
}

function fillProfileForm() {
  if (inputs && inputs.profile) {
    if (inputs.profile.name) {
      inputs.profile.name.value = currentUser.name || "";
    }
    if (inputs.profile.description) {
      inputs.profile.description.value = currentUser.about || "";
    }
  }
}

function handleImageZoom(evt) {
  const image = evt.target;
  const imagePopup = elements.popups.image;

  if (!imagePopup) {
    console.error("Попап изображения не найден");
    return;
  }

  const popupImage = imagePopup.querySelector(".popup__image");
  const popupCaption = imagePopup.querySelector(".popup__caption");

  if (popupImage) {
    popupImage.src = image.src;
    popupImage.alt = image.alt;
  }
  if (popupCaption) {
    popupCaption.textContent = image.alt;
  }

  openModal(imagePopup);
}

function createCardElement(cardData) {
  return createCard(
    cardData,
    currentUser._id,
    handleDeleteClick,
    handleLikeToggle,
    handleImageZoom
  );
}

function handleLikeToggle(cardData, likeButton, likeCounter) {
  const isLiked = cardData.likes.some((like) => like._id === currentUser._id);
  const likeMethod = isLiked ? unlikeCard : likeCard;

  likeMethod(cardData._id)
    .then((updatedCard) => {
      cardData.likes = updatedCard.likes;
      if (likeCounter) {
        likeCounter.textContent = updatedCard.likes.length;
      }
      if (likeButton) {
        likeButton.classList.toggle(
          "card__like-button_is-active",
          updatedCard.likes.some((like) => like._id === currentUser._id)
        );
      }
    })
    .catch((err) => {
      console.error("Ошибка при изменении лайка:", err);
    });
}

function handleDeleteClick(cardData, cardElement) {
  deleteCardAPI(cardData._id)
    .then(() => {
      cardElement.remove();
      console.log("Карточка удалена");
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
      alert("Ошибка при удалении карточки");
    });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  if (!inputs || !inputs.profile) {
    console.error("Инпуты профиля не найдены");
    return;
  }

  const submitButton = evt.target.querySelector(".popup__button");
  renderLoading(submitButton, true);

  updateUserInfo(inputs.profile.name.value, inputs.profile.description.value)
    .then((userData) => {
      currentUser.name = userData.name;
      currentUser.about = userData.about;
      updateProfileDisplay(userData);
      if (elements.popups.edit) {
        closeModal(elements.popups.edit);
      }
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  if (!inputs || !inputs.card) {
    console.error("Инпуты карточки не найдены");
    return;
  }

  const submitButton = evt.target.querySelector(".popup__button");
  renderLoading(submitButton, true, "Создание...");

  addCard(inputs.card.name.value, inputs.card.link.value)
    .then((newCardData) => {
      const newCardElement = createCardElement(newCardData);
      if (elements.placesList) {
        elements.placesList.prepend(newCardElement);
      }

      if (elements.forms.card) {
        elements.forms.card.reset();
        clearValidation(elements.forms.card, VALIDATION_CONFIG.newCard);
      }
      if (elements.popups.newCard) {
        closeModal(elements.popups.newCard);
      }
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  if (!inputs || !inputs.avatar) {
    console.error("Инпут аватара не найден");
    return;
  }

  const submitButton = evt.target.querySelector(".popup__button");
  renderLoading(submitButton, true);

  updateUserAvatar(inputs.avatar.value)
    .then((userData) => {
      currentUser.avatar = userData.avatar;
      if (elements.profile.avatar) {
        elements.profile.avatar.style.backgroundImage = `url(${userData.avatar})`;
      }
      if (elements.popups.avatar) {
        closeModal(elements.popups.avatar);
      }
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function handleEditProfileClick() {
  fillProfileForm();
  if (elements.forms.profile) {
    clearValidation(elements.forms.profile, VALIDATION_CONFIG.editProfile);
  }
  if (elements.popups.edit) {
    openModal(elements.popups.edit);
  }
}

function handleAddCardClick() {
  if (elements.forms.card) {
    elements.forms.card.reset();
    clearValidation(elements.forms.card, VALIDATION_CONFIG.newCard);
  }
  if (elements.popups.newCard) {
    openModal(elements.popups.newCard);
  }
}

function handleAvatarClick() {
  if (elements.forms.avatar) {
    elements.forms.avatar.reset();
    clearValidation(elements.forms.avatar, VALIDATION_CONFIG.avatar);
  }
  if (elements.popups.avatar) {
    openModal(elements.popups.avatar);
  }
}

function handleCloseClick(evt) {
  const popup = evt.target.closest(".popup");
  if (popup) {
    closeModal(popup);
  }
}

function setEventListeners() {
  if (elements.forms.profile) {
    elements.forms.profile.addEventListener("submit", handleProfileFormSubmit);
  }
  if (elements.forms.card) {
    elements.forms.card.addEventListener("submit", handleCardFormSubmit);
  }
  if (elements.forms.avatar) {
    elements.forms.avatar.addEventListener("submit", handleAvatarFormSubmit);
  }

  const editButton = document.querySelector(SELECTORS.editButton);
  if (editButton) {
    editButton.addEventListener("click", handleEditProfileClick);
  }

  const addButton = document.querySelector(SELECTORS.addButton);
  if (addButton) {
    addButton.addEventListener("click", handleAddCardClick);
  }

  const avatarButton = document.querySelector(SELECTORS.avatarButton);
  if (avatarButton) {
    avatarButton.addEventListener("click", handleAvatarClick);
  }

  document
    .querySelectorAll(SELECTORS.closeButtons)
    .forEach((button) => button.addEventListener("click", handleCloseClick));
}

function initValidation() {
  Object.values(VALIDATION_CONFIG).forEach((config) => {
    enableValidation(config);
  });
}

function loadInitialData() {
  return Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cardsData]) => {
      currentUser = userData;
      updateProfileDisplay(userData);

      cardsData.forEach((cardData) => {
        const cardElement = createCardElement(cardData);
        if (elements.placesList) {
          elements.placesList.append(cardElement);
        }
      });
    })
    .catch((err) => {
      console.error("Ошибка при загрузке данных:", err);
    });
}

function init() {
  try {
    initValidation();
    setEventListeners();
    loadInitialData();
  } catch (error) {
    console.error("Ошибка при инициализации:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}