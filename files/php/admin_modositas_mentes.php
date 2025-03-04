<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['cikkszam'] ?? null;
$nev = $input['nev'] ?? null;
$ar = $input['egysegar'] ?? null;
$akciosar = ($input['akciosar']=="")?-1:$input["akciosar"] ?? null;
$leiras = $input['leiras'] ?? null;

if ($id === null || $nev === null || $ar === null) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}

$muvelet = "UPDATE `termekek` SET `nev`='$nev',`egysegar`='$ar',`akcios_ar`='$akciosar',`leiras`='$leiras' WHERE  cikkszam = {$id}";
$eredmeny = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!") {
    echo json_encode(["status" => "success", "message" => "A termék frissítve!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Sikertelen módosítás!"]);
}
?>
