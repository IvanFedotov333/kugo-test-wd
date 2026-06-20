/* Модальное окно*/

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

/* Маска для email*/

const emailInput = document.querySelector(".footer__subscribe-input");
if (emailInput) {
  emailInput.addEventListener("input", function (e) {
    this.value = this.value.replace(/\s/g, "").toLowerCase();
  });
}

/* Маска для телефона*/

function addPhoneMask(inputElement) {
  if (!inputElement) return;
  inputElement.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    let formatted = "+7";
    if (value.length > 1) formatted += " (" + value.substring(1, 4);
    if (value.length >= 4) formatted += ") " + value.substring(4, 7);
    if (value.length >= 7) formatted += "-" + value.substring(7, 9);
    if (value.length >= 9) formatted += "-" + value.substring(9, 11);

    this.value = formatted;
  });
}

addPhoneMask(phoneInput);
addPhoneMask(document.querySelector(".cta__input"));

/*Форма подписки*/

const subscribeForm = document.querySelector(
  ".footer__subscribe-form",
); /* ищем форму подписки на странице */
if (subscribeForm) {
  subscribeForm.addEventListener("submit", (e) => {
    /* проверяем, если она есть - задаём ей слушатель событий с отменой дефолтного поведения */
    e.preventDefault();

    const emailInput = subscribeForm.querySelector(
      ".footer__subscribe-input",
    ); /* ищем поле для ввода текста в форме */
    const email = emailInput.value.trim(); /* убираем пробелы по краям */
    if (!email) {
      /* проверяем соответствие правилам ввода текста */
      alert("Введите корректный email");
      emailInput.style.borderColor = "red";
      return;
    } /* добавляем красную обводку форме при несоответствии */
    const formData = new FormData(); /* создаём контейнер для отправки данных */
    formData.append(
      "email",
      email,
    ); /* кладём в него email и обозначаем его как "email" */
    fetch("php/email-subscriber.php", {
      method: "POST",
      body: formData,
    }) /* отправляем данные в РНР-обработчик методом POST */
      .then((response) => response.json()) /* ждём ответ от сервера */
      .then((data) => {
        if (data.status === "success") {
          const subscribeInner = subscribeForm.closest(
            ".footer__subscribe-inner",
          );
          subscribeInner.innerHTML =
            '<p class="subscribe-success">Подписка оформлена!🐱‍🏍</p>'; /* если ответ получен добавляем HTML содержимое в DOM */
        } else {
          alert("Ошибка: " + data.message); /* если нет - обозначаем ошибку */
        }
      })
      .catch((error) => {
        alert("Ошибка отправки. Проверьте соединение");
        console.error(
          "Ошибка;",
          error,
        ); /* если проблема с сервером или обработчиком - сообщаем об ошибке */
      });
  });
}

/*Форма отправки в Telegram*/

function sendFormToTelegram(formElement, phoneField, containerToReplace) {
  if (!formElement || !phoneField || !containerToReplace) {
    return;
  }
  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = phoneField.value.trim();
    if (!phone || phone === "+7") {
      alert("Пожалуйста, введите номер телейона");
      phoneField.style.borderColor = "red";
      return;
    }
    const formData = new FormData();
    formData.append("phone", phone);
    fetch("php/tg-sending.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          containerToReplace.innerHTML = `
          <div class="modal__success">
            <h2 class="section-title modal__success-title">Спасибо за заявку!</h2>
            <p class="modal__success-text">Наш менеджер свяжется с вами через 5 минут</p>
            <button class="modal__success-btn" type="button">Вернуться на главную</button>
          </div>`;
          const successBtn = containerToReplace.querySelector(
            ".modal__success-btn",
          );
          if (successBtn && typeof closeModal === "function") {
            successBtn.addEventListener("click", closeModal);
          }
        } else {
          alert("Ошибка: " + (data.message || "Попробуйте позже"));
        }
      })
      .catch((error) => {
        alert("Ошибка отправки. Проверьте соединение.");
        console.error("Ошибка fetch:", error);
      });
  });
}

if (modalForm && phoneInput) {
  const modalBody = modal.querySelector(".modal__body");
  sendFormToTelegram(modalForm, phoneInput, modalBody);
}

const ctaForm = document.querySelector(".cta__form");
const ctaPhoneInput = document.querySelector(".cta__input");
if (ctaForm && ctaPhoneInput) {
  const ctaContent = document.querySelector(".cta__content");
  sendFormToTelegram(ctaForm, ctaPhoneInput, ctaContent);
}
