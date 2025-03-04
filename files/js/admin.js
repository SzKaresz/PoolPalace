var termekAdatok;
var torlendo_cikkszam
window.addEventListener("load", async function () {
    try {
        let keres = await fetch("../php/admin_adatleker.php");
        if (keres.ok) {
            let adat = await keres.json();
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
                    <td><input type="text" class="form-control" id="akciosar" value="${(item.akcios_ar==-1)?'':item.akcios_ar}" disabled></td>
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
                    mentesBtn.type = 'button';
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

            document.querySelectorAll('.torles').forEach(button => {
                button.addEventListener('click', function (event) {
                    let row = event.target.closest('tr');
                    torlendo_cikkszam={
                        cikkszam: row.querySelector('#cikkszam').value
                    }
                    createConfirmModal(torlendo_cikkszam.cikkszam, row);
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
});

async function adatMentes() {
    let keres = await fetch("../php/admin_modositas_mentes.php", ({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(termekAdatok)
    }))
    let valasz = await keres.json();
    var szin =(valasz.message=="A termék frissítve!")?"success":"danger"

    createModal(valasz.message, szin)

}

async function adatTorles() {
    let keres = await fetch("../php/admin_torles.php", ({
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(torlendo_cikkszam)
    }))
    let valasz = await keres.json();
    var szin =(valasz.message=="A törlés sikeres!")?"success":"danger"
    createModal(valasz.message, szin)

}


function createModal(eredmeny, szin) {
    const modalHTML = `
    <div class="modal fade " id="dynamicModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content ">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Információ</h5>
                </div>
                <div class="modal-body bg-${szin}">
                    ${eredmeny}
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    var myModal = new bootstrap.Modal(document.getElementById('dynamicModal'));

    myModal.show();

    setTimeout(function () {
        myModal.hide();

        document.getElementById('dynamicModal').remove();
        window.location.reload(); 
    }, 3000); 
}

function createConfirmModal(cikkszam, row) {
    const confirmModalHTML = `
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Biztos, hogy törölni szeretnéd?</h5>
                </div>
                <div class="modal-body">
                    Törlés nem vonható vissza! Biztosan törölni szeretnéd a(z) ${cikkszam} cikkszámú terméket?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Törlés</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', confirmModalHTML);

    var myConfirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    myConfirmModal.show();

    document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
        torlendo_cikkszam = { cikkszam: cikkszam };
        adatTorles();

        myConfirmModal.hide();
        setTimeout(function () {
            document.getElementById('confirmModal').remove();
        }, 500); 
    });

    document.querySelector('[data-bs-dismiss="modal"]').addEventListener('click', function () {
        myConfirmModal.hide();
        setTimeout(function () {
            document.getElementById('confirmModal').remove();
        }, 500);
    });
}