async function rendelesBetolt() {
    try {
        let keres = await fetch("../php/rendelesek.php");
        if (keres.ok) {
            let valasz = await keres.json();
            let tartalom = document.getElementById("tartalom");
            tartalom.innerHTML = `
            <ul class="nav nav-tabs" id="rendelesTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="osszes-tab" data-bs-toggle="tab" data-bs-target="#osszes" type="button" role="tab" aria-controls="osszes" aria-selected="true">Összes</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="feldolgozas-tab" data-bs-toggle="tab" data-bs-target="#feldolgozas" type="button" role="tab" aria-controls="feldolgozas" aria-selected="false">Feldolgozás alatt</button>
        </li>
        <li class="nav-item" role="presentation">
             <button class="nav-link" id="fizetesre-var-tab" data-bs-toggle="tab" data-bs-target="#fizetesre-var" type="button" role="tab" aria-controls="fizetesre-var" aria-selected="false">Fizetésre vár</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="fizetve-tab" data-bs-toggle="tab" data-bs-target="#fizetve" type="button" role="tab" aria-controls="fizetve" aria-selected="false">Fizetve</button>
        </li>
         <li class="nav-item" role="presentation">
            <button class="nav-link" id="szallitas-alatt-tab" data-bs-toggle="tab" data-bs-target="#szallitas-alatt" type="button" role="tab" aria-controls="szallitas-alatt" aria-selected="false">Szállítás alatt</button>
        </li>
         <li class="nav-item" role="presentation">
            <button class="nav-link" id="teljesitve-tab" data-bs-toggle="tab" data-bs-target="#teljesitve" type="button" role="tab" aria-controls="teljesitve" aria-selected="false">Teljesítve</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="torolve-tab" data-bs-toggle="tab" data-bs-target="#torolve" type="button" role="tab" aria-controls="torolve" aria-selected="false">Törölve</button>
        </li>
    </ul>
    <div class="tab-content" id="rendelesTabContent">
        <div class="tab-pane fade show active" id="osszes" role="tabpanel" aria-labelledby="osszes-tab"></div>
        <div class="tab-pane fade" id="feldolgozas" role="tabpanel" aria-labelledby="feldolgozas-tab"></div>
        <div class="tab-pane fade" id="fizetesre-var" role="tabpanel" aria-labelledby="fizetesre-var-tab"></div>
        <div class="tab-pane fade" id="fizetve" role="tabpanel" aria-labelledby="fizetve-tab"></div>
         <div class="tab-pane fade" id="szallitas-alatt" role="tabpanel" aria-labelledby="szallitas-alatt-tab"></div>
         <div class="tab-pane fade" id="teljesitve" role="tabpanel" aria-labelledby="teljesitve-tab"></div>
         <div class="tab-pane fade" id="torolve" role="tabpanel" aria-labelledby="torolve-tab"></div>
    </div>
            `;

            let osszesTab = document.getElementById("osszes");
            let rendelesAccordion;
            let rendelesek = {
                "Feldolgozás alatt": [],
                "Fizetésre vár": [],
                "Fizetve": [],
                "Szállítás alatt": [],
                "Teljesítve": [],
                "Törölve":[]
            };

            for (const item of valasz) {
                let accordionTemplate = document.createElement('div');
                accordionTemplate.classList.add('accordion', 'accordion-flush', 'm-4', 'border', 'rounded', 'shadow-sm');
                accordionTemplate.innerHTML = `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading-${item.id}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-${item.id}" aria-expanded="false" aria-controls="flush-collapse-${item.id}">
                    Megrendelés #${item.id} - ${item.nev}
                </button>
            </h2>
            <div id="flush-collapse-${item.id}" class="accordion-collapse collapse" aria-labelledby="heading-${item.id}" data-bs-parent="#rendelesTabContent">
                <div class="accordion-body" id="accord_body_${item.id}"></div>
            </div>
        </div>
    `;

                // Két külön példány készül: egyik az összeshez, másik a státusz szerintibe
                const accordionForOsszes = accordionTemplate.cloneNode(true);
                const accordionForTab = accordionTemplate.cloneNode(true);

                await accordFeltolt(accordionForOsszes, item.id);
                await accordFeltolt(accordionForTab, item.id);

                document.getElementById("osszes").appendChild(accordionForOsszes);

                if (rendelesek.hasOwnProperty(item.statusz)) {
                    rendelesek[item.statusz].push({
                        accordion: accordionForTab,
                        id: item.id
                    });
                }
            }

            for (const statusz in rendelesek) {
                if (rendelesek.hasOwnProperty(statusz)) {
                    let targetTab = getTargetTabId(statusz);
                    let tabContent = document.getElementById(targetTab);

                    if (rendelesek[statusz].length === 0) {
                        tabContent.innerHTML = `<h4 class="text-center">Jelenleg nincs ebben a státuszban megrendelés.</h4>`;
                    } else {
                        tabContent.innerHTML = ""; // Előző tartalmat töröljük
                        rendelesek[statusz].forEach(rendeles => {
                            let existingAccordion = document.querySelector(`#${targetTab} #flush-collapse-${rendeles.id}`);
                            if (existingAccordion) {
                                existingAccordion.parentNode.innerHTML = rendeles.accordion.innerHTML;
                            } else {
                                tabContent.appendChild(rendeles.accordion);
                            }
                        });
                    }
                }
            }


        }
    } catch (error) {
        console.log(error);
    }
}


function addOrderToTab(statusz, rendelesAccordion, id) {
    let targetTab = getTargetTabId(statusz);
    let existingAccordion = document.querySelector(`#${targetTab} #flush-collapse-${id}`);
    if (existingAccordion) {
        existingAccordion.parentNode.innerHTML = rendelesAccordion.innerHTML;
    } else {
        document.getElementById(targetTab).appendChild(rendelesAccordion);
    }
}
function getTargetTabId(statusz) {
    switch (statusz) {
        case "Feldolgozás alatt": return "feldolgozas";
        case "Fizetésre vár": return "fizetesre-var";
        case "Fizetve": return "fizetve";
        case "Szállítás alatt": return "szallitas-alatt";
        case "Teljesítve": return "teljesitve";
        case "Törölve": return "torolve";
        default: return "osszes";
    }
} async function accordFeltolt(rendelesAccordion, id) {
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
                    <td>
                         <button class="remove-btn btn btn-danger" onclick="termekTorles('${item.cikkszam}',${id},${valasz.length})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                    </tr>`;
            }).join('');

            rendelesAccordion.querySelector(`#accord_body_${id}`).innerHTML = `
            <div id="termekek">
                <table class="table table-striped mt-2">
                    <thead>
                        <tr>
                            <th>Termék cikkszám</th>
                            <th>Termék név</th>
                            <th>Termék db</th>
                            <th>Termék ára</th>
                            <th>Összeg</th>
                            <th>Művelet</th>
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
                        <option value="Törölve">Törölve</option>
                    </select>
                </div>
            </div>
            <hr class="my-5">
            <div class="row" id="adatok_${id}"></div>
            <div class="mt-5">
                ${valasz[0].statusz !== "Törölve" ? `
                <button class="btn btn-outline-danger torles-gomb delete-all-btn" style="float: right;" data-id="${id}">
                    <img src="../img/delete.png" alt="Törlés" width="30">
                </button>` : ""}
                <button class="btn btn-outline-success mentes-gomb save-all-btn" style="float: right;" data-id="${id}">
                    <img src="../img/save.png" alt="Mentés" width="30">
                </button>
            </div>


                    `;

            let betoltve = false;
            for (const item of valasz) {
                if (betoltve == false) {
                    rendelesAccordion.querySelector(`#adatok_${id}`).innerHTML += `
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
                `;
                    betoltve = true;
                }
            }

            let statusSelect = rendelesAccordion.querySelector(`#status_${id}`);
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
        // **Megkeressük a megfelelő accordiant a gombhoz legközelebbi .accordion elem segítségével**
        let accordion = event.target.closest(".accordion");

        // **Azon belül keressük a szükséges inputokat**
        let statusSelect = accordion.querySelector(`#status_${megrendelesId}`);
        let newStatus = statusSelect.value;

        let rows = accordion.querySelectorAll(`#accord_body_${megrendelesId} tbody tr`);
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

        let personalDetails = {
            szallitas: {
                irsz: accordion.querySelector(`#irsz_${megrendelesId}`).value,
                telepules: accordion.querySelector(`#telepules_${megrendelesId}`).value,
                utca: accordion.querySelector(`#utca_${megrendelesId}`).value
            },
            szamlazas: {
                irsz: accordion.querySelector(`#sz_irsz_${megrendelesId}`).value,
                telepules: accordion.querySelector(`#sz_telepules_${megrendelesId}`).value,
                utca: accordion.querySelector(`#sz_utca_${megrendelesId}`).value
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
                    rendelesBetolt();
                }
                else {
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
                    method: "PUT",
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
let aktivTorlesAdatok = {};

async function termekTorles(cikkszam, id, db) {
    try {
        if (db == 1) {
            const loadingOverlay = document.getElementById("loading-overlay");
            let modal = new bootstrap.Modal(document.getElementById("termektorlesModal"));
            document.getElementById("cikkszam_torol").innerHTML = cikkszam
            modal.show();

            aktivTorlesAdatok = { id };

            const megerositesBtn = document.getElementById("termekmegerositesTorles");
            megerositesBtn.removeEventListener("click", torles);
            megerositesBtn.addEventListener("click", torles);

        } else {
            let modal = new bootstrap.Modal(document.getElementById("termekModal"));
            document.getElementById("cikkszam_torol2").innerHTML = cikkszam
            modal.show();

            aktivTorlesAdatok = { cikkszam, id };

            const megerositesBtn = document.getElementById("termekTorles");
            megerositesBtn.removeEventListener("click", torlesTermek);
            megerositesBtn.addEventListener("click", torlesTermek);
        }

    } catch (error) {
        console.log(error);
    }
}


async function torles() {
    const loadingOverlay = document.getElementById("loading-overlay");
    const modal = bootstrap.Modal.getInstance(document.getElementById("termektorlesModal"));
    loadingOverlay.style.display = "flex";

    let requestBody = {
        megrendeles_id: aktivTorlesAdatok.id
    };

    try {
        let response = await fetch("../php/megrendeles_torles.php", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        let result = await response.json();
        loadingOverlay.style.display = "none";

        if (result.success) {
            showToast(result.message, "success");
            rendelesBetolt();
        } else {
            showToast(result.message, "danger");
        }
    } catch (error) {
        console.log(error);
        showToast("Hiba történt a törlés során!", "danger");
        loadingOverlay.style.display = "none";
    }

    modal.hide();
}

async function torlesTermek() {
    const modal = bootstrap.Modal.getInstance(document.getElementById("termekModal"));
    let keres = await fetch("../php/megrendeles_termekTorles.php", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            cikkszam: aktivTorlesAdatok.cikkszam,
            megrendeles_id: aktivTorlesAdatok.id
        })
    });

    let valasz = await keres.json();

    if (valasz.success) {
        showToast(valasz.message, "success");
        document.getElementById(`accord_body_${aktivTorlesAdatok.id}`).innerHTML = "";
        accordFeltolt(aktivTorlesAdatok.id);
    } else {
        showToast(valasz.message, "danger");
    }

    modal.hide();
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



window.addEventListener("load", rendelesBetolt);