<?php
    include "sql_fuggvenyek.php";
    $lekeres = "SELECT * FROM `termekek` WHERE akcios_ar > -1 ORDER BY cikkszam LIMIT 5;";
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