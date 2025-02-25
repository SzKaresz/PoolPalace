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
            document.getElementById("termek_select").innerHTML=""
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


document.getElementById("modositas_gomb").addEventListener("click", async function () {
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
                    <input type="text" id="termek_nev" class="form-control" value="${valasz.termek.nev}">
                    
                    <label for="termek_ar" class="form-label">Egységár:</label>
                    <input type="text" id="termek_ar" class="form-control" value="${valasz.termek.egysegar}">

                    <label for="termek_ar" class="form-label">Leírás:</label>
                    <textarea id="leiras" class="form-control" >${valasz.termek.leiras}</textarea>


                    <input type="submit" id="mentes_gomb" class="btn btn-success mt-3" value = "Mentés">
                </div>
            `;

            document.getElementById("mentes_gomb").addEventListener("click", async function () {
                let ujNev = document.getElementById("termek_nev").value;
                let ujAr = document.getElementById("termek_ar").value;
                let ujLeiras = document.getElementById("leiras").value;

                let updateKeres = await fetch("../php/admin_modositas_mentes.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ "cikkszam": termekID, "nev": ujNev, "egysegar": ujAr, "leiras": ujLeiras })
                });

                let updateValasz = await updateKeres.json();
                document.getElementById("szerkeszto_form").innerHTML += `<div class="alert alert - success" role="alert">${updateValasz.message}</div>`
            });

        } else {
            document.getElementById("szerkeszto_form").innerHTML += `<div class="alert alert - danger" role="alert">Hiba: ${updateValasz.message}</div>`

        }

    } catch (error) {
        document.getElementById("szerkeszto_form").innerHTML += `<div class="alert alert - danger" role="alert">Fetch hiba: ${updateValasz.message}</div>`
    }
});
