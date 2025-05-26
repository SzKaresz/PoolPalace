<?php
require '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function generateEmailHeader($title) {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' . htmlspecialchars($title) . '</title><style>'
         . 'body { font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; width: 100% !important; }'
         . 'table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }'
         . 'img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }'
         . 'body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }'
         . '.ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }'
         . '.container { background: #ffffff; margin: 20px auto; padding: 0; width: 100%; max-width: 700px !important; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; border: 1px solid #ddd; }'
         . '.header { background: #293144; color: #ffffff !important; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }'
         . '.content { padding: 25px; line-height: 1.6; color: #333; }'
         . '.footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; border-top: 1px solid #eee; }'
         . '.footer a { color: #293144; text-decoration: none; }'
         . '.button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff !important; text-decoration: none; border-radius: 5px; margin-top: 15px; }'
         . 'a.button { color: #ffffff !important; }'
         . 'table.order-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }'
         . 'table.order-table th, table.order-table td { padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle; }'
         . 'table.order-table th { background-color: #293144; color: white; font-size: 15px; }'
         . 'table.order-table tr:nth-child(even) { background-color: #f8f9fa; }'
         . '.order-summary { margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; text-align: right; font-size: 18px; font-weight: bold; color: #333; }'
         . '.ar { white-space: nowrap; }'
         . '.original-price { text-decoration: line-through; color: #dc3545; font-size: 0.9em; display: block; }'
         . '.discounted-price { color: #198754; font-weight: bold; display: block; }'
         . 'hr { border: 0; border-top: 1px solid #ddd; margin: 20px 0; height: 1px; }'
         . 'p { margin-bottom: 1em; }'
         . 'strong { color: #293144; }'
         . '.address-section { margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; }'
         . '.address-section h4 { margin-bottom: 15px; font-size: 18px; color: #333; text-align: left; }'
         . '.address-cards-container { width: 100%; border-spacing: 0; border-collapse: collapse; }'
         . '.address-card-cell { width: 50%; padding: 0 5px; vertical-align: top; }'
         . '.address-card { border: 1px solid #ddd; border-radius: 6px; padding: 15px; box-sizing: border-box; height: 100%; }'
         . '.address-card h5 { margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #293144; border-bottom: 1px solid #eee; padding-bottom: 8px; }'
         . '.address-card .details { font-size: 14px; line-height: 1.6; color: #555; }'
         . '@media screen and (max-width: 600px) {'
         . '  .container { width: 100% !important; max-width: 100% !important; margin: 0; border-radius: 0; border: 0; box-shadow: none; }'
         . '  .content { padding: 15px; }'
         . '  .address-card-cell { display: block !important; width: 100% !important; max-width: 100% !important; padding: 0 0 15px 0 !important; box-sizing: border-box; }'
         . '  .address-card-cell:last-child { padding-bottom: 0 !important; }'
         . '  .address-card { height: auto; }'
         . '}'
         . '</style></head><body style="margin:0; padding:0; width: 100% !important;">'
         . '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="padding: 20px 0;">'
         . '<div class="container">'
         . '<div class="header">' . htmlspecialchars($title) . '</div>'
         . '<div class="content">';
}

function generateEmailFooter() {
    return '</div>'
         . '<div class="footer">'
         . '<p>&copy; ' . date('Y') . ' PoolPalace | <a href="http://localhost/PoolPalace/files/php" style="color: #293144; text-decoration: none;">Weboldalunk</a></p>'
         . '</div>'
         . '</div>'
         . '</td></tr></table>'
         . '</body></html>';
}

function generateAddressSection($szallitasiCim, $szamlazasiCim) {
    $section = '<div class="address-section" style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">';
    $section .= '<h4 style="margin-bottom: 15px; font-size: 18px; color: #333; text-align: left;">Címadatok</h4>';
    $section .= '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="address-cards-container" style="width: 100%; border-spacing: 0; border-collapse: collapse;">';
    $section .= '<tr>';
    $section .= '<td width="50%" align="left" valign="top" style="width: 50%; padding-right: 5px; padding-left: 0; vertical-align: top;" class="address-card-cell">';
    $section .= '<div class="address-card" style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; box-sizing: border-box; height: 100%;">';
    $section .= '<h5 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #293144; border-bottom: 1px solid #eee; padding-bottom: 8px;">Szállítási cím</h5>';
    $section .= '<div class="details" style="font-size: 14px; line-height: 1.6; color: #555;">';
    $section .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . '<br>' : '');
    $section .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . ' ' . htmlspecialchars($szallitasiCim['telepules'] ?? '') . '<br>';
    $section .= htmlspecialchars($szallitasiCim['utca'] ?? '');
    $section .= '</div></div></td>';
    $section .= '<td width="50%" align="left" valign="top" style="width: 50%; padding-left: 5px; padding-right: 0; vertical-align: top;" class="address-card-cell">';
    $section .= '<div class="address-card" style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; box-sizing: border-box; height: 100%;">';
    $section .= '<h5 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #293144; border-bottom: 1px solid #eee; padding-bottom: 8px;">Számlázási cím</h5>';
    $section .= '<div class="details" style="font-size: 14px; line-height: 1.6; color: #555;">';
    $section .= (isset($szamlazasiCim['nev']) && !empty($szamlazasiCim['nev']) ? htmlspecialchars($szamlazasiCim['nev']) . '<br>' : '');
    $section .= htmlspecialchars($szamlazasiCim['irsz'] ?? '') . ' ' . htmlspecialchars($szamlazasiCim['telepules'] ?? '') . '<br>';
    $section .= htmlspecialchars($szamlazasiCim['utca'] ?? '');
    $section .= (isset($szamlazasiCim['adoszam']) && !empty($szamlazasiCim['adoszam']) ? '<br>Adószám: ' . htmlspecialchars($szamlazasiCim['adoszam']) : '');
    $section .= '</div></div></td>';
    $section .= '</tr></table></div>';
    return $section;
}

function generateOrderTable($cartItems, $total) {
     $table = '<div class="order-details" style="margin-top: 20px;">'
            . '<h3>Rendelés részletei</h3>'
            . '<table class="order-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">'
            . '<thead><tr><th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #293144; color: white; font-size: 15px;">Terméknév</th><th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #293144; color: white; font-size: 15px;">Cikkszám</th><th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #293144; color: white; font-size: 15px;">Darab</th><th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #293144; color: white; font-size: 15px;">Ár</th><th style="padding: 12px; border: 1px solid #ddd; text-align: center; background-color: #293144; color: white; font-size: 15px;">Összeg</th></tr></thead>'
            . '<tbody>';
    $evenRow = false;
    foreach ($cartItems as $item) {
        $item_egysegar_num = isset($item['egysegar']) ? (is_numeric($item['egysegar']) ? $item['egysegar'] : (int)filter_var($item['egysegar'], FILTER_SANITIZE_NUMBER_INT)) : 0;
        $item_akcios_ar_num = isset($item['akcios_ar']) && $item['akcios_ar'] > -1 ? (is_numeric($item['akcios_ar']) ? $item['akcios_ar'] : (int)filter_var($item['akcios_ar'], FILTER_SANITIZE_NUMBER_INT)) : -1;
        $item_darabszam_num = isset($item['darabszam']) ? (int)$item['darabszam'] : 0;
        $ar_to_use = ($item_akcios_ar_num > -1 && $item_akcios_ar_num < $item_egysegar_num) ? $item_akcios_ar_num : $item_egysegar_num;
        $itemTotal = $item_darabszam_num * $ar_to_use;
        $displayPrice = '';
        if ($item_akcios_ar_num > -1 && $item_akcios_ar_num < $item_egysegar_num) {
            $displayPrice = (isset($item['egysegar']) ? "<span class='original-price' style='text-decoration: line-through; color: #dc3545; font-size: 0.9em; display: block;'>" . number_format($item_egysegar_num, 0, ',', ' ') . " Ft</span>" : '')
                          . "<span class='discounted-price' style='color: #198754; font-weight: bold; display: block;'>" . number_format($item_akcios_ar_num, 0, ',', ' ') . " Ft</span>";
        } else {
            $displayPrice = "<span class='ar' style='white-space: nowrap;'>" . number_format($item_egysegar_num, 0, ',', ' ') . " Ft</span>";
        }
        $rowStyle = $evenRow ? 'background-color: #f8f9fa;' : '';
        $table .= "<tr style='$rowStyle'><td style='padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle;'>" . htmlspecialchars($item['nev'] ?? $item['termek_nev'] ?? 'Ismeretlen') . "</td><td style='padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle;'>" . htmlspecialchars($item['cikkszam'] ?? $item['termek_id'] ?? '') . "</td><td class='ar' style='white-space: nowrap; padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle;'>" . $item_darabszam_num . "</td><td style='padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle;'>" . $displayPrice . "</td><td class='ar' style='white-space: nowrap; padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle;'>" . number_format($itemTotal, 0, ',', ' ') . " Ft</td></tr>";
        $evenRow = !$evenRow;
    }
    $table .= '</tbody></table>'
            . '<div class="order-summary" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; text-align: right; font-size: 18px; font-weight: bold; color: #333;">Végösszeg: ' . number_format($total, 0, ',', ' ') . ' Ft</div>'
            . '</div>';
    return $table;
}

function configureSmtp(PHPMailer $mail): void
{
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info.poolpalace@gmail.com';
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
}

function rolunkEmail(string $nev, string $email, string $email_targya, string $email_szovege, ?string &$hiba): bool
{
    $mail = new PHPMailer(true);
    $hiba = null;

    try {
        configureSmtp($mail);

        $mail->setFrom($email, $nev);
        $mail->addAddress('info.poolpalace@gmail.com', 'PoolPalace Admin');
        $mail->addReplyTo($email, $nev);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Kapcsolatfelvétel: ' . htmlspecialchars($email_targya);

        $bodyContent = generateEmailHeader('Új Kapcsolatfelvételi Üzenet');
        $bodyContent .= '<h1>Új üzenet érkezett a PoolPalace weboldalról</h1>';
        $bodyContent .= '<p><strong>Küldő neve:</strong> ' . htmlspecialchars($nev) . '</p>';
        $bodyContent .= '<p><strong>Küldő e-mail címe:</strong> <a href="mailto:' . htmlspecialchars($email) . '">' . htmlspecialchars($email) . '</a></p>';
        $bodyContent .= '<p><strong>Üzenet tárgya:</strong> ' . htmlspecialchars($email_targya) . '</p>';
        $bodyContent .= '<hr>';
        $bodyContent .= '<h2>Üzenet:</h2>';
        $bodyContent .= '<p style="background-color: #f9f9f9; border-left: 4px solid #293144; padding: 15px; margin-top: 10px;">' . nl2br(htmlspecialchars($email_szovege)) . '</p>';
        $bodyContent .= generateEmailFooter();

        $mail->Body = $bodyContent;

        $altBody = "Új üzenet érkezett a PoolPalace weboldalról\n\n";
        $altBody .= "Küldő neve: " . htmlspecialchars($nev) . "\n";
        $altBody .= "Küldő e-mail címe: " . htmlspecialchars($email) . "\n";
        $altBody .= "Üzenet tárgya: " . htmlspecialchars($email_targya) . "\n";
        $altBody .= "-------------------------------------------\n";
        $altBody .= "Üzenet:\n" . htmlspecialchars($email_szovege) . "\n\n";
        $altBody .= "© " . date('Y') . " PoolPalace";
        $mail->AltBody = $altBody;

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
        configureSmtp($mail);

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace Webshop');
        $mail->addAddress($email, $nev);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Elfelejtett jelszó visszaállítása - PoolPalace';

        $bodyContent = generateEmailHeader('Jelszó Visszaállítás');
        $bodyContent .= '<h1>Kedves ' . htmlspecialchars($nev) . '!</h1>'
                     . '<p>Kérés érkezett a PoolPalace fiókodhoz tartozó jelszó visszaállítására.</p>'
                     . '<p>Ha te kérted a visszaállítást, kattints az alábbi gombra vagy linkre a folytatáshoz:</p>'
                     . '<p style="text-align: center;">'
                     . '<a href="' . $resetLink . '" class="button" style="display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff !important; text-decoration: none; border-radius: 5px; margin-top: 15px;">Jelszó visszaállítása</a>'
                     . '</p>'
                     . '<p>Vagy másold be a böngésződ címsorába: <a href="' . $resetLink . '" style="color: #293144;">' . $resetLink . '</a></p>'
                     . '<p>Ha nem te kérted ezt az emailt, kérjük, hagyd figyelmen kívül. A jelszavad nem fog megváltozni.</p>'
                     . '<hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0; height: 1px;">'
                     . '<p>Üdvözlettel,<br>A PoolPalace Csapata</p>';
        $bodyContent .= generateEmailFooter();
        $mail->Body = $bodyContent;

        $altBody = "Kedves " . htmlspecialchars($nev) . "!\n\nKérés érkezett a PoolPalace fiókodhoz tartozó jelszó visszaállítására.\n\nHa te kérted, látogass el a következő címre:\n" . $resetLink . "\n\nHa nem te kérted, hagyd figyelmen kívül ezt az e-mailt.\n\nÜdvözlettel,\nA PoolPalace Csapata\n\n© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;

    } catch (Exception $e) {
        $hiba = "A jelszó-visszaállító e-mail nem került elküldésre. Hiba: {$mail->ErrorInfo}";
        return false;
    }
}

function kuldRendelesVisszaigazolas($email, $name, $orderId, $cartItems, $total, $payment, $szallitasiCim, $szamlazasiCim)
{
    try {
        $mail = new PHPMailer(true);
        configureSmtp($mail);

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace Webshop');
        $mail->addAddress($email, $name);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Megrendelés visszaigazolás - #' . $orderId;

        $emailBody = generateEmailHeader('Megrendelés visszaigazolása');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Köszönjük a rendelését webshopunkban! Örömmel értesítjük, hogy megrendelését sikeresen fogadtuk.</p>";
        $emailBody .= "<p>A rendelési azonosítója: <strong>#$orderId</strong>.</p>";
        $emailBody .= generateOrderTable($cartItems, $total);
        $emailBody .= generateAddressSection($szallitasiCim, $szamlazasiCim);
        $emailBody .= "<p style='margin-top: 20px;'>Az Ön által választott fizetési mód: <strong>" . htmlspecialchars($payment) . "</strong>.</p>";
        $emailBody .= "<p>Megrendelését hamarosan feldolgozzuk, és értesítjük a szállítás részleteiről.</p>";
        $emailBody .= "<p>Ha bármilyen kérdése merülne fel, kérjük, forduljon ügyfélszolgálatunkhoz a rendelési azonosító megadásával.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>A PoolPalace Csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;

        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Köszönjük a rendelését! A rendelési azonosítója: #$orderId.\n\n";
        $altBody .= "Rendelés részletei:\n";
        $altBody .= "--------------------------------------------------\n";
        foreach ($cartItems as $item) {
             $item_egysegar_num = isset($item['egysegar']) ? (is_numeric($item['egysegar']) ? $item['egysegar'] : (int)filter_var($item['egysegar'], FILTER_SANITIZE_NUMBER_INT)) : 0;
             $item_akcios_ar_num = isset($item['akcios_ar']) && $item['akcios_ar'] > -1 ? (is_numeric($item['akcios_ar']) ? $item['akcios_ar'] : (int)filter_var($item['akcios_ar'], FILTER_SANITIZE_NUMBER_INT)) : -1;
             $item_darabszam_num = isset($item['darabszam']) ? (int)$item['darabszam'] : 0;
             $ar_to_use = ($item_akcios_ar_num > -1 && $item_akcios_ar_num < $item_egysegar_num) ? $item_akcios_ar_num : $item_egysegar_num;
             $itemTotal = $item_darabszam_num * $ar_to_use;
             $altBody .= htmlspecialchars($item['nev'] ?? $item['termek_nev'] ?? 'Ismeretlen') . " (" . htmlspecialchars($item['cikkszam'] ?? $item['termek_id'] ?? '') . ") - ";
             $altBody .= $item_darabszam_num . " db x " . number_format($ar_to_use, 0, ',', ' ') . " Ft = " . number_format($itemTotal, 0, ',', ' ') . " Ft\n";
        }
        $altBody .= "--------------------------------------------------\n";
        $altBody .= "Végösszeg: " . number_format($total, 0, ',', ' ') . " Ft\n\n";
        $altBody .= "Szállítási cím:\n";
        $altBody .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . "\n" : '');
        $altBody .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . " " . htmlspecialchars($szallitasiCim['telepules'] ?? '') . "\n";
        $altBody .= htmlspecialchars($szallitasiCim['utca'] ?? '') . "\n\n";
        $altBody .= "Számlázási cím:\n";
        $altBody .= (isset($szamlazasiCim['nev']) && !empty($szamlazasiCim['nev']) ? htmlspecialchars($szamlazasiCim['nev']) . "\n" : '');
        $altBody .= htmlspecialchars($szamlazasiCim['irsz'] ?? '') . " " . htmlspecialchars($szamlazasiCim['telepules'] ?? '') . "\n";
        $altBody .= htmlspecialchars($szamlazasiCim['utca'] ?? '') . "\n";
        $altBody .= (isset($szamlazasiCim['adoszam']) && !empty($szamlazasiCim['adoszam']) ? "Adószám: " . htmlspecialchars($szamlazasiCim['adoszam']) . "\n" : '');
        $altBody .= "\nFizetési mód: " . htmlspecialchars($payment) . "\n\n";
        $altBody .= "Hamarosan feldolgozzuk a rendelését és értesítjük a további lépésekről.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Visszaigazolás): " . $mail->ErrorInfo);
        return false;
    }
}

function kuldRendelesStatuszValtozas($email, $name, $orderId, $newStatus, $szallitasiCim = [])
{
    try {
        $mail = new PHPMailer(true);
        configureSmtp($mail);

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace Webshop');
        $mail->addAddress($email, $name);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Rendelés státuszának frissítése - #' . $orderId;

        $emailBody = generateEmailHeader('Rendelés státuszának frissítése');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Ezúton szeretnénk tájékoztatni, hogy a(z) <strong>#$orderId</strong> azonosítójú rendelésének státusza megváltozott.</p>";
        $emailBody .= "<div class='order-details' style='margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;'>";
        $emailBody .= "<h3 style='margin-bottom: 15px; color: #293144;'>Rendelés részletei:</h3>";
        $emailBody .= "<p><strong>Rendelési azonosító:</strong> #$orderId</p>";
        $emailBody .= "<p><strong>Új státusz:</strong> <strong style='color: #198754;'>" . htmlspecialchars($newStatus) . "</strong></p>";

        if (!empty($szallitasiCim) && (isset($szallitasiCim['irsz']) || isset($szallitasiCim['telepules']) || isset($szallitasiCim['utca']))) {
            $emailBody .= '<div class="address-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">';
            $emailBody .= '<h4 style="margin-bottom: 15px; font-size: 18px; color: #333; text-align: center;">Szállítási cím</h4>';
            $emailBody .= '<div style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; display: inline-block; width: auto; max-width: 100%; background-color: #ffffff;">';
            $emailBody .= '<div class="details" style="font-size: 14px; line-height: 1.6; color: #555;">';
            $emailBody .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . '<br>' : '');
            $emailBody .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . ' ' . htmlspecialchars($szallitasiCim['telepules'] ?? '') . '<br>';
            $emailBody .= htmlspecialchars($szallitasiCim['utca'] ?? '');
            $emailBody .= '</div></div></div>';
        }

        $emailBody .= "</div>";
        $emailBody .= "<p style='margin-top: 20px;'>Fiókjába bejelentkezve nyomon követheti rendelése állapotát.</p>";
        $emailBody .= "<p>Amint további információk állnak rendelkezésre, értesítjük.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>A PoolPalace Csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;

        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Ezúton értesítjük, hogy a(z) #$orderId azonosítójú rendelésének státusza megváltozott.\n\n";
        $altBody .= "Rendelési azonosító: #$orderId\n";
        $altBody .= "Új státusz: " . htmlspecialchars($newStatus) . "\n\n";
        if (!empty($szallitasiCim) && (isset($szallitasiCim['irsz']) || isset($szallitasiCim['telepules']) || isset($szallitasiCim['utca']))) {
            $altBody .= "Szállítási cím:\n";
            $altBody .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . "\n" : '');
            $altBody .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . " " . htmlspecialchars($szallitasiCim['telepules'] ?? '') . "\n";
            $altBody .= htmlspecialchars($szallitasiCim['utca'] ?? '') . "\n\n";
        }
        $altBody .= "Fiókjába bejelentkezve nyomon követheti rendelése állapotát.\n";
        $altBody .= "Amint további információk állnak rendelkezésre, értesítjük.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Státuszváltozás): " . $mail->ErrorInfo);
        return false;
    }
}

function kuldRendelesModositas($email, $name, $orderId, $cartItems, $total, $currentStatus, $currentPayment, $szallitasiCim, $szamlazasiCim)
{
    try {
        $mail = new PHPMailer(true);
        configureSmtp($mail);

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace Webshop');
        $mail->addAddress($email, $name);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Értesítés a rendelés módosításáról - #' . $orderId;

        $emailBody = generateEmailHeader('Rendelésének módosítása');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Ezúton értesítjük, hogy a(z) <strong>#$orderId</strong> azonosítójú rendelése módosításra került az adminisztrátor által.</p>";
        $emailBody .= "<p>A rendelés jelenlegi adatai a következők:</p>";
        $emailBody .= generateOrderTable($cartItems, $total);
        $emailBody .= generateAddressSection($szallitasiCim, $szamlazasiCim);
        $emailBody .= "<p style='margin-top: 20px;'>A rendelés jelenlegi státusza: <strong>" . htmlspecialchars($currentStatus) . "</strong>.</p>";
        $emailBody .= "<p style='margin-top: 20px;'>A rendelés jelenlegi fizetési módja: <strong>" . htmlspecialchars($currentPayment) . "</strong>.</p>";
        $emailBody .= "<p>Amennyiben kérdése van a módosítással kapcsolatban, kérjük, vegye fel velünk a kapcsolatot ügyfélszolgálatunkon.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>A PoolPalace Csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;

        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Ezúton értesítjük, hogy a(z) #$orderId azonosítójú rendelése módosításra került.\n\n";
        $altBody .= "A rendelés jelenlegi adatai:\n";
        $altBody .= "--------------------------------------------------\n";
        foreach ($cartItems as $item) {
             $item_egysegar_num = isset($item['egysegar']) ? (is_numeric($item['egysegar']) ? $item['egysegar'] : (int)filter_var($item['egysegar'], FILTER_SANITIZE_NUMBER_INT)) : 0;
             $item_akcios_ar_num = isset($item['akcios_ar']) && $item['akcios_ar'] > -1 ? (is_numeric($item['akcios_ar']) ? $item['akcios_ar'] : (int)filter_var($item['akcios_ar'], FILTER_SANITIZE_NUMBER_INT)) : -1;
             $item_darabszam_num = isset($item['darabszam']) ? (int)$item['darabszam'] : 0;
             $ar_to_use = ($item_akcios_ar_num > -1 && $item_akcios_ar_num < $item_egysegar_num) ? $item_akcios_ar_num : $item_egysegar_num;
             $itemTotal = $item_darabszam_num * $ar_to_use;
             $altBody .= htmlspecialchars($item['nev'] ?? $item['termek_nev'] ?? 'Ismeretlen') . " (" . htmlspecialchars($item['cikkszam'] ?? $item['termek_id'] ?? '') . ") - ";
             $altBody .= $item_darabszam_num . " db x " . number_format($ar_to_use, 0, ',', ' ') . " Ft = " . number_format($itemTotal, 0, ',', ' ') . " Ft\n";
        }
        $altBody .= "--------------------------------------------------\n";
        $altBody .= "Végösszeg: " . number_format($total, 0, ',', ' ') . " Ft\n\n";
        $altBody .= "Szállítási cím:\n";
        $altBody .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . "\n" : '');
        $altBody .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . " " . htmlspecialchars($szallitasiCim['telepules'] ?? '') . "\n";
        $altBody .= htmlspecialchars($szallitasiCim['utca'] ?? '') . "\n\n";
        $altBody .= "Számlázási cím:\n";
        $altBody .= (isset($szamlazasiCim['nev']) && !empty($szamlazasiCim['nev']) ? htmlspecialchars($szamlazasiCim['nev']) . "\n" : '');
        $altBody .= htmlspecialchars($szamlazasiCim['irsz'] ?? '') . " " . htmlspecialchars($szamlazasiCim['telepules'] ?? '') . "\n";
        $altBody .= htmlspecialchars($szamlazasiCim['utca'] ?? '') . "\n";
        $altBody .= (isset($szamlazasiCim['adoszam']) && !empty($szamlazasiCim['adoszam']) ? "Adószám: " . htmlspecialchars($szamlazasiCim['adoszam']) . "\n" : '');
        $altBody .= "\nA rendelés jelenlegi státusza: " . htmlspecialchars($currentStatus) . "\n\n";
        $altBody .= "\nA rendelés jelenlegi fizetési módja: " . htmlspecialchars($currentPayment) . "\n\n";
        $altBody .= "Amennyiben kérdése van a módosítással kapcsolatban, kérjük, vegye fel velünk a kapcsolatot.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Rendelés módosítása): " . $mail->ErrorInfo);
        return false;
    }
}

function kuldRendelesTorles($email, $name, $orderId)
{
    try {
        $mail = new PHPMailer(true);
        configureSmtp($mail);

        $mail->setFrom('info.poolpalace@gmail.com', 'PoolPalace Webshop');
        $mail->addAddress($email, $name);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = 'Értesítés rendelés törléséről - #' . $orderId;

        $emailBody = generateEmailHeader('Rendelés törlésének értesítése');
        $emailBody .= "<p>Kedves <strong>" . htmlspecialchars($name) . "</strong>,</p>";
        $emailBody .= "<p>Sajnálattal értesítjük, hogy a(z) <strong>#$orderId</strong> azonosítójú rendelése törlésre került az adminisztrátor által.</p>";
        $emailBody .= "<p>Ha kérdése van a törlés okával kapcsolatban, vagy úgy gondolja, hogy tévedés történt, kérjük, lépjen kapcsolatba ügyfélszolgálatunkkal.</p>";
        $emailBody .= "<p>Amennyiben újra szeretné leadni a rendelését, örömmel várjuk webshopunkban.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>A PoolPalace Csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;

        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Sajnálattal értesítjük, hogy a(z) #$orderId azonosítójú rendelése törlésre került.\n\n";
        $altBody .= "Ha kérdése van a törlés okával kapcsolatban, vagy úgy gondolja, hogy tévedés történt, kérjük, lépjen kapcsolatba ügyfélszolgálatunkkal.\n";
        $altBody .= "Amennyiben újra szeretné leadni a rendelését, örömmel várjuk webshopunkban.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Rendelés törlése): " . $mail->ErrorInfo);
        return false;
    }
}

?>