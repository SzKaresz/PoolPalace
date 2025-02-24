<?php
$targetDir = "../img/termekek/"; // Célmappa

// Ellenőrizzük, hogy létrehozható-e a mappa
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

foreach ($_FILES["productImages"]["tmp_name"] as $key => $tmpName) {
    $fileName = basename($_FILES["productImages"]["name"][$key]);
    $targetFilePath = $targetDir . $fileName;

    if (move_uploaded_file($tmpName, $targetFilePath)) {
        echo "Sikeresen feltöltve: " . $fileName . "<br>";
    } else {
        echo "Hiba a fájl feltöltése közben: " . $fileName . "<br>";
    }
}
?>
