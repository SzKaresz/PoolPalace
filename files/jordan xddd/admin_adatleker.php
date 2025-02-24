<?php
include './sql_fuggvenyek.php';
$sql_leker = "SELECT * FROM `termekek`";
$eredmeny = adatokLekerdezese($sql_leker);
if (is_array($eredmeny)) {
    echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
}
