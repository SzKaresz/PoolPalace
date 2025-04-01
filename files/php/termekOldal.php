<?php
ob_start();
include './session.php'; // Munkamenet kezelés (ha kell)
include 'db.php';      // Adatbázis kapcsolat

// Cikkszám lekérése az URL-ből
if (!isset($_GET['cikkszam'])) {
    header('Location: termekek.php'); // Visszairányítás, ha nincs cikkszám
    exit();
}
$cikkszam = htmlspecialchars($_GET['cikkszam']);

// Termékadatok lekérdezése
// MOST MÁR BIZTOSAN KELL A 'darabszam' (vagy a tényleges készlet oszlop neve)
$query = "SELECT
            t.nev, t.leiras, t.egysegar, t.akcios_ar, t.darabszam AS keszlet, -- Itt a keszlet oszlop aliassal
            gy.nev AS gyarto_nev,
            kat.nev AS kategoria_nev -- Feltételezett 'kategoria_nev' a JOIN-ból
          FROM termekek t
          LEFT JOIN gyarto gy ON gy.id = t.gyarto_id
          LEFT JOIN kategoria kat ON kat.id = t.kategoria_id -- Feltételezett JOIN kategóriára
          WHERE t.cikkszam = ?";

$stmt = $db->prepare($query);
$stmt->bind_param("s", $cikkszam);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Ide egy szebb hibaoldal vagy üzenet kellene
    echo "A termék nem található.";
    // include './footer.php'; // esetleg footer itt is?
    exit();
}
$termek = $result->fetch_assoc();
$max_keszlet = (int)($termek['keszlet'] ?? 0); // Maximális rendelhető mennyiség

// Készletlogika
$raktaron = $max_keszlet > 0;
$keszlet_szoveg = $raktaron ? "Raktáron" : "Nincs készleten";
$keszlet_class = $raktaron ? "text-success" : "text-danger";

// Képek keresése (marad a régi logika)
$kepek = [];
$alap_kep_fajlnev = $cikkszam . ".webp";
$kep_teljes_ut = "../img/termekek/$alap_kep_fajlnev";
if (file_exists($kep_teljes_ut) && is_readable($kep_teljes_ut)) {
    $kepek[] = $alap_kep_fajlnev;
}
for ($i = 1; $i <= 5; $i++) {
    $kep_fajlnev = $cikkszam . "_$i" . ".webp";
    $kep_teljes_ut = "../img/termekek/$kep_fajlnev";
    if (file_exists($kep_teljes_ut) && is_readable($kep_teljes_ut)) {
        $kepek[] = $kep_fajlnev;
    }
}
// Ha egyáltalán nincs kép, tegyünk be egy placeholder-t
if (empty($kepek)) {
    $placeholder_kep = 'placeholder.webp';
    $placeholder_ut = "../img/termekek/$placeholder_kep";
    if (file_exists($placeholder_ut) && is_readable($placeholder_ut)) {
        $kepek[] = $placeholder_kep;
    } else {
        // Végső esetben ne legyen kép, vagy írjunk ki hibát
        // $kepek[] = 'ures.png'; // Valami nagyon alap kép
    }
}

// Kategória linkek
$kategoria_nev = $termek['kategoria_nev'] ?? "Termékek";
// Jó lenne, ha a kategóriának lenne egy 'slug'-ja vagy ID-ja az URL-hez
// Példa ID-val: $kategoria_link = "termekek.php?kategoria_id=" . ($termek['kategoria_id'] ?? 0);
$kategoria_link = "termekek.php?kategoria=" . urlencode($kategoria_nev);

?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($termek['nev']); ?> - PoolPalace</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="../css/termekOldal.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
</head>

<body>

    <?php include './navbar.php'; // Navbar betöltése 
    ?>

    <div class="container mt-4 mb-5">

        <nav aria-label="breadcrumb" class="mb-4">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Főoldal</a></li>
                <li class="breadcrumb-item"><a href="<?= htmlspecialchars($kategoria_link) ?>"><?= htmlspecialchars($kategoria_nev) ?></a></li>
                <li class="breadcrumb-item active" aria-current="page"><?php echo htmlspecialchars($termek['nev']); ?></li>
            </ol>
        </nav>

        <div class="row gy-4">
            <div class="col-lg-7">
                <?php if (!empty($kepek)): ?>
                    <div id="productCarousel" class="carousel slide mb-3" data-bs-ride="false" data-bs-interval="false">
                        <div class="carousel-inner bg-light rounded border">
                            <?php foreach ($kepek as $index => $kep): ?>
                                <div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">
                                    <img src="../img/termekek/<?php echo $kep; ?>"
                                        class="d-block w-100 product-main-image"
                                        alt="<?php echo htmlspecialchars($termek['nev']) . ' - kép ' . ($index + 1); ?>">
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <?php if (count($kepek) > 1): // Csak akkor kellenek a vezérlők, ha több kép van 
                        ?>
                            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Előző</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Következő</span>
                            </button>
                        <?php endif; ?>
                    </div>

                    <?php if (count($kepek) > 1): // Bélyegképek, ha több kép van 
                    ?>
                        <div class="carousel-thumbnails d-flex flex-wrap justify-content-center gap-2">
                            <?php foreach ($kepek as $index => $kep): ?>
                                <img src="../img/termekek/<?php echo $kep; ?>"
                                    alt="Bélyegkép <?php echo $index + 1; ?>"
                                    class="img-thumbnail thumbnail-item <?php echo $index === 0 ? 'active' : ''; ?>"
                                    data-bs-target="#productCarousel"
                                    data-bs-slide-to="<?php echo $index; ?>"
                                    aria-current="<?php echo $index === 0 ? 'true' : 'false'; ?>"
                                    aria-label="Dia <?php echo $index + 1; ?>">
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                <?php else: ?>
                    <div class="alert alert-warning">Nincs elérhető kép a termékhez.</div>
                <?php endif; ?>
            </div>

            <div class="col-lg-5">
                <div class="product-details ps-lg-3">
                    <h1 class="product-title h3 mb-3"><?php echo htmlspecialchars($termek['nev']); ?></h1>

                    <div class="mb-3 product-meta">
                        <span class="me-3"><strong>Cikkszám:</strong> <?php echo $cikkszam; ?></span>
                        <?php if (!empty($termek['gyarto_nev'])): ?>
                            <span><strong>Gyártó:</strong> <?php echo htmlspecialchars($termek['gyarto_nev']); ?></span>
                        <?php endif; ?>
                    </div>

                    <div class="price-section mb-3">
                        <?php if (!empty($termek['akcios_ar']) && $termek['akcios_ar'] > 0 && $termek['akcios_ar'] < $termek['egysegar']): ?>
                            <span class="original-price fs-5 me-2">
                                <?php echo number_format($termek['egysegar'], 0, ',', ' '); ?> Ft
                            </span>
                            <span class="discounted-price h4 fw-bold text-danger">
                                <?php echo number_format($termek['akcios_ar'], 0, ',', ' '); ?> Ft
                            </span>
                        <?php else: ?>
                            <span class="current-price h4 fw-bold">
                                <?php echo number_format($termek['egysegar'], 0, ',', ' '); ?> Ft
                            </span>
                        <?php endif; ?>
                    </div>

                    <div class="stock-status mb-4 fw-bold <?= $keszlet_class ?>">
                        <?= $keszlet_szoveg ?> <?= $raktaron ? "($max_keszlet db)" : "" ?>
                    </div>

                    <?php if ($raktaron): // Csak akkor jelenítjük meg a kosár részt, ha van készleten 
                    ?>
                        <div class="add-to-cart-section bg-light p-3 rounded border mb-4" id="product-<?= $cikkszam; // ID a JS könnyebb eléréséhez 
                                                                                                        ?>">
                            <div class="row g-2 align-items-center">
                                <div class="col-auto">
                                    <label for="quantityInput-<?= $cikkszam; ?>" class="form-label mb-0 me-2 fw-bold">Mennyiség:</label>
                                </div>
                                <div class="col-auto">
                                    <div class="quantity-control-wrapper">
                                        <button class="btn quantity-btn minus" type="button" aria-label="Mennyiség csökkentése" disabled>&minus;</button>
                                        <input type="number"
                                            class="form-control quantity-input"
                                            id="quantityInput-<?= $cikkszam; ?>"
                                            value="1"
                                            min="1"
                                            max="<?= $max_keszlet ?>"
                                            data-max-stock="<?= $max_keszlet ?>"
                                            aria-label="Mennyiség"
                                            readonly> <button class="btn quantity-btn plus" type="button" aria-label="Mennyiség növelése" <?= $max_keszlet <= 1 ? 'disabled' : '' ?>>&plus;</button>
                                    </div>
                                </div>
                                <div class="col">
                                    <button class="btn btn-primary w-100 add-to-cart-btn"
                                        type="button"
                                        data-cikkszam="<?= $cikkszam ?>"
                                        data-max-stock="<?= $max_keszlet ?>">
                                        <i class="bi bi-cart-plus me-2"></i>Kosárba tesz
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-warning" role="alert">
                            Ez a termék jelenleg nem rendelhető.
                        </div>
                    <?php endif; ?>

                    <div class="accordion" id="descriptionAccordion">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    Termékleírás
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#descriptionAccordion">
                                <div class="accordion-body">
                                    <?php echo nl2br(htmlspecialchars($termek['leiras'])); // nl2br megtartja a sortöréseket 
                                    ?>
                                    <?php if (empty($termek['leiras'])) {
                                        echo "Nincs elérhető leírás ehhez a termékhez.";
                                    } ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="toast-container"></div>

    <?php include './footer.php'; // Footer betöltése 
    ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const productContainer = document.getElementById('product-<?= $cikkszam; ?>');
            const carouselElement = document.getElementById('productCarousel');

            if (productContainer && <?= $raktaron ? 'true' : 'false' ?>) { // Csak akkor adjuk hozzá a listenereket, ha van készlet
                const quantityInput = productContainer.querySelector('.quantity-input');
                const minusBtn = productContainer.querySelector('.quantity-btn.minus');
                const plusBtn = productContainer.querySelector('.quantity-btn.plus');
                const addToCartBtn = productContainer.querySelector('.add-to-cart-btn');
                const maxStock = parseInt(quantityInput.dataset.maxStock || '1'); // Vagy quantityInput.max

                function updateQuantityButtons(currentValue) {
                    minusBtn.disabled = (currentValue <= 1);
                    plusBtn.disabled = (currentValue >= maxStock);
                }

                // Mennyiség növelése gomb
                plusBtn.addEventListener('click', function() {
                    let currentValue = parseInt(quantityInput.value);
                    if (currentValue < maxStock) {
                        currentValue++;
                        quantityInput.value = currentValue;
                        updateQuantityButtons(currentValue);
                    }
                });

                // Mennyiség csökkentése gomb
                minusBtn.addEventListener('click', function() {
                    let currentValue = parseInt(quantityInput.value);
                    if (currentValue > 1) {
                        currentValue--;
                        quantityInput.value = currentValue;
                        updateQuantityButtons(currentValue);
                    }
                });

                // Mennyiség input kézi változtatásának figyelése (opcionális)
                // Ha readonly az input, ez nem kell
                /*
                quantityInput.addEventListener('change', function() {
                    let currentValue = parseInt(this.value);
                    if (isNaN(currentValue) || currentValue < 1) {
                        currentValue = 1;
                    } else if (currentValue > maxStock) {
                        currentValue = maxStock;
                    }
                    this.value = currentValue;
                    updateQuantityButtons(currentValue);
                });
                */

                // Kosárba tesz gomb
                addToCartBtn.addEventListener('click', function(event) {
                    const cikkszam = this.dataset.cikkszam;
                    const quantity = parseInt(quantityInput.value);
                    // A kosarbaTesz funkciónak (ha az általad adott verziót használjuk)
                    // szüksége van a termék ID-re, az eventre és a max készletre.
                    // Győződj meg róla, hogy a kosarbaTesz definíciója elérhető!
                    if (typeof kosarbaTesz === 'function') {
                        // Az általad adott kosarbaTesz csak 1 db-ot ad hozzá,
                        // módosítani kellene, hogy a kiválasztott mennyiséget adja hozzá.
                        // Itt egy példa, feltételezve, hogy a kosarbaTesz át lett írva:
                        // kosarbaTesz(cikkszam, quantity, event, maxStock);

                        // VAGY: Használjuk az eredeti logikádat, de a megfelelő mennyiséggel és animációval
                        const dataToSend = {
                            action: "add", // Vagy "set", ha a backend tudja kezelni a mennyiséget
                            termek_id: cikkszam,
                            mennyiseg: quantity
                        };

                        fetch("../php/kosarMuvelet.php", { // A te backend végpontod
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(dataToSend)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.success) {
                                    // Sikeres hozzáadás után frissítjük a számlálót és animálunk
                                    if (typeof updateCartCount === "function") {
                                        updateCartCount();
                                    }
                                    if (typeof animateToCart === "function") {
                                        animateToCart(event); // Itt az event fontos az animációhoz
                                    }
                                    if (typeof showToast === "function") {
                                        showToast(data.message || 'Termék a kosárba téve!', 'success');
                                    }
                                } else {
                                    // Hiba esetén üzenet
                                    if (typeof showToast === "function") {
                                        showToast(data?.error || "Ismeretlen hiba történt a kosárba helyezéskor!", "danger");
                                    } else {
                                        alert(data?.error || "Hiba történt!");
                                    }
                                }
                            })
                            .catch(error => {
                                console.error("Hiba a kosárba helyezés AJAX hívásakor:", error);
                                if (typeof showToast === "function") {
                                    showToast("Hálózati hiba történt a kosárba helyezéskor!", "danger");
                                } else {
                                    alert("Hálózati hiba!");
                                }
                            });

                    } else {
                        console.error('A kosarbaTesz funkció nem található!');
                        alert('Hiba: Kosár funkció nem elérhető.');
                    }
                });

                // Kezdeti gomb állapot beállítása
                updateQuantityButtons(parseInt(quantityInput.value));
            } // end if(productContainer)

            // Thumbnail klikk és carousel csúszás figyelése az aktív class frissítéséhez
            if (carouselElement) {
                const thumbnails = document.querySelectorAll('.thumbnail-item');
                thumbnails.forEach(thumb => {
                    thumb.addEventListener('click', function() {
                        document.querySelector('.thumbnail-item.active')?.classList.remove('active');
                        this.classList.add('active');
                    });
                });

                carouselElement.addEventListener('slid.bs.carousel', event => {
                    const activeIndex = event.to;
                    document.querySelector('.thumbnail-item.active')?.classList.remove('active');
                    const activeThumbnail = document.querySelector(`.thumbnail-item[data-bs-slide-to="${activeIndex}"]`);
                    if (activeThumbnail) {
                        activeThumbnail.classList.add('active');
                    }
                });
            } // end if(carouselElement)

        });
        // kosar_funkciok.js (vagy a te fájlod neve)

        // Toast Üzenet Megjelenítése
        function showToast(message, type = "danger") {
            let toastContainer = document.getElementById("toast-container");
            // Ha nincs konténer, létrehozzuk (bár a HTML-ben már ott kellene lennie)
            if (!toastContainer) {
                console.warn("Toast container not found, creating one.");
                toastContainer = document.createElement("div");
                toastContainer.id = "toast-container";
                // Stílusokat CSS-ben kell megadni!
                document.body.appendChild(toastContainer);
            }

            // Egyszerre max 3 toast (opcionális)
            const maxToastCount = 3;
            const currentToasts = toastContainer.querySelectorAll(".toast");
            if (currentToasts.length >= maxToastCount) {
                currentToasts[0].remove(); // Legrégebbit távolítja el
            }

            let toast = document.createElement("div");
            // Bootstrap 5 toast struktúra
            toast.className = `toast align-items-center text-bg-${type} border-0 show`; // show class kell az azonnali megjelenéshez, ha nem triggereli a JS
            toast.setAttribute("role", "alert");
            toast.setAttribute("aria-live", "assertive");
            toast.setAttribute("aria-atomic", "true");
            toast.setAttribute("data-bs-autohide", "true"); // Automatikusan eltűnik
            toast.setAttribute("data-bs-delay", "5000"); // 5 másodperc múlva (állítható)

            toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

            toastContainer.prepend(toast); // Új toast kerüljön felülre

            // Bootstrap Toast inicializálása (ha még nem lenne 'show' class és manuálisan kellene)
            // const toastInstance = new bootstrap.Toast(toast);
            // toastInstance.show();

            // Eltávolítás az animáció után (ha data-bs-autohide false lenne vagy biztosra akarunk menni)
            toast.addEventListener('hidden.bs.toast', function() {
                toast.remove();
            });
        }


        // Animáció a kosárhoz
        function animateToCart(event) {
            // Kell a kattintási event, hogy tudjuk, honnan induljon az animáció
            if (!event || !event.target) {
                console.error("animateToCart: Hiányzó event objektum!");
                return;
            }

            // Kosár ikon megkeresése (lehet, hogy pontosabb szelektor kell)
            const cartIcon = document.querySelector(".cart-icon img, .cart-icon i"); // Próbál képet vagy ikont keresni
            if (!cartIcon) {
                console.warn("animateToCart: Kosár ikon (.cart-icon img/i) nem található!");
                return;
            }

            // A kép forrása: A termékkép a termék oldalon
            // Meg kell keresni a nagy képet a termékoldalon.
            // Legegyszerűbb, ha a gombhoz legközelebbi képet használjuk, de az lehet a thumbnail is.
            // Inkább a carousel aktív elemét keressük meg.
            const mainProductImage = document.querySelector('#productCarousel .carousel-item.active img');
            if (!mainProductImage) {
                console.warn("animateToCart: Fő termékkép (#productCarousel .carousel-item.active img) nem található!");
                return; // Nincs mit animálni
            }

            const img = document.createElement("img");
            img.src = mainProductImage.src;
            img.classList.add("floating-image"); // CSS class a stílushoz és pozicionáláshoz
            document.body.appendChild(img);

            // Kiinduló pozíció és méret (a nagy termékképé)
            const productRect = mainProductImage.getBoundingClientRect();
            img.style.left = `${productRect.left}px`;
            img.style.top = `${productRect.top}px`;
            img.style.width = `${productRect.width}px`; // Kezdő méret lehet a nagy kép mérete
            img.style.height = `${productRect.height}px`;
            img.style.opacity = '1';

            // Cél pozíció (a kosár ikon közepe)
            const cartRect = cartIcon.getBoundingClientRect();
            const targetX = cartRect.left + cartRect.width / 2 - productRect.width / 4; // Kicsinyített kép közepéhez igazítva
            const targetY = cartRect.top + cartRect.height / 2 - productRect.height / 4;

            // Távolság
            const deltaX = targetX - productRect.left;
            const deltaY = targetY - productRect.top;

            // Web Animations API használata
            img.animate([
                // Kezdő állapot (nagy kép helye, teljes méret)
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                // Köztes állapot (opcionális, pl. felugrik kicsit)
                // { transform: `translate(${deltaX / 2}px, ${deltaY / 2 - 30}px) scale(0.5)`, opacity: 0.7, offset: 0.5 },
                // Végállapot (kosár ikon helye, kicsi méret, eltűnik)
                {
                    transform: `translate(${deltaX}px, ${deltaY}px) scale(0.1)`,
                    opacity: 0
                }
            ], {
                duration: 800, // Animáció hossza (ms)
                easing: 'ease-in-out', // Gyorsulás
                fill: 'forwards' // Maradjon a végállapotban
            }).onfinish = () => {
                // Animáció végén eltávolítjuk a lebegő képet
                img.remove();
                // Itt lehetne egy kis effekt a kosár ikonon is, pl. megrázkódik
                cartIcon.classList.add('shake'); // Kell egy 'shake' animáció CSS-ben
                setTimeout(() => cartIcon.classList.remove('shake'), 400);
            };
        }


        // Kosár darabszám frissítése a Navbárban
        function updateCartCount() {
            fetch("../php/kosarMuvelet.php", { // Backend végpont a darabszám lekéréséhez
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // Küldhetünk egy action-t, hogy tudja a backend, mit akarunk
                    body: JSON.stringify({
                        action: "getCount"
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Feltételezzük, hogy a backend { success: true, uj_mennyiseg: X } formában válaszol
                    if (data && data.success) {
                        const count = data.uj_mennyiseg || 0;
                        const cartCountElement = document.getElementById("cart-count"); // A badge ID-ja a navbarban

                        if (cartCountElement) {
                            cartCountElement.textContent = count;
                            // Elrejtjük a badge-et, ha a kosár üres
                            cartCountElement.style.display = count > 0 ? 'inline-block' : 'none';
                        } else if (count > 0) {
                            // Ha még nincs badge, létrehozzuk (első termék hozzáadásakor)
                            const cartIcon = document.querySelector(".cart-icon"); // A kosár ikon konténere
                            if (cartIcon) {
                                const badge = document.createElement("span");
                                badge.id = "cart-count";
                                badge.className = "badge rounded-pill bg-danger"; // Bootstrap badge stílus
                                badge.textContent = count;
                                // Pozícionálás CSS-ben kell! Pl. position: absolute; top:0; right:0;
                                cartIcon.style.position = 'relative'; // Szülő legyen relatív
                                badge.style.position = 'absolute';
                                badge.style.top = '-5px';
                                badge.style.right = '-10px';
                                badge.style.fontSize = '0.7em';
                                badge.style.padding = '0.3em 0.5em';
                                cartIcon.appendChild(badge);
                            } else {
                                console.warn("updateCartCount: Kosár ikon (.cart-icon) nem található a badge létrehozásához.");
                            }
                        }
                    } else {
                        console.error("updateCartCount: Hiba a kosár darabszám lekérésekor.", data?.error);
                    }
                })
                .catch(error => {
                    console.error("updateCartCount: Hálózati hiba a kosár darabszám lekérésekor.", error);
                });
        }

        // Kosárba tétel függvény (AZ ÁLTALAD ADOTT VERZIÓ - FIGYELEM: EZ CSAK 1 DB-ot AD HOZZÁ!)
        // Ezt vagy átírod, hogy fogadja a mennyiséget, vagy a fenti termékoldali JS-ben
        // lévő fetch hívást használod inkább.
        /*
        function kosarbaTesz(termekId, event, maxStock) {
            if (!event) return; // Event kell az animációhoz

            fetch("../php/kosarMuvelet.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Ez a verzió mindig csak 1 db-ot ad hozzá!
                body: JSON.stringify({ action: "add", termek_id: termekId, mennyiseg: 1 })
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.success) {
                    updateCartCount(); // Frissíti a navbart
                    // checkCartState(); // Ez inkább lista oldalon releváns
                    animateToCart(event); // Elindítja az animációt
                    showToast(data.message || 'Termék a kosárba téve!', 'success');
                } else {
                    let hiba = data?.error || "Ismeretlen hiba történt!";
                    showToast(hiba, "danger");
                }
            })
            .catch(error => {
                console.error("Hiba a kosarbaTesz során:", error);
                showToast("Hálózati hiba történt!", "danger");
            });
        }
        */

        // Oldal betöltődésekor frissítsük a kosár számot (ha van bejelentkezett user és session)
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        });
    </script>
    <?php ob_end_flush(); ?>
</body>

</html>