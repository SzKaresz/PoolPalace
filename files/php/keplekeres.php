<?php
header('Content-Type: application/json');
$cikkszam = isset($_GET['cikkszam']) ? $_GET['cikkszam'] : null;
$files = [];

if ($cikkszam && preg_match('/^[a-zA-Z0-9_-]+$/', $cikkszam)) {
    $dir = '../img/termekek/';
    $webDir = '../img/termekek/';

    $baseFilename = $cikkszam . '.webp';
    $baseFilepath = $dir . $baseFilename;
    if (file_exists($baseFilepath)) {
        $files[] = $webDir . $baseFilename;
    }

    $i = 2;
    while (true) {
        $indexedFilenameBase = $cikkszam . '_' . $i . '.webp';
        $indexedFilepath = $dir . $indexedFilenameBase;

        if (file_exists($indexedFilepath)) {
            $files[] = $webDir . $indexedFilenameBase;
            $i++;
        } else {
            break;
        }

        if ($i > 100) {
            error_log("Túl sok képindex a termékhez (keplekeres): " . $cikkszam);
            break;
        }
    }
} else {
     error_log("Érvénytelen vagy hiányzó cikkszám a képlekéréshez: " . print_r($cikkszam, true));
}

echo json_encode($files);
?>