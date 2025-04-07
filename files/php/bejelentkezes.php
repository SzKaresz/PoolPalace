<?php
include './session.php'; 
include './db.php';
ob_start(); 

$recaptcha_secret = '6LeCq3oqAAAAAAjLBjZNWtYsshRzRA1Brd7bw3D7';
$hibaUzenet = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!empty($_POST['email']) && !empty($_POST['password']) && !empty($_POST['g-recaptcha-response'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
        $recaptcha_response = $_POST['g-recaptcha-response'];

        $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptcha_data = [
            'secret' => $recaptcha_secret,
            'response' => $recaptcha_response
        ];

        $recaptcha_verify = file_get_contents($recaptcha_url . '?' . http_build_query($recaptcha_data));
        $recaptcha_result = json_decode($recaptcha_verify);

        if ($recaptcha_result -> success) {
            $stmt = $db -> prepare("SELECT * FROM felhasznalok WHERE email = ?");
            $stmt -> bind_param("s", $email);
            $stmt -> execute();
            $result = $stmt -> get_result();
            $user = $result -> fetch_assoc();

            if ($user && password_verify($password, $user['jelszo'])) {
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_nev'] = $user['nev'];
                header('Location: index.php');
                exit;
            }
            else {
                $hibaUzenet = "Érvénytelen e-mail cím vagy jelszó!";
            }
        }
        else {
            $hibaUzenet = "Kérjük, igazolja, hogy nem robot!";
        }
    }
    else {
        $hibaUzenet = "Kérjük töltse ki az összes mezőt, az ellenőrzéssel együtt!";
    }
}

ob_end_flush();
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
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title>PoolPalace - Bejelentkezés</title>
</head>
<body>

    <?php
        include './navbar.php';
    ?>

    <div class="form-container">
        <img src="../img/login.png" class="login-kep" alt="Bejelentkezés ikon">
        <h3>Bejelentkezés</h3>

        <?php if ($hibaUzenet): ?>
            <div class="alert alert-danger">
                <?php echo $hibaUzenet; ?>
            </div>
        <?php endif; ?>

        <form id="urlap" method="POST">
            <div class="mb-3">
                <div class="inputMezo input-group">
                    <span class="input-group-text required-icon">
                        <img src="../img/felhasznalo.png" alt="E-mail cím">
                    </span>
                    <input type="email" class="form-control" id="email" name="email" placeholder="E-mail cím" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                </div>
            </div>

            <div class="mb-3">
                <div class="inputMezo input-group">
                    <span class="input-group-text required-icon">
                        <img src="../img/jelszo.png" alt="Jelszó">
                    </span>
                    <input type="password" class="form-control" id="password" name="password" placeholder="Jelszó">
                </div>
            </div>

            <div class="d-flex">
                <a href="./elfelejtett_jelszo.php" class="jelszo-felejt">Elfelejtette a jelszavát?</a>
            </div>

            <div class="nem-robot g-recaptcha" data-sitekey="6LeCq3oqAAAAAAycGrnmZ-Qdcea0CEEACjHyVuVR"></div>

            <button type="submit" id="belepes" class="btn btn-primary">Belépés</button>
        </form>

        <div class="text-center mt-4">
            <p class="eloszor-jar">Először jár nálunk? <button type="button" onclick="location.href='./regisztracio.php'" class="btn btn-outline-secondary">Fiók létrehozása</button></p>
        </div>
    </div>
</body>
</html>