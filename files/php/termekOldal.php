<?php
ob_start();
include 'db.php'; // Az adatbázis kapcsolatot biztosító fájl

// Cikkszám lekérése az URL-ből
if (!isset($_GET['cikkszam'])) {
    header('Location: termekek.php'); // Visszairányítás, ha nincs cikkszám
    exit();
}
$cikkszam = htmlspecialchars($_GET['cikkszam']);

// Termékadatok lekérdezése
$query = "SELECT termekek.nev, termekek.leiras, termekek.egysegar, termekek.akcios_ar, gyarto.nev AS gyarto_nev 
          FROM termekek 
          LEFT JOIN gyarto ON gyarto.id = termekek.gyarto_id 
          WHERE termekek.cikkszam = ?";

$stmt = $db->prepare($query);
$stmt->bind_param("s", $cikkszam);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "A termék nem található.";
    exit();
}
$termek = $result->fetch_assoc();

// Képek elnevezése cikkszám alapján
$kepek = [];
for ($i = 1; $i <= 5; $i++) {
    $kep = $cikkszam . ($i > 1 ? "_$i" : "") . ".webp";
    if (file_exists("../img/termekek/$kep")) {
        $kepek[] = $kep;
    }
}
?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <link rel="stylesheet" href="../css/termekOldal.css">
    <title><?php echo $termek['nev']; ?> - PoolPalace</title>
</head>

<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 position-relative d-flex justify-content-end">
                <!-- Visszagomb a bal felső sarokba -->
                <a href="#" onclick='goBack()' class="btn btn-custom back-button">
                    <img src="../img/arrow.png" alt="Vissza az előző oldalra">
                </a>
                <div class="image-wrapper d-flex">
                    <!-- Bélyegképek oszlop -->
                    <div class="image-column">
                        <?php foreach ($kepek as $index => $kep): ?>
                            <img src="../img/termekek/<?php echo $kep; ?>"
                                alt="Bélyegkép <?php echo $index + 1; ?>"
                                class="thumbnail <?php echo $index === 0 ? 'active' : ''; ?>"
                                data-index="<?php echo $index; ?>">
                        <?php endforeach; ?>
                    </div>

                    <!-- Fő kép konténer -->
                    <div class="main-image-container">
                        <img id="main-image" src="../img/termekek/<?php echo $kepek[0]; ?>" alt="Főkép">
                    </div>
                </div>
            </div>

            <!-- Termék információ -->
            <div class="col-md-4 product-info">
                <h3><?php echo $termek['nev']; ?></h3>
                <p><strong>Cikkszám:</strong> <?php echo $cikkszam; ?></p>
                <p><strong>Gyártó:</strong> <?php echo $termek['gyarto_nev'] ? $termek['gyarto_nev'] : '-'; ?></p>
                <p><strong>Ár:</strong>
                    <?php if (!empty($termek['akcios_ar']) && $termek['akcios_ar'] > 0): ?>
                        <span class="original-price">
                            <?php echo number_format($termek['egysegar'], 0, ',', ' '); ?> Ft
                        </span>
                        <span class="discounted-price">
                            <?php echo number_format($termek['akcios_ar'], 0, ',', ' '); ?> Ft
                        </span>
                    <?php else: ?>
                        <?php echo number_format($termek['egysegar'], 0, ',', ' '); ?> Ft
                    <?php endif; ?>
                </p>
                <p><strong>Leírás:</strong></p>
                <p><?php echo nl2br($termek['leiras']); ?></p>
            </div>
        </div>
    </div>

    <?php include './navbar.php'; ?>
    <?php include './footer.php'; ?>
    <script src="../js/termekOldal.js"></script>
    <?php ob_end_flush(); ?>

</body>

</html>