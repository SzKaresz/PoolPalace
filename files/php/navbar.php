<link rel="stylesheet" href="../css/navbar.css">
<?php
ob_start();
include './session.php';

$termekekSzama = 0;

if (isset($_SESSION['user_email'])) {
    include '../php/db.php';
    $user_email = $_SESSION['user_email'];

    $query = $db->prepare("SELECT SUM(darabszam) AS osszes_darab FROM kosar WHERE felhasznalo_id = ?");
    $query->bind_param("s", $user_email);
    $query->execute();
    $result = $query->get_result()->fetch_assoc();

    $termekekSzama = $result['osszes_darab'] ?? 0;
} else {
    if (isset($_SESSION['kosar'])) {
        $termekekSzama = array_sum($_SESSION['kosar']);
    }
}
$current_page = basename($_SERVER['PHP_SELF']);
?>

<nav class="navbar navbar-dark navbar-expand-xl w-100 fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="./index.php">
            <img src="../img/logo.png" alt="PoolPalace">
        </a>

        <button class="navbar-toggler d-xl-none" type="button"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item <?php echo ($current_page === 'index.php') ? 'active' : ''; ?>">
                    <a class="nav-link" href="index.php">Kezdőlap</a>
                </li>
                <li class="nav-item <?php echo ($current_page === 'termekek.php') ? 'active' : ''; ?>">
                    <a class="nav-link" href="termekek.php">Termékek</a>
                </li>
                <li class="nav-item <?php echo ($current_page === 'rolunk.php') ? 'active' : ''; ?>">
                    <a class="nav-link" href="rolunk.php">Rólunk</a>
                </li>
            </ul>
        </div>

        <form id="searchForm" onsubmit="redirectToProducts(event)" method="GET" class="search-container">
            <div class="keresoGroup input-group">
                <input type="text" name="query" id="keresomezo" placeholder="Keresés..." class="form-control" autocomplete="off" />
                <button id="remove" type="button" class="btn">x</button>
                <div id="search-results-dropdown" class="search-results-list"></div>
            </div>
            <button type="submit" class="btn search-btn" id="kereses_button">
                <img src="../img/search.png" alt="Keresés">
            </button>
        </form>

        <script>
            function redirectToProducts(event) {
                event.preventDefault();
                let ertek = document.getElementById("keresomezo").value.trim();

                if (ertek !== "") {
                    localStorage.setItem("keresesErtek", ertek);
                } else {
                    localStorage.removeItem("keresesErtek");
                }

                window.location.href = "./termekek.php";
            }
        </script>

        <div class="ms-auto d-flex align-items-center">
            <div class="d-flex d-xl-none search-icon" onclick="toggleSearch()">
                <img src="../img/search.png" alt="Keresés">
            </div>
            <a href="kosar.php" class="cart-icon position-relative">
                <img src="../img/cart.png" alt="Kosár" width="30" />
                <?php if ($termekekSzama > 0): ?>
                    <span id="cart-count" class="badge rounded-pill bg-danger">
                        <?= $termekekSzama ?>
                    </span>
                <?php endif; ?>
            </a>

            <?php if (isset($_SESSION['user_email'])): ?>
                <div class="dropdown">
                    <a href="#" class="logged-icon btn dropdown-toggle text-light" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="../img/signed_in.png" alt="Profil">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                        <li><a class="dropdown-item" href="./adataim.php">Adataim</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="./rendeleseim.php">Rendeléseim</a></li>
                        <?php if (isset($_SESSION['user_jog']) && $_SESSION['user_jog'] === 'admin'): ?>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="./admin.php">Admin felület</a></li>
                        <?php endif; ?>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li>
                            <form method="POST" class="dropdown-item p-0 m-0">
                                <button type="button" id="logoutButton" name="logout" class="btn btn-link text-decoration-none text-dark">Kijelentkezés</button>
                            </form>
                        </li>
                    </ul>
                </div>
            <?php else: ?>
                <a href="./bejelentkezes.php" class="login-icon">
                    <img src="../img/login.png" alt="Bejelentkezés" />
                </a>
            <?php endif; ?>
        </div>
    </div>
</nav>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    ob_end_flush();
    exit;
}
?>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const toggleButton = document.querySelector(".navbar-toggler");
        const navbarMenu = document.querySelector("#navbarNav");

        toggleButton.addEventListener("click", function() {
            if (navbarMenu.classList.contains("show")) {
                navbarMenu.style.height = "0px";
                setTimeout(() => {
                    navbarMenu.classList.remove("show");
                    navbarMenu.style.opacity = "0";
                }, 300);
            } else {
                navbarMenu.classList.add("show");
                navbarMenu.style.height = navbarMenu.scrollHeight + "px";
                navbarMenu.style.opacity = "1";
            }
        });
    });

    const logoutBtn = document.getElementById("logoutButton");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            fetch('./navbar.php', {
                    method: "POST",
                    body: new URLSearchParams({
                        'logout': 'true'
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = "./index.php";
                    }
                })
                .catch(error => console.error("Hiba a kijelentkezésnél:", error));
        });
    }

    function toggleSearch() {
        const searchForm = document.getElementById('searchForm');
        if (searchForm.classList.contains('active')) {
            searchForm.style.height = "0px";
            searchForm.style.opacity = "0";
            setTimeout(() => searchForm.classList.remove('active'), 300);
        } else {
            searchForm.classList.add('active');
            searchForm.style.height = "50px";
            searchForm.style.opacity = "1";
        }
    }

    let debounceTimer;
    const searchInput = document.getElementById('keresomezo');
    const resultsDropdown = document.getElementById('search-results-dropdown');
    const keresoGroup = document.querySelector('.keresoGroup');
    const delay = 350;

    if (searchInput && resultsDropdown) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            clearTimeout(debounceTimer);

            if (searchTerm.length >= 2) {
                debounceTimer = setTimeout(() => {
                    fetch('./live_search.php?term=' + encodeURIComponent(searchTerm))
                        .then(response => {
                            if (!response.ok) throw new Error('Hálózati hiba: ' + response.statusText);
                            return response.json();
                        })
                        .then(data => {
                            resultsDropdown.innerHTML = '';
                            if (data.length > 0) {
                                keresoGroup.classList.add('dropdown-visible');
                                data.forEach(item => {
                                    const wrapper = document.createElement('div');
                                    wrapper.classList.add('search-result-item');
                                    wrapper.addEventListener('click', function(event) {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        window.location.href = item.url;
                                    });

                                    const img = document.createElement('img');
                                    img.src = `../img/termekek/${item.id}.webp`;
                                    img.alt = item.name;

                                    const textWrapper = document.createElement('div');
                                    textWrapper.classList.add('search-result-text');

                                    const name = document.createElement('div');
                                    name.classList.add('search-result-name');
                                    name.textContent = item.name;

                                    const cikkszam = document.createElement('div');
                                    cikkszam.style.fontSize = '0.8rem';
                                    cikkszam.style.color = '#555';
                                    cikkszam.textContent = 'Cikkszám: ' + item.id;

                                    const price = document.createElement('div');
                                    price.classList.add('search-result-price');

                                    let akcios = parseFloat(item.akcios_ar?.replace(/\s/g, '') || -1);
                                    let normal = parseFloat(item.price?.replace(/\s/g, '') || 0);
                                    if (akcios > -1 && akcios < normal) {
                                        price.innerHTML = `
                                        <span class="original-price" style="text-decoration: line-through; color: red; margin-right: 5px;">${item.price} Ft</span>
                                        <span class="discounted-price" style="color: #22ff26; font-weight: bold;">${item.akcios_ar} Ft</span>
                                    `;
                                    } else {
                                        price.textContent = item.price + ' Ft';
                                    }

                                    textWrapper.appendChild(name);
                                    textWrapper.appendChild(cikkszam);

                                    wrapper.appendChild(img);
                                    wrapper.appendChild(textWrapper);
                                    wrapper.appendChild(price);

                                    resultsDropdown.appendChild(wrapper);
                                });
                                resultsDropdown.style.display = 'block';
                            } else {
                                keresoGroup.classList.remove('dropdown-visible');
                                const noResultDiv = document.createElement('div');
                                noResultDiv.textContent = 'Nincs találat.';
                                noResultDiv.style.padding = '8px 12px';
                                noResultDiv.style.color = '#666';
                                resultsDropdown.appendChild(noResultDiv);
                                resultsDropdown.style.display = 'block';
                            }
                        })
                        .catch(error => {
                            keresoGroup.classList.remove('dropdown-visible');
                            resultsDropdown.innerHTML = '';
                            resultsDropdown.style.display = 'none';
                        });
                }, delay);
            } else {
                keresoGroup.classList.remove('dropdown-visible');
                resultsDropdown.innerHTML = '';
                resultsDropdown.style.display = 'none';
            }
        });

        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !resultsDropdown.contains(event.target)) {
                resultsDropdown.style.display = 'none';
                keresoGroup.classList.remove('dropdown-visible');
            }
        });

        resultsDropdown.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                resultsDropdown.style.display = 'none';
                keresoGroup.classList.remove('dropdown-visible');
            }
        });
    }
</script>