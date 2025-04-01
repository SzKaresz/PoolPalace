<?php
require '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function rolunkEmail($nev, $email, $email_targya, $email_szovege, &$hiba)
{
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

function elfelejtettEmail($email, $nev)
{
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

function kuldRendelesVisszaigazolas($email, $name, $orderId, $cartItems, $total, $payment)
{
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

        $emailBody = "<html><head>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; font-size: 16px; }
            .container { background: #ffffff; margin: auto; width: 100%; max-width: 100%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background: #293144; color: #ffffff; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }
            .footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; }
            .button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
            th { padding: 15px; border: 1px solid #ddd; text-align: center; }
            td { padding: 15px; border: 1px solid #ddd; text-align: center; }
            th { background-color: #293144; color: white; font-size: 16px; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            tr:hover { background-color: #e9ecef; }
            .order-summary { margin-top: 20px; font-size: 18px; font-weight: bold; }
            .ar {white-space: nowrap;}
            @media (max-width: 768px) {
                body { font-size: 14px; }
                th, td { padding: 8px; font-size: 13px; }
                .header { font-size: 20px; padding: 15px; }
                .footer { font-size: 12px; }
                .order-summary { font-size: 16px; }
            }
            @media (max-width: 480px) {
                body { font-size: 12px; }
                th, td { padding: 6px; font-size: 12px; }
                .header { font-size: 18px; padding: 10px; }
                .footer { font-size: 10px; }
                .order-summary { font-size: 14px; }
            }
        </style></head><body>
        <div class='container'>
            <div class='header'>Megrendelés visszaigazolása</div>
            <div class='content'>
                <p>Kedves <strong>$name</strong>,</p>
                <p>Köszönjük a rendelését! A rendelési azonosítója: <strong>#$orderId</strong>.</p>
                <div class='order-details'>
                    <h3>Rendelés részletei</h3>
                    <table class='table'>
                        <thead>
                            <tr>
                                <th>Terméknév</th>
                                <th>Cikkszám</th>
                                <th>Darab</th>
                                <th>Ár</th>
                                <th>Összeg</th>
                            </tr>
                        </thead>
                        <tbody>";

        foreach ($cartItems as $item) {
            if ($item['akcios_ar'] > -1) {
                $itemTotal = $item['darabszam'] * $item['akcios_ar'];
                $emailBody .= "<tr>
                        <td>{$item['nev']}</td>
                        <td>{$item['cikkszam']}</td>
                        <td class='ar'>{$item['darabszam']}</td>
                        <td>
                            <s>" . number_format($item['egysegar'], 0, ',', ' ') . " Ft</s><br>
                            <span class='ar' style='color: green; font-weight: bold;'>" . number_format($item['akcios_ar'], 0, ',', ' ') . " Ft</span>
                        </td>
                    <td class='ar'>" . number_format($itemTotal, 0, ',', ' ') . " Ft</td>
                </tr>";
            } else {
                $itemTotal = $item['darabszam'] * $item['egysegar'];
                $emailBody .= "<tr>
                    <td>{$item['nev']}</td>
                    <td>{$item['cikkszam']}</td>
                    <td>{$item['darabszam']}</td>
                    <td class='ar'>" . number_format($item['egysegar'], 0, ',', ' ') . " Ft</td>
                    <td class='ar'>" . number_format($itemTotal, 0, ',', ' ') . " Ft</td>
                </tr>";
            }
        }

        $emailBody .= "</tbody>
                    </table>
                    <div class='order-summary'>
                        Végösszeg: " . number_format($total, 0, ',', ' ') . " Ft
                    </div>
                </div>
                <p>Az Ön által választott fizetési mód: <strong>$payment</strong>.</p>
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

function kuldRendelesStatuszValtozas($email, $name, $orderId, $newStatus)
{
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
        $mail->Subject = 'Rendelés státuszának frissítése - #' . $orderId;

        $emailBody = "<html><head>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; font-size: 16px; }
            .container { background: #ffffff; margin: auto; width: 100%; max-width: 100%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background: #293144; color: #ffffff; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }
            .footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; }
            .button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .order-summary { margin-top: 20px; font-size: 18px; font-weight: bold; }
            @media (max-width: 768px) {
                body { font-size: 14px; }
                .header { font-size: 20px; padding: 15px; }
                .footer { font-size: 12px; }
            }
            @media (max-width: 480px) {
                body { font-size: 12px; }
                .header { font-size: 18px; padding: 10px; }
                .footer { font-size: 10px; }
            }
        </style></head><body>
        <div class='container'>
            <div class='header'>Rendelés státuszának frissítése</div>
            <div class='content'>
                <p>Kedves <strong>$name</strong>,</p>
                <p>Ezúton értesítjük, hogy rendelésének státusza megváltozott.</p>
                <div class='order-details'>
                    <h3>Rendelés részletei:</h3>
                    <p>Rendelési azonosító: <strong>#$orderId</strong></p>
                    <p>Új státusz: <strong>$newStatus</strong></p>
                </div>
                <p>Ha bejelentkezik fiókjába nyomon tudja követni rendelése állapotát.</p>
                <p>Amint új információk állnak rendelkezésre, értesítjük Önt a további lépésekről.</p>
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

function kuldRendelesTorles($email, $name, $orderId)
{
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
        $mail->Subject = 'Rendelés törlésének értesítése - #' . $orderId;

        $emailBody = "<html><head>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; font-size: 16px; }
            .container { background: #ffffff; margin: auto; width: 100%; max-width: 100%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { background: #293144; color: #ffffff; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }
            .footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; }
            .button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            @media (max-width: 768px) {
                body { font-size: 14px; }
                .header { font-size: 20px; padding: 15px; }
                .footer { font-size: 12px; }
            }
            @media (max-width: 480px) {
                body { font-size: 12px; }
                .header { font-size: 18px; padding: 10px; }
                .footer { font-size: 10px; }
            }
        </style></head><body>
        <div class='container'>
            <div class='header'>Rendelés törlésének értesítése</div>
            <div class='content'>
                <p>Kedves <strong>$name</strong>,</p>
                <p>Ezúton értesítjük, hogy rendelése törlésre került.</p>
                <div class='order-details'>
                    <h3>Rendelés részletei:</h3>
                    <p>Rendelési azonosító: <strong>#$orderId</strong></p>
                </div>
                <p>Ha kérdése van a törléssel kapcsolatban, kérjük, lépjen kapcsolatba ügyfélszolgálatunkkal.</p>
                <p>Ha úgy dönt, hogy újra szeretné rendelni, ne habozzon felkeresni minket.</p>
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