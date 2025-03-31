<?php
include './db.php';

// JSON válasz beállítása
header('Content-Type: application/json');

function formatPrice($price)
{
    return number_format($price, 0, ',', ' ') . ' Ft';
}

// Aktuális oldal és limit
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$items_per_page = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

$offset = ($page - 1) * $items_per_page;

// **Szűrési paraméterek kezelése**
$whereClauses = [];
$params = [];
$types = "";

// Kategóriák szűrése
if (!empty($_GET['kategoriak'])) {
    $kategoriak = explode(",", $_GET['kategoriak']);
    $placeholders = implode(",", array_fill(0, count($kategoriak), "?"));
    $whereClauses[] = "kategoria_id IN (SELECT id FROM kategoria WHERE nev IN ($placeholders))";
    $params = array_merge($params, $kategoriak);
    $types .= str_repeat("s", count($kategoriak));
}

// Gyártók szűrése
if (!empty($_GET['gyartok'])) {
    $gyartok = explode(",", $_GET['gyartok']);
    $placeholders = implode(",", array_fill(0, count($gyartok), "?"));
    $whereClauses[] = "gyarto_id IN (SELECT id FROM gyarto WHERE nev IN ($placeholders))";
    $params = array_merge($params, $gyartok);
    $types .= str_repeat("s", count($gyartok));
}

// Ár szűrése
if (isset($_GET['fromprice']) && isset($_GET['toprice'])) {
    $whereClauses[] = "egysegar BETWEEN ? AND ?";
    $params[] = (float)$_GET['fromprice'];
    $params[] = (float)$_GET['toprice'];
    $types .= "dd";
}

// **SQL WHERE feltételek összeállítása**
$whereSQL = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

// **Összes termék számának lekérdezése a szűrés figyelembevételével**
$total_query = $db->prepare("SELECT COUNT(*) AS total FROM termekek $whereSQL");
if (!empty($params)) {
    $total_query->bind_param($types, ...$params);
}
$total_query->execute();
$total_result = $total_query->get_result();
$total_items = $total_result->fetch_assoc()['total'] ?? 0;

// **Új szűrési opció: "kiemelt"**
$sort = isset($_GET['sort']) ? $_GET['sort'] : '';

$orderSQL = ""; // Alapértelmezett rendezés

if ($sort === "kiemelt") {
    $orderSQL = "ORDER BY 
    (SELECT COALESCE(SUM(tt.darabszam), 0) 
     FROM tetelek tt 
     WHERE tt.termek_id = t.cikkszam) DESC, 
    CAST(t.cikkszam AS UNSIGNED) ASC, 
        CASE 
            WHEN t.akcios_ar > -1 THEN t.akcios_ar 
            ELSE t.egysegar 
        END ASC";
} elseif ($sort === "ar-novekvo") {
    $orderSQL = "ORDER BY 
        CASE 
            WHEN t.akcios_ar > -1 THEN t.akcios_ar 
            ELSE t.egysegar 
        END ASC";
} elseif ($sort === "ar-csokkeno") {
    $orderSQL = "ORDER BY 
        CASE 
            WHEN t.akcios_ar > -1 THEN t.akcios_ar 
            ELSE t.egysegar 
        END DESC";
} elseif ($sort === "nev-az") {
    $orderSQL = "ORDER BY CONVERT(t.nev USING utf8mb4) COLLATE utf8mb4_hungarian_ci ASC";
} elseif ($sort === "nev-za") {
    $orderSQL = "ORDER BY CONVERT(t.nev USING utf8mb4) COLLATE utf8mb4_hungarian_ci DESC";
} elseif ($sort === "akcio") {
    $orderSQL = "ORDER BY 
        (t.akcios_ar > -1 AND t.akcios_ar < t.egysegar) DESC,
        CASE 
            WHEN t.akcios_ar > -1 THEN t.akcios_ar 
            ELSE t.egysegar 
        END ASC";
}

// **Frissített SQL lekérdezés**
$sql = "SELECT 
    t.cikkszam, t.nev, t.egysegar, t.akcios_ar, t.leiras, 
    k.nev AS kategoria_nev, g.nev AS gyarto_nev, t.darabszam,
    (SELECT COALESCE(SUM(tt.darabszam), 0) FROM tetelek tt WHERE tt.termek_id = t.cikkszam) AS rendelt_db
FROM termekek t
LEFT JOIN kategoria k ON t.kategoria_id = k.id
LEFT JOIN gyarto g ON t.gyarto_id = g.id
$whereSQL 
$orderSQL 
LIMIT ? OFFSET ?";

$query = $db->prepare($sql);

if (!empty($params)) {
    $allParams = array_merge($params, [$items_per_page, $offset]);
    $query->bind_param($types . "ii", ...$allParams);
} else {
    $query->bind_param("ii", $items_per_page, $offset);
}

$query->execute();
$result = $query->get_result();

$termekek = [];
while ($row = $result->fetch_assoc()) {
    // **🔹 Itt formázzuk az árakat a helyes megjelenítéshez**
    $row['egysegar'] = formatPrice($row['egysegar']);
    $row['akcios_ar'] = $row['akcios_ar'] !== null ? formatPrice($row['akcios_ar']) : null;

    $termekek[] = $row;
}

// **Összes oldal számának kiszámítása**
$total_pages = ceil($total_items / $items_per_page);

// **JSON válasz küldése**
echo json_encode([
    "termekek" => $termekek,
    "total_items" => $total_items,
    "total_pages" => $total_pages
]);

exit();