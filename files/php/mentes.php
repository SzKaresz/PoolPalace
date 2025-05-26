<?php
include './sql_fuggvenyek.php';
include './email_kuldes.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$response = ["success" => false, "messages" => []];
$itemsChanged = false;
$statusChanged = false;
$detailsChanged = false;
$fizModChanged = false;

$megrendelesId = $input['megrendelesId'] ?? null;

if ($megrendelesId === null) {
    $response["messages"][] = "Hiányzó megrendelés ID.";
    echo json_encode($response);
    exit;
}
$megrendelesId = intval($megrendelesId);

$sql_rendeles_adatok = "SELECT email, nev, statusz, fiz_mod FROM `megrendeles` WHERE id=$megrendelesId";
$rendeles_adatok = adatokLekerdezese($sql_rendeles_adatok);
if ($rendeles_adatok === "Nincs találat!") {
    $response["messages"][] = "Nem található megrendelés ezzel az ID-val.";
    echo json_encode($response);
    exit;
}
$email = $rendeles_adatok[0]['email'];
$name = $rendeles_adatok[0]['nev'];
$currentStatus = $rendeles_adatok[0]['statusz'];
$currentFizMod = $rendeles_adatok[0]['fiz_mod'];

if (!empty($input['items']) && is_array($input['items'])) {
    foreach ($input['items'] as $termek) {
        if (isset($termek['cikkszam'], $termek['megrendelesId'], $termek['newQuantity'])) {
            $termekId = intval($termek['cikkszam']);
            $newQuantity = intval($termek['newQuantity']);

            $sql = "UPDATE `tetelek` SET `darabszam` = $newQuantity WHERE `termek_id` = $termekId AND `megrendeles_id` = $megrendelesId";
            $result = adatokValtoztatasa($sql);

            if ($result !== "Sikeres művelet!") {
                $response["messages"][] = "Nem sikerült frissíteni a termék ID: $termekId értékét.";
                $response["success"] = false;
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
            $response["success"] = false;
        } else {
            $response["success"] = true;
            $statusChanged = true;
            $currentStatus = $newStatus;
        }
    }
}

if (isset($input['newFizMod'])) {
    $newFizMod = $input['newFizMod'];
    if ($currentFizMod != $newFizMod) {
        $sql_fizmod = "UPDATE `megrendeles` SET `fiz_mod` = '$newFizMod' WHERE `id` = $megrendelesId";
        $result = adatokValtoztatasa($sql_fizmod);

        if ($result !== "Sikeres művelet!") {
            $response["messages"][] = "Nem sikerült frissíteni a fizetési módot.";
            $response["success"] = false;
        } else {
            $response["success"] = true;
            $fizModChanged = true;
            $currentFizMod = $newFizMod;
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

    $sql_check = "SELECT szallit_irsz, szallit_telep, szallit_cim, szamlaz_irsz, szamlaz_telep, szamlaz_cim FROM `megrendeles` WHERE id=$megrendelesId";
    $current_details_result = adatokLekerdezese($sql_check);
    $details_changed_flag = false;
    if ($current_details_result !== "Nincs találat!") {
        $current_details = $current_details_result[0];
        if (
            $current_details['szallit_irsz'] != $irsz ||
            $current_details['szallit_telep'] != $telepules ||
            $current_details['szallit_cim'] != $utca ||
            $current_details['szamlaz_irsz'] != $szaml_irsz ||
            $current_details['szamlaz_telep'] != $szaml_telepules ||
            $current_details['szamlaz_cim'] != $szaml_utca
        ) {
            $details_changed_flag = true;
        }
    }

    if ($details_changed_flag) {
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
            $response["success"] = false;
        }
    }
}

if (!$itemsChanged && !$statusChanged && !$detailsChanged && !$fizModChanged) {
    if (empty($response["messages"])) {
        $response["messages"][] = "Nem történt változtatás.";
    }
    $response["success"] = $response["success"] && false;
} else {
    if ($response["success"]) {
        if (empty($response["messages"])) {
            if ($statusChanged && !$itemsChanged && !$detailsChanged && !$fizModChanged) {
                $response["messages"][] = "A státusz sikeresen frissítve!";
            } elseif ($fizModChanged && !$itemsChanged && !$detailsChanged && !$statusChanged) {
                $response["messages"][] = "A fizetési mód sikeresen frissítve!";
            } elseif (($itemsChanged || $detailsChanged || $fizModChanged) && !$statusChanged) {
                $response["messages"][] = "A rendelés adatai sikeresen frissítve!";
            } else {
                $response["messages"][] = "Sikeres frissítés!";
            }
        }

        $sql_cim_adatok = "SELECT szallit_irsz, szallit_telep, szallit_cim, szamlaz_irsz, szamlaz_telep, szamlaz_cim FROM `megrendeles` WHERE id=$megrendelesId";
        $cim_adatok_result = adatokLekerdezese($sql_cim_adatok);
        $szallitasiCim = [];
        $szamlazasiCim = [];
        if ($cim_adatok_result !== "Nincs találat!" && isset($cim_adatok_result[0])) {
            $cim_adatok = $cim_adatok_result[0];
            $szallitasiCim = [
                'irsz' => $cim_adatok['szallit_irsz'],
                'telepules' => $cim_adatok['szallit_telep'],
                'utca' => $cim_adatok['szallit_cim']
            ];
            $szamlazasiCim = [
                'irsz' => $cim_adatok['szamlaz_irsz'],
                'telepules' => $cim_adatok['szamlaz_telep'],
                'utca' => $cim_adatok['szamlaz_cim']
            ];
        }

        if ($statusChanged) {
            kuldRendelesStatuszValtozas($email, $name, $megrendelesId, $newStatus, $szallitasiCim);
        } elseif ($itemsChanged || $detailsChanged || $fizModChanged) {
            $sql_tetelek = "SELECT t.cikkszam, t.nev, t.egysegar, t.akcios_ar, tt.darabszam
                                    FROM tetelek tt
                                    JOIN termekek t ON tt.termek_id = t.cikkszam
                                    WHERE tt.megrendeles_id = $megrendelesId";
            $cartItems = adatokLekerdezese($sql_tetelek);
            if ($cartItems === "Nincs találat!") $cartItems = [];

            $sql_osszeg = "SELECT osszeg FROM megrendeles WHERE id = $megrendelesId";
            $osszeg_result = adatokLekerdezese($sql_osszeg);
            $total = ($osszeg_result !== "Nincs találat!") ? $osszeg_result[0]['osszeg'] : 0;

            kuldRendelesModositas($email, $name, $megrendelesId, $cartItems, $total, $currentStatus, $currentFizMod, $szallitasiCim, $szamlazasiCim);
        }
    }
}

echo json_encode($response);
