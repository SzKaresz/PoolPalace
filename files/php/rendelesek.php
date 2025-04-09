<?php
include './sql_fuggvenyek.php';

$sql_leker="SELECT * FROM `megrendeles` WHERE 1 order by id desc;";
$eredmeny = adatokLekerdezese($sql_leker);
if (is_array($eredmeny)) {
    echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
}