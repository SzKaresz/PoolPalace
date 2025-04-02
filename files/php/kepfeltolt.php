<?php
if (!empty($_FILES['kepek']['name'][0])) {
    $uploadDir = '../img/termekek/';

    foreach ($_FILES['kepek']['tmp_name'] as $key => $tmpName) {
        $fileName = basename($_FILES['kepek']['name'][$key]);
        $targetFilePath = $uploadDir . $fileName;

        if (move_uploaded_file($tmpName, $targetFilePath)) {
            echo "Fájl sikeresen feltöltve: " . $fileName;
        } else {
            echo "Hiba történt a fájl feltöltésekor: " . $fileName;
        }
    }
} else {
    echo "Nincs feltöltött fájl.";
}
?>