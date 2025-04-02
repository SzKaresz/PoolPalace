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

function tetejere() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupPagination(totalPages, current) {
    const leftContainer = document.querySelector(".pagination-left");
    const centerContainer = document.querySelector(".pagination-center");
    const rightContainer = document.querySelector(".pagination-right");

    leftContainer.innerHTML = "";
    centerContainer.innerHTML = "";
    rightContainer.innerHTML = "";

    function createPageButton(label, page, disabled = false, isActive = false) {
        const button = document.createElement("button");
        button.textContent = label;
        button.classList.add("page-btn");
        if (disabled) button.disabled = true;
        if (isActive) button.classList.add("active");
        button.addEventListener("click", () => {
            if (!disabled) {
                loadProducts(page);
                tetejere();
            }
        });
        return button;
    }

    // 🔹 Ha csak 1 oldal van, ne jelenítsük meg a lapozót
    if (totalPages <= 1) {
        return;
    }

    // « és < gombok
    leftContainer.appendChild(createPageButton("«", 1, current === 1));
    leftContainer.appendChild(createPageButton("<", current - 1, current === 1));

    // Csúszóablak – max. 5 oldalszám
    const visibleCount = 5;
    let startPage = Math.max(1, current - Math.floor(visibleCount / 2));
    let endPage = startPage + visibleCount - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - visibleCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        centerContainer.appendChild(createPageButton(i, i, false, i === current));
    }

    // > és » gombok
    rightContainer.appendChild(createPageButton(">", current + 1, current === totalPages));
    rightContainer.appendChild(createPageButton("»", totalPages, current === totalPages));
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

    // **🔹 Keresési érték betöltése LocalStorage-ból**
    let keresesiErtek = localStorage.getItem("keresesErtek");
    if (keresesiErtek) {
        queryParams.set("kereses", keresesiErtek);

    }

    fetch(`./termekek_api.php?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            displayProducts(data.termekek, data.total_items, page, data.total_pages);
            setupPagination(data.total_pages, page);
        })
        .catch(error => console.error("Hiba a termékek betöltésekor:", error));
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
            checkbox.id = adat.kategoria_nev;
            checkbox.style.marginRight = "10px";

            if (kivalasztottSzurok.kategoriak.has(adat.kategoria_nev)) {
                checkbox.checked = true;
            }

            let label = document.createElement('label');
            label.innerHTML = adat.kategoria_nev;
            label.htmlFor = adat.kategoria_nev;

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

// Rendezés frissítése
function rendezes(sortType) {
    localStorage.setItem("currentSort", sortType);
    currentPage = 1; // rendezés mindig az első oldaltól induljon
    loadProducts(currentPage, sortType); // szerverről újra lekérjük, most már rendezve
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

function frissitTalalatokSzama(osszDarab, oldalSzam = 1, osszesOldal = 1) {
    let szoveg;
    if (osszesOldal <= 1) {
        szoveg = `<b>Találatok: ${osszDarab} termék</b>`;
    } else {
        szoveg = `<b>${osszDarab} termék | ${oldalSzam}. oldal</b>`;
    }
    document.getElementById('talalatok').innerHTML = szoveg;
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
            checkbox.id = adat.gyarto_nev
            checkbox.value = adat.gyarto_nev;
            checkbox.style.marginRight = "10px";

            if (kivalasztottSzurok.gyartok.has(adat.gyarto_nev)) {
                checkbox.checked = true;
            }

            let label = document.createElement('label');
            label.innerHTML = adat.gyarto_nev;
            label.htmlFor = adat.gyarto_nev

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

function updateCartCount() {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getCount" })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) return;

            let cartCountElement = document.getElementById("cart-count");

            if (data.uj_mennyiseg > 0) {
                if (!cartCountElement) {
                    const cartIcon = document.querySelector(".cart-icon");
                    if (!cartIcon) {
                        console.warn("cart-icon nem található a DOM-ban.");
                        return;
                    }

                    const badge = document.createElement("span");
                    badge.id = "cart-count";
                    badge.className = "badge rounded-pill bg-danger";
                    badge.textContent = data.uj_mennyiseg;
                    cartIcon.appendChild(badge);
                } else {
                    cartCountElement.textContent = data.uj_mennyiseg;
                }
            } else {
                if (cartCountElement) {
                    cartCountElement.textContent = "0";
                    cartCountElement.style.display = "none";
                }
            }
        })
        .catch(error => console.error("Hiba a kosár frissítésében:", error));
}

function checkCartState() {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getCart" })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success || !Array.isArray(data.kosar)) {
                console.error("Hiba: a kosár adat nem megfelelő formátumú vagy nincs meghatározva.", data);
                return;
            }
        })
        .catch(error => console.error("Hiba a kosárállapot betöltésénél:", error));
}

function kosarbaTesz(termekId, event, maxStock) {
    if (!event) return;

    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", termek_id: termekId, mennyiseg: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.success) {
                updateCartCount();
                checkCartState();
                animateToCart(event);
            } else {
                let hiba = data?.error || "Ismeretlen hiba történt!";
                showToast(hiba, "danger");
            }
        })
        .catch(error => {
            console.error("Hiba:", error);
            showToast("Hálózati hiba történt!", "danger");
        });
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
function displayProducts(products, totalItems, oldalSzam = 1, osszesOldal = 1) {
    let container = document.getElementById("kartyak");
    container.innerHTML = "";

    products.forEach(adat => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.addEventListener("click", (event) => {
            if (!event.target.closest("button") && !event.target.closest("input")) {
                window.location.href = `../php/termekOldal.php?cikkszam=${adat.cikkszam}`;
            }
        });

        let cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        let img = document.createElement("img");
        img.src = `../img/termekek/${adat.cikkszam}.webp`;
        img.alt = adat.nev;
        img.classList.add("card-img-top");
        cardHeader.appendChild(img);

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "d-flex", "flex-column");

        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.innerHTML = adat.nev;

        let cardPrice = document.createElement("h6");
        cardPrice.classList.add("card-subtitle", "mb-2", "text-muted");

        let akcios_ar = parseFloat(adat.akcios_ar.replace(/\s/g, ''));
        let egysegar = parseFloat(adat.egysegar.replace(/\s/g, ''));
        if (akcios_ar > -1 && akcios_ar < egysegar) {
            cardPrice.innerHTML = `<span class="original-price">${adat.egysegar}</span> 
                                 <span class="discounted-price">${adat.akcios_ar}</span>`;
            cardHeader.innerHTML += `<div class="badge">Akció!</div>`;
        } else {
            cardPrice.innerHTML = `${adat.egysegar}`;
        }

        let cartButtonContainer = document.createElement("div");
        cartButtonContainer.classList.add("cart-button-container");

        let cartButton = document.createElement("button");
        cartButton.classList.add("btn", "add-to-cart");
        cartButton.innerHTML = `<img src="../img/cart.png" class="cart-icon-img" alt="Kosár"> Kosárba`;
        cartButton.setAttribute("data-id", adat.cikkszam);

        // Ha a termék nincs raktáron
        if (adat.raktar_keszlet === 0) {
            cartButton.disabled = true;
            cartButton.classList.add("disabled");
            cartButton.innerHTML = `Nincs készleten`;
        } else {
            cartButton.onclick = function (event) {
                event.stopPropagation();
                kosarbaTesz(adat.cikkszam, event, adat.raktar_keszlet);
            };
        }

        cartButtonContainer.appendChild(cartButton);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardPrice);
        cardBody.appendChild(cartButtonContainer);
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        container.appendChild(card);
    });

    frissitTalalatokSzama(totalItems, oldalSzam, osszesOldal);
    checkCartState(); // Frissíti a darabszámokat és vezérlőket
}

function adjustSzuroHeight() {
    if (window.innerWidth < 1200) {
        return;
    }

    let szuroContainer = document.getElementById("szuro-container");
    let footer = document.querySelector("footer");

    if (!szuroContainer || !footer) return;

    let windowHeight = window.innerHeight;
    let footerTop = footer.getBoundingClientRect().top;
    let navbarHeight = 80;

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
        localStorage.removeItem("keresesErtek"); // 🔹 Töröljük, hogy ne maradjon ott feleslegesen
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
}

function showToast(message, type = "danger") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const maxToastCount = 3;
    const currentToasts = toastContainer.querySelectorAll(".toast");
    if (currentToasts.length >= maxToastCount) {
        currentToasts[currentToasts.length - 1].remove();
    }

    let toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0 shadow`;
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
        if (type === "success") {
            window.location.reload();
        }
    }, 6000);
}

document.addEventListener("DOMContentLoaded", function () {
    const storedSort = localStorage.getItem("currentSort") || '';
    loadProducts(1, storedSort);
    kategoriaFeltolt();
    gyartoFeltolt();
    initEventListeners();
    checkCartState();
});