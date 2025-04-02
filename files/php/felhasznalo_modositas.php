<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? null;
$nev = $input['nev'] ?? null;
$telefonszam = $input['telefonszam'] ?? null;
$sztelepules = $input["sztelepules"] ?? null;
$sziranyitoszam = $input['sziranyitoszam'] ?? null;
$szutcahazszam = $input['szutcahazszam'] ?? null;
$iranyitoszam = $input['iranyitoszam'] ?? null;
$telepules = $input['telepules'] ?? null;
$utcahazszam = $input['utca_hazszam'] ?? null;


if ($email === null || $nev === null || $telefonszam === null) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}

$muvelet = "UPDATE felhasznalok 
INNER JOIN szamlazasi_cim ON szamlazasi_cim.id = felhasznalok.szamlazasi_cim_id
INNER JOIN szallitasi_cim ON szallitasi_cim.id = felhasznalok.szallitasi_cim_id
SET 
    felhasznalok.nev = '$nev',
    felhasznalok.telefonszam = '$telefonszam',
    szallitasi_cim.iranyitoszam = '$sziranyitoszam',
    szallitasi_cim.telepules = '$sztelepules',
    szallitasi_cim.utca_hazszam = '$szutcahazszam',
    szamlazasi_cim.iranyitoszam = '$iranyitoszam',
    szamlazasi_cim.telepules = '$telepules',
    szamlazasi_cim.utca_hazszam = '$utcahazszam'
WHERE felhasznalok.email = '$email';
";
$eredmeny = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!") {
    echo json_encode(["success" => true, "message" => "A felhasználó frissítve!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Sikertelen módosítás!"]);
}
?>