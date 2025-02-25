<?php

include "./sql_fuggvenyek.php";

function getUrlVege() {
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

// Szűrési feltételek összeállítása
$szuresi_adatok = [];
if ($kategoria) {
    $szuresi_adatok[] = "kategoria.nev = '$kategoria'";
}
if ($gyarto) {
    $szuresi_adatok[] = "gyarto.nev = '$gyarto'";
}

// Alap lekérdezés
$szures_sql = count($szuresi_adatok) > 0 ? "WHERE " . implode(" AND ", $szuresi_adatok) : "";
$lekeres = "SELECT termekek.*, termekek.nev as termek_nev, gyarto.nev as gyarto_nev, kategoria.nev as kategoria_nev FROM `termekek` 
            INNER JOIN kategoria ON kategoria.id = termekek.kategoria_id 
            LEFT JOIN gyarto ON gyarto.id = termekek.gyarto_id 
            $szures_sql";

// Ha az URL vége tartalmaz kategóriát, azt szűrjük, különben mindent megjelenítünk
if (!empty($url_vege)) {
    // Ellenőrizzük, hogy az URL végén lévő kategória létezik-e az adatbázisban
    $kategoria_ellenorzes = "SELECT COUNT(*) as count FROM kategoria WHERE nev = '$url_vege'";
    $kategoria_eredmeny = adatokLekerdezese($kategoria_ellenorzes);

    if (is_array($kategoria_eredmeny) && $kategoria_eredmeny[0]['count'] > 0) {
        $lekeres .= (empty($szures_sql) ? "WHERE " : " AND ") . "kategoria.nev = '$url_vege'";
    }
}

// Adatok lekérdezése
$eredmeny = adatokLekerdezese($lekeres);

if (is_array($eredmeny)) {
    // Az ár formázása a PHP oldalon
    foreach ($eredmeny as &$adat) {
        $adat['egysegar'] = number_format($adat['egysegar'], 0, ',', ' ');  // Formázott ár
    }
    echo json_encode($eredmeny, JSON_UNESCAPED_UNICODE);  // JSON válasz küldése
} else {
    echo json_encode([]);  // Ha nincs adat, üres tömböt küldünk
}
?>