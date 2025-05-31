import "../styles/index.css";
import { openModal, closeModal } from "./modal";
import { handleLikeClick, createCard, deleteCard } from "./card";
import { initialCards } from "./cards";

const profileForm = document.forms["edit-profile"];
const nameInput = profileForm.elements.name;
const description = profileForm.elements.description;
const cardForm = document.forms["new-place"];
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const imagePopup = document.querySelector(".popup_type_image");
const popupEdit = document.querySelector(".popup_type_edit");
const placesList = document.querySelector(".places__list");
const popupNewCard = document.querySelector(".popup_type_new-card");

function fillProfileForm() {
  nameInput.value = profileTitle.textContent;
  description.value = profileDescription.textContent;
}

function handleImageZoom(evt) {
  const image = evt.target;
  imagePopup.querySelector(".popup__image").src = image.src;
  imagePopup.querySelector(".popup__caption").textContent = image.alt;
  openModal(imagePopup);
}

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = description.value;

  closeModal(popupEdit);
});

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  placesList.prepend(
    createCard(newCard, deleteCard, handleLikeClick, handleImageZoom)
  );
  cardForm.reset();
  closeModal(popupNewCard);
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
    fillProfileForm();
    openModal(popupEdit);
  });

document.querySelector(".profile__add-button").addEventListener("click", () => {
  openModal(popupNewCard);
});

profileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = description.value;

  closeModal(popupEdit);
});

initialCards.forEach((element) => {
  document
    .querySelector(".places__list")
    .append(createCard(element, deleteCard, handleLikeClick, handleImageZoom));
});
