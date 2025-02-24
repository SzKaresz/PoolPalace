<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;

if ($id === null) {
    echo json_encode(["status" => "error", "message" => "Nincs ID megadva!"]);
    exit;
}

$leker = "SELECT cikkszam, nev FROM `termekek` WHERE kategoria_id = {$id}";
$eredmeny = adatokLekerdezese($leker);

if (is_array($eredmeny) && count($eredmeny) > 0) {
    echo json_encode(["status" => "success", "termek" => $eredmeny]);
} else {
    echo json_encode(["status" => "error", "message" => "Nincs ilyen termék!"]);
}
?>
