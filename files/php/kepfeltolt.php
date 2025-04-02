<?php
header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Ismeretlen hiba.'];

if (isset($_POST['cikkszam']) && !empty($_FILES['kepek']['name'][0])) {
    $uploadDir = '../img/termekek/';
    $cikkszam = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['cikkszam']);

    if (empty($cikkszam)) {
         $response['message'] = 'Érvénytelen cikkszám.';
         echo json_encode($response);
         exit;
    }

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0775, true)) {
             $response['message'] = 'Nem sikerült létrehozni a célkönyvtárat.';
             error_log("Nem sikerült létrehozni a könyvtárat: " . $uploadDir);
             echo json_encode($response);
             exit;
        }
    }

    $successMessages = [];
    $errorMessages = [];
    $currentFileIndexInBatch = 0;

    $baseFilename = $cikkszam . '.webp';
    $baseFileExists = file_exists($uploadDir . $baseFilename);
    $nextAvailableIndex = 2;

    if (!$baseFileExists) {
         $useBaseNameForFirstFile = true;
    } else {
         $useBaseNameForFirstFile = false;
         while (true) {
             $potentialFilename = $cikkszam . '_' . $nextAvailableIndex . '.webp';
             if (!file_exists($uploadDir . $potentialFilename)) {
                 break;
             }
             $nextAvailableIndex++;
             if ($nextAvailableIndex > 100) {
                 $response['message'] = 'Túl sok kép ehhez a termékhez (max index elérése).';
                 echo json_encode($response);
                 exit;
             }
         }
    }

    foreach ($_FILES['kepek']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['kepek']['error'][$key] === UPLOAD_ERR_OK) {
            $originalFileName = basename($_FILES['kepek']['name'][$key]);
            $fileExtension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

            if ($fileExtension !== 'webp') {
                 $errorMessages[] = "Csak .webp fájl tölthető fel: " . $originalFileName;
                continue;
            }

            $newFileName = '';
            if ($useBaseNameForFirstFile && $currentFileIndexInBatch === 0) {
                 $newFileName = $baseFilename;
                 $nextAvailableIndex = 2;
            } else {
                 $newFileName = $cikkszam . '_' . $nextAvailableIndex . '.webp';
                 $nextAvailableIndex++;
            }

            $targetFilePath = $uploadDir . $newFileName;

            if (move_uploaded_file($tmpName, $targetFilePath)) {
                $successMessages[] = "Fájl sikeresen feltöltve: " . $newFileName;
                 $currentFileIndexInBatch++;
                 if ($useBaseNameForFirstFile && $currentFileIndexInBatch === 1) {
                     $useBaseNameForFirstFile = false;
                 }
            } else {
                $errorMessages[] = "Hiba történt a fájl mentésekor: " . $newFileName;
                error_log("move_uploaded_file hiba: " . $tmpName . " -> " . $targetFilePath);
            }
        } else {
             $errorMessages[] = "Hiba a(z) " . basename($_FILES['kepek']['name'][$key]) . " feltöltésekor (kód: " . $_FILES['kepek']['error'][$key] . ")";
        }
    }

    if (!empty($successMessages) && empty($errorMessages)) {
        $response['success'] = true;
        $response['message'] = implode("<br>", $successMessages);
    } elseif (!empty($errorMessages)) {
        $response['success'] = false;
        $response['message'] = "<b>Feltöltési hibák:</b><br>" . implode("<br>", $errorMessages);
        if (!empty($successMessages)) {
            $response['message'] .= "<br><br><b>Sikeres feltöltések:</b><br>" . implode("<br>", $successMessages);
        }
    } elseif (empty($successMessages) && empty($errorMessages)) {
         $response['message'] = 'Nem lett fájl feldolgozva (lehet, hogy egyik sem .webp formátumú?).';
    }
}else {
    if (empty($_POST['cikkszam'])) {
       $response['message'] = 'Hiányzó termékazonosító (cikkszám).';
    } else {
       $response['message'] = 'Nincs feltöltött fájl.';
    }
}

echo json_encode($response);
?>