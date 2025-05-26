import "../styles/index.css";
import { initialCards } from "./cards";
import { openModal, closeModal } from "./modal";

function deleteCard(evt) {
  evt.target.closest(".card").remove();
}

function createCard(card, deleteCallback) {
  const cardElement = document
    .querySelector("#card-template")
    .content.cloneNode(true);
  cardElement.querySelector(".card__image").src = card.link;
  cardElement.querySelector(".card__title").textContent = card.name;
  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", deleteCallback);
  return cardElement;
}

const list = document.querySelector(".places__list");
initialCards.forEach((element) => {
  list.append(createCard(element, deleteCard));
});

document.querySelectorAll(".popup__close").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closeModal(popup);
  });
});

const editButton = document.querySelector(".profile__edit-button");
editButton.addEventListener("click", () => {
  openModal(document.querySelector(".popup_type_edit"));
});

const addButton = document.querySelector(".profile__add-button");
addButton.addEventListener("click", () => {
  openModal(document.querySelector(".popup_type_new-card"));
});
