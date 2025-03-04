<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../css/index.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title>PoolPalace - Kezdőoldal</title>
    <script defer src="../js/index.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css">


</head>

<body>
    <div class="container">
        <div class="video-container">
            <video autoplay loop muted>
                <source src="../img/medencevideo.mp4" type="video/mp4">
            </video>
            <div class="video-caption text-center">Üdvözlünk a Webshopunkban!</div>
        </div>
        <section class="products-section mb-5">
            <h2>Kiemelet termékek</h2>
            <div class="container product-section">

                <div class="product-card">
                    <img src="../img/termekek/010001.webp" alt="Termék 1">
                    <h5>Termék 1</h5>
                    <p>Rövid leírás a termékről.</p>
                    <p class="price">5 000 Ft</p>
                </div>
                <div class="product-card">
                    <img src="../img/termekek/010001.webp" alt="Termék 2">
                    <h5>Termék 2</h5>
                    <p>Rövid leírás a termékről.</p>
                    <p class="price">7 500 Ft</p>
                </div>
                <div class="product-card">
                    <img src="../img/termekek/010001.webp" alt="Termék 3">
                    <h5>Termék 3</h5>
                    <p>Rövid leírás a termékről.</p>
                    <p class="price">10 000 Ft</p>
                </div>
                <div class="product-card">
                    <img src="../img/termekek/010001.webp" alt="Termék 4">
                    <h5>Termék 4</h5>
                    <p>Rövid leírás a termékről.</p>
                    <p class="price">6 000 Ft</p>
                </div>
                <div class="product-card">
                    <img src="../img/termekek/010001.webp" alt="Termék 4">
                    <h5>Termék 4</h5>
                    <p>Rövid leírás a termékről.</p>
                    <p class="price">6 000 Ft</p>
                </div>
                <div class="product-card">
                    <img src="../img/termekek/010001.webp" alt="Termék 4">
                    <h5>Termék 4</h5>
                    <p>Rövid leírás a termékről.</p>
                    <p class="price">6 000 Ft</p>
                </div>
            </div>
        </section>

        <section class="tippek container">
            <img src="https://via.placeholder.com/150" alt="Example image">
            <div class="tippek_content">
                <h2>Medence Karbantartás</h2>
                <p>Tanuld meg, hogyan tartsd tisztán a medencédet a megfelelő eszközök és vegyszerek használatával, hogy egész nyáron élvezhesd a kristálytiszta vizet.</p>
            </div>
        </section>

        <section class="discount-section">
            <h2>Kiemelt akciós termékek</h2>
            <div class="discount-row">
                <a href="./akcios.php" class="discount-card-link">
                    <div class="discount-card">
                        <div class="badge">Akció!</div>
                        <img src="../img/termekek/010004.webp" alt="Akciós termék 1">
                        <h5>Termék neve</h5>
                        <p>Rövid leírás a termékről.</p>
                        <p class="price">12 990 Ft</p>
                        <p class="discount-price">9 990 Ft</p>
                    </div>
                </a>
                <a href="./akcios.php" class="discount-card-link">
                    <div class="discount-card">
                        <div class="badge">Akció!</div>
                        <img src="../img/termekek/010004.webp" alt="Akciós termék 1">
                        <h5>Termék neve</h5>
                        <p>Rövid leírás a termékről.</p>
                        <p class="price">12 990 Ft</p>
                        <p class="discount-price">9 990 Ft</p>
                    </div>
                </a>
                <a href="./akcios.php" class="discount-card-link">
                    <div class="discount-card">
                        <div class="badge">Akció!</div>
                        <img src="../img/termekek/010003.webp" alt="Akciós termék 2">
                        <h5>Termék neve</h5>
                        <p>Rövid leírás a termékről.</p>
                        <p class="price">15 990 Ft</p>
                        <p class="discount-price">11 990 Ft</p>
                    </div>
                </a>
                <a href="./akcios.php" class="discount-card-link">
                    <div class="discount-card">
                        <div class="badge">Akció!</div>
                        <img src="../img/termekek/010001.webp" alt="Akciós termék 2">
                        <h5>Termék neve</h5>
                        <p>Rövid leírás a termékről.</p>
                        <p class="price">15 990 Ft</p>
                        <p class="discount-price">11 990 Ft</p>
                    </div>
                </a>
                <a href="./akcios.php" class="discount-card-link">
                    <div class="discount-card">
                        <div class="badge">Akció!</div>
                        <img src="../img/termekek/010012.webp" alt="Akciós termék 2">
                        <h5>Termék neve</h5>
                        <p>Rövid leírás a termékről.</p>
                        <p class="price">15 990 Ft</p>
                        <p class="discount-price">11 990 Ft</p>
                    </div>
                </a>
            </div>
        </section>

    </div>

    <?php include './navbar.php'; ?>
    <?php include './back-to-top.php'; ?>
    <?php include "./footer.php"; ?>

</body>

</html>