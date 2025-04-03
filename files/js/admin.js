var termekAdatok;
var torlendo_cikkszam;
var eredetiAdatok = [];
let leirasModalInstance = null;
let targetLeirasInput = null;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        let keres = await fetch("../php/admin_adatleker.php");
        if (keres.ok) {
            let adat = await keres.json();
            eredetiAdatok = [...adat];
            megjelenitTermekek(adat);

            const leirasModalElement = document.getElementById('leirasModal');
            if (leirasModalElement) {
                leirasModalInstance = new bootstrap.Modal(leirasModalElement);

                const leirasTextarea = document.getElementById('leirasTextarea');
                const leirasMenteseBtn = document.getElementById('leirasMenteseBtn');
                const leirasTartalomTorlesBtn = document.getElementById('leirasTartalomTorlesBtn');

                if (leirasMenteseBtn) {
                    leirasMenteseBtn.addEventListener('click', function () {
                        if (targetLeirasInput && leirasTextarea) {
                            targetLeirasInput.value = leirasTextarea.value;
                        }
                        if (leirasModalInstance) leirasModalInstance.hide();
                        targetLeirasInput = null;
                    });
                }

                if (leirasTartalomTorlesBtn && leirasTextarea) {
                    leirasTartalomTorlesBtn.addEventListener('click', function () {
                        leirasTextarea.value = '';
                    });
                }

                leirasModalElement.addEventListener('hidden.bs.modal', function () {
                    targetLeirasInput = null;
                });
            }

        } else {
            console.error("Hiba az adatok lekérésekor:", keres.status);
        }
    } catch (error) {
        console.error("Hálózati vagy feldolgozási hiba:", error);
    }

    const keresomezo = document.getElementById("keresomezo");
    if (keresomezo) {
        keresomezo.addEventListener("input", function () {
            let keresesiErtek = this.value.toLowerCase().trim();
            let szurtAdatok = eredetiAdatok.filter(item =>
                keresesiErtek === "" ||
                item.cikkszam.toString().toLowerCase().includes(keresesiErtek) ||
                item.nev.toLowerCase().includes(keresesiErtek) ||
                (item.leiras && item.leiras.toLowerCase().includes(keresesiErtek))
            );
            megjelenitTermekek(szurtAdatok);
        });
    }

    const megerositesTorlesBtn = document.getElementById("megerositesTorles");
    if (megerositesTorlesBtn) {
        megerositesTorlesBtn.addEventListener("click", async function () {
            if (torlendo_cikkszam) {
                let torlesEredmeny = await adatTorles(torlendo_cikkszam);
                const torlesModalElement = document.getElementById("torlesModal");
                if (torlesModalElement) {
                    const torlesModalInstance = bootstrap.Modal.getInstance(torlesModalElement);
                    if (torlesModalInstance) torlesModalInstance.hide();
                }

                if (torlesEredmeny.success) {
                    showToast(torlesEredmeny.message || "A törlés sikeres!", "success");
                    const rowToRemove = document.getElementById(`row-${torlendo_cikkszam.cikkszam}`);
                    if (rowToRemove) rowToRemove.remove();
                    eredetiAdatok = eredetiAdatok.filter(item => item.cikkszam.toString() !== torlendo_cikkszam.cikkszam.toString());
                } else {
                    showToast(torlesEredmeny.message || "Hiba történt a törlés során.", "danger");
                }
                torlendo_cikkszam = null;
            }
        });
    }
});

function megjelenitTermekek(adat) {
    var tartalom = document.getElementById("tartalom");
    if (!tartalom) return;

    tartalom.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Cikkszám</th>
                        <th scope="col">Név</th>
                        <th scope="col">Egységár</th>
                        <th scope="col">Akciós ár</th>
                        <th scope="col">Leírás</th>
                        <th scope="col" class="text-end">Műveletek</th>
                    </tr>
                </thead>
                <tbody id="tablebody">
                </tbody>
            </table>
        </div>`;
    var tablebody = document.getElementById("tablebody");
    if (!tablebody) return;

    tablebody.innerHTML = '';

    if (adat.length === 0) {
        tablebody.innerHTML = '<tr><td colspan="6" class="text-center">Nincsenek megjeleníthető termékek.</td></tr>';
        return;
    }

    for (const item of adat) {
        const rowId = `row-${item.cikkszam}`;

        tablebody.innerHTML += `
            <tr id="${rowId}">
                <td><input type="number" class="form-control" id="cikkszam-${item.cikkszam}" value="${item.cikkszam}" readonly></td>
                <td><input type="text" class="form-control" id="nev-${item.cikkszam}" value="${item.nev}" readonly></td>
                <td><input type="number" class="form-control" id="egysegar-${item.cikkszam}" value="${item.egysegar}" readonly></td>
                <td><input type="number" class="form-control" id="akciosar-${item.cikkszam}" value="${(item.akcios_ar == -1 || item.akcios_ar == null) ? '' : item.akcios_ar}" readonly></td>
                <td><input type="text" class="form-control leiras-input" id="leiras-${item.cikkszam}" value="${item.leiras || ''}" readonly style="cursor: default;"></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary modositas-gomb modosit" title="Módosítás">
                         <img src="../img/pencil.png" alt="Módosítás" width="20">
                    </button>
                    <button class="btn btn-sm btn-outline-danger torles-gomb torles" title="Törlés">
                         <img src="../img/delete.png" alt="Törlés" width="20">
                    </button>
                    <button class="btn btn-sm btn-outline-info kep-gomb kepek" title="Képek">
                          <img src="../img/gallery.png" alt="Képek" width="20">
                    </button>
                </td>
            </tr>`;
    }

    tablebody.addEventListener('click', function (event) {
        const target = event.target;
        const button = target.closest('button');
        const row = target.closest('tr');
        if (!row) return;

        const cikkszam = row.id.split('-')[1];

        if (button && button.classList.contains('modosit')) {
            handleModositasClick(row, cikkszam, button);
        }
        else if (button && button.classList.contains('torles')) {
            torlendo_cikkszam = { cikkszam: cikkszam };
            const torlesModal = document.getElementById("torlesModal");
            if (torlesModal) {
                const modal = new bootstrap.Modal(torlesModal);
                modal.show();
            }
        }
        else if (button && button.classList.contains('kepek')) {
            handleKepekClick(cikkszam);
        }
        else if (target.classList.contains('leiras-input') && target.dataset.clickable === 'true') {
            targetLeirasInput = target;
            const leirasTextarea = document.getElementById('leirasTextarea');
            if (leirasTextarea) leirasTextarea.value = target.value;
            if (leirasModalInstance) leirasModalInstance.show();
        }
        else if (button && button.classList.contains('mentés-gomb')) {
            handleMentesClick(row, cikkszam, button);
        }
        else if (button && button.classList.contains('vissza-gomb')) {
            handleMegseClick(row, cikkszam, button);
        }
    });
}

function handleModositasClick(row, cikkszam, modositButton) {
    const leirasInput = row.querySelector(`#leiras-${cikkszam}`);
    const buttonCell = row.querySelector('td:last-child');
    const eredetiGombokHTML = buttonCell.innerHTML;

    row.querySelectorAll('input').forEach(input => {
        if (input.id !== `cikkszam-${cikkszam}` && input.id !== `leiras-${cikkszam}`) {
            input.readOnly = false;
        }
    });

    if (leirasInput) {
        leirasInput.style.cursor = 'pointer';
        leirasInput.dataset.clickable = 'true';
    }

    buttonCell.innerHTML = `
        <button type="button" class="btn btn-sm btn-outline-success mentés-gomb" title="Mentés">
             <img src="../img/save.png" alt="Mentés" width="20">
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary vissza-gomb" title="Mégse">
             <img src="../img/back.png" alt="Vissza" width="20">
        </button>
    `;

    row.dataset.originalButtons = eredetiGombokHTML;
}

function handleMegseClick(row, cikkszam, megseButton) {
    const leirasInput = row.querySelector(`#leiras-${cikkszam}`);
    const buttonCell = row.querySelector('td:last-child');

    row.querySelectorAll('input').forEach(input => {
        input.readOnly = true;
    });

    if (leirasInput) {
        leirasInput.style.cursor = 'default';
        delete leirasInput.dataset.clickable;
    }

    if (row.dataset.originalButtons) {
        buttonCell.innerHTML = row.dataset.originalButtons;
        delete row.dataset.originalButtons;
    }
}
async function handleMentesClick(row, cikkszam, mentesButton) {
    const buttonCell = row.querySelector('td:last-child');

    termekAdatok = {
        cikkszam: row.querySelector(`#cikkszam-${cikkszam}`).value,
        nev: row.querySelector(`#nev-${cikkszam}`).value,
        egysegar: row.querySelector(`#egysegar-${cikkszam}`).value,
        akciosar: row.querySelector(`#akciosar-${cikkszam}`).value || -1,
        leiras: row.querySelector(`#leiras-${cikkszam}`).value,
    };

    mentesButton.disabled = true;
    mentesButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const mentesEredmeny = await adatMentes(termekAdatok);

    mentesButton.disabled = false;

    if (mentesEredmeny.status=="success") {
        row.querySelectorAll('input').forEach(input => {
            input.readOnly = true;
        });
        const leirasInput = row.querySelector(`#leiras-${cikkszam}`);
        if (leirasInput) {
            leirasInput.style.cursor = 'default';
            delete leirasInput.dataset.clickable;
        }

        // Az eredeti gombok visszaállítása
        if (row.dataset.originalButtons) {
            buttonCell.innerHTML = row.dataset.originalButtons;
            delete row.dataset.originalButtons;
        }

        const index = eredetiAdatok.findIndex(item => item.cikkszam.toString() === cikkszam.toString());
        if (index > -1) {
            eredetiAdatok[index] = { ...eredetiAdatok[index], ...termekAdatok, akcios_ar: termekAdatok.akciosar };
        }
    } else {
        mentesButton.innerHTML = '<img src="../img/save.png" alt="Mentés" width="20">';
    }
}


async function handleKepekClick(cikkszam) {
    const kepModalElement = document.getElementById('kepModal');
    if (!kepModalElement) {
        console.error("Kép modal elem (#kepModal) nem található!");
        return;
    }
    const kepModalInstance = bootstrap.Modal.getOrCreateInstance(kepModalElement);
    const carouselImages = document.getElementById("carouselImages");
    const carouselThumbnails = document.getElementById("carouselThumbnails");

    if (!carouselImages || !carouselThumbnails) {
        console.error("Carousel belső elemek (#carouselImages, #carouselThumbnails) nem találhatóak!");
        return;
    }

    carouselImages.innerHTML = '<div class="carousel-item active d-flex justify-content-center align-items-center" style="min-height: 200px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Töltés...</span></div></div>';
    carouselThumbnails.innerHTML = '';

    kepModalInstance.show();

    try {
        let response = await fetch(`../php/keplekeres.php?cikkszam=${cikkszam}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let kepek = await response.json();

        carouselImages.innerHTML = "";
        carouselThumbnails.innerHTML = "";

        let kepIndex = 0;

        if (kepek && Array.isArray(kepek) && kepek.length > 0) {
            kepek.forEach((kepUrl) => {
                if (kepUrl && typeof kepUrl === 'string' && kepUrl.trim() !== "") {

                    let item = document.createElement("div");
                    item.classList.add("carousel-item");
                    if (kepIndex === 0) {
                        item.classList.add('active');
                    }
                    item.dataset.imageUrl = kepUrl;

                    let imgContainer = document.createElement("div");
                    imgContainer.classList.add("position-relative");

                    let imgElem = document.createElement("img");
                    imgElem.src = kepUrl;
                    imgElem.alt = "Termékkép";
                    imgElem.classList.add("d-block", "product-main-image", "mx-auto");
                    imgContainer.appendChild(imgElem);

                    let deleteButton = document.createElement("button");
                    deleteButton.classList.add("btn", "btn-danger", "btn-sm", "position-absolute", "top-0", "end-0", "m-2");
                    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
                    deleteButton.title = "Kép törlése";
                    deleteButton.type = "button";
                    deleteButton.addEventListener("click", async function () {
                        await handleKepTorles(cikkszam, kepUrl, item, thumbnail);
                    });
                    imgContainer.appendChild(deleteButton);

                    item.appendChild(imgContainer);
                    carouselImages.appendChild(item);

                    let thumbnail = document.createElement("img");
                    thumbnail.src = kepUrl;
                    thumbnail.alt = "Bélyegkép " + (kepIndex + 1);
                    thumbnail.classList.add("thumbnail-item");
                    if (kepIndex === 0) {
                        thumbnail.classList.add("active");
                    }
                    thumbnail.setAttribute("data-bs-target", "#productCarousel");
                    thumbnail.setAttribute("data-bs-slide-to", kepIndex);
                    thumbnail.setAttribute("aria-label", "Dia " + (kepIndex + 1));

                    carouselThumbnails.appendChild(thumbnail);

                    kepIndex++;
                }
            });
        }

        if (kepIndex === 0) {
            carouselImages.innerHTML = '<div class="carousel-item active text-center p-5">Nincsenek képek ehhez a termékhez.</div>';
        }

        let addItem = document.createElement("div");
        addItem.classList.add("carousel-item");
        if (kepIndex === 0) {
            addItem.classList.add('active');
        }

        let addButtonContainer = document.createElement("div");
        addButtonContainer.classList.add("d-flex", "justify-content-center", "align-items-center", "upload");

        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/webp";
        fileInput.multiple = true;
        fileInput.style.display = "none";
        fileInput.id = `fileInput-${cikkszam}`;

        let addButtonLabel = document.createElement("label");
        addButtonLabel.htmlFor = `fileInput-${cikkszam}`;
        addButtonLabel.classList.add("btn", "btn-outline-primary", "d-flex", "flex-column", "align-items-center", "justify-content-center");
        addButtonLabel.style.width = "150px";
        addButtonLabel.style.height = "150px";
        addButtonLabel.style.cursor = "pointer";
        addButtonLabel.title = "Képek feltöltése (.webp)";

        let addIcon = document.createElement("i");
        addIcon.classList.add("fas", "fa-upload", "fa-3x", "mb-2");

        addButtonLabel.appendChild(addIcon);
        addButtonLabel.appendChild(document.createTextNode("Képek feltöltése (.webp)"));
        addButtonContainer.appendChild(addButtonLabel);
        addButtonContainer.appendChild(fileInput);
        addItem.appendChild(addButtonContainer);
        carouselImages.appendChild(addItem);

        fileInput.addEventListener("change", async function (event) {
            await handleKepFeltoltes(cikkszam, event.target.files);
            handleKepekClick(cikkszam);
        });

        const carouselElement = document.getElementById('productCarousel');
        if (carouselElement) {
            const existingCarouselInstance = bootstrap.Carousel.getInstance(carouselElement);
            if (existingCarouselInstance) {
                existingCarouselInstance.dispose();
            }
            const newCarouselInstance = new bootstrap.Carousel(carouselElement);
            newCarouselInstance.to(0);

            carouselElement.removeEventListener('slid.bs.carousel', handleCarouselSlide);
            carouselElement.addEventListener('slid.bs.carousel', handleCarouselSlide);
        }

    } catch (error) {
        console.error("Hiba történt a képek betöltésekor:", error);
        carouselImages.innerHTML = `<div class="carousel-item active text-center text-danger p-5">Hiba történt a képek betöltésekor. ${error.message}</div>`;
    }
}

function handleCarouselSlide(event) {
    const activeIndex = event.to;
    document.querySelectorAll('#carouselThumbnails .thumbnail-item').forEach(thumb => thumb.classList.remove('active'));
    const activeThumbnail = document.querySelector(`#carouselThumbnails .thumbnail-item[data-bs-slide-to="${activeIndex}"]`);
    if (activeThumbnail) activeThumbnail.classList.add('active');
}


async function handleKepFeltoltes(cikkszam, files) {
    if (!files || files.length === 0) return;

    let formData = new FormData();
    formData.append("cikkszam", cikkszam);
    let validFilesFound = false;
    for (let file of files) {
        if (file.type !== 'image/webp') {
            showToast(`Hibás fájltípus: ${file.name}. Csak .webp fájlok tölthetők fel.`, "warning");
            continue;
        }
        formData.append("kepek[]", file);
        validFilesFound = true;
    }

    if (!validFilesFound) {
        showToast("Nincsenek feltöltésre váró .webp fájlok.", "info");
        return;
    }


    showToast("Képek feltöltése folyamatban...", "info");

    const kepModalElement = document.getElementById('kepModal');
    if (kepModalElement) {
        const kepModalInstance = bootstrap.Modal.getInstance(kepModalElement);
        if (kepModalInstance) {
            kepModalInstance.hide();
        }
    }

    try {
        let response = await fetch("../php/kepfeltolt.php", {
            method: "POST",
            body: formData
        });
        let result = await response.json();

        if (response.ok && result.success) {
            showToast(result.message || "Képek sikeresen feltöltve!", "success");
        } else {
            throw new Error(result.message || "Ismeretlen hiba történt a feltöltés során.");
        }
    } catch (error) {
        console.error("Hiba történt a fájlok feltöltésekor:", error);
        showToast(`Hiba a feltöltéskor: ${error.message}`, "danger");
    }
}

async function handleKepTorles(cikkszam, kepUrl, carouselItemElem, thumbnailElem) {
    const filename = kepUrl.substring(kepUrl.lastIndexOf('/') + 1);
    if (!confirm(`Biztosan törölni szeretnéd ezt a képet: ${filename}?`)) {
        return;
    }

    try {
        let keres = await fetch("../php/keptorol.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cikkszam: cikkszam, fajlnev: filename })
        });
        let valasz = await keres.json();

        if (keres.ok && valasz.success) {
            showToast(valasz.message || "Kép sikeresen törölve.", "success");

            const kepModalElement = document.getElementById('kepModal');
            if (kepModalElement) {
                const kepModalInstance = bootstrap.Modal.getInstance(kepModalElement);
                if (kepModalInstance) {
                    kepModalInstance.hide();
                }
            }

            const wasActive = carouselItemElem.classList.contains('active');
            const carouselElement = document.getElementById('productCarousel');
            const carousel = bootstrap.Carousel.getInstance(carouselElement);
            const items = document.querySelectorAll('#carouselImages .carousel-item');
            const itemIndex = Array.from(items).indexOf(carouselItemElem);

            carouselItemElem.remove();
            if (thumbnailElem) thumbnailElem.remove();

            const remainingItems = document.querySelectorAll('#carouselImages .carousel-item:not(:last-child)');
            const remainingThumbnails = document.querySelectorAll('#carouselThumbnails .thumbnail-item');


            let newActiveIndex = -1;

            remainingThumbnails.forEach((thumb, index) => {
                thumb.setAttribute('data-bs-slide-to', index);
                thumb.setAttribute('aria-label', `Dia ${index + 1}`);
                thumb.classList.remove('active');

                if (wasActive && index === Math.max(0, itemIndex - 1) && remainingItems.length > 0) {
                    newActiveIndex = index;
                } else if (wasActive && itemIndex === 0 && index === 0 && remainingItems.length > 0) {
                    newActiveIndex = 0;
                }
            });


            if (remainingItems.length > 0) {
                if (newActiveIndex === -1 && wasActive) {
                    newActiveIndex = remainingItems.length - 1;
                } else if (newActiveIndex === -1 && !wasActive) {
                    const currentActive = document.querySelector('#carouselImages .carousel-item.active');
                    const currentActiveIndex = currentActive ? Array.from(remainingItems).indexOf(currentActive) : 0;
                    newActiveIndex = Math.max(0, currentActiveIndex);
                } else if (newActiveIndex === -1) {
                    newActiveIndex = 0;
                }

                remainingItems[newActiveIndex].classList.add('active');
                if (remainingThumbnails[newActiveIndex]) remainingThumbnails[newActiveIndex].classList.add('active');
                if (carousel) carousel.to(newActiveIndex);

            } else {
                const uploadItem = document.querySelector('#carouselImages .carousel-item:last-child');
                if (uploadItem) uploadItem.classList.add('active');
                if (carousel) carousel.to(0);
            }

            remainingItems.forEach((item, index) => {
                const slideButton = item.querySelector('[data-bs-slide-to]');
                if (slideButton) {
                    slideButton.setAttribute('data-bs-slide-to', index);
                }
            });


        } else {
            throw new Error(valasz.message || "Hiba történt a kép törlése közben.");
        }
    } catch (error) {
        console.error("Hiba a kép törlésekor:", error);
        showToast(`Hiba a kép törlésekor: ${error.message}`, "danger");
        const kepModalElement = document.getElementById('kepModal');
        if (kepModalElement) {
            const kepModalInstance = bootstrap.Modal.getInstance(kepModalElement);
            if (kepModalInstance) {
                kepModalInstance.hide();
            }
        }
    }
}


async function adatMentes(adatok) {
    try {
        let keres = await fetch("../php/admin_modositas_mentes.php", ({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(adatok)
        }));
        let valasz = await keres.json();
        console.log(valasz)
        let szin = (valasz.status =="success") ? "success" : "danger";
        showToast(valasz.message || (valasz.success ? "Sikeres mentés!" : "Mentés sikertelen!"), szin);
        return valasz;
    } catch (error) {
        console.error("Hiba az adatok mentésekor:", error);
        showToast("Hiba történt az adatok mentésekor.", "danger");
        return { success: false, message: "Hiba történt az adatok mentésekor." };
    }
}

async function adatTorles(torlendoAdat) {
    try {
        let keres = await fetch("../php/admin_torles.php", ({
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(torlendoAdat)
        }));
        let valasz = await keres.json();
        return valasz;
    } catch (error) {
        console.error("Hiba az adatok törlésekor:", error);
        showToast("Hiba történt az adatok törlésekor.", "danger");
        return { success: false, message: "Hiba történt az adatok törlésekor." };
    }
}

function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1056';
        document.body.appendChild(toastContainer);
    }

    const maxToasts = 3;
    while (toastContainer.children.length >= maxToasts) {
        toastContainer.removeChild(toastContainer.firstChild);
    }

    let toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.setAttribute("data-bs-autohide", "true");
    toast.setAttribute("data-bs-delay", "4000");

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Bezárás"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    try {
        let toastInstance = new bootstrap.Toast(toast);
        toastInstance.show();
        toast.addEventListener('hidden.bs.toast', function () {
            toast.remove();
        });
    } catch (e) {
        console.error("Bootstrap Toast hiba:", e);
        setTimeout(() => toast.remove(), 4000);
    }
}