<?php
require '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function rolunkEmail(string $nev, string $email, string $email_targya, string $email_szovege, ?string &$hiba): bool
{
    $mail = new PHPMailer(true);
    $hiba = null;

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info.poolpalace@gmail.com';
        $mail->Password = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;

        $mail->setFrom($email, $nev);
        $mail->addAddress('info.poolpalace@gmail.com');
        $mail->addReplyTo($email, $nev);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Kapcsolatfelvétel: ' . htmlspecialchars($email_targya);

        $bodyContent = '<h2>Új üzenet a weboldalról:</h2>';
        $bodyContent .= '<p><strong>Küldő neve:</strong> ' . htmlspecialchars($nev) . '</p>';
        $bodyContent .= '<p><strong>Küldő e-mail címe:</strong> ' . htmlspecialchars($email) . '</p>';
        $bodyContent .= '<hr>';
        $bodyContent .= '<p><strong>Üzenet:</strong></p>';
        $bodyContent .= '<p>' . nl2br(htmlspecialchars($email_szovege)) . '</p>';
        $mail->Body = $bodyContent;

        $mail->AltBody = "Új üzenet:\nKüldő neve: " . htmlspecialchars($nev) . "\nKüldő e-mail: " . htmlspecialchars($email) . "\nÜzenet:\n" . htmlspecialchars($email_szovege);

        $mail->send();
        return true;

    } catch (Exception $e) {
        $hiba = "Az üzenet nem került elküldésre. Hiba: {$mail->ErrorInfo}";
        return false;
    }
}

function elfelejtettEmail(string $email, string $nev, ?string &$hiba): bool
{
    $mail = new PHPMailer(true);
    $hiba = null;
    $resetLink = 'http://localhost/PoolPalace/files/php/ujJelszo.php?email=' . urlencode($email);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info.poolpalace@gmail.com';
        $mail->Password   = $_ENV['SMTP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace Webshop');
        $mail->addAddress($email, $nev);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Elfelejtett jelszó visszaállítása - PoolPalace';

        $bodyContent = '<!DOCTYPE html><html><head><style>'
                     . 'body { font-family: Arial, sans-serif; background-color: #f4f4f4; font-size: 16px; margin: 0; padding: 0; }'
                     . '.container { background: #ffffff; margin: 20px auto; padding: 20px; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }'
                     . '.header { background: #293144; color: #ffffff; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }'
                     . '.content { padding: 20px; line-height: 1.6; color: #333; }'
                     . '.footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; }'
                     . '.button { display: inline-block; background-color: #007bff; color: white !important; padding: 10px 20px; text-decoration: none; border-radius: 5px; text-align: center; margin: 20px 0; }'
                     . 'a.button { color: white !important; }'
                     . 'hr { border: 0; height: 1px; background: #ddd; margin: 20px 0; }'
                     . '</style></head><body>'
                     . '<div class="container">'
                     . '<div class="header">Jelszó Visszaállítás</div>'
                     . '<div class="content">'
                     . '<h1>Kedves ' . htmlspecialchars($nev) . '!</h1>'
                     . '<p>Kérés érkezett a PoolPalace fiókodhoz tartozó jelszó visszaállítására.</p>'
                     . '<p>Ha te kérted a visszaállítást, kattints az alábbi gombra vagy linkre:</p>'
                     . '<p style="text-align: center;">'
                     . '<a href="' . $resetLink . '" class="button">Jelszó visszaállítása</a>'
                     . '</p>'
                     . '<p>Vagy másold be a böngésződbe: <a href="' . $resetLink . '">' . $resetLink . '</a></p>'
                     . '<p>Ha nem te kérted ezt, hagyd figyelmen kívül ezt az e-mailt, a jelszavad nem fog megváltozni.</p>'
                     . '<hr>'
                     . '<p>Üdvözlettel,<br>A PoolPalace Csapata</p>'
                     . '</div>'
                     . '<div class="footer">'
                     . '<p>&copy; ' . date('Y') . ' PoolPalace | <a href="http://localhost/PoolPalace/files/php">Weboldalunk</a></p>'
                     . '</div>'
                     . '</div></body></html>';
        $mail->Body = $bodyContent;

        $mail->AltBody = "Kedves " . htmlspecialchars($nev) . "!\n\nKérés érkezett a PoolPalace fiókodhoz tartozó jelszó visszaállítására.\n\nHa te kérted, látogass el a következő címre:\n" . $resetLink . "\n\nHa nem te kérted, hagyd figyelmen kívül ezt az e-mailt.\n\nÜdvözlettel,\nA PoolPalace Csapata";

        $mail->send();
        return true;

    } catch (Exception $e) {
        $hiba = "A jelszó-visszaállító e-mail nem került elküldésre. Hiba: {$mail->ErrorInfo}";
        return false;
    }
}

function generateEmailHeader($title) {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>'
         . 'body { font-family: Arial, sans-serif; background-color: #f4f4f4; font-size: 16px; margin: 0; padding: 0; }'
         . '.container { background: #ffffff; margin: 20px auto; padding: 0; width: 100%; max-width: 700px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; border: 1px solid #ddd; }'
         . '.header { background: #293144; color: #ffffff; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }'
         . '.content { padding: 25px; line-height: 1.6; color: #333; }'
         . '.footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; border-top: 1px solid #eee; }'
         . '.button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff !important; text-decoration: none; border-radius: 5px; margin-top: 15px; }'
         . 'a.button { color: #ffffff !important; }'
         . 'table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }'
         . 'th { padding: 12px; border: 1px solid #ddd; text-align: center; }'
         . 'td { padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle; }'
         . 'th { background-color: #293144; color: white; font-size: 15px; }'
         . 'tr:nth-child(even) { background-color: #f8f9fa; }'
         . 'tr:hover { background-color: #e9ecef; }'
         . '.order-summary { margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; text-align: right; font-size: 18px; font-weight: bold; }'
         . '.ar { white-space: nowrap; }'
         . '.original-price { text-decoration: line-through; color: #dc3545; font-size: 0.9em; display: block; }'
         . '.discounted-price { color: #198754; font-weight: bold; display: block; }'
         . 'hr { border: 0; height: 1px; background: #ddd; margin: 20px 0; }'
         . '@media (max-width: 600px) {'
         . '  body { font-size: 14px; }'
         . '  .container { width: 95%; margin: 10px auto; }'
         . '  .header { font-size: 20px; padding: 15px; }'
         . '  .content { padding: 15px; }'
         . '  th, td { padding: 8px; font-size: 13px; }'
         . '  .order-summary { font-size: 16px; }'
         . '  .footer { font-size: 12px; }'
         . '}'
         . '</style></head><body>'
         . '<div class="container">'
         . '<div class="header">' . $title . '</div>'
         . '<div class="content">';
}

function generateEmailFooter() {
    return '</div>'
         . '<div class="footer">'
         . '<p>&copy; ' . date('Y') . ' PoolPalace | <a href="http://localhost/PoolPalace/files/php">Weboldalunk</a></p>'
         . '</div>'
         . '</div></body></html>';
}

function generateOrderTable($cartItems, $total) {
     $table = '<div class="order-details">'
            . '<h3>Rendelés részletei</h3>'
            . '<table class="table">'
            . '<thead><tr><th>Terméknév</th><th>Cikkszám</th><th>Darab</th><th>Ár</th><th>Összeg</th></tr></thead>'
            . '<tbody>';

    foreach ($cartItems as $item) {
        $displayPrice = '';
        if (isset($item['akcios_ar']) && $item['akcios_ar'] > -1 && (!isset($item['egysegar']) || $item['akcios_ar'] < $item['egysegar'])) {
            $itemTotal = $item['darabszam'] * $item['akcios_ar'];
            $displayPrice = (isset($item['egysegar']) ? "<span class='original-price'>" . number_format($item['egysegar'], 0, ',', ' ') . " Ft</span>" : '')
                          . "<span class='discounted-price'>" . number_format($item['akcios_ar'], 0, ',', ' ') . " Ft</span>";
        } else {
            $itemTotal = $item['darabszam'] * $item['egysegar'];
            $displayPrice = "<span class='ar'>" . number_format($item['egysegar'], 0, ',', ' ') . " Ft</span>";
        }
        $table .= "<tr><td>" . htmlspecialchars($item['nev']) . "</td><td>" . htmlspecialchars($item['cikkszam']) . "</td><td class='ar'>" . $item['darabszam'] . "</td><td>" . $displayPrice . "</td><td class='ar'>" . number_format($itemTotal, 0, ',', ' ') . " Ft</td></tr>";
    }

    $table .= '</tbody></table>'
            . '<div class="order-summary">Végösszeg: ' . number_format($total, 0, ',', ' ') . ' Ft</div>'
            . '</div>';
    return $table;
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

        $emailBody = generateEmailHeader('Megrendelés visszaigazolása');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Köszönjük a rendelését! A rendelési azonosítója: <strong>#$orderId</strong>.</p>";
        $emailBody .= generateOrderTable($cartItems, $total);
        $emailBody .= "<p>Az Ön által választott fizetési mód: <strong>" . htmlspecialchars($payment) . "</strong>.</p>";
        $emailBody .= "<p>Hamarosan feldolgozzuk a rendelését és értesítjük a további lépésekről.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Visszaigazolás): " . $mail->ErrorInfo);
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

        $emailBody = generateEmailHeader('Rendelés státuszának frissítése');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Ezúton értesítjük, hogy rendelésének státusza megváltozott.</p>";
        $emailBody .= "<div class='order-details'><h3>Rendelés részletei:</h3>";
        $emailBody .= "<p>Rendelési azonosító: <strong>#$orderId</strong></p>";
        $emailBody .= "<p>Új státusz: <strong>" . htmlspecialchars($newStatus) . "</strong></p></div>";
        $emailBody .= "<p>Ha bejelentkezik fiókjába nyomon tudja követni rendelése állapotát.</p>";
        $emailBody .= "<p>Amint új információk állnak rendelkezésre, értesítjük Önt a további lépésekről.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Státusz): " . $mail->ErrorInfo);
        return false;
    }
}

function kuldRendelesModositas($email, $name, $orderId, $cartItems, $total, $currentStatus)
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
        $mail->Subject = 'Rendelésének módosítása - #' . $orderId;

        $emailBody = generateEmailHeader('Rendelésének módosítása');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Ezúton értesítjük, hogy <strong>#$orderId</strong> azonosítójú rendelése módosult az adminisztrátori felületen.</p>";
        $emailBody .= "<p>A rendelés jelenlegi adatai:</p>";
        $emailBody .= generateOrderTable($cartItems, $total);
        $emailBody .= "<p>Jelenlegi státusz: <strong>" . htmlspecialchars($currentStatus) . "</strong>.</p>";
        $emailBody .= "<p>Ha kérdése van a módosítással kapcsolatban, kérjük, vegye fel velünk a kapcsolatot.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Módosítás): " . $mail->ErrorInfo);
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

        $emailBody = generateEmailHeader('Rendelés törlésének értesítése');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Ezúton értesítjük, hogy <strong>#$orderId</strong> azonosítójú rendelése törlésre került.</p>";
        $emailBody .= "<p>Ha kérdése van a törléssel kapcsolatban, kérjük, lépjen kapcsolatba ügyfélszolgálatunkkal.</p>";
        $emailBody .= "<p>Ha úgy dönt, hogy újra szeretné rendelni, ne habozzon felkeresni minket.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Törlés): " . $mail->ErrorInfo);
        return false;
    }
}
?>