<?php
    include "sql_fuggvenyek.php";
    $lekeres = "SELECT termekek.cikkszam, termekek.nev, termekek.egysegar, termekek.akcios_ar, (COUNT(tetelek.termek_id)*tetelek.darabszam) AS darab FROM `tetelek` INNER JOIN termekek ON termekek.cikkszam = tetelek.termek_id GROUP BY termekek.cikkszam ORDER BY darab DESC LIMIT 5;";
    $eredmeny = adatokLekerdezese($lekeres);
    if (is_array($eredmeny)) {
        foreach ($eredmeny as &$adat) {
            $adat['egysegar'] = number_format($adat['egysegar'], 0, ',', ' ');
            $adat['akcios_ar'] = number_format($adat['akcios_ar'], 0, ',', ' ');
        }
        echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([]);
    }
?>