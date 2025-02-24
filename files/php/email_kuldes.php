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

?>