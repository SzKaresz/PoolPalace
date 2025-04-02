document.addEventListener("DOMContentLoaded", function () {
    const placeOrderBtn = document.getElementById("place-order-btn");
    const orderErrors = document.getElementById("order-errors");
    const guestModal = new bootstrap.Modal(document.getElementById("guestModal"));
    const saveAccountBtn = document.getElementById("save-account-btn");
    const modalPassword = document.getElementById("modal-password");
    const modalPasswordConfirm = document.getElementById("modal-password-confirm");
    const passwordAlert = document.getElementById("password-alert");

    const isGuest = JSON.parse(document.getElementById("is-guest-data").textContent.trim());

    let orderData = {};

    const validationRules = [
        { id: "name", label: "Név", regex: /^(?=.*[A-Z].*[A-Z])(?=.*\s).{6,}$/, error: "A névnek tartalmaznia kell legalább egy szóközt, két nagybetűt és 6 karaktert!" },
        { id: "email", label: "Email", regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error: "Kérjük, érvényes e-mail címet adjon meg!" },
        { id: "phone", label: "Telefonszám", regex: /^(\+36|06)[0-9]{9}$/, error: "Kérjük, adjon meg érvényes magyar telefonszámot (pl. +36301234567 vagy 06301234567)!" },

        { id: "shipping-postal_code", label: "Irányítószám", regex: /^[0-9]{4}$/, error: "Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!" },
        { id: "shipping-city", label: "Település", regex: /^.{2,}$/, error: "A település neve legalább 2 karakter legyen!" },
        { id: "shipping-address", label: "Utca, házszám", regex: /^(?=.*\d)(?=.*\s).{8,}$/, error: "Az utca és házszám megadása kötelező, legalább két szóköz és minimum 8 karakter szükséges!" },

        { id: "billing-postal_code", label: "Irányítószám", regex: /^[0-9]{4}$/, error: "Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!" },
        { id: "billing-city", label: "Település", regex: /^.{2,}$/, error: "A település neve legalább 2 karakter legyen!" },
        { id: "billing-address", label: "Utca, házszám", regex: /^(?=.*\d)(?=.*\s).{8,}$/, error: "Az utca és házszám megadása kötelező, legalább két szóköz és minimum 8 karakter szükséges!" }
    ];

    validationRules.forEach(rule => {
        const field = document.getElementById(rule.id);
        if (!field) return;

        field.addEventListener("input", function () {
            validateField(field, rule.regex);
        });
    });

    function validateField(field, regex) {
        const value = field.value.trim();
        if (!regex.test(value)) {
            field.classList.add("is-invalid");
            field.classList.remove("is-valid");
        } else {
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");
        }
    }

    modalPassword.addEventListener("input", validatePassword);
    modalPasswordConfirm.addEventListener("input", validatePassword);

    function validatePassword() {
        const pwd = modalPassword.value.trim();
        const pwdConfirm = modalPasswordConfirm.value.trim();
        let errorMessage = "";

        if (pwd.length < 8) {
            errorMessage = "A jelszónak legalább 8 karakter hosszúnak kell lennie!";
        } else if (!/[A-Z]/.test(pwd)) {
            errorMessage = "A jelszónak tartalmaznia kell legalább egy nagybetűt!";
        } else if (!/\d/.test(pwd)) {
            errorMessage = "A jelszónak tartalmaznia kell legalább egy számot!";
        } else if (pwdConfirm === "") {
            errorMessage = "Kérjük, erősítse meg a jelszót a 'Jelszó újra' mezőben!";
        } else if (pwd !== pwdConfirm) {
            errorMessage = "A jelszavak nem egyeznek!";
        }

        if (errorMessage) {
            modalPassword.classList.add("is-invalid");
            modalPasswordConfirm.classList.add("is-invalid");
            passwordAlert.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
            return false;
        } else {
            modalPassword.classList.remove("is-invalid");
            modalPasswordConfirm.classList.remove("is-invalid");
            modalPassword.classList.add("is-valid");
            modalPasswordConfirm.classList.add("is-valid");
            passwordAlert.innerHTML = "";
            return true;
        }
    }

    placeOrderBtn.addEventListener("click", function () {
        let firstError = null;
        let hasError = false;

        validationRules.forEach(rule => {
            const field = document.getElementById(rule.id);
            if (!field) return;
            const value = field.value.trim();

            if (!rule.regex.test(value)) {
                if (!firstError) {
                    firstError = rule.error;
                }
                field.classList.add("is-invalid");
                hasError = true;
            } else {
                field.classList.remove("is-invalid");
            }
        });

        if (hasError) {
            showErrorMessages([firstError]);
            return;
        }

        orderData = {
            action: 'placeOrder',
            total: parseFloat(document.getElementById("total-price-data").textContent),
            cart_items: JSON.parse(document.getElementById("cart-items-data").textContent.trim()),
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),

            shipping_postal_code: document.getElementById("shipping-postal_code").value.trim(),
            shipping_city: document.getElementById("shipping-city").value.trim(),
            shipping_address: document.getElementById("shipping-address").value.trim(),

            billing_postal_code: document.getElementById("billing-postal_code").value.trim(),
            billing_city: document.getElementById("billing-city").value.trim(),
            billing_address: document.getElementById("billing-address").value.trim(),

            payment_method: document.querySelector('input[name="payment-method"]:checked').value.trim()
        };

        if (isGuest) {
            guestModal.show();
        } else {
            sendOrder(orderData);
        }
    });

    saveAccountBtn.addEventListener("click", function () {
        if (!validatePassword()) {
            return;
        }

        orderData.register = true;
        orderData.password = modalPassword.value.trim();
        passwordAlert.innerHTML = '';
        guestModal.hide();
        sendOrder(orderData);
    });

    document.querySelector("#guestModal .btn-secondary").addEventListener("click", function () {
        orderData.register = false;
        guestModal.hide();
        sendOrder(orderData);
    });

    let isSubmitting = false;

    function sendOrder(orderData) {
        if (isSubmitting) return;
        isSubmitting = true;
        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.style.display = "flex";

        fetch('../php/megrendeles.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
            .then(response => response.json())
            .then(data => {
                loadingOverlay.style.display = "none";

                if (data.success) {
                    document.getElementById("order-id").textContent = data.order_id;
                    new bootstrap.Modal(document.getElementById("orderSuccessModal")).show();
                } else {
                    showToast(data.error);
                    showErrorMessages([data.error]);
                }
            })
            .catch(error => {
                console.error("Hiba történt:", error);
                loadingOverlay.style.display = "none";
                showErrorMessages(["Hiba történt a rendelés leadása során."]);
            })
            .finally(() => {
                isSubmitting = false;
            });
    }

    function showErrorMessages(messages) {
        if (orderErrors) {
            orderErrors.innerHTML = `<div class="alert alert-danger">${messages[0]}</div>`;
            orderErrors.scrollIntoView({ behavior: "smooth" });
        }
    }

    document.body.style.overflow = "hidden";
});

function showToast(message, type = "danger") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const maxToastCount = 3;
    const currentToasts = toastContainer.querySelectorAll(".toast");
    if (currentToasts.length >= maxToastCount) {
        currentToasts[currentToasts.length - 1].remove();
    }

    let toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0 shadow`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    let toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();

    setTimeout(() => {
        toast.remove();
        if (type === "success") {
            window.location.reload();
        }
    }, 10000);
}

document.addEventListener("DOMContentLoaded", function () {
    const userDataElement = document.getElementById("user-data");
    if (userDataElement) {
        const userData = JSON.parse(userDataElement.textContent);

        document.getElementById("name").value = userData.nev || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("phone").value = userData.telefonszam || "";
        document.getElementById("shipping-postal_code").value = userData.szallitasi_iranyitoszam || "";
        document.getElementById("shipping-city").value = userData.szallitasi_telepules || "";
        document.getElementById("shipping-address").value = userData.szallitasi_utca_hazszam || "";
        document.getElementById("billing-postal_code").value = userData.szamlazasi_iranyitoszam || "";
        document.getElementById("billing-city").value = userData.szamlazasi_telepules || "";
        document.getElementById("billing-address").value = userData.szamlazasi_utca_hazszam || "";
        document.getElementById("email").setAttribute("readonly", "true");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const sameAsShippingCheckbox = document.getElementById("same-as-shipping");

    const billingCollapse = document.getElementById("billingCollapse");
    const billingToggle = document.querySelector('[data-bs-target="#billingCollapse"]');

    sameAsShippingCheckbox.addEventListener("change", function () {
        const billingFields = ["postal_code", "city", "address"];

        billingFields.forEach(field => {
            const billing = document.getElementById(`billing-${field}`);
            const shipping = document.getElementById(`shipping-${field}`);

            if (this.checked) {
                billing.value = shipping.value;
                billing.setAttribute("readonly", true);
                billing.classList.remove("is-invalid");
                billing.classList.add("is-valid");

                const collapseInstance = bootstrap.Collapse.getOrCreateInstance(billingCollapse);
                collapseInstance.hide();

                billingToggle.classList.add("disabled");
                billingToggle.setAttribute("aria-disabled", "true");


                if (!shipping.dataset.listenerAttached) {
                    shipping.addEventListener("input", () => {
                        if (sameAsShippingCheckbox.checked) {
                            billing.value = shipping.value;
                        }
                    });
                    shipping.dataset.listenerAttached = true;
                }
            } else {
                billing.removeAttribute("readonly");


                billingToggle.classList.remove("disabled");
                billingToggle.removeAttribute("aria-disabled");
            }
        });
    });
});