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

if ($action === 'getStock') {
    $stmt = $db->prepare("SELECT darabszam FROM termekek WHERE cikkszam = ?");
    $stmt->bind_param("s", $termek_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $termek = $result->fetch_assoc();

    if (!$termek || !isset($termek['darabszam'])) {
        echo json_encode(["success" => false, "error" => "A termék nem található vagy nincs raktárkészlet adat."]);
        exit;
    }

    echo json_encode(["success" => true, "raktar_keszlet" => intval($termek['darabszam'])]);
    exit;
}

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

    $hasStatement = false;

    switch ($action) {
        case 'getCount':
            $uj_mennyiseg = getUserCartCount($db, $user_email);
            echo json_encode(["success" => true, "uj_mennyiseg" => $uj_mennyiseg]);
            break;

        case 'getCart':
            $stmt = $db->prepare("SELECT termek_id, darabszam FROM kosar WHERE felhasznalo_id = ?");
            $stmt->bind_param("s", $user_email);
            $stmt->execute();
            $result = $stmt->get_result();
            $kosar = [];

            while ($row = $result->fetch_assoc()) {
                // 🔹 Lekérjük a raktárkészletet
                $stmt2 = $db->prepare("SELECT darabszam as raktar_keszlet FROM termekek WHERE cikkszam = ?");
                $stmt2->bind_param("s", $row['termek_id']);
                $stmt2->execute();
                $result2 = $stmt2->get_result();
                $termek = $result2->fetch_assoc();

                $row['raktar_keszlet'] = $termek['raktar_keszlet'] ?? 0; // Ha nincs adat, akkor 0
                $kosar[] = $row;
            }

            echo json_encode(["success" => true, "kosar" => $kosar]);
            exit;

        case 'add':
            // Lekérjük az aktuális raktárkészletet a termékek táblából (!!! HIBAJAVÍTÁS: darabszam oszlopot használunk !!!)
            $stmt = $db->prepare("SELECT darabszam FROM termekek WHERE cikkszam = ?");
            $stmt->bind_param("s", $termek_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $termek = $result->fetch_assoc();

            if (!$termek || !isset($termek['darabszam'])) {
                echo json_encode(["success" => false, "error" => "A termék nem található vagy nincs raktárkészlet adat."]);
                exit;
            }

            $raktar_keszlet = intval($termek['darabszam']); // 🔹 A raktárkészlet most a darabszam oszlopból jön

            // Lekérjük a kosárban lévő mennyiséget
            $stmt = $db->prepare("SELECT darabszam FROM kosar WHERE termek_id = ? AND felhasznalo_id = ?");
            $stmt->bind_param("ss", $termek_id, $user_email);
            $stmt->execute();
            $result = $stmt->get_result();
            $kosar_mennyiseg = ($result->num_rows > 0) ? intval($result->fetch_assoc()['darabszam']) : 0;

            $uj_mennyiseg = $kosar_mennyiseg + $mennyiseg;

            // Ellenőrizzük, hogy ne lépjük túl a készletet
            if ($uj_mennyiseg > $raktar_keszlet) {
                echo json_encode([
                    "success" => false,
                    "error" => "Nincs elegendő készlet. Maximum " . ($raktar_keszlet - $kosar_mennyiseg) . " darabot tudsz még hozzáadni."
                ]);
                exit;
            }

            // Ha a termék már a kosárban van, frissítjük a mennyiséget
            if ($kosar_mennyiseg > 0) {
                $stmt = $db->prepare("UPDATE kosar SET darabszam = ? WHERE termek_id = ? AND felhasznalo_id = ?");
                $stmt->bind_param("iss", $uj_mennyiseg, $termek_id, $user_email);
            } else {
                $stmt = $db->prepare("INSERT INTO kosar (felhasznalo_id, termek_id, darabszam) VALUES (?, ?, ?)");
                $stmt->bind_param("ssi", $user_email, $termek_id, $mennyiseg);
            }
            $hasStatement = true;
            break;

        case 'update':
            $stmt = $db->prepare("UPDATE kosar SET darabszam = ? WHERE termek_id = ? AND felhasznalo_id = ?");
            $stmt->bind_param("iss", $mennyiseg, $termek_id, $user_email);
            $hasStatement = true;
            break;

        case 'remove':
            $stmt = $db->prepare("DELETE FROM kosar WHERE termek_id = ? AND felhasznalo_id = ?");
            $stmt->bind_param("ss", $termek_id, $user_email);
            $hasStatement = true;
            break;

        case 'removeAll':
            $stmt = $db->prepare("DELETE FROM kosar WHERE felhasznalo_id = ?");
            $stmt->bind_param("s", $user_email);
            $hasStatement = true;
            break;

        default:
            echo json_encode(["success" => false, "error" => "Ismeretlen művelet"]);
            exit;
    }

    if ($hasStatement && $stmt->execute()) {
        $uj_mennyiseg = getUserCartCount($db, $user_email);
        echo json_encode(["success" => true, "uj_mennyiseg" => $uj_mennyiseg]);
    } elseif ($hasStatement) {
        echo json_encode(["success" => false, "error" => "Hiba történt az adatbázis művelet során."]);
    }
} else {
    if (!isset($_SESSION['kosar'])) {
        $_SESSION['kosar'] = [];
    }

    switch ($action) {
        case 'getCart':
            if (!isset($_SESSION['kosar']) || empty($_SESSION['kosar'])) {
                echo json_encode(["success" => true, "kosar" => []]);
                exit;
            }

            $kosar = [];
            foreach ($_SESSION['kosar'] as $termek_id => $darabszam) {
                // 🔹 Lekérjük a raktárkészletet
                $stmt = $db->prepare("SELECT darabszam as raktar_keszlet FROM termekek WHERE cikkszam = ?");
                $stmt->bind_param("s", $termek_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $termek = $result->fetch_assoc();

                $kosar[] = [
                    "termek_id" => $termek_id,
                    "darabszam" => $darabszam,
                    "raktar_keszlet" => $termek['raktar_keszlet'] ?? 0
                ];
            }

            echo json_encode(["success" => true, "kosar" => $kosar]);
            exit;

        case 'add':
            // Lekérjük az aktuális raktárkészletet a termékek táblából
            $stmt = $db->prepare("SELECT darabszam FROM termekek WHERE cikkszam = ?");
            $stmt->bind_param("s", $termek_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $termek = $result->fetch_assoc();

            if (!$termek || !isset($termek['darabszam'])) {
                echo json_encode(["success" => false, "error" => "A termék nem található vagy nincs raktárkészlet adat."]);
                exit;
            }

            $raktar_keszlet = intval($termek['darabszam']); // 🔹 A raktárkészlet most a darabszam oszlopból jön

            // Kosárban lévő aktuális mennyiség lekérése (ha van)
            $kosar_mennyiseg = $_SESSION['kosar'][$termek_id] ?? 0;
            $uj_mennyiseg = $kosar_mennyiseg + $mennyiseg;

            // Ellenőrizzük, hogy ne lépjük túl a készletet
            if ($uj_mennyiseg > $raktar_keszlet) {
                echo json_encode([
                    "success" => false,
                    "error" => "Nincs elegendő készlet. Maximum " . ($raktar_keszlet - $kosar_mennyiseg) . " darabot tudsz még hozzáadni."
                ]);
                exit;
            }

            // Ha minden rendben van, frissítjük a session kosarat
            $_SESSION['kosar'][$termek_id] = $uj_mennyiseg;
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
