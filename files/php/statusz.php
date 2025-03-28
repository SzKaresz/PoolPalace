<?php
include './sql_fuggvenyek.php';

$inputJSON = file_get_contents('php://input'); 
$input = json_decode($inputJSON, true);

if (isset($input['megrendelesId']) && isset($input['newStatus'])) {
    $megrendelesId = intval($input['megrendelesId']);
    $status = $input['newStatus'];
    
    $sql = "UPDATE `megrendeles` SET `statusz` = '$status' WHERE `id` = $megrendelesId";
    
    $result = adatokValtoztatasa($sql);

    if ($result=== "Sikeres művelet!") {
        echo json_encode(["success" => true, "message"=>"Sikers státusz frissítés!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Nem sikerült frissíteni a státuszt."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Hiányzó paraméter"]);
}
?>