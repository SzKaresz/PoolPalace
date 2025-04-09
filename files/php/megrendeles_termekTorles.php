<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$cikkszam = $input['cikkszam'] ?? null;
$id = $input['megrendeles_id'] ?? null;

if ($cikkszam === null || $id===null) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}


$muvelet = "DELETE FROM `tetelek` WHERE megrendeles_id=$id AND termek_id='$cikkszam'";
$eredmeny = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!") {
    echo json_encode(["success" => true, "message" => "A $cikkszam cikkszámú termék törlése sikeres!"]);
} else {
    echo json_encode(["status" => "error", "message" => "A termék törlése sikertelen!"]);
}
?>