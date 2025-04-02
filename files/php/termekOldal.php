<?php
ob_start();
include './session.php';
include 'db.php';

// Cikkszám lekérése az URL-ből
if (!isset($_GET['cikkszam'])) {
    header('Location: termekek.php');
    exit();
}
$cikkszam = htmlspecialchars($_GET['cikkszam']);

$query = "SELECT
            t.nev, t.leiras, t.egysegar, t.akcios_ar, t.darabszam AS keszlet,
            gy.nev AS gyarto_nev,
            kat.nev AS kategoria_nev
          FROM termekek t
          LEFT JOIN gyarto gy ON gy.id = t.gyarto_id
          LEFT JOIN kategoria kat ON kat.id = t.kategoria_id
          WHERE t.cikkszam = ?";

$stmt = $db->prepare($query);
$stmt->bind_param("s", $cikkszam);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "A termék nem található.";
    exit();
}
$termek = $result->fetch_assoc();
$max_keszlet = (int)($termek['keszlet'] ?? 0);

$raktaron = $max_keszlet > 0;
$keszlet_szoveg = $raktaron ? "Raktáron" : "Nincs készleten";
$keszlet_class = $raktaron ? "text-success" : "text-danger";

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

if (empty($kepek)) {
    $placeholder_kep = 'placeholder.webp';
    $placeholder_ut = "../img/termekek/$placeholder_kep";
    if (file_exists($placeholder_ut) && is_readable($placeholder_ut)) {
        $kepek[] = $placeholder_kep;
    }
}

$kategoria_nev = $termek['kategoria_nev'] ?? "Termékek";
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
    <script defer src="../js/termekOldal.js"></script>
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
</head>

<body>

    <?php include './navbar.php';
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
                    <div id="productCarousel" class="carousel slide mb-3" data-bs-ride="carousel" data-bs-interval="4000">
                        <div class="carousel-inner bg-light rounded border">
                            <?php foreach ($kepek as $index => $kep): ?>
                                <div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">
                                    <img src="../img/termekek/<?php echo $kep; ?>"
                                        class="d-block w-100 product-main-image"
                                        alt="<?php echo htmlspecialchars($termek['nev']) . ' - kép ' . ($index + 1); ?>">
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <?php if (count($kepek) > 1):
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

                    <?php if (count($kepek) > 1):
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

                    <?php if ($raktaron):
                    ?>
                        <div class="add-to-cart-section bg-light p-3 rounded border mb-4"
                            id="product-<?= $cikkszam ?>"
                            data-cikkszam="<?= $cikkszam ?>"
                            data-max-keszlet="<?= $max_keszlet ?>">
                            <div class="d-flex flex-column align-items-center gap-3">
                                <div class="d-flex align-items-center gap-2 justify-content-center flex-wrap">
                                    <label for="quantityInput-<?= $cikkszam; ?>" class="form-label mb-0 fw-bold">Mennyiség:</label>
                                    <div class="quantity-control-wrapper d-flex">
                                        <button class="btn quantity-btn minus" type="button" aria-label="Mennyiség csökkentése" disabled>&minus;</button>
                                        <input type="number"
                                            class="form-control quantity-input"
                                            id="quantityInput-<?= $cikkszam; ?>"
                                            min="1"
                                            max="<?= $max_keszlet ?>"
                                            data-max-stock="<?= $max_keszlet ?>"
                                            aria-label="Mennyiség">
                                        <button class="btn quantity-btn plus" type="button" aria-label="Mennyiség növelése" <?= $max_keszlet <= 1 ? 'disabled' : '' ?>>&plus;</button>
                                    </div>
                                </div>

                                <button class="btn btn-lg w-100 add-to-cart mt-2"
                                    type="button"
                                    data-cikkszam="<?= $cikkszam ?>"
                                    data-max-stock="<?= $max_keszlet ?>">
                                    <img src="../img/cart.png" class="cart-icon-img" alt="Kosár"> Kosárba
                                </button>
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
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    Termékleírás
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#descriptionAccordion">
                                <div class="accordion-body">
                                    <?php echo nl2br(htmlspecialchars($termek['leiras']));
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

    <?php include './footer.php';
    ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <?php ob_end_flush(); ?>
</body>
</html>