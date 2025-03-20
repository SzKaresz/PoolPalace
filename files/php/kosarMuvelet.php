<?php
include './session.php';
include 'db.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['action'])) {
    echo json_encode(["success" => false, "error" => "Hiányzó művelet"]);
    exit;
}

$action = $data['action'];
$termek_id = $data['termek_id'] ?? null;
$mennyiseg = !empty($data['mennyiseg']) ? intval($data['mennyiseg']) : 1;

// Kosár mennyiség lekérdezése
function getUserCartCount($db, $user_email)
{
    $stmt = $db->prepare("SELECT COALESCE(SUM(darabszam), 0) AS total FROM kosar WHERE felhasznalo_id = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return intval($row['total'] ?? 0);
}

if (isset($_SESSION['user_email'])) {
    $user_email = $_SESSION['user_email'];

    switch ($action) {
        case 'getCount':
            $uj_mennyiseg = getUserCartCount($db, $user_email);
            echo json_encode(["success" => true, "uj_mennyiseg" => $uj_mennyiseg]);
            exit;

        case 'add':
            $stmt = $db->prepare("SELECT darabszam FROM kosar WHERE termek_id = ? AND felhasznalo_id = ?");
            $stmt->bind_param("ss", $termek_id, $user_email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $stmt = $db->prepare("UPDATE kosar SET darabszam = darabszam + ? WHERE termek_id = ? AND felhasznalo_id = ?");
                $stmt->bind_param("iss", $mennyiseg, $termek_id, $user_email);
            } else {
                $stmt = $db->prepare("INSERT INTO kosar (felhasznalo_id, termek_id, darabszam) VALUES (?, ?, ?)");
                $stmt->bind_param("ssi", $user_email, $termek_id, $mennyiseg);
            }
            break;

        case 'update':
            $stmt = $db->prepare("UPDATE kosar SET darabszam = ? WHERE termek_id = ? AND felhasznalo_id = ?");
            $stmt->bind_param("iss", $mennyiseg, $termek_id, $user_email);
            break;

        case 'remove':
            $stmt = $db->prepare("DELETE FROM kosar WHERE termek_id = ? AND felhasznalo_id = ?");
            $stmt->bind_param("ss", $termek_id, $user_email);
            break;

        case 'removeAll':
            $stmt = $db->prepare("DELETE FROM kosar WHERE felhasznalo_id = ?");
            $stmt->bind_param("s", $user_email);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Ismeretlen művelet"]);
            exit;
    }

    if ($stmt->execute()) {
        $uj_mennyiseg = getUserCartCount($db, $user_email);
        echo json_encode(["success" => true, "uj_mennyiseg" => $uj_mennyiseg]);
    } else {
        echo json_encode(["success" => false, "error" => "Hiba történt az adatbázisban"]);
    }
} else {
    if (!isset($_SESSION['kosar'])) {
        $_SESSION['kosar'] = [];
    }

    switch ($action) {
        case 'add':
            if (isset($_SESSION['kosar'][$termek_id])) {
                $_SESSION['kosar'][$termek_id] += $mennyiseg;
            } else {
                $_SESSION['kosar'][$termek_id] = $mennyiseg;
            }
            break;

        case 'update':
            $_SESSION['kosar'][$termek_id] = $mennyiseg;
            break;

        case 'remove':
            unset($_SESSION['kosar'][$termek_id]);
            break;

        case 'removeAll': // **Kosár teljes kiürítése vendégeknél**
            $_SESSION['kosar'] = [];
            break;
    }

    $uj_mennyiseg = array_sum($_SESSION['kosar'] ?? []);
    echo json_encode(["success" => true, "uj_mennyiseg" => $uj_mennyiseg]);
}

exit;
?>