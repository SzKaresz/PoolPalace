<link rel="stylesheet" href="../css/navbar.css">
<?php
ob_start();
include './session.php';

// Kosárban lévő termékek számának lekérése
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
?>

<nav class="navbar navbar-dark navbar-expand-xl w-100 fixed-top">
    <div class="container-fluid d-flex justify-content-between align-items-center">
        <button class="navbar-toggler ms-2 d-xl-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <a class="navbar-brand" href="./index.php">
            <img src="../img/logo.png" alt="PoolPalace" />
        </a>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link" href="./index.php">Kezdőlap</a></li>
                <li class="nav-item"><a class="nav-link" href="./akcios.php">Akciós</a></li>
                <li class="nav-item"><a class="nav-link" href="./termekek.php">Termékek</a></li>
                <li class="nav-item"><a class="nav-link" href="./rolunk.php">Rólunk</a></li>
            </ul>

            <form class="search-form-mobil d-xl-none mt-3">
                <input class="form-control me-2" type="search" placeholder="Keresés..." aria-label="Search" />
                <button class="btn btn-outline-primary w-100 mt-2" type="submit">Keresés</button>
            </form>
        </div>

        <form class="search-form ms-auto me-auto d-none d-xl-flex">
            <input class="form-control me-2" type="search" placeholder="Keresés..." aria-label="Search" />
            <button class="btn btn-outline-primary" type="submit">Keresés</button>
        </form>

        <div class="nav-icons ms-auto d-flex align-items-center">
            <a href="kosar.php" class="cart-icon position-relative me-2">
                <img src="../img/cart.png" alt="Kosár" width="30" />
                <span id="cart-count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    <?= $termekekSzama ?>
                </span>
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
                        <?php if (isset($_SESSION['user_nev']) && $_SESSION['user_nev'] === 'Admin'): ?>
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
                                <button type="submit" name="logout" class="btn btn-link text-decoration-none text-dark">Kijelentkezés</button>
                            </form>
                        </li>
                    </ul>
                </div>
            <?php else: ?>
                <a href="./bejelentkezes.php" class="login-icon ms-2">
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
    header('Location: ./index.php');
    ob_end_flush();
    exit;
}
?>