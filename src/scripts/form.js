import { openModal, closeModal } from "./modal";

const form = document.forms["edit-profile"];
const nameInput = form.elements.name;
const description = form.elements.description;

const cardForm = document.forms["new-place"];
const cardNameInput = cardForm.elements["place-name"];
const cardLinkInput = cardForm.elements.link;

export function handleFormSubmit() {
  nameInput.value = document.querySelector(".profile__title").textContent;
  description.value = document.querySelector(
    ".profile__description"
  ).textContent;
}

function createCard(card) {
  const cardElement = document
    .querySelector("#card-template")
    .content.cloneNode(true);

  cardElement.querySelector(".card__image").src = card.link;
  cardElement.querySelector(".card__title").textContent = card.name;

  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", (evt) => {
      evt.target.closest(".card").remove();
    });

  return cardElement;
}

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  document.querySelector(".profile__title").textContent = nameInput.value;
  document.querySelector(".profile__description").textContent =
    description.value;

  closeModal(document.querySelector(".popup_type_edit"));
});

cardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  document.querySelector(".places__list").prepend(createCard(newCard));
  cardForm.reset();
  closeModal(document.querySelector(".popup_type_new-card"));
});
