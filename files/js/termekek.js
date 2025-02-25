let valasz;
let kartyak = document.getElementById("kartyak");

// Gomb a szűrőpanel ki-be csúsztatásához
const toggleButton = document.getElementById("szures-button");
const filterPanel = document.getElementById("filter_div");
const cardContainer = document.getElementById("kartyak-container");
const szuroContainer = document.getElementById("szuro-container");
const szuresButton = document.getElementById("szures-button");

toggleButton.addEventListener("click", function () {
    // Ha el van rejtve, akkor megjelenítjük
    if (filterPanel.classList.contains("hidden")) {
        szuroContainer.classList.remove("hidden");
        cardContainer.classList.remove("expanded");
        szuresButton.textContent = "Szűrők elrejtése";

        setTimeout(function () {
            filterPanel.classList.remove("hidden"); // Elrejtés eltávolítása
        }, 150);
    } else {
        // Ha látszik, akkor elrejtjük
        filterPanel.classList.add("hidden");
        szuresButton.textContent = "Szűrők megjelenítése";

        // Késleltetett eltűntetés
        setTimeout(function () {
            szuroContainer.classList.add("hidden");
            cardContainer.classList.add("expanded"); // Kártyák szélességének növelése, amikor a szűrő eltűnt
        }, 500); // 1000ms késleltetés (1 másodperc), hogy az animáció lefusson
    }
});

document.getElementById('clear-filters').addEventListener('click', function () {
    // Kategóriák és gyártók resetelése (checkboxok)
    document.querySelectorAll('#kategoriak input[type="checkbox"], #gyartok input[type="checkbox"]').forEach(function (item) {
        item.checked = false;  // Checkbox visszaállítása
    });

    // Árkategóriák visszaállítása (range és input típusú)
    document.getElementById('fromSlider').value = 0;
    document.getElementById('toSlider').value = 5000000;
    document.getElementById('fromInput').value = 0;
    document.getElementById('toInput').value = 5000000;

    // Az összes kártya újratöltése a szűrők törlésével
    feltolesKartyakkal(valasz); // Az összes adatot újra betölti
    frissitTalalatokSzama(valasz.length); // Frissíti a találatok számát
    document.getElementById('toSlider').style.background = 'rgb(37, 218, 165)';
});

// Kategóriák feltöltése
async function kategoriafeltolt() {
    try {
        let eredmeny = await fetch("../php/kategoriaLeker.php");
        if (!eredmeny.ok) throw new Error("Hiba a szerver válaszában!");

        let valasz = await eredmeny.json();
        let div = document.getElementById('kategoriak');

        // Elmentjük az aktuálisan bejelölt checkboxokat
        let kivalasztottak = new Set();
        document.querySelectorAll('input[name="kategoriak"]:checked').forEach(checkbox => {
            kivalasztottak.add(checkbox.value);
        });
        div.innerHTML = "<h6>Kategóriák</h6>"; // Ezt meghagyjuk, hogy a fejléceket beállítsuk.
        const maxVisible = 4;

        function hozzaadKategoria(adat) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "kategoriak";
            checkbox.value = adat.kategoria_nev;
            checkbox.style.marginRight = "10px";

            // Ha korábban be volt jelölve, újra bejelöljük
            if (kivalasztottak.has(adat.kategoria_nev)) {
                checkbox.checked = true;
            }

            div.appendChild(checkbox);

            let label = document.createElement('label');
            let kategoriaNev = adat.kategoria_nev.length > 22 ? adat.kategoria_nev.slice(0, 22) + '...' : adat.kategoria_nev;
            label.innerHTML = `${kategoriaNev} (${adat.darabszam})`;
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }

        // Első 4 kategória megjelenítése
        valasz.slice(0, maxVisible).forEach(hozzaadKategoria);

        if (valasz.length > maxVisible) {
            let tovabbi = document.createElement('a');
            tovabbi.innerHTML = `További ${valasz.length - maxVisible} megjelenítése`;
            tovabbi.href = "#";
            tovabbi.style.color = "blue";
            tovabbi.classList.add('tovabbi-gomb');

            tovabbi.addEventListener("click", (e) => {
                e.preventDefault();
                valasz.slice(maxVisible).forEach(hozzaadKategoria);
                tovabbi.style.display = 'none';

                let bezaras = document.createElement('a');
                bezaras.innerHTML = "Kategóriák bezárása";
                bezaras.href = "#";
                bezaras.style.color = "blue";

                bezaras.addEventListener("click", (e) => {
                    e.preventDefault();
                    kategoriafeltolt();
                });

                div.appendChild(bezaras);
            });

            div.appendChild(tovabbi);
        }
    } catch (error) {
        console.log(error);
    }
}

async function szuresKuldes() {
    await delay(0)
    let currentUrl = window.location.href;
    let params = new URLSearchParams(window.location.search);
    let kategoria = params.get('kategoria');
    let gyarto = params.get('gyarto');

    //Adatok összeállítása
    let data = { url: currentUrl };
    if (kategoria) data.kategoria = kategoria;
    if (gyarto) data.gyarto = gyarto;

    $.ajax({
        url: "../php/adatokLekerese.php",
        method: "POST",
        data: data,
        success: function (response) {
            valasz = JSON.parse(response);
            feltolesKartyakkal(valasz);
        }
    });
}

async function adatbazisbolLekeres() {
    try {
        let eredmeny = await fetch("../php/adatokLekerese.php");
        if (eredmeny.ok) {
            let valasz = await eredmeny.json();
            feltolesKartyakkal(valasz);
        }
    } catch (error) {
        console.log(error);
    }
}

function Szures() {
    kartyak.innerHTML = "";  // Töröljük a meglévő kártyákat
    let fromprice = document.getElementById('fromSlider').value;
    let toprice = document.getElementById('toSlider').value;

    // Kiválasztott kategóriák és gyártók lekérése
    let kivalasztottKategoriak = Array.from(document.querySelectorAll('input[name="kategoriak"]:checked')).map(cb => cb.value);
    let kivalasztottGyartok = Array.from(document.querySelectorAll('input[name="gyartok"]:checked')).map(cb => cb.value);

    let szurtKartyak = [];

    // Szűrési logika
    for (const adat of valasz) {
        // Szóközök eltávolítása és számokká alakítás
        const egysegar = parseFloat(adat.egysegar.replace(/\s/g, '')); 
        const akcios_ar = parseFloat(adat.akcios_ar.replace(/\s/g, ''));

        // Ha van érvényes akciós ár, és az kisebb az egységárnál, akkor az alapján szűrünk
        const hasznaltAr = (akcios_ar > -1 && akcios_ar < egysegar) ? akcios_ar : egysegar;

        // Ár szűrés
        const arMegfelelo = toprice >= hasznaltAr && fromprice <= hasznaltAr;

        // Kategóriák és gyártók szűrés logikája
        const kategoriaMegfelelo = kivalasztottKategoriak.length === 0 || kivalasztottKategoriak.includes(adat.kategoria_nev);
        const gyartoMegfelelo = kivalasztottGyartok.length === 0 || kivalasztottGyartok.includes(adat.gyarto_nev);

        // Ha minden szűrési feltétel teljesül, hozzáadjuk a kártyát a szűrt listához
        if (arMegfelelo && kategoriaMegfelelo && gyartoMegfelelo) {
            szurtKartyak.push(adat);
        }
    }

    // Kártyák feltöltése a szűrt eredményekkel
    feltolesKartyakkal(szurtKartyak);

    // Frissítjük a találatok számát
    frissitTalalatokSzama(szurtKartyak.length);
}

// Rendezési funkciók
document.querySelectorAll('#dropdown-options li').forEach(option => {
    option.addEventListener('click', function () {
        const sortType = this.dataset.sort;
        const selectedOptionText = this.textContent;
        document.getElementById('dropdown-button').textContent = selectedOptionText;
        rendezes(sortType);
        toggleDropdown();
    });
});

function rendezes(sortType) {
    const kartyakContainer = document.getElementById('kartyak');
    const kartyak = Array.from(kartyakContainer.children);

    kartyak.sort((a, b) => {
        const adatA = {
            nev: a.querySelector('h5').innerText,
            akciosAr: a.querySelector('.discounted-price') ? parseInt(a.querySelector('.discounted-price').innerText.replace(/[^0-9]/g, ''), 10) : null,
            eredetiAr: parseInt(a.querySelector('h6').innerText.replace(/[^0-9]/g, ''), 10) || 0
        };

        const adatB = {
            nev: b.querySelector('h5').innerText,
            akciosAr: b.querySelector('.discounted-price') ? parseInt(b.querySelector('.discounted-price').innerText.replace(/[^0-9]/g, ''), 10) : null,
            eredetiAr: parseInt(b.querySelector('h6').innerText.replace(/[^0-9]/g, ''), 10) || 0
        };

        // Ha van akciós ár, azt használjuk az összehasonlításra
        const arA = adatA.akciosAr !== null ? adatA.akciosAr : adatA.eredetiAr;
        const arB = adatB.akciosAr !== null ? adatB.akciosAr : adatB.eredetiAr;

        if (sortType === 'ar-csokkeno') {
            return arB - arA;
        } else if (sortType === 'ar-novekvo') {
            return arA - arB;
        } else if (sortType === 'nev-az') {
            return adatA.nev.localeCompare(adatB.nev);
        } else if (sortType === 'nev-za') {
            return adatB.nev.localeCompare(adatA.nev);
        }
        return 0;
    });

    kartyakContainer.innerHTML = '';
    kartyak.forEach(kartya => kartyakContainer.appendChild(kartya));

    frissitTalalatokSzama(kartyak.length); // Találatok számának frissítése
}

function frissitTalalatokSzama(darab) {
    document.getElementById('talalatok').textContent = `Találatok: ${darab} termék`;
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-options');
    dropdownMenu.classList.toggle('show');
}

document.addEventListener('click', function (e) {
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-options');
    if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Gyártók feltöltése
async function gyartoFeltolt() {
    try {
        let eredmeny = await fetch("../php/gyartoLeker.php");
        if (!eredmeny.ok) throw new Error("Hiba a szerver válaszában!");

        let valasz = await eredmeny.json();
        let div = document.getElementById('gyartok');

        // Elmentjük az aktuálisan bejelölt checkboxokat
        let kivalasztottak = new Set();
        document.querySelectorAll('input[name="gyartok"]:checked').forEach(checkbox => {
            kivalasztottak.add(checkbox.value);
        });

        // Töröljük a div tartalmát, de a kiválasztott értékeket megőrizzük
        div.innerHTML = "<h6>Gyártók</h6>";
        const maxVisible = 4;

        function hozzaadGyarto(adat) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "gyartok";
            checkbox.value = adat.gyarto_nev;
            checkbox.style.marginRight = "10px";

            // Ha korábban be volt jelölve, újra bejelöljük
            if (kivalasztottak.has(adat.gyarto_nev)) {
                checkbox.checked = true;
            }

            div.appendChild(checkbox);

            let label = document.createElement('label');
            label.innerHTML = adat.gyarto_nev;
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }

        // Első 4 gyártó megjelenítése
        valasz.slice(0, maxVisible).forEach(hozzaadGyarto);

        if (valasz.length > maxVisible) {
            let tovabbi = document.createElement('a');
            tovabbi.innerHTML = `További ${valasz.length - maxVisible} megjelenítése`;
            tovabbi.href = "#";
            tovabbi.style.color = "blue";

            tovabbi.addEventListener("click", (e) => {
                e.preventDefault();
                valasz.slice(maxVisible).forEach(hozzaadGyarto);
                tovabbi.style.display = 'none';

                let bezaras = document.createElement('a');
                bezaras.innerHTML = "Gyártók bezárása";
                bezaras.href = "#";
                bezaras.style.color = "blue";

                bezaras.addEventListener("click", (e) => {
                    e.preventDefault();
                    gyartoFeltolt();
                });

                div.appendChild(bezaras);
            });

            div.appendChild(tovabbi);
        }
    } catch (error) {
        console.log(error);
    }
}

function kosarbaTesz(termekId) {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", termek_id: termekId, mennyiseg: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 🔵 Kosár számláló frissítése a válaszból
                document.getElementById("cart-count").textContent = data.uj_mennyiseg;
            }
        })
        .catch(error => console.error("Hiba:", error));
}

// Kártyák feltöltése
function feltolesKartyakkal(adatok) {
    kartyak.innerHTML = "";
    for (const adat of adatok) {
        let col = document.createElement("div");
        col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");

        let card = document.createElement("div");
        card.classList.add("card");
        card.style.cursor = "pointer"; // Mutató kurzor hozzáadása, hogy kattinthatónak tűnjön

        // Kattintási esemény a teljes kártyára
        card.addEventListener("click", function () {
            window.location.href = `../php/termekOldal.php?cikkszam=${adat.cikkszam}`;
        });

        let card_header = document.createElement('div');
        card_header.classList.add("card-header");
        card.appendChild(card_header);

        let img = document.createElement("img");
        img.src = `../img/termekek/${adat.cikkszam}.webp`;
        img.alt = adat.termek_nev;
        img.classList.add("card-img-top");
        card_header.appendChild(img);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "d-flex", "flex-column");

        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.innerHTML = adat.termek_nev;

        let cardTitle2 = document.createElement("h6");
        cardTitle2.classList.add("card-subtitle", "mb-2", "text-muted");

        let akcios_ar = parseFloat(adat.akcios_ar.replace(/\s/g, ''));
        let egysegar = parseFloat(adat.egysegar.replace(/\s/g, ''));
        if (akcios_ar > -1 && akcios_ar < egysegar) {
            cardTitle2.innerHTML = `<span class="original-price">${adat.egysegar} Ft</span> 
                             <span class="discounted-price">${adat.akcios_ar} Ft</span>`;
            card_header.innerHTML += `<div class="badge">Akció!</div>`;
        } else {
            cardTitle2.innerHTML = `${adat.egysegar} Ft`;
        }

        let cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.innerHTML = adat.cikkszam;

        let cartButton = document.createElement("button");
        cartButton.classList.add("btn", "btn-success", "d-flex", "align-items-center", "gap-2");
        cartButton.innerHTML = `
                                    <span>
                                        <img src="../img/cart.png" alt="Kosár ikon" width="25" height="25">
                                    </span> Kosárba
                                `;
        cartButton.setAttribute("data-id", adat.cikkszam);
        cartButton.style.border = 0;
        cartButton.style.transition = "box-shadow 0.3s ease-in-out";

        // Hover effekt az árnyékhoz
        cartButton.onmouseover = function () {
            cartButton.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.8)";
        };
        cartButton.onmouseout = function () {
            cartButton.style.boxShadow = "none";
        };

        // Kattintási esemény a kosárhoz adáshoz
        cartButton.onclick = function (event) {
            event.stopPropagation();
            kosarbaTesz(adat.cikkszam);
        };

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("d-flex", "justify-content-between", "mt-auto", "w-100");
        buttonContainer.appendChild(cartButton);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardTitle2);
        cardBody.appendChild(buttonContainer);

        card.appendChild(cardBody);
        col.appendChild(card);

        kartyak.appendChild(col);
    }

    frissitTalalatokSzama(adatok.length);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("DOMContentLoaded", adatbazisbolLekeres);
window.addEventListener("load", szuresKuldes);
window.addEventListener('load', kategoriafeltolt);
window.addEventListener('load', gyartoFeltolt);
document.getElementById("szures_button").addEventListener('click', Szures);