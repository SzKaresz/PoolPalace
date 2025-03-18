<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

// POST adatok fogadása (mivel FormData-t küldünk, nem JSON-t)
$cikkszam = $_POST["cikkszam"];
$nev = $_POST["nev"];
$leiras = $_POST["leiras"];
$ar = $_POST["egysegar"];
$gyarto = $_POST["gyarto_id"];
$kategoria = $_POST["kategoria_id"];

$uploadDir = '../img/termekek/';
$kepek = [];

if (!empty($_FILES['productImages']['name'][0])) {
    foreach ($_FILES['productImages']['tmp_name'] as $key => $tmpName) {
        $fileName =basename($_FILES['productImages']['name'][$key]); // Egyedi fájlnév
        $targetFilePath = $uploadDir . $fileName;

        if (move_uploaded_file($tmpName, $targetFilePath)) {
            $kepek[] = $fileName; // Sikeres feltöltés esetén mentjük a fájlnevet
        }
    }
}

// Ha van legalább egy feltöltött kép
if (!empty($kepek)) {
    $kepekJSON = json_encode($kepek); // A képek neveit JSON formátumban mentjük az adatbázisba
} else {
    $kepekJSON = "[]"; // Ha nincs kép, üres tömb
}

// Ellenőrzés, hogy minden adat megvan-e
if (!empty($nev) && !empty($cikkszam) && !empty($leiras) && !empty($ar) && !empty($gyarto) && !empty($kategoria)) {
    $lekeres = "INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`) 
                VALUES ('$cikkszam', '$nev', '$ar', -1, '$leiras', '$gyarto', '$kategoria')";

    $ered = adatokValtoztatasa($lekeres);
    if ($ered === "Sikeres művelet!") {
        echo json_encode(["success" => true, "message" => "A termék felvitele sikeres!", "uploaded_images" => $kepek]);
    } else {
        echo json_encode(["status" => "error", "message" => "A termék felvitele sikertelen!"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Hiányosak az adatok!"]);
}
