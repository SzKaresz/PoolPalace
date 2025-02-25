<?php
include './session.php';
include 'db.php';

// Függvény a bejelentkezett felhasználó kosarának darabszámának lekérésére
function getUserCartCount($db, $user_email)
{
    $stmt = $db->prepare("SELECT SUM(darabszam) AS total FROM kosar 
                          JOIN felhasznalok ON felhasznalok.id = kosar.felhasznalo_id 
                          WHERE felhasznalok.email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row['total'] ?? 0;
}

$termekek = [];
$osszesen = 0;

if (isset($_SESSION['user_email'])) {
    $user_email = $_SESSION['user_email'];

    $stmt = $db->prepare("SELECT t.cikkszam, t.nev, t.egysegar, t.akcios_ar, k.darabszam 
                          FROM kosar k
                          JOIN termekek t ON k.termek_id = t.cikkszam
                          JOIN felhasznalok f ON f.email = k.felhasznalo_id
                          WHERE f.email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $ar = (!is_null($row['akcios_ar']) && $row['akcios_ar'] > -1) ? $row['akcios_ar'] : $row['egysegar'];

        $termekek[] = [
            'cikkszam' => $row['cikkszam'] ?? '',
            'nev' => $row['nev'] ?? 'Név nem elérhető',
            'egysegar' => $row['egysegar'] ?? 0,
            'akcios_ar' => $row['akcios_ar'] ?? null,
            'ar' => $ar,
            'darabszam' => $row['darabszam'] ?? 0
        ];

        $osszesen += $row['darabszam'] * $ar;
    }
    
} else {
    if (!empty($_SESSION['kosar'])) {
        foreach ($_SESSION['kosar'] as $termek_id => $darabszam) {
            $stmt = $db->prepare("SELECT cikkszam, nev, egysegar, akcios_ar FROM termekek WHERE cikkszam = ?");
            $stmt->bind_param("s", $termek_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $termek = $result->fetch_assoc();

            if ($termek) {
                $ar = (!is_null($termek['akcios_ar']) && $termek['akcios_ar'] > -1) ? $termek['akcios_ar'] : $termek['egysegar'];

                $termekek[] = [
                    'cikkszam' => $termek['cikkszam'],
                    'nev' => $termek['nev'],
                    'egysegar' => $termek['egysegar'],
                    'akcios_ar' => $termek['akcios_ar'],
                    'ar' => $ar,
                    'darabszam' => $darabszam
                ];

                $osszesen += $darabszam * $ar;
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <title>PoolPalace - Kosár</title>
    <link rel="stylesheet" href="../css/kosar.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <script src="../js/kosar.js" defer></script>
</head>

<body>
    <div class="container">
        <h2>Kosár</h2>

        <?php if (!empty($termekek)): ?>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Termék</th>
                        <th>Egységár</th>
                        <th>Mennyiség</th>
                        <th>Összeg</th>
                        <th>Művelet</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($termekek as $termek): ?>
                        <tr data-id="<?= str_pad($termek['cikkszam'], 6, '0', STR_PAD_LEFT) ?>">
                            <td>
                                <a href="termekOldal.php?cikkszam=<?= $termek['cikkszam'] ?>" class="cart-product">
                                    <img src="../img/termekek/<?= $termek['cikkszam'] ?>.webp" alt="<?= htmlspecialchars($termek['nev']) ?>">
                                    <span class="cart-name"> <?= htmlspecialchars($termek['nev']) ?> </span>
                                </a>
                            </td>
                            <td>
                                <?php if (!is_null($termek['akcios_ar']) && $termek['akcios_ar'] > -1): ?>
                                    <span class="original-price">
                                        <?= number_format($termek['egysegar'], 0, ',', ' ') ?> Ft
                                    </span>
                                    <span class="discounted-price">
                                        <?= number_format($termek['akcios_ar'], 0, ',', ' ') ?> Ft
                                    </span>
                                <?php else: ?>
                                    <?= number_format($termek['egysegar'], 0, ',', ' ') ?> Ft
                                <?php endif; ?>
                            </td>
                            <td>
                                <button class="quantity-btn minus" onclick="updateQuantity(<?= str_pad($termek['cikkszam'], 6, '0', STR_PAD_LEFT) ?>, -1)">-</button>
                                <span class="quantity"><?= $termek['darabszam'] ?></span>
                                <button class="quantity-btn plus" onclick="updateQuantity(<?= str_pad($termek['cikkszam'], 6, '0', STR_PAD_LEFT) ?>, 1)">+</button>
                            </td>
                            <td><?= number_format($termek['darabszam'] * $termek['ar'], 0, ',', ' ') ?> Ft</td>
                            <td><button class="remove-btn">❌</button></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <div class="row">
                <div class="col cart-delete">
                    <button type="button" class="delete-btn">Rendeles törlése</button>
                </div>
                <div class="col cart-summary">
                    <h3>Összesen: <?= number_format($osszesen, 0, ',', ' ') ?> Ft</h3>
                    <button type="button" class="checkout-btn" onclick="window.location.href='megrendeles.php'">Tovább a fizetéshez</button>
                </div>
            </div>
        <?php endif; ?>
        <p class="empty-cart-message" style="display: none;">A kosár üres.</p>
    </div>

    <?php include './navbar.php'; ?>
    <?php include './footer.php'; ?>
</body>

</html>