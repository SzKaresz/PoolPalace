<?php

    include "./sql_fuggvenyek.php";

    $lekeres = "SELECT DISTINCT nev AS gyarto_nev FROM `gyarto` WHERE nev is not null;";
    $eredmeny = adatokLekerdezese($lekeres);
    if(is_array($eredmeny)){
        echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
    }
?>