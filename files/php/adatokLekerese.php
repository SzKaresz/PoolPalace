<?php

include "./sql_fuggvenyek.php";

function getUrlVege()
{
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'])) {
        $receivedUrl = urldecode($_POST['url']);

        $url = explode("/", $receivedUrl);
        $lastSegment = end($url);

        if (strpos($lastSegment, '#') !== false) {
            return explode("#", $lastSegment)[1];
        } else {
            return '';
        }
    }
    return '';
}

$url_vege = getUrlVege();
$kategoria = isset($_POST['kategoria']) ? $_POST['kategoria'] : '';
$gyarto = isset($_POST['gyarto']) ? $_POST['gyarto'] : '';

$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

$szuresi_adatok = [];
if ($kategoria) {
    $szuresi_adatok[] = "kategoria.nev = '$kategoria'";
}
if ($gyarto) {
    $szuresi_adatok[] = "gyarto.nev = '$gyarto'";
}


$szures_sql = count($szuresi_adatok) > 0 ? "WHERE " . implode(" AND ", $szuresi_adatok) : "";

$kereses = $data["kereses"] ?? null;
$kereses_sql = "";
if (!empty($kereses)) {
    $kereses_sql = ($szures_sql ? " AND" : " WHERE") . " termekek.nev LIKE '%" . $kereses . "%'";
}

$lekeres = "SELECT termekek.*, termekek.nev as termek_nev, gyarto.nev as gyarto_nev, kategoria.nev as kategoria_nev FROM `termekek` 
            INNER JOIN kategoria ON kategoria.id = termekek.kategoria_id 
            LEFT JOIN gyarto ON gyarto.id = termekek.gyarto_id 
            $szures_sql $kereses_sql";

if (!empty($url_vege)) {
    $kategoria_ellenorzes = "SELECT COUNT(*) as count FROM kategoria WHERE nev = '$url_vege'";
    $kategoria_eredmeny = adatokLekerdezese($kategoria_ellenorzes);

    if (is_array($kategoria_eredmeny) && $kategoria_eredmeny[0]['count'] > 0) {
        $lekeres .= (empty($szures_sql) ? "WHERE " : " AND ") . "kategoria.nev = '$url_vege'";
    }
}

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