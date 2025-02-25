<?php
include './session.php';
include './db.php';
ob_start();

$recaptcha_secret = '6LeCq3oqAAAAAAjLBjZNWtYsshRzRA1Brd7bw3D7';
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
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <link rel="stylesheet" href="../css/bejelentkezes.css">
    <script src="../js/elfelejtett_jelszo.js"></script>
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title>PoolPalace - Elfelejtett jelszó</title>
</head>

<body id="body">

    <?php
    include './navbar.php';
    ?>

    <div class="form-container">
        <img src="../img/login.png" class="login-kep" alt="Bejelentkezés ikon">
        <h3>Jelszó emlékeztető</h3>

        <div id="uzenet-helye">
            <?php if (!empty($hiba)): ?>
                <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($hiba); ?></div>
            <?php endif; ?>
            <?php if (!empty($uzenet)): ?>
                <div id="visszaSzamlalo" class="alert alert-success text-center mt-2">
                    Sikeres küldés! Átirányítás <span id="visszaSzamlalo-szam">5</span> másodperc múlva...
                </div>
            <?php endif; ?>
        </div>


        <form id="urlap" method="POST">
            <div class="mb-3">
                <div class="input-group">
                    <span class="input-group-text">
                        <img src="../img/felhasznalo.png" alt="E-mail cím">
                    </span>
                    <input type="email" class="form-control" id="email" name="email" placeholder="E-mail cím" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                </div>
            </div>

            <div class="nem-robot g-recaptcha" data-sitekey="6LeCq3oqAAAAAAycGrnmZ-Qdcea0CEEACjHyVuVR"></div>

            <button type="submit" class="btn btn-primary">Küldés</button>
        </form>
    </div>

    <?php
    include "./email_kuldes.php";
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (!empty($_POST['email']) && !empty($_POST['g-recaptcha-response'])) {
            $email = $_POST['email'];
            $recaptcha_response = $_POST['g-recaptcha-response'];

            $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
            $recaptcha_data = [
                'secret' => $recaptcha_secret,
                'response' => $recaptcha_response
            ];

            $recaptcha_verify = file_get_contents($recaptcha_url . '?' . http_build_query($recaptcha_data));
            $recaptcha_result = json_decode($recaptcha_verify);

            if ($recaptcha_result->success) {
                $stmt = $db->prepare("SELECT * FROM felhasznalok WHERE email = ?");
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $result = $stmt->get_result();
                $user = $result->fetch_assoc();

                if ($user) {
                    if (elfelejtettEmail($email, $user["nev"])) {
                        $_SESSION['uzenet'] = 'Sikeres küldés! Átirányítás 5 másodperc múlva.';
                    } else {
                        $_SESSION["hiba"] = $hiba;
                    }
                } else {
                    $_SESSION['hiba'] = "Érvénytelen e-mail cím!";
                }
            } else {
                $_SESSION['hiba'] = "Kérjük, igazolja, hogy nem robot!";
            }
        } else {
            $_SESSION['hiba'] = "Kérjük töltse ki az összes mezőt, az ellenőrzéssel együtt!";
        }
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit();
    }

    ob_end_flush();
    ?>
</body>

</html>