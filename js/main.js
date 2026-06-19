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

/*Форма подписки*/

const subscribeForm = document.querySelector(".footer__subscribe-form");
if (subscribeForm) {
  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = subscribeForm.querySelector(".footer__subscribe-input");
    const email = emailInput.value.trim();
    if (!email) {
      alert("Введите корректный email");
      emailInput.style.borderColor = "red";
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    fetch("php/email-subscriber.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          const subscribeInner = subscribeForm.closest(
            ".footer__subscribe-inner",
          );
          subscribeInner.innerHTML =
            '<p class="subscribe-success">Подписка оформлена!🐱‍🏍</p>';
        } else {
          alert("Ошибка: " + data.message);
        }
      })
      .catch((error) => {
        alert("Ошибка отправки. Проверьте соединение");
        console.error("Ошибка;", error);
      });
  });
}

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

const modalPhoneInput = document.querySelector(".modal__phone-input");
const ctaFormInput = document.querySelector(".cta__input");

addPhoneMask(modalPhoneInput);
addPhoneMask(ctaFormInput);
