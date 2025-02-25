<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['cikkszam'] ?? null;
$szazalek = $input['ackios_szazalek'] ?? null;

if ($id === null || $szazalek === null ) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}

$muvelet = "UPDATE `termekek` SET akcios_szazalek={$szazalek} WHERE cikkszam = {$id}";
$eredmeny = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!") {
    echo json_encode(["status" => "success", "message" => "A termék frissítve!"]);
} else {
    echo json_encode(["status" => "error", "message" => $eredmeny]);
}
?>
