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
                        <button class="btn btn-outline-secondary modositas-gomb modosit">
                                <img src="../img/pencil.png" alt="Módosítás" width="30">
                        </button>
                        <button class="btn btn-outline-danger torles-gomb torles">
                                <img src="../img/delete.png" alt="Törlés" width="30">
                        </button>
                        <button class="btn btn-outline-info kep-gomb kepek">
                                <img src="../img/gallery.png" alt="Képek" width="30">
                        </button>
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
            mentesBtn.classList.add('btn', 'btn-outline-success', 'mentés-gomb');

            // Kép létrehozása és hozzáadása a gombhoz
            let imgm = document.createElement('img');
            imgm.src = '../img/save.png';
            imgm.alt = 'Mentés';
            imgm.width = 30;

            mentesBtn.appendChild(imgm);

            let megseBtn = document.createElement('button');
            megseBtn.type = 'button';
            megseBtn.classList.add('btn', 'btn-outline-secondary', 'vissza-gomb');
            let img = document.createElement('img');
            img.src = '../img/back.png';
            img.alt = 'Vissza';
            img.width = 30;

            megseBtn.appendChild(img)


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
            console.log(torlesSikeres)
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

    document.querySelectorAll(".kep-gomb").forEach(button => {
        button.addEventListener("click", async function (event) {
            let row = event.target.closest('tr');
            let cikkszam = row.querySelector('#cikkszam').value;

            let modal = new bootstrap.Modal(document.getElementById('kepModal'));
            modal.show();

            try {
                let response = await fetch(`../php/keplekeres.php?cikkszam=${cikkszam}`);
                let kepek = await response.json();

                let carouselImages = document.getElementById("carouselImages");
                let carouselThumbnails = document.getElementById("carouselThumbnails");

                carouselImages.innerHTML = "";
                carouselThumbnails.innerHTML = "";

                kepek.forEach((kepUrl, index) => {
                    if (kepUrl && kepUrl.trim() !== "") {
                        let activeClass = index === 0 ? 'active' : 'n';
                
                        let item = document.createElement("div");
                        item.classList.add("carousel-item", activeClass);
                
                        // Kép létrehozása
                        let imgElem = document.createElement("img");
                        imgElem.src = kepUrl;
                        imgElem.alt = "Termékkép";
                        imgElem.classList.add("d-block", "w-50", "product-main-image", "mx-auto");
                        item.appendChild(imgElem);
                
                        // Span és gomb létrehozása
                        let buttonSpan = document.createElement("span");
                        buttonSpan.classList.add("position-absolute", "top-0", "end-0", "m-2", "d-flex", "justify-content-center", "align-items-center");
                
                        let button = document.createElement("button");
                        button.classList.add("btn", "btn-light", "border", "rounded-circle", "p-2", "d-flex", "align-items-center", "justify-content-center");
                
                        // Remove ikon létrehozása
                        let removeIcon = document.createElement("img");
                        removeIcon.src = "../img/remove.png";  // A remove.png kép elérési útja
                        removeIcon.alt = "Törlés";
                        removeIcon.style.width = "20px";  // A kép méretének beállítása
                        removeIcon.style.height = "20px"; // A kép magasságának beállítása
                
                        button.appendChild(removeIcon); // A remove.png képet hozzáadjuk a gombhoz
                        buttonSpan.appendChild(button);
                        item.appendChild(buttonSpan); // Gomb hozzáadása a képhez
                
                        carouselImages.appendChild(item);
                    }
                });
                

                let addItem = document.createElement("div");
                addItem.classList.add("carousel-item");

                let addButtonContainer = document.createElement("div");
                addButtonContainer.classList.add("d-flex", "justify-content-center", "align-items-center", "upload");


                let addButton = document.createElement("button");
                addButton.classList.add("btn", "btn-light", "border", "rounded-circle", "d-flex", "align-items-center", "justify-content-center");
                addButton.style.width = "100px";
                addButton.style.height = "100px";
                addButton.id = "kepfeltolt"

                let addIcon = document.createElement("img");
                addIcon.src = "../img/upload.png";
                addIcon.alt = "Feltöltés";
                addIcon.style.width = "60px";
                addIcon.style.height = "60px";

                addButton.appendChild(addIcon);
                addButtonContainer.appendChild(addButton);
                addItem.appendChild(addButtonContainer);
                carouselImages.appendChild(addItem);

                addButton.addEventListener("click", function () {
                    let fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.multiple = true;

                    fileInput.addEventListener("change", async function (event) {
                        let files = event.target.files;
                        if (files.length > 0) {
                            let formData = new FormData();


                            for (let file of files) {
                                formData.append("kepek[]", file);
                            }

                            try {
                                let response = await fetch("../php/kepfeltolt.php", {
                                    method: "POST",
                                    body: formData
                                });

                                if (response.ok) {
                                    console.log("Fájlok sikeresen feltöltve");
                                    let cikkszam = row.querySelector('#cikkszam').value;
                                    let updatedResponse = await fetch(`../php/keplekeres.php?cikkszam=${cikkszam}`);
                                    let updatedKepek = await updatedResponse.json();


                                    carouselImages.innerHTML = "";
                                    carouselThumbnails.innerHTML = "";

                                    updatedKepek.forEach((kepUrl, index) => {
                                        if (kepUrl && kepUrl.trim() !== "") {
                                            let activeClass = index === 0 ? 'active' : 'n';

                                            let item = document.createElement("div");
                                            item.classList.add("carousel-item", activeClass);

                                            let imgElem = document.createElement("img");
                                            imgElem.src = kepUrl;
                                            imgElem.alt = "Termékkép";
                                            imgElem.classList.add("d-block", "w-50", "product-main-image", "mx-auto");
                                            item.appendChild(imgElem);
                                            carouselImages.appendChild(item);

                                            let thumbnail = document.createElement("img");
                                            thumbnail.src = kepUrl;
                                            thumbnail.alt = "Bélyegkép " + (index + 1);
                                            thumbnail.classList.add("img-thumbnail", "thumbnail-item");
                                            thumbnail.setAttribute("data-bs-target", "#productCarousel");
                                            thumbnail.setAttribute("data-bs-slide-to", index);
                                            thumbnail.setAttribute("aria-label", "Dia " + (index + 1));
                                            carouselThumbnails.appendChild(thumbnail);
                                        }
                                    });
                                } else {
                                    console.log("Hiba történt a fájlok feltöltésekor");
                                }
                            } catch (error) {
                                console.error("Hiba történt a fájlok feltöltésekor:", error);
                            }
                        }
                    });

                    fileInput.click(); // Kattintásra aktiválja a fájlkezelőt
                });



            } catch (error) {
                console.error("Hiba történt a képek betöltésekor:", error);
            }
        });
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
    console.log(torlendo_cikkszam)
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