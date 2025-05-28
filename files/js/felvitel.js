document.getElementById("felvitel_button").addEventListener("click", async function () {
    event.preventDefault();
    const fileInput = document.getElementById("productImages");
    const files = fileInput.files;

    let formData = new FormData();

    formData.append("cikkszam", document.getElementById("cikkszam").value);
    formData.append("nev", document.getElementById("nev").value);
    formData.append("egysegar", document.getElementById("egysegar").value);
    formData.append("leiras", document.getElementById("leiras").value);
    formData.append("gyarto_id", document.getElementById("gyarto_id").value);
    formData.append("kategoria_id", document.getElementById("kategoria_id").value);

    for (const file of files) {
        formData.append("productImages[]", file);
    }

    try {
        let response = await fetch("../php/felvitel.php", {
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (result.success) {
            showToast(result.message, "success");
            setTimeout(() => {
                location.reload();
            }, 2500);
        } else {
            showToast(result.message, "danger");
        }
    } catch (error) {
        console.error("Hiba történt:", error);
    }
});

const kategoriaForm = document.getElementById('kategoriaForm');
if (kategoriaForm) {
    kategoriaForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(kategoriaForm);
        const ujKategoriaInput = document.getElementById('uj_kategoria');

        if (!ujKategoriaInput || ujKategoriaInput.value.trim() === '') {
            showToast('A kategória neve nem lehet üres!', 'danger'); // A meglévő showToast használata
            return;
        }

        // Opcionális kliensoldali validáció (hossz, karakterek) itt is hozzáadható, ha szükséges.

        try {
            const response = await fetch('../php/kategoria_felvitel.php', {
                method: 'POST',
                body: formData
            });

            const contentType = response.headers.get("content-type");
            let result;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                const textResponse = await response.text();
                console.error('Nem JSON válasz érkezett a kategória feltöltésnél:', textResponse);
                showToast('Szerver oldali hiba történt (nem JSON válasz).', 'danger');
                return;
            }

            if (result.success) {
                showToast(result.message, "success"); // A meglévő showToast használata
                if (ujKategoriaInput) ujKategoriaInput.value = '';
                // Oldal újratöltése a select lista frissítéséhez
                // setTimeout(() => { location.reload(); }, 1500); // Rövidebb várakozás is elég lehet
            } else {
                showToast(result.message || 'Ismeretlen hiba történt a kategória feltöltésekor.', 'danger'); // A meglévő showToast használata
            }
        } catch (error) {
            console.error('Hiba a kategória feltöltésekor:', error);
            showToast('Hálózati hiba vagy feldolgozási probléma történt.', 'danger'); // A meglévő showToast használata
        }
    });
}

const gyartoForm = document.getElementById('gyartoForm');
if (gyartoForm) {
    gyartoForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(gyartoForm);
        const ujGyartoInput = document.getElementById('uj_gyarto');

        if (!ujGyartoInput || ujGyartoInput.value.trim() === '') {
            showToast('A gyártó neve nem lehet üres!', 'danger'); // A meglévő showToast használata
            return;
        }

        // Opcionális kliensoldali validáció (hossz, karakterek) itt is hozzáadható, ha szükséges.

        try {
            const response = await fetch('../php/gyarto_felvitel.php', {
                method: 'POST',
                body: formData
            });

            const contentType = response.headers.get("content-type");
            let result;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                result = await response.json();
            } else {
                const textResponse = await response.text();
                console.error('Nem JSON válasz érkezett a gyártó feltöltésnél:', textResponse);
                showToast('Szerver oldali hiba történt (nem JSON válasz).', 'danger');
                return;
            }

            if (result.success) {
                showToast(result.message, 'success'); // A meglévő showToast használata
                if (ujGyartoInput) ujGyartoInput.value = '';
                // Oldal újratöltése a select lista frissítéséhez
                setTimeout(() => { location.reload(); }, 1500);
            } else {
                showToast(result.message || 'Ismeretlen hiba történt a gyártó feltöltésekor.', 'danger'); // A meglévő showToast használata
            }
        } catch (error) {
            console.error('Hiba a gyártó feltöltésekor:', error);
            showToast('Hálózati hiba vagy feldolgozási probléma történt.', 'danger'); // A meglévő showToast használata
        }
    });
}

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

    let toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const mainTextarea = document.getElementById('leiras');
    const modalTextarea = document.getElementById('modalLeirasTextarea');
    const descriptionModalElement = document.getElementById('editDescriptionModal');
    const descriptionModal = new bootstrap.Modal(descriptionModalElement);

    const saveModalBtn = document.getElementById('saveModalButton');
    const clearModalBtn = document.getElementById('clearModalButton');

    mainTextarea.addEventListener('click', () => {
        if (mainTextarea.readOnly) {
            modalTextarea.value = mainTextarea.value;
            descriptionModal.show();
        }
    });

    saveModalBtn.addEventListener('click', () => {
        mainTextarea.value = modalTextarea.value;
        descriptionModal.hide();
    });

    clearModalBtn.addEventListener('click', () => {
        modalTextarea.value = '';
        mainTextarea.value = '';
        descriptionModal.hide();
    });
});