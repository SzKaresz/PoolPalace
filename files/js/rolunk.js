document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uzenetKuldes-urlap');
    const nevInput = document.getElementById('nev');
    const emailInput = document.getElementById('email');
    const adatkezCheckbox = document.getElementById('adatkez');
    const submitButton = document.getElementById('kuldesGomb');

    const toastContainer = document.querySelector('.toast-container');

    function validateForm() {
        let isValid = true;
        clearErrors();

        if (!nevInput.value.trim()) {
            showError(nevInput, 'A név megadása kötelező.');
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Az e-mail cím megadása kötelező.');
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            showError(emailInput, 'Érvénytelen e-mail formátum.');
            isValid = false;
        }

        if (!adatkezCheckbox.checked) {
            showError(adatkezCheckbox, 'Kérjük, fogadja el az Adatkezelési tájékoztatóban leírtakat!', true);
            isValid = false;
        }

        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
             showError(document.querySelector('.g-recaptcha'), 'Kérjük, igazolja, hogy nem robot!', false, '.recaptcha-error');
        }


        return isValid;
    }

    function showError(inputElement, message, isCheckbox = false, errorSelectorSuffix = '.error') {
        let errorElement;
        if (isCheckbox) {
             errorElement = form.querySelector('.adatkez-error');
        } else if (inputElement.classList.contains('g-recaptcha')) {
             errorElement = form.querySelector(errorSelectorSuffix);
        }
         else {
            errorElement = inputElement.closest('.inputMezo')?.querySelector(errorSelectorSuffix);
             if (!errorElement) errorElement = form.querySelector(`${errorSelectorSuffix}`);
        }

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
         if(inputElement && !isCheckbox) {
             inputElement.classList.add('is-invalid');
         }
    }

    function clearErrors() {
        form.querySelectorAll('.error').forEach(span => {
             span.textContent = '';
             span.style.display = 'none';
        });
        form.querySelectorAll('.is-invalid').forEach(input => {
            input.classList.remove('is-invalid');
        });
         const adatkezError = form.querySelector('.adatkez-error');
         if (adatkezError) adatkezError.style.display = 'none';
         const recaptchaError = form.querySelector('.recaptcha-error');
         if (recaptchaError) recaptchaError.style.display = 'none';
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) {
            console.error('Toast container not found!');
            alert(message);
            return;
        }

        const toastId = 'toast-' + Date.now();
        const toastBgClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';

        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center ${toastBgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);

        const toastElement = document.getElementById(toastId);
        const toastInstance = new bootstrap.Toast(toastElement);

        toastElement.addEventListener('hidden.bs.toast', function () {
            toastElement.remove();
        });

        toastInstance.show();
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!validateForm()) {
                showToast('Kérjük, javítsa a hibákat az űrlapon!', 'danger');
                return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Küldés...';

            const formData = new FormData(form);
            formData.append('adatkez', adatkezCheckbox.checked ? 'on' : 'off');

            fetch('rolunk_form.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                 if (!response.ok) {
                     throw new Error(`HTTP error! status: ${response.status}`);
                 }
                 return response.json();
             })
            .then(data => {
                showToast(data.message, data.success ? 'success' : 'danger');

                if (data.success) {
                    form.reset();
                    grecaptcha.reset();
                    clearErrors();
                } else {
                     grecaptcha.reset();
                }
            })
            .catch(error => {
                console.error('Hiba a form elküldésekor:', error);
                showToast('Hálózati vagy szerverhiba történt. Kérjük, próbálja meg később.', 'danger');
                grecaptcha.reset();
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Küldés';
            });
        });
    } else {
         console.error("Az űrlap (uzenetKuldes-urlap) nem található!");
     }

     [nevInput, emailInput].forEach(input => {
         input?.addEventListener('input', () => {
             if (input.classList.contains('is-invalid')) {
                 clearErrorForInput(input);
             }
         });
     });
     adatkezCheckbox?.addEventListener('change', () => {
          if (form.querySelector('.adatkez-error')?.style.display === 'block') {
              clearErrorForInput(adatkezCheckbox, true);
          }
     });

     function clearErrorForInput(inputElement, isCheckbox = false) {
         inputElement.classList.remove('is-invalid');
         let errorElement;
         if (isCheckbox) {
             errorElement = form.querySelector('.adatkez-error');
         } else {
             errorElement = inputElement.closest('.inputMezo')?.querySelector('.error');
         }
         if (errorElement) {
             errorElement.textContent = '';
             errorElement.style.display = 'none';
         }
     }
});