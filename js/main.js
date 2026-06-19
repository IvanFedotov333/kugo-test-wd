const modal = document.querySelector("#modal-test-drive"); // ищем модалку
const modalOverlay = modal.querySelector(".modal__overlay"); // оверлей
const closeBtn = modal.querySelector(".modal__close"); //кнопка закрывания модалки
const modalForm = modal.querySelector(".modal__form"); //форму
const phoneInput = modal.querySelector(".modal__phone-input"); //поле для номера телефона

function openModal() {
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden"; //блокируем скролл страницы при открывании модалки
}

function closeModal() {
  modal.classList.remove("is-open");
  document.body.style.overflow = ""; //снимаем блок скролла
}

const allButtons = document.querySelectorAll("button, a"); //ищем все кнопки и ссылки где есть слово "записаться"
allButtons.forEach((btn) => {
  if (
    btn.textContent.trim().toLowerCase().includes("записаться")
  ) //если в кнопке есть слово 'записаться'
  {
    btn.addEventListener("click", (e) => {
      //на каждую кнопку навешиваем слушатель событий "клик"
      e.preventDefault(); //отключаем дефолтное поведение
      openModal();
    });
  }
});

closeBtn.addEventListener("click", closeModal); //закрывает на крестик

modalOverlay.addEventListener("click", closeModal); //закрывает на клик по оверлею

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});
