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
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title><?php echo $termek['nev']; ?> - PoolPalace</title>
    <style>
        .thumbs-container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }

        .thumbs-container img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            cursor: pointer;
            border: 2px solid transparent;
            transition: border 0.3s;
            border-radius: 10px;
        }

        .thumbs-container img.active {
            border: 2px solid #293144;
        }

        .carousel-container {
            position: relative;
        }

        .back-button {
            position: absolute;
            top: 10px;
            left: -150px;
            z-index: 10;
            border: 0;
        }

        .back-button img {
            width: 50px;
            height: auto;
        }

        .carousel-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-right: 10px;
            /* 10px jobb oldali margó */
        }

        .carousel-inner {
            text-align: center;
        }

        .carousel-item {
            overflow: hidden;
        }

        .carousel-item img {
            max-width: 400px;
            max-height: 300px;
            width: auto;
            height: auto;
            display: block;
            object-fit: contain;
        }

        .col-md-8 {
            width: fit-content !important;
            /* Méret igazítása a tartalomhoz */
            max-width: 100%;
            /* Ne lépje túl a szülő div szélességét */
        }

        .row {
            justify-content: center;
            /* Ha kell, középre húzza az elemeket */
        }

        /* Középre igazítás kis képernyőn */
        @media (max-width: 768px) {
            .carousel-wrapper {
                justify-content: center;
                margin-right: 0;
            }

            .thumbs-container {
                align-items: center;
            }
        }

        .original-price {
            text-decoration: line-through;
            color: red;
            margin-left: 4px;
            margin-right: 6px;
        }

        .discounted-price {
            color: #22ff26;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 position-relative">
                <!-- Visszagomb a bal felső sarokba -->
                <a href="javascript:window.history.back()" class="btn btn-custom back-button">
                    <img src="../img/arrow.png" alt="Vissza az előző oldalra">
                </a>

                <div class="carousel-wrapper d-flex align-items-center">
                    <!-- Kisképek -->
                    <div class="thumbs-container me-3">
                        <?php foreach ($kepek as $index => $kep): ?>
                            <img src="../img/termekek/<?php echo $kep; ?>" alt="Termék kép <?php echo $index + 1; ?>"
                                data-bs-target="#productCarousel" data-bs-slide-to="<?php echo $index; ?>"
                                class="<?php echo $index === 0 ? 'active' : ''; ?>" />
                        <?php endforeach; ?>
                    </div>

                    <!-- Carousel -->
                    <div id="productCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                        <div class="carousel-inner">
                            <?php foreach ($kepek as $index => $kep): ?>
                                <div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">
                                    <img src="../img/termekek/<?php echo $kep; ?>" class="d-block mx-auto" alt="Termék kép <?php echo $index + 1; ?>">
                                </div>
                            <?php endforeach; ?>
                        </div>
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        var myCarousel = document.getElementById('productCarousel')
        myCarousel.addEventListener('slide.bs.carousel', function(event) {
            var thumbImages = document.querySelectorAll('.thumbs-container img');
            thumbImages.forEach(function(img) {
                img.classList.remove('active');
            });

            var activeThumb = thumbImages[event.to];
            if (activeThumb) {
                activeThumb.classList.add('active');
            }
        });
    </script>

    <?php include './navbar.php'; ?>
    <?php include './footer.php'; ?>
    <?php
    ob_end_flush();
    ?>
</body>
</html>