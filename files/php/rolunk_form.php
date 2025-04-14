<?php
session_start();

header('Content-Type: application/json');

include './email_kuldes.php';

$response = ['success' => false, 'message' => 'Ismeretlen hiba történt.'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recaptcha_secret = '6Lfs-4kqAAAAAEy4wjpXoGPC3er4FusWos9bVmnh';
    // $recaptcha_secret = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; TESZTHEZ
    $recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

    if (empty($recaptcha_response)) {
        $response['message'] = 'Kérjük, igazolja, hogy nem robot!';
        echo json_encode($response);
        exit;
    }

    $verify_url = "https://www.google.com/recaptcha/api/siteverify";
    $verify_data = http_build_query([
        'secret'   => $recaptcha_secret,
        'response' => $recaptcha_response,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ]);

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => $verify_data,
        ],
    ];
    $context  = stream_context_create($options);
    $verify_result = file_get_contents($verify_url, false, $context);
    $response_data = json_decode($verify_result);

    if (!$response_data || !$response_data->success) {
        $response['message'] = 'reCAPTCHA ellenőrzés sikertelen! Kérjük, próbálja újra.';
        echo json_encode($response);
        exit;
    }

    $nev = trim($_POST['nev'] ?? '');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $email_targya = htmlspecialchars(trim($_POST['email_targya'] ?? 'Nincs tárgy'));
    $email_szovege = htmlspecialchars(trim($_POST['email_szovege'] ?? 'Nincs üzenet'));
    $adatkez_elfogadva = isset($_POST['adatkez']) && $_POST['adatkez'] === 'on';

    if (empty($nev)) {
        $response['message'] = 'A név megadása kötelező.';
        echo json_encode($response);
        exit;
    }
    if (!$email) {
        $response['message'] = 'Érvénytelen e-mail cím formátum.';
        echo json_encode($response);
        exit;
    }
     if (!$adatkez_elfogadva) {
         $response['message'] = 'El kell fogadnia az adatkezelési tájékoztatót.';
         echo json_encode($response);
         exit;
     }
    if (empty($email_szovege) || $email_szovege === 'Nincs üzenet') {
         $response['message'] = 'Az üzenet szövege nem lehet üres.';
         echo json_encode($response);
         exit;
     }

    $hiba = "";
    if (rolunkEmail($nev, $email, $email_targya, $email_szovege, $hiba)) {
        $response = ['success' => true, 'message' => 'Az üzenet sikeresen elküldve. Köszönjük!'];
    } else {
        $response['message'] = !empty($hiba) ? $hiba : 'Hiba történt az üzenet küldése közben.';
    }

} else {
    $response['message'] = 'Hibás kérés (Nem POST).';
}

echo json_encode($response);
exit;
?>