var termekAdatok;
var torlendo_cikkszam;
var eredetiAdatok = [];
let leirasModalInstance = null;
let kepModalInstance = null;
let targetLeirasInput = null;
let leirasTextarea = null;
let leirasSzerkesztesBtn = null;
let leirasMenteseBtn = null;
let leirasTartalomTorlesBtn = null;
let leirasMegseBtn = null;

let kepTorlesModalInstance = null;
let kepTorlendoAdatok = null;
let kepTorlesMegseClicked = false;

document.addEventListener('DOMContentLoaded', async function () {
    const leirasModalElement = document.getElementById('leirasModal');
    if (leirasModalElement) {
        leirasModalInstance = new bootstrap.Modal(leirasModalElement);
        leirasTextarea = document.getElementById('leirasTextarea');
        leirasSzerkesztesBtn = document.getElementById('leirasSzerkesztesBtn');
        leirasMenteseBtn = document.getElementById('leirasMenteseBtn');
        leirasTartalomTorlesBtn = document.getElementById('leirasTartalomTorlesBtn');
        leirasMegseBtn = document.getElementById('leirasMegseBtn');

        if (leirasSzerkesztesBtn) {
            leirasSzerkesztesBtn.addEventListener('click', handleLeirasSzerkesztes);
        }
        if (leirasMenteseBtn) {
            leirasMenteseBtn.addEventListener('click', handleLeirasMentes);
        }
        if (leirasTartalomTorlesBtn && leirasTextarea) {
            leirasTartalomTorlesBtn.addEventListener('click', function () {
                leirasTextarea.value = '';
            });
        }

        leirasModalElement.addEventListener('hidden.bs.modal', function () {
            resetLeirasModalToReadOnly();
            targetLeirasInput = null;
            const orphanedFileInput = document.querySelector(`#${leirasModalElement.id} input[type="file"]`);
            if (orphanedFileInput) {
                orphanedFileInput.remove();
            }
        });

        leirasModalElement.addEventListener('show.bs.modal', function () {
             if (targetLeirasInput && leirasTextarea) {
                  leirasTextarea.value = targetLeirasInput.value;
             }
             const row = targetLeirasInput ? targetLeirasInput.closest('tr') : null;
             if (row && isRowInEditMode(row)) {
                  setLeirasModalToEditState();
             } else {
                  resetLeirasModalToReadOnly();
             }
        });
    }

    const kepModalElement = document.getElementById('kepModal');
    if (kepModalElement) {
        kepModalInstance = new bootstrap.Modal(kepModalElement);
        kepModalElement.addEventListener('hidden.bs.modal', function () {
            const carouselElement = document.getElementById('productCarousel');
            if (carouselElement) {
                const existingCarouselInstance = bootstrap.Carousel.getInstance(carouselElement);
                if (existingCarouselInstance) {
                    existingCarouselInstance.dispose();
                }
            }
             const fileInput = kepModalElement.querySelector('input[type="file"]');
             if (fileInput) {
                 fileInput.remove();
             }
        });
    }

    const kepTorlesModalElement = document.getElementById('kepTorlesModal');
    if (kepTorlesModalElement) {
        kepTorlesModalInstance = new bootstrap.Modal(kepTorlesModalElement);
        const megerositesKepTorlesBtn = document.getElementById('megerositesKepTorles');
        const megseKepTorlesBtn = kepTorlesModalElement.querySelector('.btn-secondary[data-bs-dismiss="modal"]');

        if (megerositesKepTorlesBtn) {
            megerositesKepTorlesBtn.addEventListener('click', async () => {
                kepTorlesMegseClicked = false;
                if (kepTorlendoAdatok && kepTorlesModalInstance) {
                    kepTorlesModalInstance.hide();
                    await performKepTorles(
                        kepTorlendoAdatok.cikkszam,
                        kepTorlendoAdatok.kepUrl,
                        kepTorlendoAdatok.carouselItemElem,
                        kepTorlendoAdatok.thumbnailElem
                    );
                    kepTorlendoAdatok = null;
                }
            });
        }

        if (megseKepTorlesBtn) {
             megseKepTorlesBtn.addEventListener('click', () => {
                 kepTorlesMegseClicked = true;
             });
         }


        kepTorlesModalElement.addEventListener('hidden.bs.modal', () => {
             if (kepTorlesMegseClicked) {
                 if (kepModalInstance) {
                     kepModalInstance.show();
                 }
                 kepTorlesMegseClicked = false;
             }
             kepTorlendoAdatok = null;
             const fajlnevElem = document.getElementById('kepTorlesFajlnev');
             if (fajlnevElem) fajlnevElem.textContent = '';
        });
    }


    try {
        let keres = await fetch("../php/admin_adatleker.php");
        if (keres.ok) {
            let adat = await keres.json();
            eredetiAdatok = JSON.parse(JSON.stringify(adat));
            megjelenitTermekek(adat);
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
            let szurtAdatok = JSON.parse(JSON.stringify(eredetiAdatok)).filter(item => {
                if (keresesiErtek === "") {
                    return true;
                }
                const isNumericSearch = !isNaN(parseFloat(keresesiErtek)) && isFinite(keresesiErtek);

                const textMatch =
                    item.cikkszam.toString().toLowerCase().includes(keresesiErtek) ||
                    item.nev.toLowerCase().includes(keresesiErtek) ||
                    (item.leiras && item.leiras.toLowerCase().includes(keresesiErtek));

                let numericMatch = false;
                if (isNumericSearch) {
                    const searchNumStr = keresesiErtek;
                    numericMatch =
                        item.egysegar.toString().includes(searchNumStr) ||
                        (item.akcios_ar && item.akcios_ar != -1 && item.akcios_ar.toString().includes(searchNumStr)) ||
                        (item.darabszam && item.darabszam.toString().includes(searchNumStr));
                }

                return textMatch || numericMatch;
            });
             megjelenitTermekek(szurtAdatok);
             kiemelTalalatokat(keresesiErtek);
        });
    }

     const megerositesTorlesBtn = document.getElementById("megerositesTorles");
     if (megerositesTorlesBtn) {
         megerositesTorlesBtn.addEventListener("click", async function () {
             if (torlendo_cikkszam) {
                 let torlesEredmeny = await adatTorles(torlendo_cikkszam);
                 const torlesModalElement = document.getElementById("torlesModal");
                 if (torlesModalElement) {
                     const torlesModalInstanceBs = bootstrap.Modal.getInstance(torlesModalElement);
                     if (torlesModalInstanceBs) torlesModalInstanceBs.hide();
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

function isRowInEditMode(row) {
    if (!row) return false;
    const buttonCell = row.querySelector('td:last-child');
    return buttonCell && buttonCell.querySelector('.mentés-gomb') !== null;
}

function setLeirasModalToEditState() {
    if (leirasTextarea) leirasTextarea.readOnly = false;
    if (leirasSzerkesztesBtn) leirasSzerkesztesBtn.classList.add('d-none');
    if (leirasMenteseBtn) leirasMenteseBtn.classList.remove('d-none');
    if (leirasTartalomTorlesBtn) leirasTartalomTorlesBtn.classList.remove('d-none');
    if (leirasTextarea) leirasTextarea.focus();
}

function resetLeirasModalToReadOnly() {
    if (leirasTextarea) leirasTextarea.readOnly = true;
    if (leirasSzerkesztesBtn) leirasSzerkesztesBtn.classList.remove('d-none');
    if (leirasMenteseBtn) leirasMenteseBtn.classList.add('d-none');
    if (leirasTartalomTorlesBtn) leirasTartalomTorlesBtn.classList.add('d-none');
}

function handleLeirasSzerkesztes() {
   setLeirasModalToEditState();
}

function handleLeirasMentes() {
    if (targetLeirasInput && leirasTextarea) {
        targetLeirasInput.value = leirasTextarea.value;

        const row = targetLeirasInput.closest('tr');
        if (row) {
            const cikkszam = row.id.split('-')[1];
            setRowToEditState(cikkszam);
        }
    }
    if (leirasModalInstance) leirasModalInstance.hide();
}

function setRowToEditState(cikkszam) {
    const row = document.getElementById(`row-${cikkszam}`);
    if (!row) return;
    const buttonCell = row.querySelector('td:last-child');
    if (!buttonCell) return;

    if (!row.dataset.originalButtons) {
        row.dataset.originalButtons = buttonCell.innerHTML;
    }

    row.querySelectorAll('input').forEach(input => {
        if (input.id !== `cikkszam-${cikkszam}`) {
             input.readOnly = false;
        }
    });

    buttonCell.innerHTML = `
        <button type="button" class="btn btn-sm btn-outline-success mentés-gomb" title="Mentés">
            <img src="../img/save.png" alt="Mentés" width="20">
        </button>
        <button type="button" class="btn btn-sm btn-outline-secondary vissza-gomb" title="Mégse">
            <img src="../img/back.png" alt="Vissza" width="20">
        </button>
    `;
}

function handleModositasClick(row, cikkszam, modositButton) {
    setRowToEditState(cikkszam);
}

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
                        <th scope="col">Készlet</th>
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
        tablebody.innerHTML = '<tr><td colspan="7" class="text-center">Nincsenek megjeleníthető termékek.</td></tr>';
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
                <td><input type="number" class="form-control" id="darabszam-${item.cikkszam}" value="${item.darabszam ?? 0}" readonly></td>
                <td>
                    <input
                        type="text"
                        class="form-control leiras-input"
                        id="leiras-${item.cikkszam}"
                        value="${item.leiras || ''}"
                        readonly
                        style="cursor: pointer;"
                        title="Leírás megtekintése/szerkesztése"
                    >
                </td>
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
        const input = target.closest('input.leiras-input');
        const row = target.closest('tr');
        if (!row) return;

        const cikkszam = row.id.split('-')[1];

        if (button && button.classList.contains('modosit')) {
            handleModositasClick(row, cikkszam, button);
        } else if (button && button.classList.contains('torles')) {
            torlendo_cikkszam = { cikkszam: cikkszam };
            const torlesModalElement = document.getElementById("torlesModal");
            if (torlesModalElement) {
                const modal = new bootstrap.Modal(torlesModalElement);
                modal.show();
            }
        } else if (button && button.classList.contains('kepek')) {
            handleKepekClick(cikkszam);
        }
        else if (input && input.classList.contains('leiras-input')) {
            targetLeirasInput = input;
            if (leirasModalInstance) {
                if (isRowInEditMode(row)) {
                    setLeirasModalToEditState();
                } else {
                    resetLeirasModalToReadOnly();
                }
                 leirasTextarea.value = targetLeirasInput.value;
                leirasModalInstance.show();
            }
        }
        else if (button && button.classList.contains('mentés-gomb')) {
             handleMentesClick(row, cikkszam, button);
        } else if (button && button.classList.contains('vissza-gomb')) {
             handleMegseClick(row, cikkszam, button);
        }
    });
}

function handleMegseClick(row, cikkszam, sourceButton) {
    const buttonCell = row.querySelector('td:last-child');
    const originalData = eredetiAdatok.find(item => item.cikkszam.toString() === cikkszam.toString());

    row.querySelectorAll('input').forEach(input => {
        input.readOnly = true;
        if (originalData && input.id !== `cikkszam-${cikkszam}`) {
             const key = input.id.split('-')[0];
             let originalValue = '';
             if (key === 'akciosar') {
                 originalValue = (originalData.akcios_ar == -1 || originalData.akcios_ar == null) ? '' : originalData.akcios_ar;
             } else if (key === 'leiras') {
                 originalValue = originalData.leiras || '';
             } else if (key === 'darabszam') {
                 originalValue = originalData.darabszam ?? 0;
             } else if (originalData.hasOwnProperty(key)) {
                 originalValue = originalData[key];
             } else if (key === 'nev'){
                 originalValue = originalData.nev;
             } else if (key === 'egysegar'){
                 originalValue = originalData.egysegar;
             }
             input.value = originalValue;
             input.classList.remove('is-valid', 'is-invalid');
             const errorSpan = input.nextElementSibling;
             if (errorSpan && errorSpan.classList.contains('error')) {
                errorSpan.style.display = 'none';
             }
        }
    });

    if (row.dataset.originalButtons) {
        buttonCell.innerHTML = row.dataset.originalButtons;
        delete row.dataset.originalButtons;
    } else {
         buttonCell.innerHTML = `
              <button class="btn btn-sm btn-outline-secondary modositas-gomb modosit" title="Módosítás">
                  <img src="../img/pencil.png" alt="Módosítás" width="20">
              </button>
              <button class="btn btn-sm btn-outline-danger torles-gomb torles" title="Törlés">
                  <img src="../img/delete.png" alt="Törlés" width="20">
              </button>
              <button class="btn btn-sm btn-outline-info kep-gomb kepek" title="Képek">
                   <img src="../img/gallery.png" alt="Képek" width="20">
               </button>
         `;
    }
}

async function handleMentesClick(row, cikkszam, mentesButton) {
    const buttonCell = row.querySelector('td:last-child');

    const currentData = {
        cikkszam: row.querySelector(`#cikkszam-${cikkszam}`).value,
        nev: row.querySelector(`#nev-${cikkszam}`).value,
        egysegar: row.querySelector(`#egysegar-${cikkszam}`).value,
        akciosar: row.querySelector(`#akciosar-${cikkszam}`).value.trim() === '' ? -1 : row.querySelector(`#akciosar-${cikkszam}`).value,
        darabszam: row.querySelector(`#darabszam-${cikkszam}`).value,
        leiras: row.querySelector(`#leiras-${cikkszam}`).value,
    };

    const originalData = eredetiAdatok.find(item => item.cikkszam.toString() === cikkszam.toString());
    let changed = false;
    if (originalData) {
        if (currentData.nev !== originalData.nev ||
             currentData.egysegar.toString() !== originalData.egysegar.toString() ||
             currentData.akciosar.toString() !== (originalData.akcios_ar == null ? '-1' : originalData.akcios_ar.toString()) ||
             currentData.darabszam.toString() !== (originalData.darabszam == null ? '0' : originalData.darabszam.toString()) ||
             (currentData.leiras || '') !== (originalData.leiras || '')
            ) {
            changed = true;
        }
    } else {
        changed = true;
    }

    if (!changed) {
        showToast("Nem történt változás.", "info");
        handleMegseClick(row, cikkszam, mentesButton);
        return;
    }

    mentesButton.disabled = true;
    mentesButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    const mentesEredmeny = await adatMentes(currentData);

    mentesButton.disabled = false;

    if (mentesEredmeny.status=="success") {
        const index = eredetiAdatok.findIndex(item => item.cikkszam.toString() === cikkszam.toString());
        if (index > -1) {
            eredetiAdatok[index].nev = currentData.nev;
            eredetiAdatok[index].egysegar = currentData.egysegar;
            eredetiAdatok[index].akcios_ar = currentData.akciosar;
            eredetiAdatok[index].darabszam = currentData.darabszam;
            eredetiAdatok[index].leiras = currentData.leiras;
        }
        handleMegseClick(row, cikkszam, mentesButton);
    } else {
        mentesButton.innerHTML = '<img src="../img/save.png" alt="Mentés" width="20">';
    }
}

async function handleKepekClick(cikkszam) {
    const modalBody = kepModalInstance ? kepModalInstance._element.querySelector('.modal-body') : null;
    if (!modalBody) {
        console.error("Kép modal body nem található!");
        return;
    }

    const carouselImages = document.getElementById("carouselImages");
    const carouselThumbnails = document.getElementById("carouselThumbnails");

    if (!carouselImages || !carouselThumbnails) {
        console.error("Carousel belső elemek (#carouselImages, #carouselThumbnails) nem találhatóak!");
        return;
    }

    const existingFileInput = modalBody.querySelector(`#fileInput-${cikkszam}`);
    if (existingFileInput) {
        existingFileInput.remove();
    }

    carouselImages.innerHTML = '<div class="carousel-item active d-flex justify-content-center align-items-center" style="min-height: 200px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Töltés...</span></div></div>';
    carouselThumbnails.innerHTML = '';

    if (kepModalInstance && !kepModalInstance._isShown) {
        kepModalInstance.show();
    }

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
                    if (kepIndex === 0) item.classList.add('active');
                    item.dataset.imageUrl = kepUrl;
                    item.dataset.slideIndex = kepIndex;

                    let imgContainer = document.createElement("div");
                    imgContainer.classList.add("position-relative", "d-flex", "justify-content-center", "align-items-center");

                    let imgElem = document.createElement("img");
                    imgElem.src = kepUrl;
                    imgElem.alt = "Termékkép";
                    imgElem.classList.add("d-block", "product-main-image");
                    imgContainer.appendChild(imgElem);

                    let deleteButton = document.createElement("button");
                    deleteButton.classList.add("btn", "btn-danger", "btn-sm", "position-absolute", "top-0", "end-0", "m-2");
                    deleteButton.innerHTML = '<i class="fas fa-times"></i>';
                    deleteButton.title = "Kép törlése";
                    deleteButton.type = "button";
                    imgContainer.appendChild(deleteButton);

                    item.appendChild(imgContainer);
                    carouselImages.appendChild(item);

                    let thumbnail = document.createElement("img");
                    thumbnail.src = kepUrl;
                    thumbnail.alt = "Bélyegkép " + (kepIndex + 1);
                    thumbnail.classList.add("thumbnail-item");
                    if (kepIndex === 0) thumbnail.classList.add("active");
                    thumbnail.setAttribute("data-bs-target", "#productCarousel");
                    thumbnail.setAttribute("data-bs-slide-to", kepIndex);
                    thumbnail.setAttribute("aria-label", "Dia " + (kepIndex + 1));
                    carouselThumbnails.appendChild(thumbnail);

                     deleteButton.addEventListener("click", function () {
                         kepTorlendoAdatok = {
                             cikkszam: cikkszam,
                             kepUrl: kepUrl,
                             carouselItemElem: item,
                             thumbnailElem: thumbnail,
                         };
                         const fajlnevElem = document.getElementById('kepTorlesFajlnev');
                         if (fajlnevElem) {
                              const filename = kepUrl.substring(kepUrl.lastIndexOf('/') + 1);
                              fajlnevElem.textContent = filename;
                         }

                         const kepModalElement = document.getElementById('kepModal');

                         const onKepModalHidden = () => {
                             if (kepTorlesModalInstance) {
                                 kepTorlesModalInstance.show();
                             } else {
                                  console.error("Kép törlés modal nincs inicializálva!");
                                 if (confirm(`Biztosan törölni szeretnéd ezt a képet: ${kepUrl.substring(kepUrl.lastIndexOf('/') + 1)}?`)) {
                                      performKepTorles(cikkszam, kepUrl, item, thumbnail);
                                 } else {
                                      if (kepModalInstance) {
                                          kepModalInstance.show();
                                      }
                                 }
                             }
                             kepModalElement.removeEventListener('hidden.bs.modal', onKepModalHidden);
                         };

                         kepModalElement.addEventListener('hidden.bs.modal', onKepModalHidden);

                         if (kepModalInstance) {
                             kepModalInstance.hide();
                         } else {
                              console.error("Kep modal instance not found for hiding.");
                              if (kepTorlesModalInstance) {
                                  kepTorlesModalInstance.show();
                              }
                         }
                     });


                    kepIndex++;
                }
            });
        }

        if (kepIndex === 0) {
           carouselImages.innerHTML = '<div class="carousel-item active text-center p-5">Nincsenek képek ehhez a termékhez.</div>';
        }

        let uploadThumbnailContainer = document.createElement("div");
        uploadThumbnailContainer.classList.add("thumbnail-item", "upload-thumbnail", "d-flex", "align-items-center", "justify-content-center");
        uploadThumbnailContainer.title = "Új képek feltöltése (.webp)";
        uploadThumbnailContainer.style.cursor = "pointer";

        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/webp";
        fileInput.multiple = true;
        fileInput.style.display = "none";
        fileInput.id = `fileInput-${cikkszam}`;

        uploadThumbnailContainer.addEventListener('click', () => {
           fileInput.click();
        });

        fileInput.addEventListener("change", async function (event) {
           await handleKepFeltoltes(cikkszam, event.target.files);
        });

        let addIcon = document.createElement("i");
        addIcon.classList.add("fas", "fa-plus", "fa-lg");
        uploadThumbnailContainer.appendChild(addIcon);
        carouselThumbnails.appendChild(uploadThumbnailContainer);

         const kepModalBody = document.getElementById('kepModal').querySelector('.modal-body');
         if (kepModalBody && !kepModalBody.querySelector(`#${fileInput.id}`)) {
            kepModalBody.appendChild(fileInput);
         }


        frissitCarouselState(cikkszam);

    } catch (error) {
        console.error("Hiba történt a képek betöltésekor:", error);
        carouselImages.innerHTML = `<div class="carousel-item active text-center text-danger p-5">Hiba történt a képek betöltésekor. ${error.message}</div>`;
        carouselThumbnails.innerHTML = '';
    }
}


function frissitCarouselState(cikkszam, startIndex = 0) {
    const carouselElement = document.getElementById('productCarousel');
    const carouselImages = document.getElementById("carouselImages");
    const carouselThumbnails = document.getElementById("carouselThumbnails");

    if (!carouselElement || !carouselImages || !carouselThumbnails) return;

    const meglévőKépek = carouselImages.querySelectorAll('.carousel-item');
    const meglévőThumbnailek = carouselThumbnails.querySelectorAll('.thumbnail-item:not(.upload-thumbnail)');
    const meglévőKépekSzáma = meglévőKépek.length;

    const prevControl = carouselElement.querySelector('.carousel-control-prev');
    const nextControl = carouselElement.querySelector('.carousel-control-next');

    if (meglévőKépekSzáma <= 1) {
        if(prevControl) prevControl.style.display = 'none';
        if(nextControl) nextControl.style.display = 'none';
    } else {
        if(prevControl) prevControl.style.display = '';
        if(nextControl) nextControl.style.display = '';
    }

    const existingCarouselInstance = bootstrap.Carousel.getInstance(carouselElement);
    if (existingCarouselInstance) {
        existingCarouselInstance.dispose();
    }

    if (meglévőKépekSzáma > 0) {
         meglévőKépek.forEach(item => item.classList.remove('active'));
         meglévőThumbnailek.forEach(thumb => thumb.classList.remove('active'));

        let activeIndex = Math.max(0, Math.min(startIndex, meglévőKépekSzáma - 1));

         if (meglévőKépek[activeIndex]) meglévőKépek[activeIndex].classList.add('active');
         if (meglévőThumbnailek[activeIndex]) meglévőThumbnailek[activeIndex].classList.add('active');

         const newCarouselInstance = new bootstrap.Carousel(carouselElement, {
            interval: false,
            ride: false,
            wrap: meglévőKépekSzáma > 1
        });

        carouselElement.removeEventListener('slid.bs.carousel', handleCarouselSlide);
        if (meglévőKépekSzáma > 1) {
             carouselElement.addEventListener('slid.bs.carousel', handleCarouselSlide);
        }

    } else {
        carouselImages.innerHTML = '<div class="carousel-item active text-center p-5">Nincsenek képek ehhez a termékhez.</div>';
    }

     const fileInput = document.getElementById(`fileInput-${cikkszam}`);
     if (fileInput) fileInput.value = "";
}


function handleCarouselSlide(event) {
    const activeIndex = event.to;
    const targetThumbnail = document.querySelector(`#carouselThumbnails .thumbnail-item[data-bs-slide-to="${activeIndex}"]`);
    document.querySelectorAll('#carouselThumbnails .thumbnail-item').forEach(thumb => {
         thumb.classList.remove('active');
    });
    if (targetThumbnail) {
         targetThumbnail.classList.add('active');
    }
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
    let message = "Ismeretlen hiba történt a feltöltés során.";
    let messageType = "danger";

    try {
        let response = await fetch("../php/kepfeltolt.php", {
            method: "POST",
            body: formData
        });
        let result = await response.json();

        if (response.ok && result.success) {
            message = result.message || "Képek sikeresen feltöltve!";
            messageType = "success";
            await handleKepekClick(cikkszam);
        } else {
            message = result.message || "Ismeretlen hiba történt a feltöltés során.";
            throw new Error(message);
        }
    } catch (error) {
        console.error("Hiba történt a fájlok feltöltésekor:", error);
        message = `Hiba a feltöltéskor: ${error.message}`;
    } finally {
         const fileInput = document.getElementById(`fileInput-${cikkszam}`);
         if (fileInput) fileInput.value = "";
         showToast(message, messageType);
         if (kepModalInstance) kepModalInstance.hide();
    }
}

async function performKepTorles(cikkszam, kepUrl, carouselItemElem, thumbnailElem) {
    const filename = kepUrl.substring(kepUrl.lastIndexOf('/') + 1);
    let message = "Hiba történt a kép törlése közben.";
    let messageType = "danger";

    try {
        let keres = await fetch("../php/keptorol.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cikkszam: cikkszam, fajlnev: filename })
        });
        let valasz = await keres.json();

        if (keres.ok && valasz.success) {
            message = valasz.message || "Kép sikeresen törölve.";
            messageType = "success";

            const wasActive = carouselItemElem.classList.contains('active');
            const itemsParent = carouselItemElem.parentNode;
            const currentItemIndex = Array.from(itemsParent.querySelectorAll('.carousel-item')).indexOf(carouselItemElem);

            carouselItemElem.remove();
            if (thumbnailElem) thumbnailElem.remove();

            const remainingItems = itemsParent.querySelectorAll('.carousel-item');
            const remainingThumbnails = document.querySelectorAll('#carouselThumbnails .thumbnail-item:not(.upload-thumbnail)');

            let newActiveIndex = 0;
            if (remainingItems.length > 0) {
                 if (wasActive) {
                     newActiveIndex = Math.max(0, currentItemIndex -1);
                 } else {
                     const currentActiveElem = itemsParent.querySelector('.carousel-item.active');
                     newActiveIndex = currentActiveElem ? Array.from(remainingItems).indexOf(currentActiveElem) : 0;
                     newActiveIndex = Math.max(0, Math.min(newActiveIndex, remainingItems.length - 1));
                 }
            }

             remainingThumbnails.forEach((thumb, index) => {
                 thumb.setAttribute('data-bs-slide-to', index);
                 thumb.setAttribute('aria-label', `Dia ${index + 1}`);
             });

            frissitCarouselState(cikkszam, newActiveIndex);

        } else {
             message = valasz.message || "Hiba történt a kép törlése közben.";
             throw new Error(message);
        }
    } catch (error) {
        console.error("Hiba a kép törlésekor:", error);
        message = `Hiba a kép törlésekor: ${error.message}`;
        messageType = "danger";
    } finally {
        showToast(message, messageType);
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
        let szin = (valasz.status =="success") ? "success" : "danger";
        showToast(valasz.message || (valasz.status === "success" ? "Sikeres mentés!" : "Mentés sikertelen!"), szin);
        return valasz;
    } catch (error) {
        console.error("Hiba az adatok mentésekor:", error);
        showToast("Hiba történt az adatok mentésekor.", "danger");
        return { status: "error", message: "Hiba történt az adatok mentésekor." };
    }
}

function kiemelTalalatokat(kereses) {
    const tableBody = document.getElementById("tablebody");
    if (!tableBody) return;

    const kiemeltMezok = tableBody.querySelectorAll('input.highlight-match');
    kiemeltMezok.forEach(mezo => {
        mezo.classList.remove('highlight-match');
    });

    if (kereses === "") {
        return;
    }

    const isNumericSearch = !isNaN(parseFloat(kereses)) && isFinite(kereses);
    const inputMezok = tableBody.querySelectorAll('input[type="text"], input[type="number"]');

    inputMezok.forEach(input => {
        const ertek = input.value;
        const ertekLower = ertek.toLowerCase();
        let highlight = false;

        if (input.id.startsWith('cikkszam-') && ertek.includes(kereses)) {
            highlight = true;
        } else if (input.id.startsWith('nev-') && ertekLower.includes(kereses)) {
            highlight = true;
        }
        else if (input.id.startsWith('leiras-') && ertekLower.includes(kereses)) {
             highlight = true;
        }
        else if (isNumericSearch && (input.id.startsWith('egysegar-') || input.id.startsWith('akciosar-') || input.id.startsWith('darabszam-'))) {
             if (ertek.includes(kereses)) {
                 highlight = true;
             }
        }

        if (highlight) {
            input.classList.add('highlight-match');
        }
    });
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
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
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