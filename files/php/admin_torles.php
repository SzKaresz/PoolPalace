<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['cikkszam'] ?? null;

if ($id === null) {
    echo json_encode(["success" => false, "message" => "Hiányzó termékazonosító!"]);
    exit;
}

if (!is_numeric($id)) {
    echo json_encode(["success" => false, "message" => "Érvénytelen termékazonosító!"]);
    exit;
}
$termekId = intval($id);

$db = new mysqli('localhost', 'root', '', 'poolpalace');
if ($db->connect_error) {
    echo json_encode(["success" => false, "message" => "Adatbázis kapcsolati hiba: " . $db->connect_error]);
    exit;
}
$db->begin_transaction();

try {
    $sql_tetelek = "DELETE FROM `tetelek` WHERE termek_id = ?";
    $stmt_tetelek = $db->prepare($sql_tetelek);
    if ($stmt_tetelek === false) {
        throw new Exception("SQL előkészítési hiba (tetelek): " . $db->error);
    }
    $stmt_tetelek->bind_param("i", $termekId);
    $stmt_tetelek->execute();
    if ($stmt_tetelek->errno) {
        throw new Exception("SQL végrehajtási hiba (tetelek): " . $stmt_tetelek->error);
    }
    $stmt_tetelek->close();

    $sql_termek = "DELETE FROM `termekek` WHERE cikkszam = ?";
    $stmt_termek = $db->prepare($sql_termek);
    if ($stmt_termek === false) {
        throw new Exception("SQL előkészítési hiba (termekek): " . $db->error);
    }
    $stmt_termek->bind_param("i", $termekId);
    $stmt_termek->execute();

    if ($stmt_termek->affected_rows > 0) {
        $db->commit();
        echo json_encode(["success" => true, "message" => "A termék és a kapcsolódó rendelési tételek sikeresen törölve!"]);
    } else if ($stmt_termek->affected_rows === 0 && !$stmt_termek->errno) {
        $db->rollback();
        echo json_encode(["success" => false, "message" => "A termék nem található vagy már törölve lett."]);
    } else {
        throw new Exception("SQL végrehajtási hiba (termekek): " . $stmt_termek->error);
    }
    $stmt_termek->close();
} catch (Exception $e) {
    $db->rollback();
    error_log("Termék törlési hiba (ID: $termekId): " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Hiba történt a törlés során: " . $e->getMessage()]);
} finally {
    $db->close();
}

exit;
?>