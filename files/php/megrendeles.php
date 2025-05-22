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

        $stmt = $db->prepare("SELECT email FROM felhasznalok WHERE email = ?");
        $stmt->bind_param("s", $data['email']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["success" => false, "error_field" => "email", "error" => "Ez az e-mail cím már regisztrálva van!"]);
            exit;
        }

        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

        $stmt = $db->prepare("INSERT INTO szallitasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data['shipping_postal_code'], $data['shipping_city'], $data['shipping_address']);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a szállítási cím mentése során."]);
            exit;
        }
        $szallitasi_cim_id = $stmt->insert_id;

        $stmt = $db->prepare("INSERT INTO szamlazasi_cim (iranyitoszam, telepules, utca_hazszam) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data['billing_postal_code'], $data['billing_city'], $data['billing_address']);
        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a számlázási cím mentése során."]);
            exit;
        }
        $szamlazasi_cim_id = $stmt->insert_id;

        $stmt = $db->prepare("INSERT INTO felhasznalok (email, nev, telefonszam, jelszo, szallitasi_cim_id, szamlazasi_cim_id) 
                              VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssii", $data['email'], $data['name'], $data['phone'], $password_hash, $szallitasi_cim_id, $szamlazasi_cim_id);

        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "error" => "Hiba történt a felhasználó mentése során: " . $stmt->error]);
            exit;
        }
    }

    $valodi_total = 0;
    $termekek = [];

    foreach ($cart_items as $item) {
        $valodi_ar = (!is_null($item['akcios_ar']) && $item['akcios_ar'] > 0 && $item['akcios_ar'] < $item['egysegar']) ? $item['akcios_ar'] : $item['egysegar'];
        $valodi_total += $item['darabszam'] * $valodi_ar;

        $termekek[] = [
            'cikkszam' => $item['cikkszam'],
            'nev' => $item['nev'],
            'egysegar' => $item['egysegar'],
            'akcios_ar' => $item['akcios_ar'],
            'darabszam' => $item['darabszam'],
            'ar' => $valodi_ar
        ];
    }

    $stmt = $db->prepare("INSERT INTO megrendeles (
        email, nev, telefonszam, osszeg, 
        szallit_irsz, szallit_telep, szallit_cim, 
        szamlaz_irsz, szamlaz_telep, szamlaz_cim, statusz, fiz_mod
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Feldolgozás alatt', ?)");

    $stmt->bind_param(
        "sssdsssssss",
        $data['email'],
        $data['name'],
        $data['phone'],
        $valodi_total,
        $data['shipping_postal_code'],
        $data['shipping_city'],
        $data['shipping_address'],
        $data['billing_postal_code'],
        $data['billing_city'],
        $data['billing_address'],
        $data['payment_method']
    );
    $stmt->execute();
    $megrendeles_id = $stmt->insert_id;

    foreach ($termekek as $t) {
        $stmt = $db->prepare("INSERT INTO tetelek (megrendeles_id, termek_id, darabszam, egysegar) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isid", $megrendeles_id, $t['cikkszam'], $t['darabszam'], $t['ar']);
        $stmt->execute();

        $stmt = $db->prepare("UPDATE termekek SET darabszam = darabszam - ? WHERE cikkszam = ? AND darabszam >= ?");
        $stmt->bind_param("isi", $t['darabszam'], $t['cikkszam'], $t['darabszam']);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            echo json_encode([
                "success" => false,
                "error" => "A(z) {$t['cikkszam']} cikkszámú termékből nincs elég raktáron!"
            ]);
            exit;
        }
    }

    if (!$is_guest) {
        $stmt = $db->prepare("DELETE FROM kosar WHERE felhasznalo_id = ?");
        $stmt->bind_param("s", $felhasznalo_email);
        $stmt->execute();
    } else {
        unset($_SESSION['kosar']);
    }

    echo json_encode(["success" => true, "order_id" => $megrendeles_id]);
    include 'email_kuldes.php';
    $szallitasiCim = [
        'irsz' => $data['shipping_postal_code'],
        'telepules' => $data['shipping_city'],
        'utca' => $data['shipping_address']
    ];
    $szamlazasiCim = [
        'irsz' => $data['billing_postal_code'],
        'telepules' => $data['billing_city'],
        'utca' => $data['billing_address']
    ];
    kuldRendelesVisszaigazolas($felhasznalo_email, $data['name'], $megrendeles_id, $termekek, $valodi_total, $data['payment_method'], $szallitasiCim, $szamlazasiCim);
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
        <div id="kosar-container">
            <h2>Kosár tartalma</h2>
            <ul class="list-group" id="cart-items">
                <?php foreach ($cart_items as $item): ?>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="<?= htmlspecialchars($item['kep_url'] ?? '../img/default.png') ?>" alt="<?= htmlspecialchars($item['nev']) ?>" class="img-thumbnail me-3" style="width: 50px; height: 50px;">
                            <div>
                                <h6 class="my-0">
                                    <a href="termekOldal.php?cikkszam=<?= htmlspecialchars($item['cikkszam']) ?>" class="cart-product" target="_blank">
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

        <div id="megrendeles-form-container">
            <h2>Megrendelés adatai</h2>
            <form id="order-form">
                <div class="mb-3">
                    <label for="name">Név<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($user_data['nev'] ?? '') ?>">
                </div>
                <div class="mb-3">
                    <label for="email">Email<span class="text-danger">*</span></label>
                    <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($user_data['email'] ?? '') ?>" <?= $is_guest ? '' : 'readonly' ?>>
                </div>
                <div class="mb-3">
                    <label for="phone">Telefonszám<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="phone" name="phone" value="<?= htmlspecialchars($user_data['telefonszam'] ?? '') ?>">
                </div>

                <div class="accordion mb-3" id="shippingAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#shippingCollapse">
                                Szállítási cím<span class="text-danger">*</span>
                            </button>
                        </h2>
                        <div id="shippingCollapse" class="accordion-collapse collapse">
                            <div class="accordion-body">
                                <label for="shipping-postal_code">Irányítószám<span class="text-danger">*</span></label>
                                <input type="text" class="form-control mb-2" id="shipping-postal_code" name="shipping-postal_code"
                                    value="<?= htmlspecialchars($user_data['szallitasi_iranyitoszam'] ?? '') ?>">

                                <label for="shipping-city">Település<span class="text-danger">*</span></label>
                                <input type="text" class="form-control mb-2" id="shipping-city" name="shipping-city"
                                    value="<?= htmlspecialchars($user_data['szallitasi_telepules'] ?? '') ?>">

                                <label for="shipping-address">Utca, házszám<span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="shipping-address" name="shipping-address"
                                    value="<?= htmlspecialchars($user_data['szallitasi_utca_hazszam'] ?? '') ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <label class="form-check mb-3" for="same-as-shipping" style="cursor: pointer;">
                    <input class="form-check-input" type="checkbox" id="same-as-shipping" style="pointer-events: none;">
                    <span class="form-check-label">Számlázási cím megegyezik a szállítási címmel</span>
                </label>

                <div class="accordion" id="billingAccordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#billingCollapse" aria-expanded="false">
                                Számlázási cím<span class="text-danger">*</span>
                            </button>
                        </h2>
                        <div id="billingCollapse" class="accordion-collapse collapse" aria-expanded="false">
                            <div class="accordion-body">
                                <label for="billing-postal_code">Irányítószám<span class="text-danger">*</span></label>
                                <input type="text" class="form-control mb-2" id="billing-postal_code" name="billing-postal_code"
                                    value="<?= htmlspecialchars($user_data['szamlazasi_iranyitoszam'] ?? '') ?>">

                                <label for="billing-city">Település<span class="text-danger">*</span></label>
                                <input type="text" class="form-control mb-2" id="billing-city" name="billing-city"
                                    value="<?= htmlspecialchars($user_data['szamlazasi_telepules'] ?? '') ?>">

                                <label for="billing-address">Utca, házszám<span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="billing-address" name="billing-address"
                                    value="<?= htmlspecialchars($user_data['szamlazasi_utca_hazszam'] ?? '') ?>">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-3 mt-3">
                    <label class="form-label">Fizetési mód<span class="text-danger">*</span></label>
                    <label class="form-check" for="payment-card" style="cursor: pointer;">
                        <input class="form-check-input" type="radio" name="payment-method" id="payment-card" value="Bankkártyás fizetés" style="pointer-events: none;" checked>
                        <span class="form-check-label">Bankkártyás fizetés</span>
                    </label>
                    <label class="form-check" for="payment-cash" style="cursor: pointer;">
                        <input class="form-check-input" type="radio" name="payment-method" id="payment-cash" value="Utánvét (készpénz)" style="pointer-events: none;">
                        <span class="form-check-label">Utánvét (készpénz)</span>
                    </label>
                    <label class="form-check" for="payment-transfer" style="cursor: pointer;">
                        <input class="form-check-input" type="radio" name="payment-method" id="payment-transfer" value="Banki átutalás" style="pointer-events: none;">
                        <span class="form-check-label">Banki átutalás</span>
                    </label>
                </div>

                <button type="button" class="btn btn-primary w-100 mt-3" id="place-order-btn">Megrendelés leadása</button>
            </form>
        </div>
    </div>

    <div id="loading-overlay">
        <div class="spinner"></div>
        <p>Kérjük várjon...</p>
    </div>

    <div id="cart-items-data" style="display: none;"><?= htmlspecialchars(json_encode($cart_items)) ?></div>
    <div id="total-price-data" style="display: none;"><?= htmlspecialchars($total) ?></div>
    <div id="is-guest-data" style="display: none;"><?= htmlspecialchars(json_encode($is_guest)) ?></div>

    <div class="modal fade" id="guestModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Fiók létrehozása</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Szeretné elmenteni adatait a későbbi vásárlásokhoz?</p>
                    <div id="password-alert"></div>
                    <div class="mb-2 position-relative">
                        <label for="modal-password">Jelszó</label>
                        <input type="password" class="form-control" id="modal-password" placeholder="Jelszó">
                        <img src="../img/caps_on.png" id="caps-icon-modal-1" class="caps-lock-icon" alt="Caps Lock aktív">
                    </div>
                    <div class="mb-2 position-relative">
                        <label for="modal-password-confirm">Jelszó újra</label>
                        <input type="password" class="form-control" id="modal-password-confirm" placeholder="Jelszó újra">
                        <img src="../img/caps_on.png" id="caps-icon-modal-2" class="caps-lock-icon" alt="Caps Lock aktív">
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

    <div class="modal fade" id="orderSuccessModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                    <button type="button" class="ok-gomb btn btn-primary" data-bs-dismiss="modal" onclick="window.location.href='termekek.php'">Ok</button>
                </div>
            </div>
        </div>
    </div>

    <?php
    ob_end_flush();
    ?>
</body>

</html>