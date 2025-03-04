let valasz;
let kartyak = document.getElementById("kartyak");

// Gomb a szűrőpanel ki-be csúsztatásához
const toggleButton = document.getElementById("szures-button");
const filterPanel = document.getElementById("szuro-container");
const cardContainer = document.getElementById("kartyak-container");
const szuroContainer = document.getElementById("szuro-container");
const szuresButton = document.getElementById("szures-button");

document.addEventListener("DOMContentLoaded", function () {
    const szuroButton = document.getElementById("szures-button");
    const szuroContainer = document.getElementById("szuro-container");
    const kartyakContainer = document.getElementById("kartyak-container");

    let szuroLathato = !(window.innerWidth <= 1200);

    // Nyitás/zárás kezelése
    szuroButton.addEventListener("click", function () {
        if (szuroLathato) {
            szuroContainer.classList.add("hidden");
            szuroContainer.classList.remove("show");
            kartyakContainer.classList.add("expanded");
            szuroButton.innerText = "Szűrők megjelenítése";
        } else {
            szuroContainer.classList.add("show");
            szuroContainer.classList.remove("hidden");
            kartyakContainer.classList.remove("expanded");

            // 🔹 Frissítjük a magasságot, hogy ne ugorjon meg
            setTimeout(() => {
                szuroContainer.style.height = "calc(100vh - 80px)";
                szuroContainer.style.maxHeight = "calc(100vh - 80px)";
                szuroContainer.style.overflowY = "auto";
            }, 350);

            szuroButton.innerText = "Szűrők elrejtése";
        }
        szuroLathato = !szuroLathato;
    });
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

function frissitSzuroMagassag() {
    const szuroContainer = document.getElementById("szuro-container");
    szuroContainer.style.height = "calc(100vh - 80px)"; // Biztosítja, hogy mindig megfelelő legyen a méret
    szuroContainer.style.overflowY = "auto"; // Görgethető legyen, ha szükséges
}

// Automatikusan meghatározza a megjelenítendő elemek számát a képernyőméret szerint
function getMaxVisibleElements() {
    const screenHeight = window.innerHeight;
    if (screenHeight > 1200) return 10; // Nagy képernyő
    if (screenHeight > 1000) return 9;
    if (screenHeight > 800) return 4; // Közepes képernyő
    return 8; // Kis képernyő
}

// Kategóriák feltöltése
async function kategoriafeltolt() {
    try {
        let eredmeny = await fetch("../php/kategoriaLeker.php");
        if (!eredmeny.ok) throw new Error("Hiba a szerver válaszában!");

        let valasz = await eredmeny.json();
        let div = document.getElementById('kategoriak');

        div.innerHTML = "<h6>Kategóriák</h6>";
        const maxVisible = getMaxVisibleElements();

        function hozzaadKategoria(adat) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "kategoriak";
            checkbox.value = adat.kategoria_nev;
            checkbox.style.marginRight = "10px";

            let label = document.createElement('label');
            let kategoriaNev = adat.kategoria_nev.length > 22 ? adat.kategoria_nev.slice(0, 22) + '...' : adat.kategoria_nev;
            label.innerHTML = kategoriaNev;

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }

        valasz.slice(0, maxVisible).forEach(hozzaadKategoria);

        if (valasz.length > maxVisible) {
            let tovabbi = document.createElement('a');
            tovabbi.innerHTML = `További ${valasz.length - maxVisible} megjelenítése`;
            tovabbi.href = "#";
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

                // **🔹 Frissítjük a szűrőpanel magasságát**
                frissitSzuroMagassag();
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

    // A magyar ABC helyes sorrendje
    const magyarABC = [
        "a", "á", "b", "c", "cs", "d", "dz", "dzs", "e", "é", "f", "g", "gy", "h",
        "i", "í", "j", "k", "l", "m", "n", "ny", "o", "ó", "ö", "ő", "p", "q", "r",
        "s", "sz", "t", "ty", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z", "zs"
    ];

    function compareHungarian(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        let minLength = Math.min(a.length, b.length);
        let i = 0;

        while (i < minLength) {
            let charA = a[i];
            let charB = b[i];

            // Ha a karakterek megegyeznek, akkor folytatjuk a következő betűvel
            if (charA === charB) {
                i++;
                continue;
            }

            // Megnézzük az aktuális karakterek ABC szerinti pozícióját
            let indexA = magyarABC.indexOf(charA);
            let indexB = magyarABC.indexOf(charB);

            // Ha az egyik karakter nincs az ABC-ben (pl. szám vagy speciális karakter), akkor hagyjuk az alap JavaScript összehasonlítást
            if (indexA === -1 || indexB === -1) {
                return charA.localeCompare(charB, "hu", { sensitivity: "base" });
            }

            // A betűsorrend alapján visszaadjuk a különbséget
            return indexA - indexB;
        }

        // Ha az első karakterek megegyeznek, a rövidebb szó előrébb kerül
        return a.length - b.length;
    }

    kartyak.sort((a, b) => {
        const adatA = {
            nev: a.querySelector('h5') ? a.querySelector('h5').innerText.trim().toLowerCase() : '',
            akciosAr: a.querySelector('.discounted-price') ? parseInt(a.querySelector('.discounted-price').innerText.replace(/[^0-9]/g, ''), 10) : null,
            eredetiAr: a.querySelector('h6') ? parseInt(a.querySelector('h6').innerText.replace(/[^0-9]/g, ''), 10) : 0
        };

        const adatB = {
            nev: b.querySelector('h5') ? b.querySelector('h5').innerText.trim().toLowerCase() : '',
            akciosAr: b.querySelector('.discounted-price') ? parseInt(b.querySelector('.discounted-price').innerText.replace(/[^0-9]/g, ''), 10) : null,
            eredetiAr: b.querySelector('h6') ? parseInt(b.querySelector('h6').innerText.replace(/[^0-9]/g, ''), 10) : 0
        };

        const arA = adatA.akciosAr !== null ? adatA.akciosAr : adatA.eredetiAr;
        const arB = adatB.akciosAr !== null ? adatB.akciosAr : adatB.eredetiAr;

        if (sortType === 'ar-csokkeno') {
            return arB - arA;
        } else if (sortType === 'ar-novekvo') {
            return arA - arB;
        } else if (sortType === 'nev-az') {
            return compareHungarian(adatA.nev, adatB.nev);
        } else if (sortType === 'nev-za') {
            return compareHungarian(adatB.nev, adatA.nev);
        }
        return 0;
    });

    // DOM újrarenderelése optimalizált módon
    const fragment = document.createDocumentFragment();
    kartyak.forEach(kartya => fragment.appendChild(kartya));
    kartyakContainer.innerHTML = ''; 
    kartyakContainer.appendChild(fragment);

    frissitTalalatokSzama(kartyak.length);
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
        const maxVisible = getMaxVisibleElements();

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

            let label = document.createElement('label');
            label.innerHTML = adat.gyarto_nev;

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }

        // Az első 8 gyártó megjelenítése
        valasz.slice(0, maxVisible).forEach(hozzaadGyarto);

        if (valasz.length > maxVisible) {
            let tovabbi = document.createElement('a');
            tovabbi.innerHTML = `További ${valasz.length - maxVisible} megjelenítése`;
            tovabbi.href = "#";
            tovabbi.classList.add('tovabbi-gomb');

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

                // **🔹 Frissítjük a szűrőpanel magasságát**
                frissitSzuroMagassag();
            });

            div.appendChild(tovabbi);
        }
    } catch (error) {
        console.log(error);
    }
}

function kosarbaTesz(termekId, event) {
    if (!event) {
        console.error("Nincs eseményobjektum!");
        return;
    }

    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", termek_id: termekId, mennyiseg: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("cart-count").textContent = data.uj_mennyiseg;
            
            // 🔹 Az animációhoz továbbadjuk az eseményt
            animateToCart(event);
        }
    })
    .catch(error => console.error("Hiba:", error));
}

function animateToCart(event) {
    if (!event || !event.target) {
        console.error("Nincs érvényes event objektum!");
        return;
    }

    const cartIcon = document.querySelector(".cart-icon img"); // Kosár ikon kiválasztása
    if (!cartIcon) return;

    const productCard = event.target.closest(".card"); // Teljes kártya
    const productImage = productCard.querySelector("img"); // Termék képe
    if (!productImage) return;

    // Új animációs elem létrehozása
    const img = document.createElement("img");
    img.src = productImage.src;
    img.classList.add("floating-image");
    document.body.appendChild(img);
 
    // Kiindulási pozíció (termékkép)
    const productRect = productImage.getBoundingClientRect();
    img.style.position = "fixed";
    img.style.left = `${productRect.left}px`;
    img.style.top = `${productRect.top}px`;
    img.style.width = `${productRect.width}px`;
    img.style.height = `${productRect.height}px`;

    // Célpozíció (kosár ikon)
    const cartRect = cartIcon.getBoundingClientRect();
    const cartX = cartRect.left + cartRect.width / 2 - productRect.width / 2;
    const cartY = cartRect.top + cartRect.height / 2 - productRect.height / 2;

    // Animáció indítása
    img.animate([
        { transform: "scale(1) translate(0, 0)", opacity: 1 },
        { transform: `scale(0.5) translate(${cartX - productRect.left}px, ${cartY - productRect.top}px)`, opacity: 0.7 },
        { transform: `scale(0.2) translate(${cartX - productRect.left}px, ${cartY - productRect.top}px)`, opacity: 0 }
    ], {
        duration: 700,
        easing: "ease-in-out",
        fill: "forwards"
    });

    // Kép eltávolítása az animáció végén
    setTimeout(() => img.remove(), 700);
}

// Kosár gombokhoz események hozzáadása
document.querySelectorAll(".btn-success").forEach(button => {
    button.addEventListener("click", function(event) {
        event.stopPropagation();
        kosarbaTesz(this.getAttribute("data-id"), event);
    });
});

// Kártyák feltöltése
function feltolesKartyakkal(adatok) {
    kartyak.innerHTML = "";
    for (const adat of adatok) {
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
            kosarbaTesz(adat.cikkszam, event); // 🔹 Esemény továbbadása
        };               

        let buttonContainer = document.createElement("div");
        buttonContainer.classList.add("d-flex", "justify-content-between", "mt-auto", "w-100");
        buttonContainer.appendChild(cartButton);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardTitle2);
        cardBody.appendChild(buttonContainer);

        card.appendChild(cardBody);

        kartyak.appendChild(card);
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