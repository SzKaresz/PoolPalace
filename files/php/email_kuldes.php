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
        
        $mail->Body = "Tisztelt " . htmlspecialchars($nev) . "!<br><br> Jelszó visszaállításához kattintson az alábbi linkre:<br><br> <a href='http://localhost/PoolPalace/files/php/ujJelszo.php?email=" . urlencode($email) . "'>Jelszó visszaállítása</a>";

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

        $emailBody = "<html><head><style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); margin: auto; }
            .header { background: #293144; color: #ffffff; text-align: center; padding: 15px; border-radius: 10px 10px 0 0; font-size: 20px; }
            .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; }
            .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #293144; color: white; }
        </style></head><body>
        <div class='container'>
            <div class='header'>Megrendelés visszaigazolása</div>
            <div class='content'>
                <p>Kedves <strong>$name</strong>,</p>
                <p>Köszönjük a rendelését! A rendelési azonosítója: <strong>#$orderId</strong>.</p>
                <div class='order-details'>
                    <h3>Rendelés részletei</h3>
                    <table>
                        <tr><th>Terméknév</th><th>Termék cikkszám</th><th>Darabszám</th><th>Egységár</th><th>Összeg</th></tr>";

        foreach ($cartItems as $item) {
            $itemTotal = $item['darabszam'] * $item['egysegar'];
            $emailBody .= "<tr>
                <td>{$item['nev']}</td>
                <td>{$item['cikkszam']}</td>
                <td>{$item['darabszam']}</td>
                <td>" . number_format($item['egysegar'], 0, ',', ' ') . " Ft</td>
                <td>" . number_format($itemTotal, 0, ',', ' ') . " Ft</td>
            </tr>";
        }

        $emailBody .= "</table>
                    <p><strong>Végösszeg: " . number_format($total, 0, ',', ' ') . " Ft</strong></p>
                </div>
                <p>Hamarosan feldolgozzuk a rendelését és értesítjük a további lépésekről.</p>
                <br>
                <p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " PoolPalace | <a href='localhost/PoolPalace/files/php'>Weboldalunk</a></p>
            </div>
        </div>
        </body></html>";

        $mail->Body = $emailBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba: " . $mail->ErrorInfo);
        return false;
    }
}

?>