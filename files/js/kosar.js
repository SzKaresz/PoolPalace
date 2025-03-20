document.addEventListener("DOMContentLoaded", function () {
    updateCartTotal();
    updateCartCount();

    document.querySelectorAll(".quantity-btn").forEach(button => {
        button.addEventListener("click", function () {
            const termekId = this.closest("tr").dataset.id.padStart(6, '0');
            const change = this.classList.contains("plus") ? 1 : -1;
            updateQuantity(termekId, change);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", function () {
            const termekId = this.closest("tr").dataset.id.padStart(6, '0');
            removeItem(termekId);
        });
    });

    document.getElementById("confirmClearCart").addEventListener("click", function () {
        removeAllItems();
    });    
});

function updateQuantity(termekId, change) {
    termekId = termekId.toString().padStart(6, '0');
    const quantityElement = document.querySelector(`tr[data-id='${termekId}'] .quantity`);

    if (!quantityElement) {
        console.error("A quantity elem nem található a DOM-ban.");
        return;
    }

    let newQuantity = parseInt(quantityElement.textContent, 10) + change;
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
            quantityElement.textContent = newQuantity;
            const row = quantityElement.closest('tr');
            updateRowTotal(row, newQuantity);
            updateCartTotal();
            updateCartCount();
        } else {
            console.error("Hiba történt a mennyiség frissítésekor: " + data.error);
        }
    })
    .catch(error => {
        console.error("Hiba:", error);
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
                    badge.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
                    cartIcon.appendChild(badge);
                }
                cartCountElement.textContent = data.uj_mennyiseg;
                cartCountElement.style.display = "inline-block"; // Megjelenítés
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