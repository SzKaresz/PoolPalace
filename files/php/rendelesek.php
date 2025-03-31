<?php
include './sql_fuggvenyek.php';

$sql_leker="SELECT * FROM `megrendeles` WHERE 1;";
// $sql_leker = "SELECT * FROM `tetelek` inner join megrendeles on megrendeles.id=tetelek.megrendeles_id inner join termekek on termekek.cikkszam=tetelek.termek_id WHERE 1";
$eredmeny = adatokLekerdezese($sql_leker);
if (is_array($eredmeny)) {
    echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
}
