<?php
include './sql_fuggvenyek.php';

// Az adatokat JSON formátumban kapjuk
$inputJSON = file_get_contents('php://input'); 
$input = json_decode($inputJSON, true);

$response = ["success" => true, "messages" => []];


// Termékek frissítése és darabszám módosítása
if (!empty($input['items']) && is_array($input['items'])) {
   
    foreach ($input['items'] as $termek) {
        if (isset($termek['cikkszam'], $termek['megrendelesId'], $termek['newQuantity'])) {
            $termekId = intval($termek['cikkszam']);
            $megrendelesId = intval($termek['megrendelesId']);
            $newQuantity = intval($termek['newQuantity']);

            $sql = "UPDATE `tetelek` SET `darabszam` = $newQuantity WHERE `termek_id` = $termekId AND `megrendeles_id` = $megrendelesId";
            $result = adatokValtoztatasa($sql);

            if ($result !== "Sikeres művelet!") {
                $response["success"] = false;
                $response["messages"][] = "Nem sikerült frissíteni a termék ID: $termekId értékét.";
            }

            else{
                $response["success"] = true;

                $response["messages"]="Sikeres frissítés!";
            }
        }
    }
}

// Rendelés státuszának frissítése
if (!empty($input['megrendelesId']) && isset($input['newStatus'])) {
    $megrendelesId = intval($input['megrendelesId']);
    $status = $input['newStatus'];

    $sql_ellen=" SELECT statusz FROM `megrendeles` WHERE megrendeles.id=$megrendelesId";

    $ered= adatokLekerdezese($sql_ellen);

    if($ered[0]["statusz"]!=$status){
        $sql = "UPDATE `megrendeles` SET `statusz` = '$status' WHERE `id` = $megrendelesId";
        $result = adatokValtoztatasa($sql);
    
        if ($result !== "Sikeres művelet!") {
            $response["success"] = false;
            $response["messages"][] = "Nem sikerült frissíteni a rendelés státuszát.";
        }
        else{
            $response["success"] = true;
            $response["messages"]="Sikeres frissítés!";
        }
    }
}

if (empty($response["messages"])) {
    $response["success"]=false;
    $response["messages"][] = "Nem történt változtatás!";
}
else{
    $response["messages"]="Sikeres frissítés!";

}

echo json_encode($response);
?>