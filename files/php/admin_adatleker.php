<?php
include './sql_fuggvenyek.php';
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

$kereses=$_POST["kereses"]??null;
$kereses_sql = ($kereses)?"cikkszam like '%$kereses%'' or nev like '%$kereses%'":"1";

$sql_leker = "SELECT * FROM `termekek` WHERE $kereses_sql";
$eredmeny = adatokLekerdezese($sql_leker);
if (is_array($eredmeny)) {
    echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);
}
