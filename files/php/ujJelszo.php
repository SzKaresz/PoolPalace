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
         <h4>Új jelszó beállítása</h4>
        <form method="POST" id="ujJelszo-urlap" class="row g-3 justify-content-center">
            <input type="hidden" name="email" value="<?php echo isset($_REQUEST['email']) ? htmlspecialchars($_REQUEST['email']) : ''; ?>">
            <div class="col-md-8 col-lg-6">
                <div class="mb-3 position-relative">
                    <div class="input-group">
                        <span class="input-group-text required-icon"><img src="../img/jelszo.png" class="jelszo-logo" alt="Jelszó"></span>
                        <input type="password" class="form-control" id="uj-jelszo" name="jelszo" placeholder="Új jelszó">
                        <img src="../img/caps_on.png" id="caps-icon-uj" class="caps-lock-icon" alt="Caps Lock aktív">
                    </div>
                </div>
                <div class="mb-3 position-relative">
                    <div class="input-group">
                        <span class="input-group-text required-icon"><img src="../img/jelszo_ujra.png" class="jelszo-ujra-logo" alt="Jelszó megerősítése"></span>
                        <input type="password" class="form-control" id="uj-jelszo-ismet" name="jelszo-ujra" placeholder="Új jelszó megerősítése">
                        <img src="../img/caps_on.png" id="caps-icon-uj-ismet" class="caps-lock-icon" alt="Caps Lock aktív">
                    </div>
                </div>
                <button type="submit" class="mt-3 btn btn-primary w-100">Módosítás</button>
            </div>
        </form>
    </div>

     <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>

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

             $jelszoPattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/';
             if (!preg_match($jelszoPattern, $uj_jelszo)) {
                 $_SESSION['hiba'] = "Az új jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!";
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

            if($result->num_rows === 0) {
                 $_SESSION['hiba'] = "Nem található felhasználó ezzel az e-mail címmel.";
                 $jelenlegi_stmt->close();
                 header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
                 exit;
            }

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
            $_SESSION['hiba'] = "Minden jelszó mezőt ki kell tölteni!";
             header('Location: ' . $_SERVER['PHP_SELF'] . '?email=' . urlencode($email));
            exit;
        }
    }

    if (!empty($uzenet)): ?>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                showToast('<?php echo addslashes(htmlspecialchars($uzenet)); ?>', 'success');
                 let visszaSzamlaloElemDiv = document.createElement('div');
                 visszaSzamlaloElemDiv.id = 'visszaSzamlalo';
                 visszaSzamlaloElemDiv.className = 'd-none';
                 document.body.appendChild(visszaSzamlaloElemDiv);
                 szamlaloAtiranyitas();
            });
        </script>
    <?php endif; ?>
    <?php if (!empty($hiba)): ?>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                showToast('<?php echo addslashes(htmlspecialchars($hiba)); ?>', 'danger');
            });
        </script>
    <?php endif;
    ob_end_flush();
    ?>

</body>
</html>