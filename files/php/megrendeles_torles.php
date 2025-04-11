<?php
include './sql_fuggvenyek.php';

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (isset($input['megrendeles_id'])) {
    $megrendeles_id = intval($input['megrendeles_id']);
    $sql_adatok = "SELECT email, nev FROM `megrendeles` WHERE id=$megrendeles_id";
    $ered = adatokLekerdezese($sql_adatok);
    $sql_leker = "DELETE FROM `tetelek` WHERE megrendeles_id=$megrendeles_id";

    $dropTrigger = "DROP TRIGGER IF EXISTS megrendeles_torles";

    $createTrigger = "CREATE TRIGGER megrendeles_torles
AFTER DELETE ON tetelek
FOR EACH ROW
BEGIN
    
    DECLARE itemCount INT;
    
    SELECT COUNT(*) INTO itemCount FROM tetelek WHERE megrendeles_id = $megrendeles_id;
    
    IF itemCount = 0 THEN
        DELETE FROM megrendeles WHERE id = $megrendeles_id;
    END IF;
END;";

    adatokValtoztatasa($dropTrigger);
    adatokValtoztatasa($createTrigger);

    $eredmeny = adatokValtoztatasa($sql_leker);
    if ($eredmeny === "Sikeres művelet!") {
        include "./email_kuldes.php";
        kuldRendelesTorles($ered[0]["email"], $ered[0]["nev"], $megrendeles_id);
        echo json_encode(["success" => true, "message" => "A(z) $megrendeles_id azonosítójú rendelés törlése sikeres!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "A rendelés törlése sikertelen!"]);
    }
} else {
    echo json_encode(["hiba" => "Nincs megadva ID"]);
}