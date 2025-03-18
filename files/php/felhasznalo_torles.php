<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? null;

if ($email === null ) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}


$muvelet = "DELETE FROM `felhasznalok` WHERE email='$email'";
$eredmeny = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!") {
    echo json_encode(["success" => true, "message" => "A törlés sikeres!"]);
} else {
    echo json_encode(["status" => "error", "message" => "A törlés sikertelen!"]);
}
?>
