<?php
include './session.php';
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data['action'] === 'placeOrder') {
        $is_guest = !isset($_SESSION['user_email']);
        $user_email = $is_guest ? $data['email'] : $_SESSION['user_email'];
        $register = isset($data['register']) && $data['register'] === true;

        if ($is_guest) {
            // Check if guest user already exists
            $stmt = $db->prepare("SELECT email FROM felhasznalok WHERE email = ?");
            $stmt->bind_param("s", $data['email']);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                if ($register) {
                    // Save guest shipping address details
                    $stmt = $db->prepare("INSERT INTO szallitasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $data['postal_code'], $data['city'], $data['address']);
                    if (!$stmt->execute()) {
                        echo json_encode(["success" => false, "error" => "Hiba történt a szállítási cím mentése során"]);
                        exit;
                    }
                    $szallitasi_cim_id = $stmt->insert_id;

                    // Save guest billing address details (assuming it's the same as shipping address for simplicity)
                    $stmt = $db->prepare("INSERT INTO szamlazasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $data['postal_code'], $data['city'], $data['address']);
                    if (!$stmt->execute()) {
                        echo json_encode(["success" => false, "error" => "Hiba történt a számlázási cím mentése során"]);
                        exit;
                    }
                    $szamlazasi_cim_id = $stmt->insert_id;

                    // Save guest user details
                    $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);
                    $stmt = $db->prepare("INSERT INTO felhasznalok (email, nev, telefonszam, szallitasi_cim_id, szamlazasi_cim_id, jelszo) VALUES (?, ?, ?, ?, ?, ?)");
                    $stmt->bind_param("ssssss", $data['email'], $data['name'], $data['phone'], $szallitasi_cim_id, $szamlazasi_cim_id, $password_hash);
                    if (!$stmt->execute()) {
                        echo json_encode(["success" => false, "error" => "Hiba történt a felhasználó mentése során"]);
                        exit;
                    }
                } else {
                    // Use the predefined guest user ID for guest orders
                    $user_email = 'guest';

                    // Ensure guest user exists in the felhasznalok table
                    $stmt = $db->prepare("SELECT email FROM felhasznalok WHERE email = ?");
                    $stmt->bind_param("s", $user_email);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if ($result->num_rows === 0) {
                        $stmt = $db->prepare("INSERT INTO felhasznalok (email, nev, telefonszam) VALUES (?, 'Vendég', '0000000000')");
                        $stmt->bind_param("s", $user_email);
                        if (!$stmt->execute()) {
                            echo json_encode(["success" => false, "error" => "Hiba történt a vendég felhasználó mentése során"]);
                            exit;
                        }
                    }
                }
            } else {
                $user_email = $data['email'];
            }
        }

        // Calculate total amount
        $total = 0;
        foreach ($data['cart_items'] as $item) {
            $total += $item['darabszam'] * $item['ar'];
        }

        // Insert order into megrendeles table
        $stmt = $db->prepare("INSERT INTO megrendeles (felhasznalo_id, osszeg) VALUES (?, ?)");
        $stmt->bind_param("sd", $user_email, $total);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a megrendelés mentése során"]);
            exit;
        }
        $megrendeles_id = $stmt->insert_id;

        // Insert order items into tetelek table
        foreach ($data['cart_items'] as $item) {
            $stmt = $db->prepare("INSERT INTO tetelek (megrendeles_id, termek_id, darabszam, egysegar) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("isid", $megrendeles_id, $item['cikkszam'], $item['darabszam'], $item['ar']);
            if (!$stmt->execute()) {
                echo json_encode(["success" => false, "error" => "Hiba történt a megrendelés tételeinek mentése során"]);
                exit;
            }

            // Update stock quantity in termekek table
            $stmt = $db->prepare("UPDATE termekek SET darabszam = darabszam - ? WHERE cikkszam = ?");
            $stmt->bind_param("is", $item['darabszam'], $item['cikkszam']);
            if (!$stmt->execute()) {
                echo json_encode(["success" => false, "error" => "Hiba történt a készlet frissítése során"]);
                exit;
            }
        }

        // Log the order
        $stmt = $db->prepare("INSERT INTO log (tabla_id, tabla_nev, datum) VALUES (?, ?, NOW())");
        $table_name = 'megrendeles';
        $stmt->bind_param("is", $megrendeles_id, $table_name);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a naplózás során"]);
            exit;
        }

        // Clear the cart
        if (!$is_guest) {
            $stmt = $db->prepare("DELETE FROM kosar WHERE felhasznalo_id = ?");
            $stmt->bind_param("s", $user_email);
            $stmt->execute();
        } else {
            unset($_SESSION['kosar']);
        }

        echo json_encode(["success" => true]);
        exit;
    }
}

// Existing code for displaying the order form

$is_guest = !isset($_SESSION['user_email']);
$user_email = $is_guest ? '' : $_SESSION['user_email'];

if (!$is_guest) {
    // Fetch user details
    $stmt = $db->prepare("SELECT * FROM felhasznalok WHERE email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
}

// Fetch cart items
$cart_items = [];
$total = 0;

if (!$is_guest) {
    $stmt = $db->prepare("SELECT t.cikkszam, t.nev, t.egysegar, t.akcios_ar, k.darabszam 
                          FROM kosar k
                          JOIN termekek t ON k.termek_id = t.cikkszam
                          WHERE k.felhasznalo_id = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $cart_items = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
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
                $cart_items[] = [
                    'cikkszam' => $termek['cikkszam'],
                    'nev' => $termek['nev'],
                    'egysegar' => $termek['egysegar'],
                    'akcios_ar' => $termek['akcios_ar'],
                    'darabszam' => $darabszam,
                    'ar' => $ar,
                    'kep_url' => "../img/termekek/{$termek['cikkszam']}.webp"
                ];
            }
        }
    }
}

foreach ($cart_items as $item) {
    $price = (!is_null($item['akcios_ar']) && $item['akcios_ar'] > -1) ? $item['akcios_ar'] : $item['egysegar'];
    $total += $item['darabszam'] * $price;
}
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/megrendeles.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title>PoolPalace - Megrendelés</title>
</head>
<body>
    <div class="container py-5">
        <h2 class="mb-4 text-center">Megrendelés</h2>
        
        <div class="card p-4 shadow-sm">
            <h4 class="mb-3">Kosár tartalma</h4>
            <ul class="list-group mb-3" id="cart-items">
                <?php foreach ($cart_items as $item): ?>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="<?= htmlspecialchars($item['kep_url'] ?? '../img/default.png') ?>" alt="<?= htmlspecialchars($item['nev']) ?>" class="img-thumbnail me-3" style="width: 50px; height: 50px;">
                            <div>
                                <h6 class="my-0">
                                    <a href="termekOldal.php?cikkszam=<?= htmlspecialchars($item['cikkszam']) ?>" class="cart-product">
                                        <?= htmlspecialchars($item['nev']) ?>
                                    </a>
                                </h6>
                                <small class="text-muted">Cikkszám: <?= htmlspecialchars($item['cikkszam']) ?></small>
                            </div>
                        </div>
                        <span class="text-muted">
                            <?= htmlspecialchars($item['darabszam']) ?> x 
                            <?php if (!is_null($item['akcios_ar']) && $item['akcios_ar'] > -1): ?>
                                <span class="discounted-price"><?= number_format($item['akcios_ar'], 0, ',', ' ') ?> Ft</span>
                                <span class="original-price"><?= number_format($item['egysegar'], 0, ',', ' ') ?> Ft</span>
                            <?php else: ?>
                                <?= number_format($item['egysegar'], 0, ',', ' ') ?> Ft
                            <?php endif; ?>
                        </span>
                    </li>
                <?php endforeach; ?>
            </ul>
            <h4 class="text-end">Összesen: <span id="total-price"><?= number_format($total, 0, ',', ' ') ?></span> Ft</h4>
        </div>

        <div class="card p-4 mt-4 shadow-sm">
            <h4 class="mb-3">Számlázási és szállítási adatok</h4>
            <form id="order-form">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Név</label>
                        <input type="text" class="form-control" id="name" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="phone" class="form-label">Telefonszám</label>
                        <input type="text" class="form-control" id="phone" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="postal_code" class="form-label">Irányítószám</label>
                        <input type="text" class="form-control" id="postal_code" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">Település</label>
                        <input type="text" class="form-control" id="city" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="address" class="form-label">Szállítási cím</label>
                        <input type="text" class="form-control" id="address" required>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Jelszó (opcionális, ha regisztrálni szeretne)</label>
                    <input type="password" class="form-control" id="password">
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="register" name="register">
                    <label class="form-check-label" for="register">Regisztrálni szeretnék</label>
                </div>
                <button type="button" class="btn btn-primary w-100" id="place-order-btn">Megrendelés leadása</button>
            </form>
        </div>
    </div>

    <!-- Hidden elements to pass data to JavaScript -->
    <div id="cart-items-data" style="display: none;"><?= htmlspecialchars(json_encode($cart_items)) ?></div>
    <div id="total-price-data" style="display: none;"><?= htmlspecialchars($total) ?></div>
    <div id="is-guest-data" style="display: none;"><?= htmlspecialchars(json_encode($is_guest)) ?></div>

    <!-- Modal a vendégvásárlóknak -->
    <div class="modal fade" id="guestModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Fiók létrehozása</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Szeretné elmenteni adatait a későbbi vásárlásokhoz?</p>
                    <input type="password" class="form-control" id="password" placeholder="Jelszó (opcionális)">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Nem</button>
                    <button type="button" class="btn btn-primary" id="save-account-btn">Igen</button>
                </div>
            </div>
        </div>
    </div>
    
    <?php include './navbar.php'; ?>
    <?php include './footer.php'; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/megrendeles.js"></script>
</body>
</html>