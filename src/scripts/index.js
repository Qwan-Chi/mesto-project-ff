import "../styles/index.css";
import { openModal, closeModal } from "./modal";
import { handleLikeClick, createCard, initialCards, deleteCard } from "./cards";

const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const description = profileForm.elements.description;
const cardForm = document.forms["new-place"];
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

function handleProfileFormSubmit() {
  nameInput.value = profileTitle.textContent;
  description.value = profileDescription.textContent;
}

function handleImageZoom(evt) {
  const imagePopup = document.querySelector(".popup_type_image");
  const card = evt.target.closest(".card");
  imagePopup.querySelector(".popup__image").src =
    card.querySelector(".card__image").src;
  imagePopup.querySelector(".popup__caption").textContent =
    card.querySelector(".card__title").textContent;
  openModal(imagePopup);
}

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = description.value;

  closeModal(document.querySelector(".popup_type_edit"));
});

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  document
    .querySelector(".places__list")
    .prepend(createCard(newCard, deleteCard, handleLikeClick, handleImageZoom));
  cardForm.reset();
  closeModal(document.querySelector(".popup_type_new-card"));
});

document.querySelectorAll(".popup__close").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closeModal(popup);
  });
});

document
  .querySelector(".profile__edit-button")
  .addEventListener("click", () => {
    handleProfileFormSubmit();
    openModal(document.querySelector(".popup_type_edit"));
  });

document.querySelector(".profile__add-button").addEventListener("click", () => {
  openModal(document.querySelector(".popup_type_new-card"));
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  document.querySelector(".profile__title").textContent = nameInput.value;
  document.querySelector(".profile__description").textContent =
    description.value;

  closeModal(document.querySelector(".popup_type_edit"));
});

initialCards.forEach((element) => {
  document
    .querySelector(".places__list")
    .append(createCard(element, deleteCard, handleLikeClick, handleImageZoom));
});
