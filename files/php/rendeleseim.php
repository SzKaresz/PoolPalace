<?php
include './session.php';
include 'db.php';

if (!isset($_SESSION['user_email'])) {
    header("Location: bejelentkezes.php");
    exit;
}

$user_email = $_SESSION['user_email'];

// Rendelések lekérése
$stmt = $db->prepare("SELECT id, datum, osszeg, szallit_irsz, szallit_telep, szallit_cim, statusz FROM megrendeles WHERE email = ? ORDER BY datum DESC");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$orders = $result->fetch_all(MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendeléseim</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
</head>
<body>
    <?php include 'navbar.php'; ?>

    <div class="container mt-5 mb-5">
        <h2 class="mb-4">Rendeléseim</h2>

        <?php if (empty($orders)): ?>
            <p class="text-muted">Még nem adtál le rendelést.</p>
        <?php else: ?>
            <div class="accordion" id="orderAccordion">
                <?php foreach ($orders as $index => $order): ?>
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading<?= $order['id'] ?>">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse<?= $order['id'] ?>">
                                Rendelés #<?= $order['id'] ?> - <?= date("Y.m.d H:i", strtotime($order['datum'])) ?> - <?= number_format($order['osszeg'], 0, ',', ' ') ?> Ft
                            </button>
                        </h2>
                        <div id="collapse<?= $order['id'] ?>" class="accordion-collapse collapse" data-bs-parent="#orderAccordion">
                            <div class="accordion-body">
                                <p><strong>Státusz:</strong> <?= htmlspecialchars($order['statusz']) ?></p> 
                                <p><strong>Szállítási cím:</strong> <?= htmlspecialchars($order['szallit_irsz']." ".$order['szallit_telep'].", ".$order["szallit_cim"]) ?></p>
                                
                                <?php
                                $stmt_items = $db->prepare("SELECT t.termek_id, t.darabszam, t.egysegar, termekek.nev FROM tetelek t JOIN termekek ON t.termek_id = termekek.cikkszam WHERE t.megrendeles_id = ?");
                                $stmt_items->bind_param("i", $order['id']);
                                $stmt_items->execute();
                                $items = $stmt_items->get_result()->fetch_all(MYSQLI_ASSOC);
                                ?>
                                <ul class="list-group">
                                    <?php foreach ($items as $item): ?>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            <a href="termekOldal.php?cikkszam=<?= urlencode($item['termek_id']) ?>" class="text-decoration-none"> 
                                                <?= htmlspecialchars($item['nev']) ?> (<?= htmlspecialchars($item['termek_id']) ?>)
                                            </a>
                                            <span><?= $item['darabszam'] ?> x <?= number_format($item['egysegar'], 0, ',', ' ') ?> Ft</span>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    <?php include "./footer.php"; ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>