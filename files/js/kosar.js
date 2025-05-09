function disableCartButtons() {
    document.querySelectorAll(".cart-table tbody tr").forEach(row => {
        let termekId = row.dataset.id;
        let quantityElement = row.querySelector(".quantity-input");
        let plusButton = row.querySelector(".quantity-btn.plus");
        let minusButton = row.querySelector(".quantity-btn.minus");

        if (!quantityElement || !plusButton || !minusButton) return;

        let currentQuantity = parseInt(quantityElement.value, 10);

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

                plusButton.disabled = (currentQuantity >= maxStock);
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
                updateCartCount();
            } else {
                console.error("Hiba történt a törlésnél: " + data.error);
            }
        })
        .catch(error => {
            console.error("Hiba:", error);
        });
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
                updateCartCount();
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
        unitPriceElement = row.querySelector("td:nth-child(2)");
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
    const cartButtons = document.querySelector(".cart-btns");

    if (total === 0 || rows.length === 0) {
        if (table) table.style.display = "none";
        if (summary) summary.style.display = "none";
        if (deletebtn) deletebtn.style.display = "none";
        if (cartButtons) cartButtons.style.display = "none";
        if (emptyMessage) emptyMessage.style.display = "block";
    } else {
        if (table) table.style.display = "table";
        if (summary) summary.style.display = "block";
        if (deletebtn) deletebtn.style.display = "block";
        if (cartButtons) cartButtons.style.display = "flex";
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
                        const cartIcon = document.querySelector(".cart-icon");
                        const badge = document.createElement("span");
                        badge.id = "cart-count";
                        badge.className = "badge rounded-pill bg-danger";
                        cartIcon.appendChild(badge);
                    }
                    cartCountElement.textContent = data.uj_mennyiseg;
                } else {
                    if (cartCountElement) {
                        cartCountElement.textContent = "0";
                        cartCountElement.style.display = "none";
                    }
                }
            }
        })
        .catch(error => console.error("Hiba a kosár frissítésében:", error));
}

function setQuantity(termekId, newQuantity) {
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
        if (newQuantity > maxStock) newQuantity = maxStock;
        if (newQuantity < 1) newQuantity = 1;

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
                const row = document.querySelector(`tr[data-id='${termekId}']`);
                const input = row.querySelector(".quantity-input");
                input.value = newQuantity;
                input.dataset.currentValue = newQuantity;

                updateRowTotal(row, newQuantity);
                updateCartTotal();
                updateCartCount();
                disableCartButtons();
            }
        });
    });
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
            if (!isNaN(newVal)) {
                setQuantity(termekId, newVal);
            }
        });        

        plus.addEventListener("click", () => {
            const current = parseInt(input.value) || 1;
            setQuantity(termekId, current + 1);
        });
        minus.addEventListener("click", () => {
            const current = parseInt(input.value) || 1;
            setQuantity(termekId, current - 1);
        });        
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartTotal();
    updateCartCount();
    disableCartButtons();
    initQuantityInputs();

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function () {
            const termekId = this.closest("tr").dataset.id;
            removeItem(termekId);
        });
    });

    document.getElementById("confirmClearCart").addEventListener("click", function () {
        removeAllItems();
    });

    document.querySelectorAll(".cart-table .product-name").forEach(elem => {
        const maxLength = 42;
        const fullText = elem.textContent.trim();

        if (fullText.length > maxLength) {
            elem.textContent = fullText.slice(0, maxLength) + "...";
            elem.title = fullText;
        }
    });
});