import "../styles/index.css";
import { openModal, closeModal } from "./modal";
import { handleLikeClick, createCard, deleteCard } from "./card";
import { initialCards } from "./cards";
import { enableValidation, clearValidation } from "./validation";

const SELECTORS = {
  profileForm: 'form[name="edit-profile"]',
  cardForm: 'form[name="new-place"]',
  editPopup: ".popup_type_edit",
  newCardPopup: ".popup_type_new-card",
  imagePopup: ".popup_type_image",
  editButton: ".profile__edit-button",
  addButton: ".profile__add-button",
  closeButtons: ".popup__close",
  profileTitle: ".profile__title",
  profileDescription: ".profile__description",
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
};

const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const descriptionInput = profileForm.elements.description;

const cardForm = document.forms["new-place"];
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;

const profileTitle = document.querySelector(SELECTORS.profileTitle);
const profileDescription = document.querySelector(SELECTORS.profileDescription);
const placesList = document.querySelector(SELECTORS.placesList);

const editPopup = document.querySelector(SELECTORS.editPopup);
const newCardPopup = document.querySelector(SELECTORS.newCardPopup);
const imagePopup = document.querySelector(SELECTORS.imagePopup);

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
}

function handleImageZoom(evt) {
  const image = evt.target;
  const popupImage = imagePopup.querySelector(".popup__image");
  const popupCaption = imagePopup.querySelector(".popup__caption");

  popupImage.src = image.src;
  popupImage.alt = image.alt;
  popupCaption.textContent = image.alt;

  openModal(imagePopup);
}

function addNewCard(cardData) {
  const newCardElement = createCard(
    cardData,
    deleteCard,
    handleLikeClick,
    handleImageZoom
  );

  placesList.prepend(newCardElement);
}

function updateProfile(name, description) {
  profileTitle.textContent = name;
  profileDescription.textContent = description;
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  updateProfile(nameInput.value, descriptionInput.value);
  closeModal(editPopup);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  addNewCard(newCard);

  cardForm.reset();
  clearValidation(cardForm, VALIDATION_CONFIG.newCard);

  closeModal(newCardPopup);
}

function handleEditProfileClick() {
  fillProfileForm();
  clearValidation(profileForm, VALIDATION_CONFIG.editProfile);
  openModal(editPopup);
}

function handleAddCardClick() {
  cardForm.reset();
  clearValidation(cardForm, VALIDATION_CONFIG.newCard);
  openModal(newCardPopup);
}

function handleCloseClick(evt) {
  const popup = evt.target.closest(".popup");
  closeModal(popup);
}

function setEventListeners() {
  profileForm.addEventListener("submit", handleProfileFormSubmit);
  cardForm.addEventListener("submit", handleCardFormSubmit);

  document
    .querySelector(SELECTORS.editButton)
    .addEventListener("click", handleEditProfileClick);

  document
    .querySelector(SELECTORS.addButton)
    .addEventListener("click", handleAddCardClick);

  document.querySelectorAll(SELECTORS.closeButtons).forEach((button) => {
    button.addEventListener("click", handleCloseClick);
  });
}

function initValidation() {
  enableValidation(VALIDATION_CONFIG.editProfile);
  enableValidation(VALIDATION_CONFIG.newCard);
}

function initCards() {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      deleteCard,
      handleLikeClick,
      handleImageZoom
    );
    placesList.append(cardElement);
  });
}

function init() {
  initValidation();
  setEventListeners();
  initCards();
}

init();
