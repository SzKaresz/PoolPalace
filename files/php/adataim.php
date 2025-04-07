<?php
include './session.php';
include './db.php';

if (!isset($_SESSION['user_email'])) {
    header('Location: bejelentkezes.php');
    exit;
}

$email = $_SESSION['user_email'];
$stmt = $db->prepare("SELECT felhasznalok.nev, felhasznalok.email, felhasznalok.telefonszam,
                           szallitasi_cim.iranyitoszam AS szallitasi_irsz, szallitasi_cim.telepules AS szallitasi_telepules,
                           szallitasi_cim.utca_hazszam AS szallitasi_utca, szamlazasi_cim.iranyitoszam AS szamlazasi_irsz,
                           szamlazasi_cim.telepules AS szamlazasi_telepules, szamlazasi_cim.utca_hazszam AS szamlazasi_utca
                           FROM felhasznalok
                           INNER JOIN szallitasi_cim ON felhasznalok.szallitasi_cim_id = szallitasi_cim.id
                           INNER JOIN szamlazasi_cim ON felhasznalok.szamlazasi_cim_id = szamlazasi_cim.id
                           WHERE felhasznalok.email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nev = !empty($_POST['nev']) ? $_POST['nev'] : $user['nev'];
    $uj_email = !empty($_POST['email']) ? $_POST['email'] : $user['email'];
    $telefonszam = !empty($_POST['telefonszam']) ? $_POST['telefonszam'] : $user['telefonszam'];
    $szallitasi_irsz = !empty($_POST['szallitasi-irsz']) ? $_POST['szallitasi-irsz'] : $user['szallitasi_irsz'];
    $szallitasi_telepules = !empty($_POST['szallitasi-telepules']) ? $_POST['szallitasi-telepules'] : $user['szallitasi_telepules'];
    $szallitasi_utca = !empty($_POST['szallitasi-utca']) ? $_POST['szallitasi-utca'] : $user['szallitasi_utca'];
    $szamlazasi_irsz = !empty($_POST['szamlazasi-irsz']) ? $_POST['szamlazasi-irsz'] : $user['szamlazasi_irsz'];
    $szamlazasi_telepules = !empty($_POST['szamlazasi-telepules']) ? $_POST['szamlazasi-telepules'] : $user['szamlazasi_telepules'];
    $szamlazasi_utca = !empty($_POST['szamlazasi-utca']) ? $_POST['szamlazasi-utca'] : $user['szamlazasi_utca'];

    $uj_jelszo_post = isset($_POST['uj-jelszo']) ? trim($_POST['uj-jelszo']) : '';
    $regi_jelszo_post = isset($_POST['regi-jelszo']) ? trim($_POST['regi-jelszo']) : '';
    $uj_jelszo_ismet_post = isset($_POST['uj-jelszo-ismet']) ? trim($_POST['uj-jelszo-ismet']) : '';

    if ($uj_email !== $email) {
        $stmt = $db->prepare("SELECT email FROM felhasznalok WHERE email = ?");
        $stmt->bind_param("s", $uj_email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $_SESSION['error_message'] = "A megadott e-mail cím már foglalt!";
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        $stmt->close();
    }

    if (!empty($uj_jelszo_post)) {
        if (empty($regi_jelszo_post) || empty($uj_jelszo_ismet_post)) {
            $_SESSION['error_message'] = "A jelszó módosításához a régi jelszót és az új jelszó megerősítését is meg kell adni!";
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        if ($uj_jelszo_post !== $uj_jelszo_ismet_post) {
            $_SESSION['error_message'] = "Az új jelszavak nem egyeznek meg!";
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        $regi_jelszo = $regi_jelszo_post;
        $uj_jelszo = $uj_jelszo_post;

        $stmt = $db->prepare("SELECT jelszo FROM felhasznalok WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->bind_result($hash);
        $stmt->fetch();
        $stmt->close();

        if (!password_verify($regi_jelszo, $hash)) {
            $_SESSION['error_message'] = "Hibás régi jelszó!";
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }

        $uj_jelszo_hash = password_hash($uj_jelszo, PASSWORD_DEFAULT);
        $update_pass_stmt = $db->prepare("UPDATE felhasznalok SET jelszo = ? WHERE email = ?");
        $update_pass_stmt->bind_param("ss", $uj_jelszo_hash, $email);
        $update_pass_stmt->execute();
        $update_pass_stmt->close();
    }

    $update_stmt = $db->prepare("UPDATE felhasznalok
                                     INNER JOIN szallitasi_cim ON felhasznalok.szallitasi_cim_id = szallitasi_cim.id
                                     INNER JOIN szamlazasi_cim ON felhasznalok.szamlazasi_cim_id = szamlazasi_cim.id
                                     SET felhasznalok.nev = ?, felhasznalok.email = ?, felhasznalok.telefonszam = ?,
                                         szallitasi_cim.iranyitoszam = ?, szallitasi_cim.telepules = ?, szallitasi_cim.utca_hazszam = ?,
                                         szamlazasi_cim.iranyitoszam = ?, szamlazasi_cim.telepules = ?, szamlazasi_cim.utca_hazszam = ?
                                     WHERE felhasznalok.email = ?");
    $update_stmt->bind_param(
        "ssssssssss",
        $nev,
        $uj_email,
        $telefonszam,
        $szallitasi_irsz,
        $szallitasi_telepules,
        $szallitasi_utca,
        $szamlazasi_irsz,
        $szamlazasi_telepules,
        $szamlazasi_utca,
        $email
    );
    $update_stmt->execute();
    $update_stmt->close();

    if ($uj_email !== $_SESSION['user_email']) {
        $_SESSION['user_email'] = $uj_email;
    }

    $_SESSION['message'] = "Sikeres mentés!";
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit();
}

$message = isset($_SESSION['message']) ? $_SESSION['message'] : '';
$error_message = isset($_SESSION['error_message']) ? $_SESSION['error_message'] : '';

unset($_SESSION['message']);
unset($_SESSION['error_message']);
?>


<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../css/adataim.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <script src="../js/adataim.js" defer></script>
    <title>PoolPalace - Adatok</title>
</head>

<body>
    <?php include './navbar.php'; ?>

    <div class="form-container">
        <h3>Adatok módosítása</h3>

        <div>
            <?php if (!empty($message)): ?>
                <div id="visszaSzamlalo" class="alert alert-success text-center">
                    <?php echo htmlspecialchars($message); ?> Átirányítás <span id="visszaSzamlalo-szam">3</span> másodperc múlva...
                </div>
            <?php endif; ?>
            <?php if (!empty($error_message)) { ?>
                <div class="alert alert-danger text-center">
                    <?php echo htmlspecialchars($error_message); ?>
                </div>
            <?php } ?>
        </div>

        <form method="POST" id="adataim-urlap" class="row g-3">
            <div class="col-md-6">
                <h4>Felhasználói adatok</h4>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/felhasznalo.png" alt="Név ikon"></span>
                        <input type="text" id="nev" name="nev" class="form-control" value="<?php echo htmlspecialchars($user['nev']); ?>" placeholder="Név">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/email.png" alt="E-mail ikon"></span>
                        <input type="email" id="email" name="email" class="form-control" value="<?php echo htmlspecialchars($user['email']); ?>" placeholder="E-mail cím">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/telefon.png" alt="Telefonszám ikon"></span>
                        <input type="text" id="telefonszam" name="telefonszam" class="form-control" value="<?php echo htmlspecialchars($user['telefonszam']); ?>" placeholder="Telefonszám">
                        <span class="error"></span>
                    </div>
                </div>
                <h4>Jelszó módosítása</h4>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/jelszo.png" alt="Jelszó ikon"></span>
                        <input type="password" id="regi-jelszo" name="regi-jelszo" class="form-control" placeholder="Régi jelszó">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/jelszo.png" alt="Jelszó ikon"></span>
                        <input type="password" id="uj-jelszo" name="uj-jelszo" class="form-control" placeholder="Új jelszó">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/jelszo_ujra.png" alt="Jelszó megerősítése ikon"></span>
                        <input type="password" id="uj-jelszo-ismet" name="uj-jelszo-ismet" class="form-control" placeholder="Új jelszó mégegyszer">
                        <span class="error"></span>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <h4>Szállítási adatok</h4>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/iranyitoszam.png" alt="Irányítószám ikon"></span>
                        <input type="text" id="szallitasi-irsz" name="szallitasi-irsz" class="form-control" value="<?php echo htmlspecialchars($user['szallitasi_irsz']); ?>" placeholder="Irányítószám">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/telepules.png" alt="Település ikon"></span>
                        <input type="text" id="szallitasi-telepules" name="szallitasi-telepules" class="form-control" value="<?php echo htmlspecialchars($user['szallitasi_telepules']); ?>" placeholder="Település">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/hazszam.png" alt="Házszám ikon"></span>
                        <input type="text" id="szallitasi-utca" name="szallitasi-utca" class="form-control" value="<?php echo htmlspecialchars($user['szallitasi_utca']); ?>" placeholder="Utca és házszám">
                        <span class="error"></span>
                    </div>
                </div>

                <h4>Számlázási adatok</h4>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/iranyitoszam.png" alt="Irányítószám ikon"></span>
                        <input type="text" id="szamlazasi-irsz" name="szamlazasi-irsz" name="szamlazasi-irsz" class="form-control" value="<?php echo htmlspecialchars($user['szamlazasi_irsz']); ?>" placeholder="Irányítószám">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/telepules.png" alt="Település ikon"></span>
                        <input type="text" id="szamlazasi-telepules" name="szamlazasi-telepules" class="form-control" value="<?php echo htmlspecialchars($user['szamlazasi_telepules']); ?>" placeholder="Település">
                        <span class="error"></span>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text"><img src="../img/hazszam.png" alt="Házszám ikon"></span>
                        <input type="text" id="szamlazasi-utca" name="szamlazasi-utca" class="form-control" value="<?php echo htmlspecialchars($user['szamlazasi_utca']); ?>" placeholder="Utca és házszám">
                        <span class="error"></span>
                    </div>
                </div>
            </div>

            <div class="col-md-12 text-center">
                <button type="submit" id="mentes-gomb" class="btn btn-primary mt-3">Mentés</button>
            </div>
        </form>
    </div>
</body>
</html>