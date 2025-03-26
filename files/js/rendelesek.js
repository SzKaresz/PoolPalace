async function rendelesBetolt() {
    try {
        let keres = await fetch("../php/rendelesek.php");
        if (keres.ok) {
            let valasz = await keres.json();
            let tartalom = document.getElementById("tartalom");
            tartalom.innerHTML = `<div id="accord_div" class="accordion accordion-flush"></div>`;
            let accord_div = document.getElementById("accord_div");
            
            for (const item of valasz) {
                let egyediId = `flush-collapse-${item.id}`; // Egyedi ID minden elemnek

                accord_div.innerHTML += `
                <div class="accordion-item m-5">
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
            for (const item of valasz) {
                if (item.megrendeles_id == id) {
                    document.getElementById(`accord_body_${id}`).innerHTML += `
    <table class="table table-striped mt-2" id="megrendeles_table">
        <thead>
            <tr>
                <th>Termék cikkszám</th>
                <th>Termék név</th>
                <th>Termék db</th>
                <th>Termék ára</th>
                <th>Összeg</th>
                <th>#</th>
            </tr>
        </thead>
        <tbody>
        ${valasz.map(item => {
            let ar = (item.akcios_ar == -1) ? item.egysegar : item.akcios_ar;
            let osszeg = item.darabszam * ar;
            return `
            <tr data-ar="${ar}">
                <td>${item.cikkszam}</td>
                <td>${item.termek_nev}</td>
                <td>
                    <div class="quantity-control" style="display: flex;">
                        <button class="quantity-btn minus" ${item.darabszam <= 1 ? "disabled" : ""}>-</button>
                        <input class="quantity-input" type="number" min="1" value="${item.darabszam}" data-current-value="${item.darabszam}">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </td>
                <td>${ar} Ft</td>
                <td class="osszeg">${osszeg} Ft</td>
                <td>
                    <button type="button" class="btn btn-primary save-btn" data-id="${item.megrendeles_id}" data-cikkszam="${item.cikkszam}">Mentés</button> 
                </td>
            </tr>`;}).join('')}
        
        </tbody>
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
        <button type="button" class="btn btn-primary save-status" data-id=${item.megrendeles_id}>Státusz módosítása</button>
    </div>
`;
let statusSelect = document.getElementById(`status_${id}`);
if (item.statusz) {
    statusSelect.value = item.statusz;
}
return
}
            }
        } else {
            console.log("Hiba történt a lekérdezés során.");
        }
    } catch (error) {
        console.log(error);
    }
}

async function saveChanges(termekId, megrendelesId, newQuantity) {
    try {
        let response = await fetch("../php/mentes.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "termekId": termekId,
                "megrendelesId": megrendelesId,
                "newQuantity": newQuantity
            })
        });

        if (response.ok) {
            let result = await response.json();
            if (result.success) {
                alert("A változások sikeresen mentve.");
            } else {
                alert("Hiba történt a mentés során.");
            }
        }
    } catch (error) {
        console.log(error);
        alert("Hiba történt a mentés során.");
    }
}

async function saveStatusChange(megrendelesId, newStatus) {
    try {
        let response = await fetch("../php/statusz.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "megrendelesId": megrendelesId,
                "newStatus": newStatus
            })
        });

        if (response.ok) {
            let result = await response.json();
            if (result.success) {
                alert("A státusz sikeresen frissítve.");
            } else {
                alert("Hiba történt a státusz módosítása során.");
            }
        }
    } catch (error) {
        console.log(error);
        alert("Hiba történt a státusz mentése során.");
    }
}

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("save-status")) {
        let button = event.target;
        let megrendelesId = button.getAttribute("data-id");
        let statusSelect = document.getElementById(`status_${megrendelesId}`);
        let newStatus = statusSelect.value;
        saveStatusChange(megrendelesId, newStatus);
    }
});

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("save-btn")) {
        let row = event.target.closest("tr");
        if (row) {
            let buttons = row.querySelectorAll("button");
            if (buttons.length >= 3) {
                let thirdButton = buttons[2];
                let termekId = thirdButton.getAttribute("data-cikkszam");
                let megrendelesId = thirdButton.getAttribute("data-id");
                let input = row.querySelector(".quantity-input");
                let newQuantity = parseInt(input.value, 10);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    alert("Érvénytelen mennyiség! Kérlek, adj meg egy érvényes mennyiséget.");
                    return;
                }
                saveChanges(termekId, megrendelesId, newQuantity);
            }
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

        // Ha nem számot ír be vagy kisebb mint 1, állítsuk vissza az előző értéket
        if (isNaN(ujErtek) || ujErtek < 1) {
            event.target.value = 1;
            ujErtek = 1;
        }

        // Frissítsük az árat
        let ujOsszeg = ujErtek * ar;
        osszegElem.textContent = `${ujOsszeg} Ft`;

        // Frissítsük a mínusz gomb állapotát
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

        // Frissítsük az árat
        let ujOsszeg = input.value * ar;
        osszegElem.textContent = `${ujOsszeg} Ft`;

        // Frissítsük a mínusz gomb állapotát
        minusBtn.disabled = input.value <= 1;
    }
});


window.addEventListener("load", rendelesBetolt);
