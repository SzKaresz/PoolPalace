<?php
include './sql_fuggvenyek.php';

$inputJSON = file_get_contents('php://input'); 
$input = json_decode($inputJSON, true);

if (isset($input['id'])) {
    $id = intval($input['id']);
    $sql_leker = "SELECT termekek.cikkszam, termekek.nev as termek_nev, termekek.akcios_ar, termekek.egysegar,megrendeles.osszeg, megrendeles.szallit_irsz,megrendeles.szallit_telep,megrendeles.szallit_cim, megrendeles.szamlaz_irsz, megrendeles.szamlaz_telep, megrendeles.szamlaz_cim, megrendeles.statusz, megrendeles.fiz_mod, tetelek.darabszam, megrendeles.id as megrendeles_id FROM `tetelek` 
                  INNER JOIN megrendeles ON megrendeles.id = tetelek.megrendeles_id 
                  INNER JOIN termekek ON termekek.cikkszam = tetelek.termek_id 
                  WHERE megrendeles_id = $id";

    $eredmeny = adatokLekerdezese($sql_leker);
    if (is_array($eredmeny)) {
        echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode(["hiba" => "Nincs megadva ID"]);
}
