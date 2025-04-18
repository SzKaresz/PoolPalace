<?php
include './session.php';
ob_start();
?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../css/rolunk.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title>PoolPalace - Rólunk</title>
    <script defer src="../js/rolunk.js"></script>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col">
                <?php
                include './navbar.php';
                ?>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div id="rolunk_szoveg">
                    <p>A <b>Poolpalace Kft.</b> elkötelezett amellett, hogy minden medencetulajdonos számára elérhetővé tegye a legjobb minőségű termékeket és kiegészítőket. Webshopunkban mindent megtalálsz, amire egy tökéletes medence fenntartásához szükséged lehet – modern medencetestektől kezdve a karbantartó eszközökig. Célunk, hogy ne csupán egy webáruház legyünk, hanem egy szakértői közösség, amely segíti a medencetulajdonosokat a tiszta és biztonságos fürdőzés megteremtésében.</p>

                    <p>A medence nem csupán egy vízzel teli tér – hanem a kikapcsolódás, a nyugalom és a közös élmények helyszíne. Egy hely, ahol a család és a barátok összegyűlhetnek a forró nyári napokon, ahol a gyermekek pancsolhatnak, és ahol a felnőttek is megpihenhetnek. Éppen ezért különös figyelmet fordítunk arra, hogy mindenki megtalálja a számára legmegfelelőbb megoldásokat, legyen szó családi kerti medencéről vagy professzionális uszodai felszerelésekről.</p>

                    <h4>Széles termékválaszték, minden igényre</h4>

                    <p>Webshopunkban a legkülönbözőbb típusú medencék, vízforgató rendszerek, tisztítószerek és karbantartási kiegészítők széles választékát kínáljuk. Tudjuk, hogy a tiszta és biztonságos víz elengedhetetlen, ezért csak megbízható, minőségi termékeket forgalmazunk.</p>

                    <p>Kínálatunkban megtalálhatók:</p>
                    <ul>
                        <li><b>Különböző típusú medencék</b> – föld feletti és beépített modellek</li>
                        <li><b>Szűrőberendezések és vízforgató rendszerek</b></li>
                        <li><b>Vízkezelő vegyszerek</b> és fertőtlenítőszerek</li>
                        <li><b>Porszívók, hálók, kefék</b> és tisztítószerek</li>
                        <li><b>Medencefedések és ponyvák</b></li>
                        <li><b>Medencefűtési rendszerek</b></li>
                    </ul>

                    <h4>Szakértői támogatás és ügyfélbarát szolgáltatások</h4>

                    <p>Hiszünk abban, hogy a medence fenntartása nem bonyolult, és mi segítünk eligazodni a különböző termékek között. Ügyfélszolgálatunk bármilyen kérdésben rendelkezésedre áll, hogy a legjobb döntést hozd meg.</p>

                    <p>Emellett gyors házhoz szállítást és versenyképes árakat kínálunk, hogy minél könnyebben hozzáférj a kívánt termékekhez.</p>

                    <p>A <b>Poolpalace Kft.</b> azért jött létre, hogy mindenki számára elérhetővé tegye a gondtalan medencézést. Fedezd fel kínálatunkat, és élvezd a tiszta víz nyújtotta élményt! 💦</p>
                </div>
            </div>
        </div>
        <div id="rolunk_form">
            <form method="POST" style="width: 100%;" id="uzenetKuldes-urlap">
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text required-icon">
                            <img src="../img/felhasznalo.png" alt="Név">
                        </span>
                        <input type="text" class="form-control mezo" name="nev" id="nev" placeholder="Név">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text required-icon">
                            <img src="../img/email.png" alt="E-mail cím">
                        </span>
                        <input type="email" class="form-control mezo" name="email" id="email" placeholder="E-mail cím">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text">
                            <img src="../img/email_targy.png" alt="E-mail tárgya">
                        </span>
                        <input type="text" class="form-control mezo" name="email_targya" id="email_targya" placeholder="E-mail tárgya">
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text">
                            <img src="../img/email_szoveg.png" alt="E-mail szövege">
                        </span>
                        <textarea class="form-control mezo" name="email_szovege" id="email_szovege" placeholder="E-mail szövege" rows="5"></textarea>
                    </div>
                </div>
                <div class="form-check d-flex align-items-center justify-content-center">
                    <input class="form-check-input" type="checkbox" id="adatkez">
                    <label class="form-check-label ms-2" for="adatkez">
                        Elfogadom az <a href="#" data-bs-toggle="modal" data-bs-target="#adatkez-modal">Adatkezelési tájékoztatóban</a> leírtakat.
                    </label>
                </div>
                <span class="error adatkez-error">Kérjük, fogadja el az Adatkezelési tájékoztatóban leírtakat!</span>
                <div id="recaptcha-container">
                    <div class="g-recaptcha nem-robot" data-sitekey="6Lfs-4kqAAAAACPZ6RbVLP0IAz9sBeCZrsYgRzHY"></div>
                    <!-- <div class="g-recaptcha nem-robot" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div> TESZTHEZ -->
                    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
                </div>
                <span class="error recaptcha-error">Kérjük, igazolja, hogy nem robot!</span> <br hidden id="st">
                <button type="submit" class="btn btn-primary" name="kuldes" id="kuldesGomb">Küldés</button>
            </form>

            <?php
            ob_end_flush();
            ?>
        </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
    </div>

    <?php include './back-to-top.php'; ?>
    <?php include "./footer.php"; ?>
</body>

</html>