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

    // Validációs szabályok
    const validationRules = [
        { id: "name", label: "Név", regex: /^(?=.*[A-Z].*[A-Z])(?=.*\s).{6,}$/, error: "A névnek tartalmaznia kell legalább egy szóközt, két nagybetűt és 6 karaktert!" },
        { id: "email", label: "Email", regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error: "Kérjük, érvényes e-mail címet adjon meg!" },
        { id: "phone", label: "Telefonszám", regex: /^(\+36|06)[0-9]{9}$/, error: "Kérjük, adjon meg érvényes magyar telefonszámot (pl. +36301234567 vagy 06301234567)!" },
    
        // Szállítási cím validáció
        { id: "shipping-postal_code", label: "Irányítószám", regex: /^[0-9]{4}$/, error: "Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!" },
        { id: "shipping-city", label: "Település", regex: /^.{2,}$/, error: "A település neve legalább 2 karakter legyen!" },
        { id: "shipping-address", label: "Utca, házszám", regex: /^(?=.*\d)(?=.*\s).{8,}$/, error: "Az utca és házszám megadása kötelező, legalább két szóköz és minimum 8 karakter szükséges!" },
    
        // Számlázási cím validáció
        { id: "billing-postal_code", label: "Irányítószám", regex: /^[0-9]{4}$/, error: "Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!" },
        { id: "billing-city", label: "Település", regex: /^.{2,}$/, error: "A település neve legalább 2 karakter legyen!" },
        { id: "billing-address", label: "Utca, házszám", regex: /^(?=.*\d)(?=.*\s).{8,}$/, error: "Az utca és házszám megadása kötelező, legalább két szóköz és minimum 8 karakter szükséges!" }
    ];    

    // 🔹 Real-time validáció minden mezőnél
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

    // 🔹 Jelszó validáció (real-time gépelés közben)
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
            return false; // 🔴 Nem engedjük a beküldést
        } else {
            modalPassword.classList.remove("is-invalid");
            modalPasswordConfirm.classList.remove("is-invalid");
            modalPassword.classList.add("is-valid");
            modalPasswordConfirm.classList.add("is-valid");
            passwordAlert.innerHTML = "";
            return true; // ✅ Minden rendben
        }
    }    

    // 🔹 Gombra kattintva ellenőrizzük a mezőket
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
    
        // Ha van hiba, ne küldjük el
        if (hasError) {
            showErrorMessages([firstError]); // Csak az első hibát mutatja
            return;
        }
    
        // **Frissített orderData, hogy tartalmazza a számlázási címet is**
        orderData = {
            action: 'placeOrder',
            total: parseFloat(document.getElementById("total-price-data").textContent),
            cart_items: JSON.parse(document.getElementById("cart-items-data").textContent.trim()),
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
        
            // Szállítási adatok
            shipping_postal_code: document.getElementById("shipping-postal_code").value.trim(),
            shipping_city: document.getElementById("shipping-city").value.trim(),
            shipping_address: document.getElementById("shipping-address").value.trim(),
        
            // Számlázási adatok
            billing_postal_code: document.getElementById("billing-postal_code").value.trim(),
            billing_city: document.getElementById("billing-city").value.trim(),
            billing_address: document.getElementById("billing-address").value.trim()
        };        

        if (isGuest) {
            guestModal.show();
        } else {
            sendOrder(orderData);
        }
    });                

    saveAccountBtn.addEventListener("click", function () {
        if (!validatePassword()) {
            return; // 🔴 Ha a jelszó hibás vagy a mező üres, nem küldi el
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
        if (isSubmitting) return;  // Ha már folyamatban van egy kérés, ne küldje el újra!
        isSubmitting = true;
    
        console.log("Küldött rendelési adatok:", orderData);
    
        fetch('../php/megrendeles.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Szerver válasza:", data);
    
            if (data.success) {
                document.getElementById("order-id").textContent = data.order_id;
                new bootstrap.Modal(document.getElementById("orderSuccessModal")).show();
            } else {
                showErrorMessages([data.error]);  // 🔹 Hibaüzenetet a közös alertbe küldi
            }
        })
        .catch(error => {
            console.error("Hiba történt:", error);
            showErrorMessages(["Hiba történt a rendelés leadása során."]);
        })
        .finally(() => {
            isSubmitting = false; // Visszaállítjuk, hogy újra lehessen küldeni
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

document.getElementById("place-order-btn").addEventListener("click", function () {
    // Clear any previous alert
    let alertContainer = document.getElementById("form-alert");
    if (!alertContainer) {
        alertContainer = document.createElement("div");
        alertContainer.id = "form-alert";
        document.getElementById("megrendeles-form-container").insertBefore(alertContainer, document.getElementById("order-form"));
    }
    alertContainer.innerHTML = "";

    // Only shipping required fields are validated.
    const requiredFields = [
        { id: "name", label: "Név" },
        { id: "email", label: "Email" },
        { id: "phone", label: "Telefonszám" },
        { id: "shipping-postal_code", label: "Irányítószám" },
        { id: "shipping-city", label: "Település" },
        { id: "shipping-address", label: "Utca, házszám" },
        { id: "billing-postal_code", label: "Számlázási irányítószám" },
        { id: "billing-city", label: "Számlázási település" },
        { id: "billing-address", label: "Számlázási utca, házszám" }
    ];    
    let missing = [];
    requiredFields.forEach(field => {
        let value = document.getElementById(field.id).value.trim();
        if (!value) {
            missing.push(field.label);
        }
    });
    if (missing.length > 0) {
        alertContainer.innerHTML = `<div class="alert alert-danger" role="alert">
            Kérem, töltse ki a következő mezőket: ${missing.join(", ")}
        </div>`;
        return;
    }

    // If user is guest, show the registration modal
    const isGuest = JSON.parse(document.getElementById("is-guest-data").innerText.trim());
    if (isGuest) {
        const guestModal = new bootstrap.Modal(document.getElementById("guestModal"));
        guestModal.show();
    } else {
        submitOrder(false, null);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Ellenőrizzük, hogy van-e bejelentkezett felhasználóhoz adat
    const userDataElement = document.getElementById("user-data");
    if (userDataElement) {
        const userData = JSON.parse(userDataElement.textContent);

        // Mezők kitöltése, ha van adat
        document.getElementById("name").value = userData.nev || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("phone").value = userData.telefonszam || "";
        document.getElementById("shipping-postal_code").value = userData.szallitasi_iranyitoszam || "";
        document.getElementById("shipping-city").value = userData.szallitasi_telepules || "";
        document.getElementById("shipping-address").value = userData.szallitasi_utca_hazszam || "";
        document.getElementById("billing-postal_code").value = userData.szamlazasi_iranyitoszam || "";
        document.getElementById("billing-city").value = userData.szamlazasi_telepules || "";
        document.getElementById("billing-address").value = userData.szamlazasi_utca_hazszam || "";

        // Az email mezőt letiltjuk, ha a felhasználó be van jelentkezve
        document.getElementById("email").setAttribute("readonly", "true");
    }
});