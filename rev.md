export function createCard(cardData, userId, deleteCallback, likeHandler, zoomHandler) {
При работе с функциями, принимающими большое количество параметров (более 3), рекомендуется использовать объект. Этот подход значительно улучшает читаемость кода при вызове функции, поскольку все параметры имеют явные имена, что делает код более понятным и самодокументируемым.

const VALIDATION_PATTERNS = {
Согласно заданию регулярное выражение следует хранить в атрибуте pattern

const ERROR_MESSAGES = {
Согласно заданию сообщение об ошибке следует хранить в дата атрибуте

function checkInputValidity(form, input, config) {
Валидация паттерном не работает для формы редактировать профиль https://disk.yandex.com/i/RkBK2TE79lxh4g
