<?php
include './sql_fuggvenyek.php';
include './email_kuldes.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$cikkszam = $input['cikkszam'] ?? null;
$id = $input['megrendeles_id'] ?? null;

if ($cikkszam === null || $id === null) {
    echo json_encode(["status" => "error", "message" => "Hiányzó adatok!"]);
    exit;
}

$megrendelesId = intval($id);

$sql_rendeles_adatok = "SELECT email, nev, statusz, fiz_mod, osszeg FROM `megrendeles` WHERE id=$megrendelesId";
$rendeles_adatok = adatokLekerdezese($sql_rendeles_adatok);
if ($rendeles_adatok === "Nincs találat!") {
     echo json_encode(["status" => "error", "message" => "Nem található megrendelés ezzel az ID-val."]);
     exit;
}
$email = $rendeles_adatok[0]['email'];
$name = $rendeles_adatok[0]['nev'];
$currentStatus = $rendeles_adatok[0]['statusz'];
$currentPayment = $rendeles_adatok[0]['fiz_mod'];
$originalTotal = $rendeles_adatok[0]['osszeg'];


$muvelet = "DELETE FROM `tetelek` WHERE megrendeles_id=$megrendelesId AND termek_id='$cikkszam'";
$eredmeny = adatokValtoztatasa($muvelet);

if ($eredmeny === "Sikeres művelet!") {
    $sql_maradt_tetelek = "SELECT t.cikkszam, t.nev, t.egysegar, t.akcios_ar, tt.darabszam
                          FROM tetelek tt
                          JOIN termekek t ON tt.termek_id = t.cikkszam
                          WHERE tt.megrendeles_id = $megrendelesId";
    $maradtCartItems = adatokLekerdezese($sql_maradt_tetelek);
    if ($maradtCartItems === "Nincs találat!") {
        $maradtCartItems = [];
    }

    $newTotal = 0;
    foreach ($maradtCartItems as $item) {
        $price = (isset($item['akcios_ar']) && $item['akcios_ar'] > -1 && (!isset($item['egysegar']) || $item['akcios_ar'] < $item['egysegar'])) ? $item['akcios_ar'] : $item['egysegar'];
        $newTotal += $item['darabszam'] * $price;
    }

    $sql_update_osszeg = "UPDATE megrendeles SET osszeg = $newTotal WHERE id = $megrendelesId";
    adatokValtoztatasa($sql_update_osszeg);
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

    kuldRendelesModositas($email, $name, $megrendelesId, $maradtCartItems, $newTotal, $currentStatus, $currentPayment, $szallitasiCim, $szamlazasiCim);

    echo json_encode(["success" => true, "message" => "A(z) $cikkszam cikkszámú termék törlése sikeres!"]);
} else {
    echo json_encode(["status" => "error", "message" => "A termék törlése sikertelen!"]);
}
?>