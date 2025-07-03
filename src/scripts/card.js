export function createCard(cardData, userId, deleteCallback, likeHandler, zoomHandler) {
  const cardElement = document
    .querySelector("#card-template")
    .content.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");
  const card = cardElement.querySelector(".card");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (likeCounter) {
    likeCounter.textContent = cardData.likes ? cardData.likes.length : 0;
  }

  if (cardData.likes && userId) {
    const isLiked = cardData.likes.some((like) => like._id === userId);
    if (isLiked) {
      likeButton.classList.add("card__like-button_is-active");
    }
  }

  if (deleteButton) {
    if (cardData.owner && cardData.owner._id === userId) {
      deleteButton.style.display = "block";
      deleteButton.addEventListener("click", () => deleteCallback(cardData, card));
    } else {
      deleteButton.style.display = "none";
    }
  }

  if (likeButton) {
    likeButton.addEventListener("click", () => likeHandler(cardData, likeButton, likeCounter));
  }

  if (cardImage) {
    cardImage.addEventListener("click", zoomHandler);
  }

  return cardElement;
}