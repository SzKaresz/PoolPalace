var termekAdatok;
var torlendo_cikkszam;
var eredetiAdatok = [];
window.addEventListener("load", async function () {
    try {
        let keres = await fetch("../php/admin_adatleker.php");
        if (keres.ok) {
            let adat = await keres.json();
            eredetiAdatok = [...adat]; // Eredeti adatok mentése
            megjelenitTermekek(adat);
        }
    } catch (error) {
        console.log(error);
    }
});


document.getElementById("keresomezo").addEventListener("input", function () {
    let keresesiErtek = this.value.toLowerCase().trim(); // Levágja a felesleges szóközöket

    if (keresesiErtek === "") {
        megjelenitTermekek(eredetiAdatok); // Ha üres, visszaáll az alaphelyzet
        return;
    }

    let szurtAdatok = eredetiAdatok.filter(item =>
        item.cikkszam.toString().includes(keresesiErtek) ||
        item.nev.toLowerCase().includes(keresesiErtek)
    );

    megjelenitTermekek(szurtAdatok);
});


function megjelenitTermekek(adat) {
    var tartalom = document.getElementById("tartalom");
    tartalom.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Cikkszám</th>
                        <th scope="col">Név</th>
                        <th scope="col">Egységár</th>
                        <th scope="col">Akciós ár</th>
                        <th scope="col">Leírás</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="tablebody">
                </tbody>
            </table>`;
    var tablebody = document.getElementById("tablebody");

    for (const item of adat) {
        tablebody.innerHTML += `<tr>
                    <td><input type="number" class="form-control" id="cikkszam" value="${item.cikkszam}" disabled></td>
                    <td><input type="text" class="form-control" id="nev" value="${item.nev}" disabled></td>
                    <td><input type="text" class="form-control" id="egysegar" value="${item.egysegar}" disabled></td>
                    <td><input type="text" class="form-control" id="akciosar" value="${(item.akcios_ar == -1) ? '' : item.akcios_ar}" disabled></td>
                    <td><input type="textarea" class="form-control" id="leiras" value="${item.leiras}" disabled></td>
                    <td>
                        <button type="button" class="btn btn-secondary modosit w-75">Módosítás</button>
                        <button type="button" class="btn btn-danger torles w-75">Törlés</button>
                    </td>
                </tr>`;
    }

    document.querySelectorAll('.modosit').forEach(button => {
        button.addEventListener('click', function (event) {
            let row = event.target.closest('tr');
            row.querySelectorAll('input').forEach(input => input.removeAttribute('disabled'));

            let modositBtn = row.querySelector('.modosit');
            let torlesBtn = row.querySelector('.torles');

            let mentesBtn = document.createElement('button');
            mentesBtn.type = 'submit';
            mentesBtn.classList.add('btn', 'btn-success', 'w-75');
            mentesBtn.textContent = 'Mentés';

            let megseBtn = document.createElement('button');
            megseBtn.type = 'button';
            megseBtn.classList.add('btn', 'btn-secondary', 'w-75');
            megseBtn.textContent = 'Mégse';

            row.querySelector('td:last-child').innerHTML = '';
            row.querySelector('td:last-child').appendChild(mentesBtn);
            row.querySelector('td:last-child').appendChild(megseBtn);

            megseBtn.addEventListener('click', function () {
                row.querySelectorAll('input').forEach(input => input.setAttribute('disabled', true));

                row.querySelector('td:last-child').innerHTML = '';
                row.querySelector('td:last-child').appendChild(modositBtn);
                row.querySelector('td:last-child').appendChild(torlesBtn);
            });

            mentesBtn.addEventListener('click', function () {
                termekAdatok = {
                    cikkszam: row.querySelector('#cikkszam').value,
                    nev: row.querySelector('#nev').value,
                    egysegar: row.querySelector('#egysegar').value,
                    akciosar: row.querySelector('#akciosar').value,
                    leiras: row.querySelector('#leiras').value,
                    // kategoria: row.querySelector('#kategoria').value,
                    // gyarto: row.querySelector('#gyarto').value
                };
                adatMentes()

            });
        });
    });

    var torlendo_cikkszam

    document.querySelectorAll('.torles').forEach(button => {
        button.addEventListener('click', function (event) {
            let row = event.target.closest('tr');
            torlendo_cikkszam = {
                cikkszam: row.querySelector('#cikkszam').value
            }
            let modal = new bootstrap.Modal(document.getElementById("torlesModal"));
            modal.show();
        });
    });

    document.getElementById("megerositesTorles").addEventListener("click", async function () {
        if (torlendo_cikkszam) {
            let torlesSikeres = await adatTorles(torlendo_cikkszam);
            document.getElementById("torlesModal").querySelector(".btn-close").click(); // Modal bezárása

            if (torlesSikeres.success) {
                showToast(torlesSikeres.message, "success");
                window.location.reload(); // Frissíti az oldalt
            } else {
                showToast(torlesSikeres.message, "danger");
            }
            torlendo_cikkszam = null;
        }
    });
}

async function adatMentes() {
    let keres = await fetch("../php/admin_modositas_mentes.php", ({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(termekAdatok)
    }))
    let valasz = await keres.json();
    var szin = (valasz.message == "A termék frissítve!") ? "success" : "danger"

    showToast(valasz.message, szin)
    console.log(valasz)
    return valasz;

}

async function adatTorles(torlendo_cikkszam) {
    let keres = await fetch("../php/admin_torles.php", ({
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(torlendo_cikkszam)
    }))
    let valasz = await keres.json();
    var szin = (valasz.message == "A törlés sikeres!") ? "success" : "danger"
    showToast(valasz.message, szin)

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

    // Bootstrap toast inicializálás
    let toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();

    // Toast automatikus eltüntetése 3 másodperc után
    setTimeout(() => {
        toast.remove();
        if (type == "success") {
            window.location.reload();
        }
    }, 3000);

}