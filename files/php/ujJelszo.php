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
    <link rel="stylesheet" href="../css/ujJelszo.css">
    <script src="../js/ujJelszo.js" defer></script>
    <title>Új jelszó beállítása</title>
</head>

<body id="body">
    <?php include './navbar.php'; ?>

    <div class="form-container">
        <div id="uzenet-helye">
            <?php if (!empty($hiba)): ?>
                <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($hiba); ?></div>
            <?php endif; ?>
            <?php if (!empty($uzenet)): ?>
                <div id="visszaSzamlalo" class="alert alert-success text-center mt-2">
                    Sikeres jelszómódosítás! Átirányítás <span id="visszaSzamlalo-szam">3</span> másodperc múlva...
                </div>
            <?php endif; ?>
        </div>

        <form method="POST" id="ujJelszo-urlap" class="row g-3">
            <input type="hidden" name="email" value="<?php echo isset($_REQUEST['email']) ? htmlspecialchars($_REQUEST['email']) : ''; ?>">
            <div class="col">
                <h4>Új jelszó</h4>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text required-icon"><img src="../img/jelszo.png" class="jelszo-logo" alt="Jelszó"></span>
                        <input type="password" class="form-control" id="uj-jelszo" name="jelszo" placeholder="Új jelszó">
                    </div>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text required-icon"><img src="../img/jelszo_ujra.png" class="jelszo-ujra-logo" alt="Jelszó megerősítése"></span>
                        <input type="password" class="form-control" id="uj-jelszo-ismet" name="jelszo-ujra" placeholder="Új jelszó megerősítése">
                    </div>
                </div>
                <button type="submit" class="mt-3 btn btn-primary">Módosítás</button>
            </div>
        </form>
    </div>

    <?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        include './db.php';

        $email = $_POST['email'] ?? null;
        if (!empty($_POST['jelszo']) && !empty($_POST['jelszo-ujra']) && !empty($_POST['email'])) {
            $uj_jelszo = $_POST['jelszo'];
            $uj_jelszo_megerositett = $_POST['jelszo-ujra'];

            if (empty($uj_jelszo) || empty($uj_jelszo_megerositett) || empty($email)) {
                $_SESSION['hiba'] = "Minden mezőt ki kell tölteni!";
                header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
                exit;
            }

            if ($uj_jelszo !== $uj_jelszo_megerositett) {
                $_SESSION['hiba'] = "Az új jelszavak nem egyeznek meg!";
                header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
                exit;
            }

            $jelenlegi_stmt = $db->prepare("SELECT jelszo FROM felhasznalok WHERE email = ?");
            if (!$jelenlegi_stmt) {
                $_SESSION['hiba'] = "Adatbázis hiba: " . $db->error;
                header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
                exit;
            }

            $jelenlegi_stmt->bind_param("s", $email);
            $jelenlegi_stmt->execute();
            $result = $jelenlegi_stmt->get_result();
            $row = $result->fetch_assoc();
            $jelenlegi_jelszo_hash = $row['jelszo'];
            $jelenlegi_stmt->close();

            if (password_verify($uj_jelszo, $jelenlegi_jelszo_hash)) {
                $_SESSION['hiba'] = "Az új jelszó nem lehet azonos a jelenlegi jelszóval!";
                header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
                exit;
            }

            $uj_jelszo_hash = password_hash($uj_jelszo, PASSWORD_DEFAULT);
            $update_stmt = $db->prepare("UPDATE felhasznalok SET jelszo = ? WHERE email = ?");
            if (!$update_stmt) {
                $_SESSION['hiba'] = "Adatbázis hiba: " . $db->error;
                header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
                exit;
            }

            $update_stmt->bind_param("ss", $uj_jelszo_hash, $email);
            if ($update_stmt->execute()) {
                $_SESSION['uzenet'] = "Sikeres jelszómódosítás!";
            } else {
                $_SESSION['hiba'] = "Adatbázis hiba: " . $update_stmt->error;
            }
            $update_stmt->close();

            header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
            exit;
        } else {
            $_SESSION['hiba'] = "Minden mezőt ki kell tölteni!";
            header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
            exit;
        }
    }
    ?>

</body>
</html>