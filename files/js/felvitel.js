document.getElementById("felvitel_button").addEventListener("click", async function () {
    event.preventDefault();
    const fileInput = document.getElementById("productImages");
    const files = fileInput.files; // Több fájlt is tartalmazhat
    
    let formData = new FormData(); // FormData létrehozása

    // Termék adatok hozzáadása
    formData.append("cikkszam", document.getElementById("cikkszam").value);
    formData.append("nev", document.getElementById("nev").value);
    formData.append("egysegar", document.getElementById("egysegar").value);
    formData.append("leiras", document.getElementById("leiras").value);
    formData.append("gyarto_id", document.getElementById("gyarto_id").value);
    formData.append("kategoria_id", document.getElementById("kategoria_id").value);

    // Fájlok hozzáadása FormData-hoz
    for (const file of files) {
        formData.append("productImages[]", file); // [] kell a tömb miatt!
    }

    try {
        let response = await fetch("../php/felvitel.php", {
            method: "POST",
            body: formData // JSON helyett FormData-t küldünk
        });

        let result = await response.json();
        
        if (result.success) {
            showToast("Sikeres termék felvitel!", "success");
            setTimeout(() => {
                location.reload();
            }, 2500);
        } else {
            showToast("Sikertelen termék felvitel!", "danger");
        }
    } catch (error) {
        console.error("Hiba történt:", error);
    }
});

function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");

    let toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
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

    // Bootstrap toast inicializálás
    let toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();

    // Toast automatikus eltüntetése 3 másodperc után
    setTimeout(() => {
        toast.remove();
    }, 3000);
}