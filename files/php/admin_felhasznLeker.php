<?php
include './sql_fuggvenyek.php';
$sql_leker = "SELECT 
    felhasznalok.email, 
    felhasznalok.nev, 
    felhasznalok.telefonszam, 
    szamlazasi_cim.iranyitoszam, 
    szamlazasi_cim.telepules, 
    szamlazasi_cim.utca_hazszam, 
    szallitasi_cim.iranyitoszam AS sziranyitoszam, 
    szallitasi_cim.telepules AS sztelepules, 
    szallitasi_cim.utca_hazszam AS szutcahazszam,
    felhasznalok.jogosultsag  
FROM felhasznalok 
INNER JOIN szallitasi_cim ON szallitasi_cim.id = felhasznalok.szallitasi_cim_id 
INNER JOIN szamlazasi_cim ON szamlazasi_cim.id = felhasznalok.szamlazasi_cim_id 
ORDER BY (felhasznalok.nev = 'Admin') DESC, felhasznalok.nev ASC;";
$eredmeny = adatokLekerdezese($sql_leker);
if (is_array($eredmeny)) {
    echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
}