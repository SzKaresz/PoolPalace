<?php
include './session.php';
include 'db.php';

ob_start();

$is_guest = !isset($_SESSION['user_email']);
$user_email = $is_guest ? '' : $_SESSION['user_email'];

$user_data = [];

if (!$is_guest) {
    $stmt = $db->prepare("SELECT f.nev, f.email, f.telefonszam, 
                                 sz.iranyitoszam AS szallitasi_iranyitoszam, 
                                 sz.telepules AS szallitasi_telepules, 
                                 sz.utca_hazszam AS szallitasi_utca_hazszam,
                                 szaml.iranyitoszam AS szamlazasi_iranyitoszam, 
                                 szaml.telepules AS szamlazasi_telepules, 
                                 szaml.utca_hazszam AS szamlazasi_utca_hazszam
                          FROM felhasznalok f
                          LEFT JOIN szallitasi_cim sz ON f.szallitasi_cim_id = sz.id
                          LEFT JOIN szamlazasi_cim szaml ON f.szamlazasi_cim_id = szaml.id
                          WHERE f.email = ?");
    $stmt->bind_param("s", $user_email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user_data = $result->fetch_assoc();
}

// Kosár inicializálása
$cart_items = [];
$total = 0;

if (!$is_guest) {
    $stmt = $db->prepare("SELECT t.cikkszam, t.nev, t.egysegar, t.akcios_ar, 
                             COALESCE(t.akcios_ar, t.egysegar) AS ar, 
                             k.darabszam, 
                             CONCAT('../img/termekek/', t.cikkszam, '.webp') AS kep_url 
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
    $price = (isset($item['akcios_ar']) && $item['akcios_ar'] !== null && $item['akcios_ar'] > -1) ? $item['akcios_ar'] : $item['egysegar'];
    $total += $item['darabszam'] * $price;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (
        empty($data['name']) || empty($data['email']) || empty($data['phone']) ||
        empty($data['shipping_postal_code']) || empty($data['shipping_city']) || empty($data['shipping_address']) ||
        empty($data['billing_postal_code']) || empty($data['billing_city']) || empty($data['billing_address'])
    ) {
        echo json_encode(["success" => false, "error" => "Hiba: Minden mező kitöltése kötelező!"]);
        exit;
    }

    $felhasznalo_email = $is_guest ? null : $_SESSION['user_email'];
    if ($is_guest && !empty($data['email'])) {
        $felhasznalo_email = $data['email'];
    }

    $register = isset($data['register']) && $data['register'] === true;

    if ($is_guest && $register) {
        if (empty($data['password'])) {
            echo json_encode(["success" => false, "error" => "Hiba: A regisztrációhoz jelszót kell megadni!"]);
            exit;
        }

        // Ellenőrizzük, hogy az e-mail már létezik-e
        $stmt = $db->prepare("SELECT email FROM felhasznalok WHERE email = ?");
        $stmt->bind_param("s", $data['email']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["success" => false, "error_field" => "email", "error" => "Ez az e-mail cím már regisztrálva van!"]);
            exit;
        }

        // Jelszó hashelése
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

        // Szállítási cím mentése
        $stmt = $db->prepare("INSERT INTO szallitasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data['shipping_postal_code'], $data['shipping_city'], $data['shipping_address']);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a szállítási cím mentése során."]);
            exit;
        }
        $szallitasi_cim_id = $stmt->insert_id;

        // Számlázási cím mentése
        $stmt = $db->prepare("INSERT INTO szamlazasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data['billing_postal_code'], $data['billing_city'], $data['billing_address']);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a számlázási cím mentése során."]);
            exit;
        }
        $szamlazasi_cim_id = $stmt->insert_id;

        // Felhasználó beszúrása
        $stmt = $db->prepare("INSERT INTO felhasznalok (email, nev, telefonszam, jelszo, szallitasi_cim_id, szamlazasi_cim_id) 
                              VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssii", $data['email'], $data['name'], $data['phone'], $password_hash, $szallitasi_cim_id, $szamlazasi_cim_id);

        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a felhasználó mentése során: " . $stmt->error]);
            exit;
        }
    }

    // Rendelés mentése (számlázási címmel együtt!)
    $stmt = $db->prepare("INSERT INTO megrendeles (
        email, nev, telefonszam, osszeg, 
        szallit_irsz, szallit_telep, szallit_cim, 
        szamlaz_irsz, szamlaz_telep, szamlaz_cim, statusz
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Feldolgozás alatt')");

    $stmt->bind_param(
        "sssdssssss",
        $data['email'],
        $data['name'],
        $data['phone'],
        $data['total'],
        $data['shipping_postal_code'],
        $data['shipping_city'],
        $data['shipping_address'],
        $data['billing_postal_code'],
        $data['billing_city'],
        $data['billing_address']
    );
    $stmt->execute();
    $megrendeles_id = $stmt->insert_id;

    foreach ($data['cart_items'] as $item) {
        $stmt = $db->prepare("INSERT INTO tetelek (megrendeles_id, termek_id, darabszam, egysegar) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isid", $megrendeles_id, $item['cikkszam'], $item['darabszam'], $item['egysegar']);
        $stmt->execute();
    }

    if (!$is_guest) {
        $stmt = $db->prepare("DELETE FROM kosar WHERE felhasznalo_id = ?");
        $stmt->bind_param("s", $felhasznalo_email);
        $stmt->execute();
    } else {
        unset($_SESSION['kosar']);
    }

    echo json_encode(["success" => true, "order_id" => $megrendeles_id]);

    // include 'email_kuldes.php';
    // kuldRendelesVisszaigazolas($felhasznalo_email, $data['name'], $megrendeles_id, $data['cart_items'], $data['total']);

    exit;
}

ob_end_flush();
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
    <?php if (!$is_guest): ?>
        <div id="user-data" style="display: none;"><?= htmlspecialchars(json_encode($user_data)) ?></div>
    <?php endif; ?>

    <div id="megrendeles-container">
        <!-- Bal oldal: Kosár tartalma -->
        <div id="kosar-container">
            <h2>Kosár tartalma</h2>
            <ul class="list-group" id="cart-items">
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

        <!-- Jobb oldal: Megrendelési űrlap -->
        <div id="megrendeles-form-container">
            <h2>Megrendelés adatai</h2>
            <form id="order-form">
                <div class="mb-3">
                    <label for="name">Név</label>
                    <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($user_data['nev'] ?? '') ?>">
                </div>
                <div class="mb-3">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($user_data['email'] ?? '') ?>" <?= $is_guest ? '' : 'readonly' ?>>
                </div>
                <div class="mb-3">
                    <label for="phone">Telefonszám</label>
                    <input type="text" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($user_data['telefonszam'] ?? '') ?>">
                </div>

                <!-- Accordion Szállítási cím -->
                <div class="accordion mb-3" id="shippingAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#shippingCollapse">
                                Szállítási cím
                            </button>
                        </h2>
                        <div id="shippingCollapse" class="accordion-collapse collapse">
                            <div class="accordion-body">
                                <label for="shipping-postal_code">Irányítószám</label>
                                <input type="text" class="form-control mb-2" id="shipping-postal_code" name="shipping-postal_code"
                                    value="<?= htmlspecialchars($user_data['szallitasi_iranyitoszam'] ?? '') ?>">

                                <label for="shipping-city">Település</label>
                                <input type="text" class="form-control mb-2" id="shipping-city" name="shipping-city"
                                    value="<?= htmlspecialchars($user_data['szallitasi_telepules'] ?? '') ?>">

                                <label for="shipping-address">Utca, házszám</label>
                                <input type="text" class="form-control" id="shipping-address" name="shipping-address"
                                    value="<?= htmlspecialchars($user_data['szallitasi_utca_hazszam'] ?? '') ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Accordion Számlázási cím -->
                <div class="accordion" id="billingAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#billingCollapse">
                                Számlázási cím
                            </button>
                        </h2>
                        <div id="billingCollapse" class="accordion-collapse collapse">
                            <div class="accordion-body">
                                <label for="billing-postal_code">Irányítószám</label>
                                <input type="text" class="form-control mb-2" id="billing-postal_code" name="billing-postal_code"
                                    value="<?= htmlspecialchars($user_data['szamlazasi_iranyitoszam'] ?? '') ?>">

                                <label for="billing-city">Település</label>
                                <input type="text" class="form-control mb-2" id="billing-city" name="billing-city"
                                    value="<?= htmlspecialchars($user_data['szamlazasi_telepules'] ?? '') ?>">

                                <label for="billing-address">Utca, házszám</label>
                                <input type="text" class="form-control" id="billing-address" name="billing-address"
                                    value="<?= htmlspecialchars($user_data['szamlazasi_utca_hazszam'] ?? '') ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-3 mt-3">
                    <label for="payment-method" class="form-label">Fizetési mód</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="payment-method" id="payment-card" value="card" checked>
                        <label class="form-check-label" for="payment-card">Bankkártyás fizetés</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="payment-method" id="payment-cash" value="cash">
                        <label class="form-check-label" for="payment-cash">Utánvét (készpénz)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="payment-method" id="payment-transfer" value="transfer">
                        <label class="form-check-label" for="payment-transfer">Banki átutalás</label>
                    </div>
                </div>

                <button type="button" class="btn btn-primary w-100 mt-3" id="place-order-btn">Megrendelés leadása</button>
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
                    <!-- Alert container inside modal for password errors -->
                    <div id="password-alert"></div>
                    <!-- Two password fields added -->
                    <div class="mb-2">
                        <label for="modal-password">Jelszó</label>
                        <input type="password" class="form-control" id="modal-password" placeholder="Jelszó">
                    </div>
                    <div class="mb-2">
                        <label for="modal-password-confirm">Jelszó újra</label>
                        <input type="password" class="form-control" id="modal-password-confirm" placeholder="Jelszó újra">
                    </div>
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

    <!-- Rendelés visszaigazolás modal -->
    <div class="modal fade" id="orderSuccessModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Sikeres rendelés</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    <p>A rendelésed sikeresen leadtad!</p>
                    <p><strong>Rendelés azonosítója: <span id="order-id"></span></strong></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="window.location.href='termekek.php'">Ok</button>
                </div>
            </div>
        </div>
    </div>

    <?php
    ob_end_flush();
    ?>
</body>

</html>