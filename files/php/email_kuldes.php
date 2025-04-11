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
                     . 'body { font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0; }'
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
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' . $title . '</title><style>'
         . 'body { font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; width: 100% !important; }'
         . 'table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }' // Outlook compatibility
         . 'img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }' // Image resets
         . 'body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }' // Text size adjust reset
         . '.ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }' // Outlook.com compatibility
         . '.container { background: #ffffff; margin: 20px auto; padding: 0; width: 100%; max-width: 700px !important; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; border: 1px solid #ddd; }'
         . '.header { background: #293144; color: #ffffff !important; text-align: center; padding: 20px; font-size: 24px; border-radius: 5px 5px 0 0; }'
         . '.content { padding: 25px; line-height: 1.6; color: #333; }'
         . '.footer { text-align: center; padding: 15px; font-size: 14px; color: #666; margin-top: 20px; border-top: 1px solid #eee; }'
         . '.footer a { color: #293144; text-decoration: none; }'
         . '.button { display: inline-block; padding: 10px 20px; background: #293144; color: #ffffff !important; text-decoration: none; border-radius: 5px; margin-top: 15px; }'
         . 'a.button { color: #ffffff !important; }'
         . 'table.order-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }'
         . 'table.order-table th { padding: 12px; border: 1px solid #ddd; text-align: center; }'
         . 'table.order-table td { padding: 12px; border: 1px solid #ddd; text-align: center; vertical-align: middle; }'
         . 'table.order-table th { background-color: #293144; color: white; font-size: 15px; }'
         . 'table.order-table tr:nth-child(even) { background-color: #f8f9fa; }'
         . '.order-summary { margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; text-align: right; font-size: 18px; font-weight: bold; color: #333; }'
         . '.ar { white-space: nowrap; }'
         . '.original-price { text-decoration: line-through; color: #dc3545; font-size: 0.9em; display: block; }'
         . '.discounted-price { color: #198754; font-weight: bold; display: block; }'
         . 'hr { border: 0; border-top: 1px solid #ddd; margin: 20px 0; height: 1px; }'
         // --- Address Card Styles ---
         . '.address-section { margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; }'
         . '.address-section h4 { margin-bottom: 15px; font-size: 18px; color: #333; text-align: left; }'
         . '.address-cards-container { width: 100%; border-spacing: 0; border-collapse: collapse; }' // Use collapse for better border control
         . '.address-card-cell { width: 50%; padding: 0 5px; vertical-align: top; }' // Keep padding for spacing
         . '.address-card { border: 1px solid #ddd; border-radius: 6px; padding: 15px; box-sizing: border-box; height: 100%; }' // Removed background, added height
         . '.address-card h5 { margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #293144; border-bottom: 1px solid #eee; padding-bottom: 8px; }'
         . '.address-card .details { font-size: 14px; line-height: 1.6; color: #555; }'
         // --- Responsive Styles ---
         . '@media screen and (max-width: 600px) {'
         . '  .container { width: 100% !important; max-width: 100% !important; margin: 0; border-radius: 0; border: 0; box-shadow: none; }' // Full width on mobile
         . '  .content { padding: 15px; }'
         . '  .address-card-cell { display: block !important; width: 100% !important; max-width: 100% !important; padding: 0 0 15px 0 !important; box-sizing: border-box; }' // Stack cards
         . '  .address-card-cell:last-child { padding-bottom: 0 !important; }'
         . '  .address-card { height: auto; }' // Reset height for stacked cards
         . '}'
         . '</style></head><body style="margin:0; padding:0; width: 100% !important;">'
         . '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td>' // Wrapper table for Outlook
         . '<div class="container">'
         . '<div class="header">' . $title . '</div>'
         . '<div class="content">';
}

function generateEmailFooter() {
    return '</div>' // end content
         . '<div class="footer">'
         . '<p>&copy; ' . date('Y') . ' PoolPalace | <a href="http://localhost/PoolPalace/files/php" style="color: #293144; text-decoration: none;">Weboldalunk</a></p>'
         . '</div>'
         . '</div>' // end container
         . '</td></tr></table>' // End wrapper table
         . '</body></html>';
}

function generateAddressSection($szallitasiCim, $szamlazasiCim) {
    $section = '<div class="address-section">';
    $section .= '<h4>Címadatok</h4>';
    // Using a table for reliable side-by-side layout in email clients
    $section .= '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="address-cards-container">';
    $section .= '<tr>';

    // Shipping Address Card Cell
    // Applied critical styles inline for maximum compatibility
    $section .= '<td width="50%" align="left" valign="top" style="width: 50%; padding-right: 5px; padding-left: 0; vertical-align: top;" class="address-card-cell">';
    $section .= '<div class="address-card" style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; height: 100%; box-sizing: border-box;">'; // Removed inline background
    $section .= '<h5 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #293144; border-bottom: 1px solid #eee; padding-bottom: 8px;">Szállítási cím</h5>';
    $section .= '<div class="details" style="font-size: 14px; line-height: 1.6; color: #555;">';
    $section .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . '<br>' : '');
    $section .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . ' ' . htmlspecialchars($szallitasiCim['telepules'] ?? '') . '<br>';
    $section .= htmlspecialchars($szallitasiCim['utca'] ?? '');
    $section .= '</div>'; // end details
    $section .= '</div>'; // end address-card
    $section .= '</td>'; // end address-card-cell

    // Billing Address Card Cell
    // Applied critical styles inline for maximum compatibility
    $section .= '<td width="50%" align="left" valign="top" style="width: 50%; padding-left: 5px; padding-right: 0; vertical-align: top;" class="address-card-cell">';
    $section .= '<div class="address-card" style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; height: 100%; box-sizing: border-box;">'; // Removed inline background
    $section .= '<h5 style="margin-top: 0; margin-bottom: 10px; font-size: 16px; color: #293144; border-bottom: 1px solid #eee; padding-bottom: 8px;">Számlázási cím</h5>';
    $section .= '<div class="details" style="font-size: 14px; line-height: 1.6; color: #555;">';
    $section .= (isset($szamlazasiCim['nev']) && !empty($szamlazasiCim['nev']) ? htmlspecialchars($szamlazasiCim['nev']) . '<br>' : '');
    $section .= htmlspecialchars($szamlazasiCim['irsz'] ?? '') . ' ' . htmlspecialchars($szamlazasiCim['telepules'] ?? '') . '<br>';
    $section .= htmlspecialchars($szamlazasiCim['utca'] ?? '');
    $section .= (isset($szamlazasiCim['adoszam']) && !empty($szamlazasiCim['adoszam']) ? '<br>Adószám: ' . htmlspecialchars($szamlazasiCim['adoszam']) : '');
    $section .= '</div>'; // end details
    $section .= '</div>'; // end address-card
    $section .= '</td>'; // end address-card-cell

    $section .= '</tr>';
    $section .= '</table>'; // End table
    $section .= '</div>'; // end address-section
    return $section;
}


function generateOrderTable($cartItems, $total) {
     $table = '<div class="order-details">'
            . '<h3>Rendelés részletei</h3>'
            . '<table class="order-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">' // Added inline styles
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


function kuldRendelesVisszaigazolas($email, $name, $orderId, $cartItems, $total, $payment, $szallitasiCim, $szamlazasiCim)
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
        $emailBody .= generateAddressSection($szallitasiCim, $szamlazasiCim);
        $emailBody .= "<p style='margin-top: 20px;'>Az Ön által választott fizetési mód: <strong>" . htmlspecialchars($payment) . "</strong>.</p>";
        $emailBody .= "<p>Hamarosan feldolgozzuk a rendelését és értesítjük a további lépésekről.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
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

function kuldRendelesStatuszValtozas($email, $name, $orderId, $newStatus, $szallitasiCim)
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
        $emailBody .= "<p>Új státusz: <strong>" . htmlspecialchars($newStatus) . "</strong></p>";

        if (isset($szallitasiCim['irsz']) || isset($szallitasiCim['telepules']) || isset($szallitasiCim['utca'])) {
             $emailBody .= '<div class="address-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">';
             $emailBody .= '<h4 style="margin-bottom: 15px; font-size: 18px; color: #333; text-align: left;">Szállítási cím</h4>';
             // Simple card for single address
             $emailBody .= '<div style="border: 1px solid #ddd; border-radius: 6px; padding: 15px; display: inline-block; width: auto; max-width: 100%;">';
             $emailBody .= '<div class="details" style="font-size: 14px; line-height: 1.6; color: #555;">';
             $emailBody .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . '<br>' : '');
             $emailBody .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . ' ' . htmlspecialchars($szallitasiCim['telepules'] ?? '') . '<br>';
             $emailBody .= htmlspecialchars($szallitasiCim['utca'] ?? '');
             $emailBody .= '</div>'; // end details
             $emailBody .= '</div>'; // end address-card (simple)
             $emailBody .= '</div>'; // end address-section
        }

        $emailBody .= "</div>"; // end order-details
        $emailBody .= "<p style='margin-top: 20px;'>Ha bejelentkezik fiókjába nyomon tudja követni rendelése állapotát.</p>";
        $emailBody .= "<p>Amint új információk állnak rendelkezésre, értesítjük Önt a további lépésekről.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;
        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Ezúton értesítjük, hogy rendelésének státusza megváltozott.\n\n";
        $altBody .= "Rendelési azonosító: #$orderId\n";
        $altBody .= "Új státusz: " . htmlspecialchars($newStatus) . "\n\n";
        if (isset($szallitasiCim['irsz']) || isset($szallitasiCim['telepules']) || isset($szallitasiCim['utca'])) {
            $altBody .= "Szállítási cím:\n";
             $altBody .= (isset($szallitasiCim['nev']) && !empty($szallitasiCim['nev']) ? htmlspecialchars($szallitasiCim['nev']) . "\n" : '');
            $altBody .= htmlspecialchars($szallitasiCim['irsz'] ?? '') . " " . htmlspecialchars($szallitasiCim['telepules'] ?? '') . "\n";
            $altBody .= htmlspecialchars($szallitasiCim['utca'] ?? '') . "\n\n";
        }
        $altBody .= "Ha bejelentkezik fiókjába nyomon tudja követni rendelése állapotát.\n";
        $altBody .= "Amint új információk állnak rendelkezésre, értesítjük Önt a további lépésekről.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Státusz): " . $mail->ErrorInfo);
        return false;
    }
}

function kuldRendelesModositas($email, $name, $orderId, $cartItems, $total, $currentStatus, $szallitasiCim, $szamlazasiCim)
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
        $emailBody .= generateAddressSection($szallitasiCim, $szamlazasiCim);
        $emailBody .= "<p style='margin-top: 20px;'>Jelenlegi státusz: <strong>" . htmlspecialchars($currentStatus) . "</strong>.</p>";
        $emailBody .= "<p>Ha kérdése van a módosítással kapcsolatban, kérjük, vegye fel velünk a kapcsolatot.</p>";
        $emailBody .= "<br><p>Üdvözlettel, <br><strong>PoolPalace csapata</strong></p>";
        $emailBody .= generateEmailFooter();

        $mail->Body = $emailBody;
        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Ezúton értesítjük, hogy #$orderId azonosítójú rendelése módosult.\n\n";
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
        $altBody .= "\nJelenlegi státusz: " . htmlspecialchars($currentStatus) . "\n\n";
        $altBody .= "Ha kérdése van a módosítással kapcsolatban, kérjük, vegye fel velünk a kapcsolatot.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

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
        $altBody = "Kedves " . htmlspecialchars($name) . ",\n\n";
        $altBody .= "Ezúton értesítjük, hogy #$orderId azonosítójú rendelése törlésre került.\n\n";
        $altBody .= "Ha kérdése van a törléssel kapcsolatban, kérjük, lépjen kapcsolatba ügyfélszolgálatunkkal.\n";
        $altBody .= "Ha úgy dönt, hogy újra szeretné rendelni, ne habozzon felkeresni minket.\n\n";
        $altBody .= "Üdvözlettel,\nA PoolPalace Csapata\n";
        $altBody .= "© " . date('Y') . " PoolPalace | http://localhost/PoolPalace/files/php";
        $mail->AltBody = $altBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email küldési hiba (Törlés): " . $mail->ErrorInfo);
        return false;
    }
}
?>