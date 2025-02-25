<?php

//SQL function lekérdezésekhez:
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


//SQL function módosításhoz:
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


?>