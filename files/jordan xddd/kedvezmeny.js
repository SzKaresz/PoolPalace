document.getElementById("kategoria_select").addEventListener("change", async function () {
    let kategoriaID = document.getElementById("kategoria_select").value;
    if (!kategoriaID) {
        alert("Válassz egy kategóriát!");
        return;
    }

    try {
        let keres = await fetch("../php/admin_modositas_termekek.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": kategoriaID })
        });
        let valasz = await keres.json();
        console.log(valasz);
        if (valasz.status === "success") {
            document.getElementById("termek_select").innerHTML="<option value=''>Válassz Terméket...</option>";
            for (const item of valasz.termek) {
                document.getElementById("termek_select").innerHTML += `
                    <option value ="${item.cikkszam}">${item.cikkszam}-${item.nev}</option>
                `;
            }
        }
    }
    catch(error){
        console.log(error)
    }

})


document.getElementById("termek_select").addEventListener("change", async function () {
    let termekID = document.getElementById("termek_select").value;

    if (!termekID) {
        alert("Válassz egy terméket!");
        return;
    }

    try {
        let keres = await fetch("../php/admin_modositas_betoltes.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "id": termekID })
        });

        let valasz = await keres.json();
        console.log(valasz);

        if (valasz.status === "success") {
            document.getElementById("szerkeszto_form").innerHTML = `
                <div class="card p-3">
                    <h4>Termék módosítása</h4>
                    <label for="termek_nev" class="form-label">Termék neve:</label>
                    <input type="text" id="termek_nev" class="form-control" value="${valasz.termek.nev}" readonly>
                    
                   <div class="d-flex justify-content-between align-items-end">

                    <div class="w-50 me-2">
                        <label for="termek_ar" class="form-label">Egységár:</label>
                        <input type="number" id="termek_ar" class="form-control" value="${valasz.termek.egysegar}" readonly>
                    </div>
                    

                    <div class="w-25 text-end">
                        <div class="input-group">
                            <input type="number" id="akcio" class="form-control text-end" value="${valasz.termek.akcios_szazalek }">
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>

                    <label for="termek_akciosar" class="form-label">Akciós ár:</label>
                    <input type="number" id="termek_akciosar" class="form-control" readonly>

                   
                    <input type="submit" id="mentes_gomb" class="btn btn-success mt-3" value = "Mentés">
                </div>
            `;

            document.getElementById("akcio").addEventListener('change', function(){
                document.getElementById("termek_akciosar").value = Math.round(valasz.termek.egysegar*((100-document.getElementById("akcio").value)/100));
            })

            document.getElementById("mentes_gomb").addEventListener("click", async function () {
               let szazelek = document.getElementById("akcio").value;

                let updateKeres = await fetch("../php/admin_kedvezmeny_mentes.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "cikkszam": termekID, "ackios_szazalek":szazelek })
                });

                let updateValasz = await updateKeres.json();
                document.getElementById("szerkeszto_form").innerHTML += `<div class="alert alert - success" role="alert">${updateValasz.message}</div>`
            });

        } else {
            document.getElementById("szerkeszto_form").innerHTML += `<div class="alert alert - danger" role="alert">Hiba: ${updateValasz.message}</div>`

        }

    } catch (error) {
        console.log(error)
    }
});
