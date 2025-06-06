<?php
include './sql_fuggvenyek.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Ismeretlen hiba történt.'];

if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["uj_gyarto"])) {
    $ujNev = trim($_POST["uj_gyarto"]);

    $check_sql = "SELECT id FROM gyarto WHERE nev = ?";
    $stmt_check = $db->prepare($check_sql);
    if ($stmt_check) {
        $stmt_check->bind_param("s", $ujNev);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) {
            $response['message'] = 'Már létezik ilyen nevű gyártó!';
        } else {
            $sql = "INSERT INTO gyarto (nev) VALUES (?)";
            $stmt = $db->prepare($sql);
            if ($stmt) {
                $stmt->bind_param("s", $ujNev);
                if ($stmt->execute()) {
                    if ($stmt->affected_rows > 0) {
                        $response['success'] = true;
                        $response['message'] = 'Gyártó sikeresen hozzáadva!';
                    } else {
                        $response['message'] = 'Nem sikerült hozzáadni a gyártót (0 érintett sor).';
                    }
                } else {
                    $response['message'] = 'Hiba történt a gyártó hozzáadása közben: ' . $stmt->error;
                }
                $stmt->close();
            } else {
                $response['message'] = 'Adatbázis előkészítési hiba (INSERT): ' . $db->error;
            }
        }
        $stmt_check->close();
    } else {
        $response['message'] = 'Adatbázis előkészítési hiba (SELECT): ' . $db->error;
    }
} else {
    $response['message'] = 'Érvénytelen kérés vagy hiányzó gyártónév.';
}

echo json_encode($response);
?>