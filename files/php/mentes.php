<?php
include './sql_fuggvenyek.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$response = ["success" => false, "messages" => []];

if (!empty($input['items']) && is_array($input['items'])) {
    foreach ($input['items'] as $termek) {
        if (isset($termek['cikkszam'], $termek['megrendelesId'], $termek['newQuantity'])) {
            $termekId = intval($termek['cikkszam']);
            $megrendelesId = intval($termek['megrendelesId']);
            $newQuantity = intval($termek['newQuantity']);

            $sql = "UPDATE `tetelek` SET `darabszam` = $newQuantity WHERE `termek_id` = $termekId AND `megrendeles_id` = $megrendelesId";
            $result = adatokValtoztatasa($sql);

            if ($result !== "Sikeres művelet!") {
                $response["messages"][] = "Nem sikerült frissíteni a termék ID: $termekId értékét.";
            } else {
                $response["success"] = true;
            }
        }
    }
}

if (!empty($input['megrendelesId']) && isset($input['newStatus'])) {
    $megrendelesId = intval($input['megrendelesId']);
    $status = $input['newStatus'];

    $sql_ellen = "SELECT statusz, email, nev FROM `megrendeles` WHERE id=$megrendelesId";
    $ered = adatokLekerdezese($sql_ellen);

    if ($ered[0]["statusz"] != $status) {
        $sql = "UPDATE `megrendeles` SET `statusz` = '$status' WHERE `id` = $megrendelesId";
        $result = adatokValtoztatasa($sql);

        if ($result !== "Sikeres művelet!") {
            $response["messages"][] = "Nem sikerült frissíteni a rendelés státuszát.";
        } else {
            $response["success"] = true;
            include './email_kuldes.php';
            if ($status == "Törölve") {
                kuldRendelesTorles($ered[0]["email"], $ered[0]["nev"], $megrendelesId);
            } else {
                kuldRendelesStatuszValtozas($ered[0]["email"], $ered[0]["nev"], $megrendelesId, $status);
            }
        }
    }
}

if (isset($input["details"]["szallitas"]) && isset($input["details"]["szamlazas"])) {
    $irsz = $input["details"]["szallitas"]["irsz"];
    $telepules = $input["details"]["szallitas"]["telepules"];
    $utca = $input["details"]["szallitas"]["utca"];

    $szaml_irsz = $input["details"]["szamlazas"]["irsz"];
    $szaml_telepules = $input["details"]["szamlazas"]["telepules"];
    $szaml_utca = $input["details"]["szamlazas"]["utca"];

    $sql = "UPDATE `megrendeles` 
            SET `szallit_irsz`='$irsz', `szallit_telep`='$telepules', `szallit_cim`='$utca', 
                `szamlaz_irsz`='$szaml_irsz', `szamlaz_telep`='$szaml_telepules', `szamlaz_cim`='$szaml_utca' 
            WHERE id=$megrendelesId";

    $result = adatokValtoztatasa($sql);

    if ($result == "Sikeres művelet!") {
        $response["success"] = true;
    }
}

if (!$response["success"]) {
    $response["messages"][] = "Nem történt változtatás!";
} else {
    $response["messages"] = ["Sikeres frissítés!"];
}

echo json_encode($response);