async function felhasznaloLeker() {
    try {
        let keres = await fetch("../php/admin_felhasznLeker.php");
        if (keres.ok) {
            let valasz = await keres.json();
            valasz.sort((a, b) => {
                if (a.jogosultsag === "admin" && b.jogosultsag !== "admin") {
                    return -1;
                } else if (a.jogosultsag !== "admin" && b.jogosultsag === "admin") {
                    return 1;
                } else {
                    return 0;
                }
            });
            let felhasznaloDiv = document.getElementById("felhasznalok");
            felhasznaloDiv.innerHTML = ""; // Előző tartalom törlése

            for (const item of valasz) {
                let szamlalo = 0
                let kartya = document.createElement("div");
                kartya.className = "card mb-3";
                kartya.style.maxWidth = "100%";
                kartya.innerHTML = `
                    <div class="row g-0">
                        <div class="col-md-1 d-flex align-items-center justify-content-center">
                            <img src="${(item.jogosultsag == "admin" ? "../img/admin.png" : "../img/users.png")}" class="img-fluid rounded-start" alt="Felhasználó ikon">
                        </div>
                        <div class="col-md-11">
                            <div class="card-body row">
                                <div class="col-md-3 col-12">
                                    <h3>Személyes adatok</h3>
                                    <form>
                                        <label for="nev">Név</label>
                                        <input type="text" class="form-control szerkesztheto" value="${item.nev}" disabled>
                                        <label for="email">Email</label>
                                        <input type="text" class="form-control" value="${item.email}" disabled>
                                        <label for="telefonszam">Telefonszám</label>
                                        <input type="text" class="form-control szerkesztheto" value="${item.telefonszam}" disabled>
                                    </form>
                                </div>
                                <div class="col-md-3 col-12">
                                    <h3>Szállítási adatok</h3>
                                    <form>
                                        <label for="sziranyitoszam">Irányítószám</label>
                                        <input type="number" class="form-control szerkesztheto" value="${item.sziranyitoszam}" disabled>
                                        <label for="sztelepules">Település</label>
                                        <input type="text" class="form-control szerkesztheto" value="${item.sztelepules}" disabled>
                                        <label for="szutcahazszam">Utca, házszám</label>
                                        <input type="text" class="form-control szerkesztheto" value="${item.szutcahazszam}" disabled>
                                    </form>
                                </div>
                                <div class="col-md-3 col-12">
                                    <h3>Számlázási adatok</h3>
                                    <form>
                                        <label for="iranyitoszam">Irányítószám</label>
                                        <input type="number" class="form-control szerkesztheto" value="${item.iranyitoszam}" disabled>
                                        <label for="telepules">Település</label>
                                        <input type="text" class="form-control szerkesztheto" value="${item.telepules}" disabled>
                                        <label for="utca_hazszam">Utca, házszám</label>
                                        <input type="text" class="form-control szerkesztheto" value="${item.utca_hazszam}" disabled>
                                    </form>
                                </div>
                                <div class="col-md-3 col-12">
                                    <h3>Jogosultság</h3>
                                    <div class="form-check">
                                        <input class="form-check-input szerkesztheto" type="radio" name="jogosultsag_${item.nev}" value="admin" id="admin_jog_${item.nev}" ${item.jogosultsag === "admin" ? "checked" : ""} disabled>
                                        <label class="form-check-label" for="admin_jog_${item.nev}">
                                            Admin
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input szerkesztheto" type="radio" name="jogosultsag_${item.nev}" value="felhasználó" id="felhaszn_jog_${item.nev}" ${item.jogosultsag !== "admin" ? "checked" : ""} disabled>
                                        <label class="form-check-label" for="felhaszn_jog_${item.nev}">
                                            Felhasználó
                                        </label>
                                    </div>
                                </div>

                            </div>
                            </div>
                            <div class="text-end p-3">
                            <button class="btn btn-outline-secondary modositas-gomb">
                                <img src="../img/pencil.png" alt="Módosítás" width="30">
                            </button>
                            <button class="btn btn-outline-success mentés-gomb d-none">
                                <img src="../img/save.png" alt="Mentés" width="30">
                            </button>
                            <button class="btn btn-outline-secondary vissza-gomb d-none">
                                <img src="../img/back.png" alt="Vissza" width="30">
                            </button>
                            <button class="btn btn-outline-danger torles-gomb ${(item.jogosultsag != "admin") ? "" : "d-none"}" data-id="${item.email}">
                                <img src="../img/delete.png" alt="Törlés" width="30">
                            </button>
                        </div>

                        </div>
                    </div>
                `;

                felhasznaloDiv.appendChild(kartya);

                let modositasGomb = kartya.querySelector(".modositas-gomb");
                let mentesGomb = kartya.querySelector(".mentés-gomb");
                let visszaGomb = kartya.querySelector(".vissza-gomb");
                let inputMezok = kartya.querySelectorAll(".szerkesztheto");

                let eredetiAdatok = Array.from(inputMezok).map(input => input.value);

                modositasGomb.addEventListener("click", function () {
                    inputMezok.forEach(input => input.disabled = false);
                    modositasGomb.classList.add("d-none");
                    mentesGomb.classList.remove("d-none");
                    visszaGomb.classList.remove("d-none");
                });

                mentesGomb.addEventListener("click", async function () {
                    const kartya = this.closest(".card");
                    const nev = kartya.querySelector('input[name^="jogosultsag_"]').name.split("_")[1];
                    const checkedRadio = kartya.querySelector(`input[name="jogosultsag_${nev}"]:checked`);
                    const jogosultsag = checkedRadio ? checkedRadio.value : null;

                    let adatok = {
                        email: item.email,
                        nev: inputMezok[0].value,
                        telefonszam: inputMezok[1].value,
                        sziranyitoszam: inputMezok[2].value,
                        sztelepules: inputMezok[3].value,
                        szutcahazszam: inputMezok[4].value,
                        iranyitoszam: inputMezok[5].value,
                        telepules: inputMezok[6].value,
                        utca_hazszam: inputMezok[7].value,
                        jogosultsag:jogosultsag

                    };

                    let mentesSikeres = await felhasznaloModosit(adatok);
                    console.log(mentesSikeres)
                    if (mentesSikeres.success) {
                        showToast(mentesSikeres.message, "success");
                        inputMezok.forEach(input => input.disabled = true);
                        modositasGomb.classList.remove("d-none");
                        mentesGomb.classList.add("d-none");
                        visszaGomb.classList.add("d-none");
                        felhasznaloLeker()
                    } else {
                        showToast(mentesSikeres.message, "info");
                        felhasznaloLeker()
                    }

                });

                visszaGomb.addEventListener("click", function () {
                    inputMezok.forEach((input) => {
                        input.disabled = true;
                    });
                    modositasGomb.classList.remove("d-none");
                    mentesGomb.classList.add("d-none");
                    visszaGomb.classList.add("d-none");
                });

                let torlendoEmail = null;

                kartya.querySelector(".torles-gomb").addEventListener("click", function () {
                    torlendoEmail = this.getAttribute("data-id");

                    let modal = new bootstrap.Modal(document.getElementById("torlesModal"));
                    modal.show();
                });

                document.getElementById("megerositesTorles").addEventListener("click", async function () {
                    if (torlendoEmail) {
                        let torlesSikeres = await felhasznaloTorles(torlendoEmail);
                        if (torlesSikeres.success) {
                            showToast(torlesSikeres.message, "success");
                            document.getElementById("torlesModal").querySelector(".btn-close").click();
                            felhasznaloLeker(); // Frissíti a listát
                        } else {
                            showToast(torlesSikeres.message, "danger");
                        }
                        torlendoEmail = null;
                    }
                });



            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function felhasznaloModosit(adatok) {
    try {
        let keres = await fetch("../php/felhasznalo_modositas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adatok)
        });

        let valasz = await keres.json();
        return valasz;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function felhasznaloTorles(emailcim) {
    try {
        let keres = await fetch("../php/felhasznalo_torles.php", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailcim
            })
        });

        let valasz = await keres.json();
        return valasz;
    } catch (error) {
        console.log(error);
        return false;
    }
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


window.addEventListener("load", felhasznaloLeker);