<?php
declare(strict_types=1);
include './db.php';
header('Content-Type: application/json; charset=utf-8');

$results = [];
$limit = 10;
$searchTerm = isset($_GET['term']) ? trim($_GET['term']) : '';

if (mb_strlen($searchTerm, 'UTF-8') >= 2) {
    if ($db) {
        $sql = "SELECT cikkszam, nev, egysegar, akcios_ar
                FROM termekek
                WHERE nev LIKE ?
                ORDER BY nev ASC
                LIMIT ?";

        $searchTermWildcard = '%' . $searchTerm . '%';

        $stmt = $db->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("si", $searchTermWildcard, $limit);

            if ($stmt->execute()) {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    $results[] = [
                        'id'    => $row['cikkszam'],
                        'name'  => htmlspecialchars($row['nev'], ENT_QUOTES, 'UTF-8'),
                        'url'   => './termekOldal.php?cikkszam=' . $row['cikkszam'],
                        'img'   => $row['cikkszam'] . '.webp',
                        'akcios_ar' => $row['akcios_ar'] !== null ? number_format((float)$row['akcios_ar'], 0, ',', ' ') : null,
                        'price' => number_format((int)$row['egysegar'], 0, '', ' ')
                    ];
                }
            } else {
                error_log("Live search SQL execution error: " . $stmt->error);
            }
            $stmt->close();
        } else {
            error_log("Live search SQL prepare error: " . $db->error);
        }
        $db->close();
    } else {
        error_log("Live search database connection failed.");
    }
}

echo json_encode($results);
exit;
?>