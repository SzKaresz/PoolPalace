<?php
include './session.php';
include 'db.php';

if (!isset($_SESSION['user_email'])) {
    header("Location: bejelentkezes.php");
    exit;
}

$user_email = $_SESSION['user_email'];

$stmt = $db->prepare("SELECT id, datum, osszeg, szallit_irsz, szallit_telep, szallit_cim, statusz, fiz_mod FROM megrendeles WHERE email = ? ORDER BY datum DESC");
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
    <link rel="stylesheet" href="../css/rendeleseim.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
</head>

<body>
    <?php include 'navbar.php'; ?>

    <div class="container mt-5 mb-5">
        <?php if (empty($orders)): ?>
            <div class="empty-order-wrapper text-center">
                <h2 class="mb-3">Rendeléseim</h2>
                <p class="text-muted">Még nem adtál le rendelést.</p>
            </div>
        <?php else: ?>
            <h2 class="text-center my-4">Rendeléseim</h2>
            <div class="container mt-4 mb-5">
                <div class="accordion" id="orderAccordion">
                    <?php foreach ($orders as $index => $order): ?>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>
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
                            <p><strong>Fizetési mód:</strong> <?= htmlspecialchars($order['fiz_mod']) ?></p>
                            <p><strong>Szállítási cím:</strong> <?= htmlspecialchars($order['szallit_irsz'] . " " . $order['szallit_telep'] . ", " . $order["szallit_cim"]) ?></p>

                            <?php
                            $stmt_items = $db->prepare("SELECT t.termek_id, t.darabszam, t.egysegar, termekek.nev, termekek.akcios_ar FROM tetelek t JOIN termekek ON t.termek_id = termekek.cikkszam WHERE t.megrendeles_id = ?");
                            $stmt_items->bind_param("i", $order['id']);
                            $stmt_items->execute();
                            $items = $stmt_items->get_result()->fetch_all(MYSQLI_ASSOC);
                            ?>
                            <ul class="list-group">
                                <?php foreach ($items as $item): ?>
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <a href="termekOldal.php?cikkszam=<?= urlencode($item['termek_id']) ?>" class="text-decoration-none" target="_blank">
                                            <?= htmlspecialchars($item['nev']) ?> (<?= htmlspecialchars($item['termek_id']) ?>)
                                        </a>
                                        <?php
                                        $egysegar = (int) str_replace(' ', '', $item['egysegar']);
                                        $akciosAr = isset($item['akcios_ar']) ? (int) str_replace(' ', '', $item['akcios_ar']) : -1;

                                        if ($akciosAr > 0 && $akciosAr < $egysegar): ?>
                                            <span>
                                                <?= $item['darabszam'] ?> x
                                                <span class="discounted-price"><?= number_format($akciosAr, 0, ',', ' ') ?> Ft</span>
                                                <span class="original-price"><?= number_format($egysegar, 0, ',', ' ') ?> Ft</span>
                                            </span>
                                        <?php else: ?>
                                            <span><?= $item['darabszam'] ?> x <?= number_format($egysegar, 0, ',', ' ') ?> Ft</span>
                                        <?php endif; ?>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php include "./footer.php"; ?>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>