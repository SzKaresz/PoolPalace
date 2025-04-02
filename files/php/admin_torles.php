<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['cikkszam'] ?? null;


if ($id === null ) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}


$tetelek = "DELETE FROM `tetelek` WHERE termek_id=$id";
$muvelet = "DELETE FROM `termekek` WHERE cikkszam= $id";
$eredmeny = adatokValtoztatasa($tetelek);
$eredmeny2 = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!" && $eredmeny2 === "Sikeres művelet!") {
    echo json_encode(["success" => true, "message" => "A törlés sikeres!"]);
} else {
    echo json_encode(["status" => "error", "message" => "A törlés sikertelen!"]);
}
?>
