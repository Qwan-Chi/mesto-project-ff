import "./styles/index.css";
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
