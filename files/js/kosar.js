function updateQuantity(termekId, change) {
    // 🔹 Lekérjük a termék raktárkészletét az adatbázisból
    fetch('../php/kosarMuvelet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'getStock',
            termek_id: termekId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error("Hiba történt a készlet lekérdezésekor:", data.error);
            return;
        }

        const row = document.querySelector(`tr[data-id='${termekId}']`);
        const quantityElement = row?.querySelector(".quantity-input");

        if (!row || !quantityElement) {
            console.error("A quantity vagy a sor nem található a DOM-ban.");
            return;
        }

        let currentQuantity = parseInt(quantityElement.value, 10);
        let newQuantity = currentQuantity + change;

        // 🔹 Nem engedjük a mínusz gombot 1 alá menni
        if (newQuantity < 1) newQuantity = 1;

        // 🔹 Nem engedjük a plusz gombot a készlet fölé menni
        let maxStock = data.raktar_keszlet;
        if (newQuantity > maxStock) newQuantity = maxStock;

        // 🔹 Frissítsük az adatbázist
        fetch('../php/kosarMuvelet.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update',
                termek_id: termekId,
                mennyiseg: newQuantity
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 🔁 Friss DOM lekérés újra
                const row = document.querySelector(`tr[data-id='${termekId}']`);
                const quantityElement = row?.querySelector(".quantity-input");

                if (!row || !quantityElement) {
                    console.error("A frissített sor vagy quantity nem található.");
                    return;
                }

                quantityElement.value = newQuantity;
                quantityElement.dataset.currentValue = newQuantity;
                updateRowTotal(row, newQuantity);
                updateCartTotal();
                updateCartCount();

                const plusButton = row.querySelector(".quantity-btn.plus");
                const minusButton = row.querySelector(".quantity-btn.minus");

                if (plusButton) plusButton.disabled = (newQuantity >= maxStock);
                if (minusButton) minusButton.disabled = (newQuantity <= 1);
            } else {
                console.error("Hiba történt a mennyiség frissítésekor:", data.error);
            }
        });
    })
    .catch(error => console.error("Hiba:", error));
}

function disableCartButtons() {
    document.querySelectorAll(".cart-table tbody tr").forEach(row => {
        let termekId = row.dataset.id;
        let quantityElement = row.querySelector(".quantity-input");
        let plusButton = row.querySelector(".quantity-btn.plus");
        let minusButton = row.querySelector(".quantity-btn.minus");

        if (!quantityElement || !plusButton || !minusButton) return;

        let currentQuantity = parseInt(quantityElement.value, 10);

        // 🔹 Lekérjük a raktárkészletet minden termékre
        fetch('../php/kosarMuvelet.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'getStock',
                termek_id: termekId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) return;

            let maxStock = data.raktar_keszlet;

            // 🔹 Ha elérte a maximumot, a `+` gomb inaktiválása
            plusButton.disabled = (currentQuantity >= maxStock);

            // 🔹 Ha már 1 a mennyiség, a `-` gomb inaktiválása
            minusButton.disabled = (currentQuantity <= 1);
        });
    });
}

function removeItem(termekId) {
    fetch('../php/kosarMuvelet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'remove',
            termek_id: termekId
        })
    })    
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const rowElement = document.querySelector(`tr[data-id='${termekId}']`);
            if (rowElement) {
                rowElement.remove();
            }
            updateCartTotal();
            updateCartCount(); // 🔹 Automatikus frissítés törlés után
        } else {
            console.error("Hiba történt a törlésnél: " + data.error);
        }
    })
    .catch(error => {
        console.error("Hiba:", error);
    });
}

function updateCartItem(termekId, change) {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", termek_id: termekId, mennyiseg: change })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateCartCount();
            let productCard = document.querySelector(`tr[data-id='${termekId}`);
            let quantityInput = productCard.querySelector(".quantity-input");
            let newValue = parseInt(quantityInput.value) + change;

            if (newValue < 1) {
                newValue = 1;
            }
            quantityInput.value = newValue;
            quantityInput.dataset.currentValue = newValue;
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error("Hiba:", error));
}

function removeAllItems() {
    fetch('../php/kosarMuvelet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'removeAll'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            let clearCartModal = bootstrap.Modal.getInstance(document.getElementById("clearCartModal"));
            clearCartModal.hide();

            const allRows = document.querySelectorAll(".cart-table tbody tr");
            allRows.forEach(row => row.remove());

            updateCartTotal();
            updateCartCount(); // 🔹 Automatikus frissítés teljes törlés után
        } else {
            console.error("Hiba történt az összes elem törlésénél: " + data.error);
        }
    })
    .catch(error => {
        console.error("Hiba:", error);
    });
}

function updateRowTotal(row, quantity) {
    let unitPriceElement = row.querySelector(".discounted-price");
    let unitPrice;
    
    if (unitPriceElement) {
        unitPrice = parseInt(unitPriceElement.textContent.replace(/\D/g, ''));
    } else {
        unitPriceElement = row.querySelector("td:nth-child(2)"); // Az ár az adott oszlopban
        unitPrice = parseInt(unitPriceElement.textContent.replace(/\D/g, ''));
    }
    
    if (isNaN(unitPrice)) {
        console.error("Hibás árformátum a számításnál.");
        return;
    }
    
    const totalPriceElement = row.querySelector("td:nth-child(4)");
    totalPriceElement.textContent = (unitPrice * quantity).toLocaleString() + " Ft";
}

function updateCartTotal() {
    let total = 0;
    let rows = document.querySelectorAll(".cart-table tbody tr");

    rows.forEach(row => {
        const totalCell = row.querySelector("td:nth-child(4)");
        total += parseInt(totalCell.textContent.replace(/\D/g, ''));
    });

    const totalElement = document.querySelector(".cart-summary h3");
    const table = document.querySelector(".cart-table");
    const summary = document.querySelector(".cart-summary");
    const deletebtn = document.querySelector(".cart-delete");
    const emptyMessage = document.querySelector(".empty-cart-message");

    if (total === 0 || rows.length === 0) {
        if (table) table.style.display = "none";
        if (summary) summary.style.display = "none";
        if (deletebtn) deletebtn.style.display = "none";
        if (emptyMessage) emptyMessage.style.display = "block";
    } else {
        if (table) table.style.display = "table";
        if (summary) summary.style.display = "block";
        if (deletebtn) deletebtn.style.display = "block";
        if (emptyMessage) emptyMessage.style.display = "none";
        totalElement.textContent = "Összesen: " + total.toLocaleString() + " Ft";
    }
}

function updateCartCount() {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getCount" })
    })
    .then(response => response.json())
    .then(data => {
        const cartCountElement = document.getElementById("cart-count");

        if (data.success) {
            if (data.uj_mennyiseg > 0) {
                if (!cartCountElement) {
                    // Ha nincs számláló, létrehozzuk
                    const cartIcon = document.querySelector(".cart-icon");
                    const badge = document.createElement("span");
                    badge.id = "cart-count";
                    badge.className = "badge rounded-pill bg-danger";
                    cartIcon.appendChild(badge);
                }
                cartCountElement.textContent = data.uj_mennyiseg;
            } else {
                if (cartCountElement) {
                    cartCountElement.textContent = "0"; // Biztosan frissítse az értéket
                    cartCountElement.style.display = "none"; // 🔹 Ha üres, elrejtjük
                }
            }
        }
    })
    .catch(error => console.error("Hiba a kosár frissítésében:", error));
}

function initQuantityInputs() {
    document.querySelectorAll(".cart-table tbody tr").forEach(row => {
        const termekId = row.dataset.id;
        const input = row.querySelector(".quantity-input");
        const plus = row.querySelector(".quantity-btn.plus");
        const minus = row.querySelector(".quantity-btn.minus");

        if (!input || !plus || !minus) return;

        input.addEventListener("change", () => {
            const newVal = parseInt(input.value);
            const current = parseInt(input.dataset.currentValue || input.value);
            const diff = newVal - current;
            updateQuantity(termekId, diff);
        });

        plus.addEventListener("click", () => updateQuantity(termekId, 1));
        minus.addEventListener("click", () => updateQuantity(termekId, -1));
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartTotal();
    updateCartCount();
    disableCartButtons();
    initQuantityInputs();

    // 🛒 Mennyiség növelés/csökkentés
    document.querySelectorAll(".quantity-btn").forEach(button => {
        button.addEventListener("click", function () {
            const termekId = this.closest("tr").dataset.id;
            const change = this.classList.contains("plus") ? 1 : -1;
            updateQuantity(termekId, change);
        });
    });

    // 🗑️ Termék törlése
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function () {
            const termekId = this.closest("tr").dataset.id;
            removeItem(termekId);
        });
    });

    // 🧹 Teljes kosár ürítése
    document.getElementById("confirmClearCart").addEventListener("click", function () {
        removeAllItems();
    });
});