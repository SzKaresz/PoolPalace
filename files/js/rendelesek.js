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
            </tr>
        </thead>
        <tbody>
        ${valasz.map(item => {
            let ar = (item.akcios_ar == -1) ? item.egysegar : item.akcios_ar;
            let osszeg = item.darabszam * ar; // Kezdeti összeg
        
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
            </tr>`;}).join('')}
        
        </tbody>
    </table>
`;
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
