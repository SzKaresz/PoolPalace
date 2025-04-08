async function rendelesBetolt() {
    try {
        let keres = await fetch("../php/rendelesek.php");
        if (keres.ok) {
            let valasz = await keres.json();
            let tartalom = document.getElementById("tartalom");
            tartalom.innerHTML = `<div id="accord_div" class="accordion accordion-flush"></div>`;
            let accord_div = document.getElementById("accord_div");

            for (const item of valasz) {
                let egyediId = `flush-collapse-${item.id}`;

                accord_div.innerHTML += `
                <div class="accordion-item m-5 border rounded shadow-sm  sm-12">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${egyediId}" aria-expanded="false" aria-controls="${egyediId}">
                            Megrendelés #${item.id} - ${item.nev}
                        </button>
                    </h2>
                    <div id="${egyediId}" class="accordion-collapse collapse" data-bs-parent="#accord_div">
                        <div class="accordion-body" id="accord_body_${item.id}">
                        </div>
                    </div>
                </div>

                `;
                accordFeltolt(item.id);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function accordFeltolt(id) {
    try {
        let keres = await fetch("../php/rendelesek_termekek.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        });

        if (keres.ok) {
            let valasz = await keres.json();
            let tbodyContent = valasz.map(item => {
                let ar = (item.akcios_ar == -1) ? item.egysegar : item.akcios_ar;
                ar = parseInt(ar);
                let osszeg = item.darabszam * ar;
                osszeg = parseInt(osszeg);
                return `
                <tr data-ar="${ar}" data-id="${item.megrendeles_id}" data-cikkszam="${item.cikkszam}">
                    <td>${item.cikkszam}</td>
                    <td>${item.termek_nev}</td>
                    <td>
                        <div class="quantity-control" style="display: flex;">
                            <button class="quantity-btn minus" ${item.darabszam <= 1 ? "disabled" : ""}>-</button>
                            <input class="quantity-input" type="number" min="1" value="${item.darabszam}" data-original-value="${item.darabszam}">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </td>
                    <td>${ar.toLocaleString("hu-HU", { style: 'currency', currency: 'HUF', minimumFractionDigits: 0, useGrouping: true })}</td>
                    <td class="osszeg">${osszeg.toLocaleString("hu-HU", { style: 'currency', currency: 'HUF', minimumFractionDigits: 0, useGrouping: true })}</td>
                </tr>`;
            }).join('');

            document.getElementById(`accord_body_${id}`).innerHTML += `
            <div id="termekek">
                <table class="table table-striped mt-2">
                    <thead>
                        <tr>
                            <th>Termék cikkszám</th>
                            <th>Termék név</th>
                            <th>Termék db</th>
                            <th>Termék ára</th>
                            <th>Összeg</th>
                        </tr>
                    </thead>
                    <tbody>${tbodyContent}</tbody>
                </table>
                <div class="mt-3">
                    <label for="status_${id}">Rendelés státusza:</label>
                    <select id="status_${id}" class="form-select">
                        <option value="Feldolgozás alatt">Feldolgozás alatt</option>
                        <option value="Fizetésre vár">Fizetésre vár</option>
                        <option value="Fizetve">Fizetve</option>
                        <option value="Szállítás alatt">Szállítás alatt</option>
                        <option value="Teljesítve">Teljesítve</option>
                    </select>
                </div>
            </div>
            <hr class="my-5">
            <div class="row" id="adatok_${id}"></div>
            <div class="mt-5">
                <button class="btn btn-outline-danger torles-gomb delete-all-btn" style="float: right;" data-id="${id}"><img src="../img/delete.png" alt="Törlés" width="30"></button>
                <button class="btn btn-outline-success mentes-gomb save-all-btn" style="float: right;" data-id="${id}"><img src="../img/save.png" alt="Mentés" width="30"></button>
            </div>

                    `;

            let betoltve = false
            for (const item of valasz) {
                if(betoltve==false){
                    document.getElementById(`adatok_${id}`).innerHTML+=`
                    <div class="col-md-6">
                    <div class="mb-3">
                        <h3>Szállítási adatok</h3>
                    </div>
                    <div class="mb-3">
                        <label for="irsz" class="form-label">Irányítószám</label>
                        <input type="text" id="irsz_${id}" class="form-control" name="irsz" value="${item.szallit_irsz}">
                    </div>
                    <div class="mb-3">
                        <label for="telepules" class="form-label">Település</label>
                        <input type="text" id="telepules_${id}" class="form-control" name="telepules" value="${item.szallit_telep}">
                    </div>
                    <div class="mb-3">
                        <label for="utca" class="form-label">Utca és házszám</label>
                        <input type="text" id="utca_${id}" class="form-control" name="utca" value="${item.szallit_cim}">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <h3>Számlázási adatok</h3>
                    </div>
                    <div class="mb-3">
                        <label for="sz_irsz" class="form-label">Irányítószám</label>
                        <input type="text" id="sz_irsz_${id}" class="form-control" name="sz_irsz" value="${item.szamlaz_irsz}">
                    </div>
                    <div class="mb-3">
                        <label for="sz_telepules" class="form-label">Település</label>
                        <input type="text" id="sz_telepules_${id}" class="form-control" name="sz_telepules" value="${item.szamlaz_telep}">
                    </div>
                    <div class="mb-3">
                        <label for="sz_utca" class="form-label">Utca és házszám</label>
                        <input type="text" id="sz_utca_${id}" class="form-control" name="sz_utca" value="${item.szamlaz_cim}">
                    </div>
                </div>
                `
                betoltve=true
                }
            }
        
            let statusSelect = document.getElementById(`status_${id}`);
            if (valasz.length > 0 && valasz[0].statusz) {
                statusSelect.value = valasz[0].statusz;
            }
        } else {
            console.log("Hiba történt a lekérdezés során.");
        }
    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("click", function (event) {
    if (event.target.closest(".save-all-btn")) {
        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.style.display = "flex";
        let megrendelesId = event.target.closest(".save-all-btn").getAttribute("data-id");
        let statusSelect = document.getElementById(`status_${megrendelesId}`);
        let newStatus = statusSelect.value;

        let rows = document.querySelectorAll(`#accord_body_${megrendelesId} tbody tr`);
        let modifiedItems = [];

        rows.forEach(row => {
            let input = row.querySelector(".quantity-input");
            let originalValue = parseInt(input.getAttribute("data-original-value"), 10);
            let newValue = parseInt(input.value, 10);

            if (originalValue !== newValue) {
                modifiedItems.push({
                    megrendelesId: megrendelesId,
                    cikkszam: row.getAttribute("data-cikkszam"),
                    newQuantity: newValue
                });
            }
        });

        let personalDetails={
            szallitas: {
                irsz: document.getElementById(`irsz_${megrendelesId}`).value,
                telepules: document.getElementById(`telepules_${megrendelesId}`).value,
                utca: document.getElementById(`utca_${megrendelesId}`).value
            },
            szamlazas: {
                irsz: document.getElementById(`sz_irsz_${megrendelesId}`).value,
                telepules: document.getElementById(`sz_telepules_${megrendelesId}`).value,
                utca: document.getElementById(`sz_utca_${megrendelesId}`).value
            }
        }


        let requestBody = {
            megrendelesId: megrendelesId,
            newStatus: newStatus,
            items: modifiedItems,
            details: personalDetails
        };

        fetch("../php/mentes.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(result => {
                console.log(result.messages);
                loadingOverlay.style.display = "none";
                if (result.success) {
                    showToast(result.messages, "success");
                    rows.forEach(row => {
                        let input = row.querySelector(".quantity-input");
                        input.setAttribute("data-original-value", input.value);
                    });
                }
                else
                {
                    showToast(result.messages, "info");
                }
            })
            .catch(error => {
                loadingOverlay.style.display = "none";
                console.log(error);
                showToast("Hiba történt a mentés során!", "danger");
            });
    }
});

document.addEventListener("click", function (event) {
    if (event.target.closest(".delete-all-btn")) {
        const loadingOverlay = document.getElementById("loading-overlay");
        let megrendelesId = event.target.closest(".delete-all-btn").getAttribute("data-id");
        let modal = new bootstrap.Modal(document.getElementById("torlesModal"));
        modal.show();

        const megerositesBtn = document.getElementById("megerositesTorles");
        megerositesBtn.removeEventListener("click", handleTorlest);

        megerositesBtn.addEventListener("click", handleTorlest);

        async function handleTorlest() {
            loadingOverlay.style.display = "flex";
            let requestBody = {
                megrendeles_id: megrendelesId
            };

            try {
                let response = await fetch("../php/megrendeles_torles.php", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody)
                });

                let result = await response.json();
                console.log(result);
                loadingOverlay.style.display = "none";

                if (result.success) {
                    showToast(result.message, "success");
                    rendelesBetolt()
                    
                } else {
                    showToast(result.message, "danger");
                }
            } catch (error) {
                console.log(error);
                loadingOverlay.style.display = "none";
                showToast("Hiba történt a törlés során!", "danger");
            }

            modal.hide();
        }
    }
});


document.addEventListener("input", function (event) {
    if (event.target.classList.contains("quantity-input")) {
        let row = event.target.closest("tr");
        let minusBtn = row.querySelector(".minus");
        let ar = parseInt(row.getAttribute("data-ar"), 10);
        let osszegElem = row.querySelector(".osszeg");

        let ujErtek = parseInt(event.target.value, 10);

        if (isNaN(ujErtek) || ujErtek < 1) {
            event.target.value = 1;
            ujErtek = 1;
        }

        let ujOsszeg = ujErtek * ar;
        osszegElem.textContent = `${ujOsszeg.toLocaleString("hu-HU", {
            style: 'currency',
            currency: 'HUF',
            minimumFractionDigits: 0,
            useGrouping: true
        })}`;

        minusBtn.disabled = ujErtek <= 1;
    }
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("plus") || event.target.classList.contains("minus")) {
        let row = event.target.closest("tr");
        let input = row.querySelector(".quantity-input");
        let minusBtn = row.querySelector(".minus");
        let ar = parseInt(row.getAttribute("data-ar"), 10);
        let osszegElem = row.querySelector(".osszeg");

        let currentValue = parseInt(input.value, 10);

        if (event.target.classList.contains("plus")) {
            input.value = currentValue + 1;
        } else if (event.target.classList.contains("minus") && currentValue > 1) {
            input.value = currentValue - 1;
        }

        let ujOsszeg = input.value * ar;
        osszegElem.textContent = `${ujOsszeg.toLocaleString("hu-HU", {
            style: 'currency',
            currency: 'HUF',
            minimumFractionDigits: 0,
            useGrouping: true
        })}`;

        minusBtn.disabled = input.value <= 1;
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

    let toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


window.addEventListener("load", rendelesBetolt);