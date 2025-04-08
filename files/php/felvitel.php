<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$cikkszam = $_POST["cikkszam"];
$nev = $_POST["nev"];
$leiras = $_POST["leiras"];
$ar = $_POST["egysegar"];
$gyarto = $_POST["gyarto_id"];
$kategoria = $_POST["kategoria_id"];

if (!empty($nev) && !empty($cikkszam) && !empty($leiras) && !empty($ar) && !empty($gyarto) && !empty($kategoria)) {

    $idellen = "SELECT * FROM `termekek` WHERE cikkszam=$cikkszam";
    $idLekeres = adatokLekerdezese($idellen);
    if ($idLekeres != "Nincs találat!") {
        echo json_encode(["status" => "error", "message" => "Ilyen cikkszámú termék már van!"]);
    } else {
        $lekeres = "INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`) 
        VALUES ('$cikkszam', '$nev', '$ar', -1, '$leiras', '$gyarto', '$kategoria')";

        $ered = adatokValtoztatasa($lekeres);
        if ($ered === "Sikeres művelet!") {
            echo json_encode(["success" => true, "message" => "A termék felvitele sikeres!"]);

            $uploadDir = '../img/termekek/';
            if (!empty($_FILES['productImages']['name'][0])) {
                $sorszam = 1;  // Kezdjük a sorszámot 1-től
                foreach ($_FILES['productImages']['tmp_name'] as $key => $tmpName) {
                    $originalName = $_FILES['productImages']['name'][$key];
                    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

                    // Csak .webp fájl engedélyezett
                    if ($extension !== "webp") {
                        continue;
                    }

                    if ($sorszam === 1) {
                        $newFileName = $cikkszam . ".webp"; // Az első fájl a cikkszámot használja
                    } else {
                        $newFileName = $cikkszam . "_" . $sorszam . ".webp"; // A többi fájl cikkszám + sorszám
                    }

                    $targetFilePath = $uploadDir . $newFileName;

                    if (move_uploaded_file($tmpName, $targetFilePath)) {
                        $kepek[] = $newFileName; // Fájl neve hozzáadása a listához
                        $sorszam++; // Növeljük a sorszámot
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
