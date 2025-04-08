<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$cikkszam = $input['cikkszam'] ?? null;

if ($cikkszam === null) {
    echo json_encode(['success' => false, 'inOrders' => false, 'message' => 'Hiányzó cikkszám.']);
    exit;
}

if (!is_numeric($cikkszam)) {
    echo json_encode(['success' => false, 'inOrders' => false, 'message' => 'Érvénytelen cikkszám.']);
    exit;
}
$termekId = intval($cikkszam);

$sql = "SELECT COUNT(*) as count FROM `tetelek` WHERE termek_id = $termekId";
$result = adatokLekerdezese($sql);

$inOrders = false;
if (is_array($result) && isset($result[0]['count']) && $result[0]['count'] > 0) {
    $inOrders = true;
} elseif ($result === "Nincs találat!") {
    $inOrders = false;
} elseif (!is_array($result)) {
    error_log("Adatbázis hiba a tetelek tábla ellenőrzésekor: " . $result);
    echo json_encode(['success' => false, 'inOrders' => false, 'message' => 'Adatbázis hiba történt.']);
    exit;
}

echo json_encode(['success' => true, 'inOrders' => $inOrders]);
?>