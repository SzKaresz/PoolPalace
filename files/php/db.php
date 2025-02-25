<?php

    $db = new mysqli('localhost', 'root', '', 'poolpalace');

    if ($db->connect_error) {
        die("Adatbázis kapcsolat sikertelen: " . $db->connect_error);
    }

?>