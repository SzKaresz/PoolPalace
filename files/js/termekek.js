let valasz;
let kartyak = document.getElementById("kartyak");
let kivalasztottSzurok = {
    kategoriak: new Set(),
    gyartok: new Set()
};

document.addEventListener("change", function (event) {
    if (event.target.name === "kategoriak") {
        if (event.target.checked) {
            kivalasztottSzurok.kategoriak.add(event.target.value);
        } else {
            kivalasztottSzurok.kategoriak.delete(event.target.value);
        }
    }

    if (event.target.name === "gyartok") {
        if (event.target.checked) {
            kivalasztottSzurok.gyartok.add(event.target.value);
        } else {
            kivalasztottSzurok.gyartok.delete(event.target.value);
        }
    }
});

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

    let isLargeScreen = window.innerWidth > 1200;

    // Kis képernyőn alapból elrejtjük a szűrőpanelt és a megfelelő gombfeliratot állítjuk be
    if (!isLargeScreen) {
        szuroContainer.style.display = "none";
        szuroContainer.classList.add("hidden");
        szuroButton.innerText = "Szűrők megjelenítése";
    }

    let szuroLathato = isLargeScreen;

    szuroButton.addEventListener("click", function () {
        if (szuroLathato) {
            if (isLargeScreen) {
                szuroContainer.classList.add("hidden");
                szuroContainer.classList.remove("show");
                kartyakContainer.classList.add("expanded");
            } else {
                szuroContainer.classList.remove("show");
                setTimeout(() => {
                    szuroContainer.style.display = "none";
                }, 500);
            }
            szuroButton.innerText = "Szűrők megjelenítése";
        } else {
            if (isLargeScreen) {
                szuroContainer.classList.add("show");
                szuroContainer.classList.remove("hidden");
                kartyakContainer.classList.remove("expanded");
            } else {
                szuroContainer.style.display = "block";
                setTimeout(() => {
                    szuroContainer.classList.add("show");
                    szuroContainer.classList.remove("hidden");
                }, 20);
            }

            // 🔹 **Kis képernyőn az egész szűrőpanel jelenjen meg teljes méretben**
            setTimeout(() => {
                if (!isLargeScreen) {
                    szuroContainer.style.height = "100vh"; // Teljes képernyő magasság
                    szuroContainer.style.maxHeight = "100vh"; // Ne lehessen túlcsúszni
                    szuroContainer.style.overflowY = "hidden"; // Ne görgessen
                } else {
                    // Nagy képernyőn marad az eredeti működés
                    szuroContainer.style.height = "calc(100vh - 80px)";
                    szuroContainer.style.maxHeight = "calc(100vh - 80px)";
                    szuroContainer.style.overflowY = "auto";
                }
            }, 350);

            szuroButton.innerText = "Szűrők elrejtése";
        }
        szuroLathato = !szuroLathato;
    });

    window.addEventListener("resize", function () {
        isLargeScreen = window.innerWidth > 1200;
        if (!isLargeScreen) {
            szuroContainer.classList.remove("show");
            szuroContainer.classList.add("hidden");
            szuroContainer.style.display = "none";
            szuroLathato = false;
            szuroButton.innerText = "Szűrők megjelenítése";
        } else {
            szuroContainer.style.display = "block";
            szuroContainer.classList.remove("hidden");
            szuroContainer.classList.add("show");
            kartyakContainer.classList.remove("expanded");
            szuroLathato = true;
            szuroButton.innerText = "Szűrők elrejtése";
        }
    });

    // Navbar mindig legyen a szűrő felett
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.style.zIndex = "1050"; // Magasabb z-index, mint a szűrőé
    }
    szuroContainer.style.zIndex = "1000";
});

function getItemsPerPage() {
    if (window.innerWidth > 1500) return 20;
    if (window.innerWidth > 1200) return 16;
    if (window.innerWidth > 768) return 12;
    return 8;
}

let currentPage = 1;
let itemsPerPage = getItemsPerPage();          

function tetejere(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupPagination(totalPages, currentPage = 1) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.setAttribute("onclick", "tetejere()");
        button.classList.add("pagination-btn");

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", function () {
            loadProducts(i);
        });

        paginationContainer.appendChild(button);
    }
}               

// Fő függvények
function loadProducts(page = 1, sortType = '') {
    const limitPerPage = getItemsPerPage();
    let queryParams = new URLSearchParams();

    if (sortType) {
        queryParams.set("sort", sortType);
        localStorage.setItem("currentSort", sortType);
    } else {
        sortType = localStorage.getItem("currentSort") || '';
        if (sortType) queryParams.set("sort", sortType);
    }

    queryParams.set("page", page);
    queryParams.set("limit", limitPerPage);

    // **🔹 SZŰRÉSI PARAMÉTEREK HOZZÁADÁSA**
    let kategoriak = Array.from(kivalasztottSzurok.kategoriak);
    let gyartok = Array.from(kivalasztottSzurok.gyartok);

    if (kategoriak.length > 0) {
        queryParams.set("kategoriak", kategoriak.join(","));
    }
    if (gyartok.length > 0) {
        queryParams.set("gyartok", gyartok.join(","));
    }

    let fromPrice = document.getElementById('fromSlider').value;
    let toPrice = document.getElementById('toSlider').value;
    queryParams.set("fromprice", fromPrice);
    queryParams.set("toprice", toPrice);

    fetch(`./termekek_api.php?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            displayProducts(data.termekek, data.total_items);
            setupPagination(data.total_pages, page);
        })
        .catch(error => console.error("Hiba a termékek betöltésekor:", error));
}

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
async function kategoriaFeltolt() {
    try {
        let eredmeny = await fetch("../php/kategoriaLeker.php");
        if (!eredmeny.ok) throw new Error("Hiba a szerver válaszában!");

        let valasz = await eredmeny.json();
        let div = document.getElementById('kategoriak');

        // **🔹 Megőrizzük a bejelölt elemeket**
        document.querySelectorAll('input[name="kategoriak"]:checked').forEach(checkbox => {
            kivalasztottSzurok.kategoriak.add(checkbox.value);
        });

        div.innerHTML = "<h6>Kategóriák</h6>";
        const maxVisible = getMaxVisibleElements();

        function hozzaadKategoria(adat) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "kategoriak";
            checkbox.value = adat.kategoria_nev;
            checkbox.style.marginRight = "10px";

            if (kivalasztottSzurok.kategoriak.has(adat.kategoria_nev)) {
                checkbox.checked = true;
            }

            let label = document.createElement('label');
            label.innerHTML = adat.kategoria_nev;

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
                    kategoriaFeltolt();
                });

                div.appendChild(bezaras);
            });

            div.appendChild(tovabbi);
        }

        // **🔹 Az eltárolt bejelölések DOM-ba állítása**
        document.querySelectorAll('input[name="kategoriak"]').forEach(checkbox => {
            if (kivalasztottSzurok.kategoriak.has(checkbox.value)) {
                checkbox.checked = true;
            }
        });

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
            displayProducts(valasz);
        }
    });
}

async function adatbazisbolLekeres() {
    try {
        let eredmeny = await fetch("../php/adatokLekerese.php");
        if (eredmeny.ok) {
            let valasz = await eredmeny.json();
            displayProducts(valasz, valasz.length); // 🚀 **Az új verziót használjuk**
        }
    } catch (error) {
        console.log(error);
    }
}

function Szures() {
    kartyak.innerHTML = "";  

    let fromprice = document.getElementById('fromSlider').value;
    let toprice = document.getElementById('toSlider').value;

    // 🔹 Beállítjuk a rejtett checkboxok értékeit is
    document.querySelectorAll('input[name="kategoriak"]:checked').forEach(checkbox => {
        kivalasztottSzurok.kategoriak.add(checkbox.value);
    });

    document.querySelectorAll('input[name="gyartok"]:checked').forEach(checkbox => {
        kivalasztottSzurok.gyartok.add(checkbox.value);
    });

    let kivalasztottKategoriak = Array.from(kivalasztottSzurok.kategoriak);
    let kivalasztottGyartok = Array.from(kivalasztottSzurok.gyartok);

    let szurtKartyak = valasz.filter(adat => {
        const egysegar = parseFloat(adat.egysegar.replace(/\s/g, ''));
        const akcios_ar = parseFloat(adat.akcios_ar.replace(/\s/g, ''));
        const hasznaltAr = (akcios_ar > -1 && akcios_ar < egysegar) ? akcios_ar : egysegar;

        return (
            toprice >= hasznaltAr && fromprice <= hasznaltAr &&
            (kivalasztottKategoriak.length === 0 || kivalasztottKategoriak.includes(adat.kategoria_nev)) &&
            (kivalasztottGyartok.length === 0 || kivalasztottGyartok.includes(adat.gyarto_nev))
        );
    });

    displayProducts(szurtKartyak, szurtKartyak.length);
}

// A magyar ABC helyes sorrendje
const magyarABC = [
    "a", "á", "b", "c", "cs", "d", "dz", "dzs", "e", "é", "f", "g", "gy", "h",
    "i", "í", "j", "k", "l", "m", "n", "ny", "o", "ó", "ö", "ő", "p", "q", "r",
    "s", "sz", "t", "ty", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z", "zs"
];

// Magyar ABC szerinti összehasonlítás
function compareHungarian(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    let minLength = Math.min(a.length, b.length);
    let i = 0;

    while (i < minLength) {
        let charA = a[i];
        let charB = b[i];

        if (charA === charB) {
            i++;
            continue;
        }

        let indexA = magyarABC.indexOf(charA);
        let indexB = magyarABC.indexOf(charB);

        if (indexA === -1 || indexB === -1) {
            return charA.localeCompare(charB, "hu", { sensitivity: "base" });
        }

        return indexA - indexB;
    }

    return a.length - b.length;
}

// Rendezés frissítése
function rendezes(sortType) {
    localStorage.setItem("currentSort", sortType);

    if (sortType === 'kiemelt') {
        loadProducts(1, 'kiemelt');
        return;
    }

    const kartyakContainer = document.getElementById('kartyak');
    const kartyak = Array.from(kartyakContainer.children);

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

    const fragment = document.createDocumentFragment();
    kartyak.forEach(kartya => fragment.appendChild(kartya));
    kartyakContainer.innerHTML = '';
    kartyakContainer.appendChild(fragment);

    frissitTalalatokSzama(kartyak.length);
}

// Dropdown események a rendezéshez
document.querySelectorAll('#dropdown-options li').forEach(option => {
    option.addEventListener('click', function () {
        const sortType = this.dataset.sort;
        document.getElementById('dropdown-button').textContent = this.textContent;
        rendezes(sortType);
        toggleDropdown();
    });
});

function frissitTalalatokSzama(osszDarab) {
    document.getElementById('talalatok-szam').textContent = `${osszDarab}`;
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

        // **🔹 Megőrizzük a bejelölt elemeket**
        document.querySelectorAll('input[name="gyartok"]:checked').forEach(checkbox => {
            kivalasztottSzurok.gyartok.add(checkbox.value);
        });

        div.innerHTML = "<h6>Gyártók</h6>";
        const maxVisible = getMaxVisibleElements();

        function hozzaadGyarto(adat) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "gyartok";
            checkbox.value = adat.gyarto_nev;
            checkbox.style.marginRight = "10px";

            if (kivalasztottSzurok.gyartok.has(adat.gyarto_nev)) {
                checkbox.checked = true;
            }

            let label = document.createElement('label');
            label.innerHTML = adat.gyarto_nev;

            div.appendChild(checkbox);
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
        }

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
            });

            div.appendChild(tovabbi);
        }

        // **🔹 Az eltárolt bejelölések DOM-ba állítása**
        document.querySelectorAll('input[name="gyartok"]').forEach(checkbox => {
            if (kivalasztottSzurok.gyartok.has(checkbox.value)) {
                checkbox.checked = true;
            }
        });

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
                let cartCountElement = document.getElementById("cart-count");

                if (cartCountElement) {
                    cartCountElement.textContent = data.uj_mennyiseg;
                } else {
                    // Ha először adunk hozzá terméket, létrehozzuk a számlálót
                    const cartIcon = document.querySelector(".cart-icon");
                    const badge = document.createElement("span");
                    badge.id = "cart-count";
                    badge.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
                    badge.textContent = data.uj_mennyiseg;
                    cartIcon.appendChild(badge);
                }

                // 🔹 Indítjuk az animációt, de a számlálót csak az animáció végén frissítjük
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

    const cartIcon = document.querySelector(".cart-icon img");
    if (!cartIcon) return;

    const productCard = event.target.closest(".card");
    const productImage = productCard.querySelector("img");
    if (!productImage) return;

    const img = document.createElement("img");
    img.src = productImage.src;
    img.classList.add("floating-image");
    document.body.appendChild(img);

    const productRect = productImage.getBoundingClientRect();
    img.style.position = "fixed";
    img.style.left = `${productRect.left}px`;
    img.style.top = `${productRect.top}px`;
    img.style.width = `${productRect.width}px`;
    img.style.height = `${productRect.height}px`;

    const cartRect = cartIcon.getBoundingClientRect();
    const deltaX = (cartRect.left + cartRect.width / 2) - (productRect.left + productRect.width / 2);
    const deltaY = (cartRect.top + cartRect.height / 2) - (productRect.top + productRect.height / 2);

    img.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2)`, opacity: 0 }
    ], {
        duration: 800,
        easing: "ease-in-out",
        fill: "forwards"
    });

    setTimeout(() => {
        img.remove();

        // **Ne növeljük a számlálót kézzel, hanem kérjünk frissítést a szerverről!**
        if (typeof updateCartCount === "function") {
            updateCartCount(); // **A kosar.js frissíti a valódi értéket**
        }

    }, 800);
}

// Kártyák feltöltése
function displayProducts(products, totalItems) {
    let container = document.getElementById("kartyak");
    container.innerHTML = "";

    products.forEach(adat => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.style.cursor = "pointer";

        card.addEventListener("click", function () {
            window.location.href = `../php/termekOldal.php?cikkszam=${adat.cikkszam}`;
        });

        let card_header = document.createElement('div');
        card_header.classList.add("card-header");
        card.appendChild(card_header);

        let img = document.createElement("img");
        img.src = `../img/termekek/${adat.cikkszam}.webp`;
        img.alt = adat.nev;
        img.classList.add("card-img-top");
        card_header.appendChild(img);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "d-flex", "flex-column");

        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.innerHTML = adat.nev;

        let cardPrice = document.createElement("h6");
        let akcios_ar = parseFloat(String(adat.akcios_ar).replace(/\s/g, ''));
        let egysegar = parseFloat(String(adat.egysegar).replace(/\s/g, ''));

        if (akcios_ar > -1 && akcios_ar < egysegar) {
            cardPrice.innerHTML = `<span class="original-price">${adat.egysegar}</span> 
                             <span class="discounted-price">${adat.akcios_ar}</span>`;
            card_header.innerHTML += `<div class="badge">Akció!</div>`;
        } else {
            cardPrice.innerHTML = `${adat.egysegar}`;
        }

        let cartButton = document.createElement("button");
        cartButton.classList.add("btn", "btn-success");
        cartButton.innerHTML = `Kosárba`;
        cartButton.setAttribute("data-id", adat.cikkszam);
        cartButton.onclick = function (event) {
            event.stopPropagation();
            kosarbaTesz(adat.cikkszam, event);
        };

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(cartButton);
        card.appendChild(cardBody);
        container.appendChild(card);
    });

    // 🔹 **Frissítsük a teljes találatok számát**
    document.getElementById("talalatok-szam").textContent = totalItems;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function adjustSzuroHeight() {
    let szuroContainer = document.getElementById("szuro-container");
    let footer = document.querySelector("footer");

    if (!szuroContainer || !footer) return;

    let windowHeight = window.innerHeight;
    let footerTop = footer.getBoundingClientRect().top;
    let navbarHeight = 80; // Navbar fix magassága

    if (footerTop > windowHeight) {
        szuroContainer.style.height = `calc(100vh - ${navbarHeight}px)`;
    } else {
        let availableHeight = footerTop - navbarHeight;
        szuroContainer.style.height = `${availableHeight}px`;
    }
}

// Frissítés görgetéskor és átméretezéskor
window.addEventListener("scroll", adjustSzuroHeight);
window.addEventListener("resize", adjustSzuroHeight);
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(adjustSzuroHeight, 50); // Kis késleltetés a teljes betöltésig
});
window.addEventListener("load", adjustSzuroHeight); // Végső biztosítás a teljes betöltés után

function initEventListeners() {
    document.getElementById("szures_button").addEventListener("click", function () {
        loadProducts(1);
    });

    document.getElementById('clear-filters').addEventListener('click', function () {
        // Az összes checkboxot kikapcsoljuk
        document.querySelectorAll('input[name="kategoriak"], input[name="gyartok"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Kiürítjük a tárolt szűrési beállításokat
        kivalasztottSzurok.kategoriak.clear();
        kivalasztottSzurok.gyartok.clear();

        // Alapértelmezett árértékek visszaállítása
        document.getElementById('fromSlider').value = 0;
        document.getElementById('toSlider').value = 5000000;
        document.getElementById('fromInput').value = 0;
        document.getElementById('toInput').value = 5000000;
        document.getElementById('toSlider').style.background = 'rgb(37, 218, 165)';

        // Visszatöltjük a kategóriákat és a gyártókat, hogy a becsukott részek is frissüljenek
        kategoriaFeltolt();
        gyartoFeltolt();

        // Frissítjük a terméklistát
        loadProducts(1);
    });    

    window.addEventListener("resize", () => {
        itemsPerPage = getItemsPerPage();
        loadProducts(currentPage);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const storedSort = localStorage.getItem("currentSort") || '';
    loadProducts(1, storedSort);
    kategoriaFeltolt();
    gyartoFeltolt();
    initEventListeners();
});