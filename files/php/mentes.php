<?php
include './sql_fuggvenyek.php';

// Az adatokat JSON formátumban kapjuk
$inputJSON = file_get_contents('php://input'); 
$input = json_decode($inputJSON, true);

// Ellenőrizd, hogy a szükséges paraméterek megvannak
if (isset($input['termekId']) && isset($input['megrendelesId']) && isset($input['newQuantity'])) {
    $termekId = intval($input['termekId']);
    $megrendelesId = intval($input['megrendelesId']);
    $newQuantity = intval($input['newQuantity']);
    
    // Frissítés SQL lekérdezés
    $sql = "UPDATE `tetelek` SET `darabszam` = $newQuantity WHERE `termek_id` = $termekId AND `megrendeles_id` = $megrendelesId";
    
    // A frissítés végrehajtása
    $result = adatokValtoztatasa($sql);

    if ($result=== "Sikeres művelet!") {
        echo json_encode(["success" => true, "message"=>"Sikeres frissítés!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Nem sikerült frissíteni az adatokat."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Hiányzó paraméterek"]);
}
?>