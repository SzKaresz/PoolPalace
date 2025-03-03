<?php

    include "./sql_fuggvenyek.php";

    $lekeres = "SELECT kategoria.nev AS kategoria_nev, COUNT(termekek.cikkszam) as darabszam  FROM `kategoria` inner join termekek on termekek.kategoria_id=kategoria.id GROUP BY termekek.kategoria_id ORDER BY kategoria_nev ASC";
    $eredmeny = adatokLekerdezese($lekeres);
    if(is_array($eredmeny)){
        echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
    }
?>