export function handleLikeClick(evt) {
  const likeButton = evt.target;
  likeButton.classList.toggle("card__like-button_is-active");
}

export function deleteCard(evt) {
  evt.target.closest(".card").remove();
}

export function createCard(card, deleteCallback, likeHandler, zoomHandler) {
  const cardElement = document
    .querySelector("#card-template")
    .content.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  deleteButton.addEventListener("click", deleteCallback);
  likeButton.addEventListener("click", likeHandler);
  cardImage.addEventListener("click", zoomHandler);

  return cardElement;
}
