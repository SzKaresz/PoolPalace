<?php
$db = new mysqli ('localhost', 'root', '', 'poolpalace');
function adatokLekerdezese($muvelet) {
    $db = new mysqli ('localhost', 'root', '', 'poolpalace');
    if ($db->connect_errno == 0 ) {
        $eredmeny = $db->query($muvelet);
        if ($db->errno == 0) {
            if ($eredmeny->num_rows != 0) {
                return $adatok = $eredmeny->fetch_all(MYSQLI_ASSOC);
            }
            else {
                return 'Nincs találat!';
            }
        }
        return $db->error;
    }
    else {
        return $db->connect_error;
    }
}

function adatokValtoztatasa($muvelet) {
    $db = new mysqli ('localhost', 'root', '', 'poolpalace');
    if ($db->connect_errno == 0 ) {
        $db->query($muvelet);
        if ($db->errno == 0) {
            if ($db->affected_rows > 0) {
                return 'Sikeres művelet!';
            }
            else if ($db->affected_rows == 0) {
                return 'Sikertelen művelet!';
            }
            else {
                return $db->error;
            }
        }
        return $db->error;
    }
    else {
        return $db->connect_error;
    }
}

function lekerKategoria() {
    $sql = "SELECT id, nev FROM kategoria ORDER BY nev ASC";
    $eredmeny = adatokLekerdezese($sql);
    if (is_array($eredmeny)) {
        return $eredmeny;
    }
    return [];
}

function lekerGyarto() {
    $sql = "SELECT id, nev FROM gyarto ORDER BY nev ASC";
    $eredmeny = adatokLekerdezese($sql);
    if (is_array($eredmeny)) {
        return $eredmeny;
    }
    return [];
}
?>