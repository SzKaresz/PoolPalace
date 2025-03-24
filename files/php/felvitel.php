<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$cikkszam = $_POST["cikkszam"];
$nev = $_POST["nev"];
$leiras = $_POST["leiras"];
$ar = $_POST["egysegar"];
$gyarto = $_POST["gyarto_id"];
$kategoria = $_POST["kategoria_id"];


// Ellenőrzés, hogy minden adat megvan-e
if (!empty($nev) && !empty($cikkszam) && !empty($leiras) && !empty($ar) && !empty($gyarto) && !empty($kategoria)) {

    $idellen = "SELECT * FROM `termekek` WHERE cikkszam=$cikkszam";
    $idLekeres = adatokLekerdezese($idellen);
    if ($idLekeres!="Nincs találat!") {
        echo json_encode(["status" => "error", "message" => "Ilyen cikkszámú termék már van!"]);
    } else {
        $lekeres = "INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`) 
        VALUES ('$cikkszam', '$nev', '$ar', -1, '$leiras', '$gyarto', '$kategoria')";

        $ered = adatokValtoztatasa($lekeres);
        if ($ered === "Sikeres művelet!") {
            echo json_encode(["success" => true, "message" => "A termék felvitele sikeres!"]);

            $uploadDir = '../img/termekek/';
            if (!empty($_FILES['productImages']['name'][0])) {
                foreach ($_FILES['productImages']['tmp_name'] as $key => $tmpName) {
                    $fileName = basename($_FILES['productImages']['name'][$key]); // Egyedi fájlnév
                    $targetFilePath = $uploadDir . $fileName;

                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        $kepek[] = $fileName; // Sikeres feltöltés esetén mentjük a fájlnevet
                    }
                }
            }
        } else {
            echo json_encode(["status" => "error", "message" => "A termék felvitele sikertelen!"]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "Hiányosak az adatok!"]);
}