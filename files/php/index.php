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
    <?php include './navbar.php'; ?>
    <div>
        <div class="video-container">
            <video autoplay loop muted>
                <source src="../img/medencevideo.mp4" type="video/mp4">
            </video>
            <div class="video-caption text-center">Üdvözlünk a Webshopunkban!</div>
        </div>
        <section class="products-section mb-5">
            <h2 style="display: none";>Kiemelet termékek</h2> <!--Örök baki vicces-->
            <h2>Kiemelt termékek</h2>
            <div class="container kontener">
                <div id="kartyak"></div>
            </div>
        </section>
        <a href="">
            <section class="tippek container">
                 <img src="../img/tipp.webp" title="Tipp" alt="Tipp">
                 <div class="tippek_content">
                     <h2>Medence Karbantartás</h2>
                     <p>Tanuld meg, hogyan tartsd tisztán a medencédet a megfelelő eszközök és vegyszerek használatával, hogy egész nyáron élvezhesd a kristálytiszta vizet.</p>
                 </div>
             </section>
        </a>
    </div>

    <?php include './back-to-top.php'; ?>
    <?php include "./footer.php"; ?>

</body>

</html>