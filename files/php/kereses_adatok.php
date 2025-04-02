<?php
header("Content-Type: application/json");
include './sql_fuggvenyek.php';

if (isset($_GET['keres'])) {
    $keresettSzoveg = trim($_GET['keres']);
    $sql = "SELECT nev as termek_nev, cikkszam, egysegar, akcios_ar FROM termekek 
            WHERE nev LIKE CONCAT('%', '{$keresettSzoveg}', '%') LIMIT 10";
    $talalatok = adatokLekerdezese($sql);
    echo json_encode($talalatok);
} else {
    echo json_encode([]);
}
?>