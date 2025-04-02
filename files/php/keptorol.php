<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (isset($data['fajlnev'])) {
        $fajlnev = $data['fajlnev'];
        $fajl_utvonal = "../img/termekek/" . $fajlnev;
        var_dump($fajl_utvonal);

        if (file_exists($fajl_utvonal)) {
            if (unlink($fajl_utvonal)) {
                echo json_encode(['success' => true, 'message' => 'Fájl sikeresen törölve.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba történt a fájl törlésekor.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'A fájl nem található.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Hiányzó fájlnév.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Érvénytelen kérés.']);
}
?>