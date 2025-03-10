<?php
require '../vendor/autoload.php';
require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require '../vendor/phpmailer/phpmailer/src/SMTP.php';
require '../vendor/phpmailer/phpmailer/src/Exception.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function rolunkEmail($nev, $email, $email_targya, $email_szovege, &$hiba) {
    try {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info.poolpalace@gmail.com';
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom($email);
        $mail->addAddress('info.poolpalace@gmail.com');
        $mail->addReplyTo($email, $nev);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $email_targya;
        $mail->Body = $email_szovege . '<br>' . $nev . "<br>" . $email;

        $mail->send();
        return true;
    } catch (Exception $e) {
        $hiba = "Az üzenet nem került elküldésre. Hiba: {$mail->ErrorInfo}";
        return false;
    }
}

function elfelejtettEmail($email, $nev){
    try {
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info.poolpalace@gmail.com';
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = "Elfelejtett jelszó";
        
        $mail->Body = "Tisztelt " . htmlspecialchars($nev) . "!<br><br> Jelszó visszaállításához kattintson az alábbi linkre:<br><br> <a href='http://localhost/13c-szautner/projekt/php/ujJelszo.php?email=" . urlencode($email) . "'>Jelszó visszaállítása</a>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        $hiba = "Az üzenet nem került elküldésre. Hiba: {$mail->ErrorInfo}";
        return false;
    }
}

function kuldRendelesVisszaigazolas($email, $name, $orderId, $cartItems, $total) {
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = 'info.poolpalace@gmail.com';
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace');
        $mail->addAddress($email, $name);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Megrendelés visszaigazolás - #' . $orderId;

        $emailBody = "<h1>Kedves $name,</h1>";
        $emailBody .= "<p>Köszönjük a rendelését! A rendelési azonosítója: <strong>#$orderId</strong>.</p>";
        $emailBody .= "<h2>Rendelés részletei:</h2>";
        $emailBody .= "<table border='1' cellspacing='0' cellpadding='5'>";
        $emailBody .= "<tr><th>Termék</th><th>Darabszám</th><th>Egységár</th><th>Összeg</th></tr>";

        foreach ($cartItems as $item) {
            $itemTotal = $item['darabszam'] * $item['egysegar'];
            $emailBody .= "<tr>
                <td>{$item['cikkszam']}</td>
                <td>{$item['darabszam']}</td>
                <td>" . number_format($item['egysegar'], 0, ',', ' ') . " Ft</td>
                <td>" . number_format($itemTotal, 0, ',', ' ') . " Ft</td>
            </tr>";
        }

        $emailBody .= "</table>";
        $emailBody .= "<p><strong>Végösszeg: " . number_format($total, 0, ',', ' ') . " Ft</strong></p>";
        $emailBody .= "<p>Hamarosan feldolgozzuk a rendelését és értesítjük a további lépésekről.</p>";
        $emailBody .= "<br><p>Üdvözlettel, PoolPalace csapata</p>";

        $mail->Body = $emailBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba: " . $mail->ErrorInfo);
        return false;
    }
}

?>