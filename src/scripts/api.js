const API_CONFIG = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-39",
  headers: {
    authorization: "3ed9a828-192d-47e9-9835-3fa825825e93",
    "Content-Type": "application/json",
  },
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfo = () => {
  return fetch(`${API_CONFIG.baseUrl}/users/me`, {
    headers: {
      authorization: API_CONFIG.headers.authorization,
    },
  }).then(checkResponse);
};

export const getInitialCards = () => {
  return fetch(`${API_CONFIG.baseUrl}/cards`, {
    headers: {
      authorization: API_CONFIG.headers.authorization,
    },
  }).then(checkResponse);
};

export const updateUserInfo = (name, about) => {
  return fetch(`${API_CONFIG.baseUrl}/users/me`, {
    method: "PATCH",
    headers: API_CONFIG.headers,
    body: JSON.stringify({
      name: name,
      about: about,
    }),
  }).then(checkResponse);
};

export const addCard = (name, link) => {
  return fetch(`${API_CONFIG.baseUrl}/cards`, {
    method: "POST",
    headers: API_CONFIG.headers,
    body: JSON.stringify({
      name: name,
      link: link,
    }),
  }).then(checkResponse);
};

export const deleteCard = (cardId) => {
  return fetch(`${API_CONFIG.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: {
      authorization: API_CONFIG.headers.authorization,
    },
  }).then(checkResponse);
};

export const likeCard = (cardId) => {
  return fetch(`${API_CONFIG.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: {
      authorization: API_CONFIG.headers.authorization,
    },
  }).then(checkResponse);
};

export const unlikeCard = (cardId) => {
  return fetch(`${API_CONFIG.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: {
      authorization: API_CONFIG.headers.authorization,
    },
  }).then(checkResponse);
};

export const updateUserAvatar = (avatar) => {
  return fetch(`${API_CONFIG.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: API_CONFIG.headers,
    body: JSON.stringify({
      avatar: avatar,
    }),
  }).then(checkResponse);
};