<?php
include './sql_fuggvenyek.php';
include './email_kuldes.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$response = ["success" => false, "messages" => []];
$itemsChanged = false;
$statusChanged = false;
$detailsChanged = false;

$megrendelesId = $input['megrendelesId'] ?? null;

if ($megrendelesId === null) {
    $response["messages"][] = "Hiányzó megrendelés ID.";
    echo json_encode($response);
    exit;
}
$megrendelesId = intval($megrendelesId);

$sql_rendeles_adatok = "SELECT email, nev, statusz FROM `megrendeles` WHERE id=$megrendelesId";
$rendeles_adatok = adatokLekerdezese($sql_rendeles_adatok);
if ($rendeles_adatok === "Nincs találat!") {
    $response["messages"][] = "Nem található megrendelés ezzel az ID-val.";
    echo json_encode($response);
    exit;
}
$email = $rendeles_adatok[0]['email'];
$name = $rendeles_adatok[0]['nev'];
$currentStatus = $rendeles_adatok[0]['statusz'];

if (!empty($input['items']) && is_array($input['items'])) {
    foreach ($input['items'] as $termek) {
        if (isset($termek['cikkszam'], $termek['megrendelesId'], $termek['newQuantity'])) {
            $termekId = intval($termek['cikkszam']);
            $newQuantity = intval($termek['newQuantity']);

            $sql = "UPDATE `tetelek` SET `darabszam` = $newQuantity WHERE `termek_id` = $termekId AND `megrendeles_id` = $megrendelesId";
            $result = adatokValtoztatasa($sql);

            if ($result !== "Sikeres művelet!") {
                $response["messages"][] = "Nem sikerült frissíteni a termék ID: $termekId értékét.";
            } else {
                $response["success"] = true;
                $itemsChanged = true;
            }
        }
    }
}

if (isset($input['newStatus'])) {
    $newStatus = $input['newStatus'];
    if ($currentStatus != $newStatus) {
        $sql = "UPDATE `megrendeles` SET `statusz` = '$newStatus' WHERE `id` = $megrendelesId";
        $result = adatokValtoztatasa($sql);

        if ($result !== "Sikeres művelet!") {
            $response["messages"][] = "Nem sikerült frissíteni a rendelés státuszát.";
        } else {
            $response["success"] = true;
            $statusChanged = true;
            $currentStatus = $newStatus;
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
        $detailsChanged = true;
    } else {
        $response["messages"][] = "Nem sikerült frissíteni a szállítási/számlázási címeket.";
    }
}

if (!$itemsChanged && !$statusChanged && !$detailsChanged) {
    $response["messages"][] = "Nem történt változtatás!";
} else {
    if ($response["success"] && !$statusChanged) {
        $response["messages"] = ["Sikeres frissítés!"];

        $sql_tetelek = "SELECT t.cikkszam, t.nev, t.egysegar, t.akcios_ar, tt.darabszam
                            FROM tetelek tt
                            JOIN termekek t ON tt.termek_id = t.cikkszam
                            WHERE tt.megrendeles_id = $megrendelesId";
        $cartItems = adatokLekerdezese($sql_tetelek);
        if ($cartItems === "Nincs találat!") $cartItems = [];

        $sql_osszeg = "SELECT osszeg FROM megrendeles WHERE id = $megrendelesId";
        $osszeg_result = adatokLekerdezese($sql_osszeg);
        $total = ($osszeg_result !== "Nincs találat!") ? $osszeg_result[0]['osszeg'] : 0;

        kuldRendelesModositas($email, $name, $megrendelesId, $cartItems, $total, $currentStatus);
    }
    else{
        kuldRendelesStatuszValtozas($email, $name, $megrendelesId, $newStatus);
    }
}

echo json_encode($response);
?>