<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Termékfelvitel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <script defer src="../js/felvitel.js"></script>
</head>

<body class="min-vh-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="./index.php">Főoldal</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="./admin.php" id="products-link">Termékek</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="./admin_felvitel.php" id="add-product-link">Felvitel</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./felhasznalo_kezeles.php" id="user-link">Felhasználók</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./megrendeles_kezeles.php" id="order-link">Megrendelések</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="d-flex">
        <div class="container  my-2">
            <h2 class="mb-4">Termékek felvitele</h2>
            <form method="post" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="productName" class="form-label">Termék neve</label>
                    <input type="text" id="nev" class="form-control" name="productName" required>
                </div>

                <div class="mb-3">
                    <label for="productCode" class="form-label">Cikkszám</label>
                    <input type="text" id="cikkszam" class="form-control" name="productCode" required>
                </div>

                <div class="mb-3">
                    <label for="productDescription" class="form-label">Leírás</label>
                    <textarea class="form-control" id="leiras" name="productDescription" rows="3" required></textarea>
                </div>

                <div class="mb-3">
                    <label for="productType" class="form-label">Gyártó</label>
                    <select class="form-select" id="gyarto_id" name="productType">
                        <option value="">Válassz gyártót...</option>
                        <?php
                        include './sql_fuggvenyek.php';
                        $leker_gyarto = "SELECT nev, id FROM `gyarto` WHERE 1";
                        $eredmeny_gyarto = adatokLekerdezese($leker_gyarto);
                        if (is_array($eredmeny_gyarto)) {
                            foreach ($eredmeny_gyarto as $er) {
                                echo '<option value="' . $er['id'] . '">' . $er["nev"] . '</option>';
                            }
                        } else {
                            return $eredmeny_gyarto;
                        }
                        ?>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="productCategory" class="form-label">Kategória</label>
                    <select class="form-select" id="kategoria_id" name="productCategory" required>
                        <option value="">Válassz kategóriát...</option>
                        <?php
                        $leker = "SELECT nev, id FROM `kategoria` WHERE 1";
                        $eredmeny = adatokLekerdezese($leker);
                        if (is_array($eredmeny)) {
                            foreach ($eredmeny as $e) {
                                echo '<option value="' . $e['id'] . '">' . $e["nev"] . '</option>';
                            }
                        } else {
                            return $eredmeny;
                        }
                        ?>
                    </select>
                </div>

                <div class="mb-3">
                    <label for="productPrice" class="form-label">Ár (Ft)</label>
                    <input type="number" id="egysegar" class="form-control" name="productPrice" required>
                </div>

                <div class="mb-3">
                    <label for="productImages" class="form-label">Termék képek</label>
                    <input type="file" class="form-control" name="productImages[]" id="productImages" multiple accept="image/*">
                </div>

                <button type="submit" id="felvitel_button" class="btn btn-primary" name="felvitel"><img src="../img/folder.png" alt="Felvitel" width="30"></button>
            </form>

        </div>
        <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>

    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>