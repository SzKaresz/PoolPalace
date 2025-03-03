document.addEventListener("DOMContentLoaded", function () {
    const placeOrderBtn = document.getElementById("place-order-btn");
    const orderErrors = document.getElementById("order-errors");
    const guestModal = new bootstrap.Modal(document.getElementById("guestModal"));
    const saveAccountBtn = document.getElementById("save-account-btn");
    const modalPassword = document.getElementById("modal-password");

    const isGuest = JSON.parse(document.getElementById("is-guest-data").textContent);

    let orderData = {};

    placeOrderBtn.addEventListener("click", function () {
        const fields = ["name", "email", "phone", "postal_code", "city", "address"];
        let errorMessages = [];

        orderData = {
            action: 'placeOrder',
            total: parseFloat(document.getElementById("total-price-data").textContent),
            cart_items: JSON.parse(document.getElementById("cart-items-data").textContent),
        };

        fields.forEach(field => {
            let inputElement = document.getElementById(field);
            let value = inputElement.value.trim();

            if (!value) {
                errorMessages.push(inputElement.labels[0].textContent + " megadása kötelező!");
            } else {
                orderData[field] = value;
            }
        });

        if (errorMessages.length > 0) {
            showErrorMessages(errorMessages);
            return;
        }

        if (isGuest) {
            // Vendég esetén kérdezzük meg, hogy akar-e regisztrálni
            guestModal.show();
        } else {
            // Bejelentkezett felhasználónál azonnal küldjük a rendelést
            sendOrder(orderData);
        }
    });

    // Ha "Igen"-t választ, akkor regisztráljuk is
    saveAccountBtn.addEventListener("click", function () {
        orderData.register = true;
        orderData.password = modalPassword.value.trim();
        guestModal.hide();
        sendOrder(orderData);
    });

    // Ha "Nem"-et választ, akkor csak a rendelést mentjük el
    document.querySelector("#guestModal .btn-secondary").addEventListener("click", function () {
        orderData.register = false;
        guestModal.hide();
        sendOrder(orderData);
    });

    function sendOrder(orderData) {
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
                showErrorMessages([data.error]);
            }
        })
        .catch(error => {
            console.error("Hiba történt:", error);
            showErrorMessages(["Hiba történt a rendelés leadása során."]);
        });
    }

    function showErrorMessages(messages) {
        orderErrors.innerHTML = messages.map(msg => `<div class="alert alert-danger">${msg}</div>`).join("");
    }
});