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
                accordFeltolt(item.id)
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
            console.log(valasz)
            for (const item of valasz) {
                if (item.megrendeles_id == id) {
                    document.getElementById(`accord_body_${id}`).innerHTML += `
    <table class="table table-striped mt-2">
        <thead>
            <tr>
                <th>Termék cikkszám</th>
                <th>Termék db</th>
                <th>Termék ára</th>
                <th>Összeg</th>
            </tr>
        </thead>
        <tbody>
            ${valasz.map(item => `
                <tr>
                    <td>${item.cikkszam}</td>
                    <td>${item.db}</td>
                    <td>${item.ar} Ft</td>
                    <td>${item.db * item.ar} Ft</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
`;

                }
            }
        } else {
            console.log("Hiba történt a lekérdezés során.");
        }
    } catch (error) {
        console.log(error);
    }
}


window.addEventListener("load", rendelesBetolt);
