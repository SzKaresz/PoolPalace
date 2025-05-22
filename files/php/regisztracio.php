<?php
include './session.php';
ob_start();

$hiba = isset($_SESSION['hiba']) ? $_SESSION['hiba'] : '';
$uzenet = isset($_SESSION['uzenet']) ? $_SESSION['uzenet'] : '';
unset($_SESSION['hiba'], $_SESSION['uzenet']);
?>


<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <link rel="stylesheet" href="../css/regisztracio.css">
    <script src="../js/regisztracio.js" defer></script>
    <title>PoolPalace - Regisztráció</title>
</head>

<body>
    <?php
    include './navbar.php';
    ?>

    <div class="form-container">
        <img src="../img/sign_up.png" class="regiszt-kep" alt="Regisztráció ikon">
        <h3>Fiók létrehozása</h3>

        <div id="uzenet-helye">
            <?php if (!empty($hiba)): ?>
                <div class="alert alert-danger" role="alert"> <?php echo htmlspecialchars($hiba); ?> </div>
            <?php endif; ?>
            <?php if (!empty($uzenet)): ?>
                <div id="visszaSzamlalo" class="alert alert-success text-center mt-2">
                    Sikeres regisztráció! Átirányítás <span id="visszaSzamlalo-szam">3</span> másodperc múlva...
                </div>
            <?php endif; ?>
        </div>

        <form method="POST" id="regisztracio-urlap" class="row g-3">
            <div class="col-md-4">
                <h4>Személyes adatok</h4>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text required-icon"><img src="../img/felhasznalo.png" class="felhasznalo-logo" alt="Név ikon"></span>
                        <input type="text" class="form-control" id="nev" name="nev" placeholder="Név">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text required-icon"><img src="../img/email.png" class="email-logo" alt="E-mail cím"></span>
                        <input type="email" class="form-control" id="email" name="email" placeholder="E-mail cím">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="position-relative">
                        <div class="inputMezo input-group">
                            <span class="input-group-text required-icon"><img src="../img/jelszo.png" class="jelszo-logo" alt="Jelszó"></span>
                            <input type="password" class="form-control" id="jelszo" name="jelszo" placeholder="Jelszó">
                            <span class="error"></span>
                        </div>
                        <img src="../img/caps_on.png" id="caps-icon-1" alt="Caps Lock aktív" class="caps-lock-icon">
                    </div>
                </div>
                <div class="mb-3">
                    <div class="position-relative">
                        <div class="inputMezo input-group">
                            <span class="input-group-text required-icon"><img src="../img/jelszo_ujra.png" class="jelszo-ujra-logo" alt="Jelszó megerősítése"></span>
                            <input type="password" class="form-control" id="jelszo-ujra" name="jelszo-ujra" placeholder="Jelszó megerősítése">
                            <span class="error"></span>
                        </div>
                        <img src="../img/caps_on.png" id="caps-icon-2" alt="Caps Lock aktív" class="caps-lock-icon">
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <h4>Szállítási adatok</h4>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/telefon.png" class="telefon-logo" alt="Telefon"></span>
                        <input type="tel" class="form-control" id="szall-telefon" name="szall-telefon" placeholder="Telefonszám">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/iranyitoszam.png" class="irszam-logo" alt="Irányítószám"></span>
                        <input type="text" class="form-control" id="szall-irszam" name="szall-irszam" placeholder="Irányítószám">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/telepules.png" class="telepules-logo" alt="Település"></span>
                        <input type="text" class="form-control" id="szall-telepules" name="szall-telepules" placeholder="Település">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/hazszam.png" class="hazszam-logo" alt="Utca és házszám"></span>
                        <input type="text" class="form-control" id="szall-cim" name="szall-cim" placeholder="Utca és házszám">
                        <span class="error"></span>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <h4>Számlázási adatok</h4>
                <div id="szamlazas-checkbox-helye" class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/telefon.png" class="telefon-logo" alt="Telefon"></span>
                        <input type="tel" class="form-control" id="szam-telefon" name="szam-telefon" placeholder="Telefonszám">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/iranyitoszam.png" class="irszam-logo" alt="Irányítószám"></span>
                        <input type="text" class="form-control" id="szam-irszam" name="szam-irszam" placeholder="Irányítószám">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/telepules.png" class="telepules-logo" alt="Település"></span>
                        <input type="text" class="form-control" id="szam-telepules" name="szam-telepules" placeholder="Település">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="inputMezo input-group">
                        <span class="input-group-text"><img src="../img/hazszam.png" class="hazszam-logo" alt="Utca és házszám"></span>
                        <input type="text" class="form-control" id="szam-cim" name="szam-cim" placeholder="Utca és házszám">
                        <span class="error"></span>
                    </div>
                </div>
            </div>

            <div class="col-md-12">
                <div class="row g-3 mb-1 align-items-center">
                    <div class="col-md-4 d-none d-xl-block"></div>

                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <div class="form-check d-flex align-items-center">
                            <input class="form-check-input" type="checkbox" id="aszf">
                            <label class="form-check-label ms-2" for="aszf">
                                Elfogadom az <a href="#" data-bs-toggle="modal" data-bs-target="#aszf-modal">Általános Szerződési Feltételeket</a>
                            </label>
                        </div>
                    </div>

                    <div class="col-md-4 d-flex align-items-center justify-content-center d-none d-xl-block">
                        <div class="form-check d-flex align-items-center">
                            <input class="form-check-input" type="checkbox" id="egyezo-adatok">
                            <label class="form-check-label ms-2" for="egyezo-adatok">
                                Megegyeznek a Szállítási adatokkal
                            </label>
                        </div>
                    </div>
                </div>

                <span class="error aszf-error">Kérjük, fogadja el az Általános Szerződési Feltételeket!</span> <br>

                <button type="submit" class="mt-3 btn btn-primary" id="regisztracio">Regisztráció</button>
            </div>

            <?php
            include './modalok.php';
            ?>
        </form>
    </div>

    <?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        include './db.php';

        $nev = trim($_POST['nev']);
        $email = trim($_POST['email']);
        $jelszo = trim($_POST['jelszo']);
        $jelszo_megerosites = trim($_POST['jelszo-ujra']);

        $szall_telefon = trim($_POST['szall-telefon']) ?: "";
        $szall_irszam = trim($_POST['szall-irszam']) ?: "";
        $szall_telepules = trim($_POST['szall-telepules']) ?: "";
        $szall_cim = trim($_POST['szall-cim']) ?: "";

        $szam_telefon = trim($_POST['szam-telefon']) ?: "";
        $szam_irszam = trim($_POST['szam-irszam']) ?: "";
        $szam_telepules = trim($_POST['szam-telepules']) ?: "";
        $szam_cim = trim($_POST['szam-cim']) ?: "";

        $telefon = "";
        if (!empty($szall_telefon)) {
            $telefon = $szall_telefon;
        } else if (!empty($szam_telefon)) {
            $telefon = $szam_telefon;
        }

        if ($jelszo !== $jelszo_megerosites) {
            $_SESSION['hiba'] = 'A jelszavak nem egyeznek meg!';
        } else {
            $emailLekerdezes = "SELECT email FROM felhasznalok WHERE email = ?";
            $stmt = $db->prepare($emailLekerdezes);
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $eredmeny = $stmt->get_result();

            if ($eredmeny->num_rows > 0) {
                $_SESSION['hiba'] = 'Ez az e-mail cím már regisztrálva van!';
            } else {
                $db->begin_transaction();
                try {
                    $szallInsertQuery = "INSERT INTO szallitasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)";
                    $stmt = $db->prepare($szallInsertQuery);
                    $stmt->bind_param('sss', $szall_irszam, $szall_telepules, $szall_cim);
                    $stmt->execute();
                    $szallitasi_cim_id = $stmt->insert_id;

                    $szamInsertQuery = "INSERT INTO szamlazasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)";
                    $stmt = $db->prepare($szamInsertQuery);
                    $stmt->bind_param('sss', $szam_irszam, $szam_telepules, $szam_cim);
                    $stmt->execute();
                    $szamlazasi_cim_id = $stmt->insert_id;

                    $hashed_jelszo = password_hash($jelszo, PASSWORD_DEFAULT);
                    $userInsertQuery = "INSERT INTO felhasznalok (email, nev, jelszo, telefonszam, szallitasi_cim_id, szamlazasi_cim_id) VALUES (?, ?, ?, ?, ?, ?)";
                    $stmt = $db->prepare($userInsertQuery);
                    $stmt->bind_param('ssssii', $email, $nev, $hashed_jelszo, $telefon, $szallitasi_cim_id, $szamlazasi_cim_id);
                    $stmt->execute();

                    $db->commit();
                    $_SESSION['uzenet'] = 'Sikeres regisztráció! Átirányítás 5 másodperc múlva.';
                } catch (Exception $e) {
                    $db->rollback();
                    $_SESSION['hiba'] = 'Hiba történt a regisztráció során: ' . $e->getMessage();
                }
            }
        }
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    }
    ob_end_flush();
    ?>
</body>

</html>