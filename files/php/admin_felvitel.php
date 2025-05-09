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
            <a class="navbar-brand" href="./index.php"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                </svg> Kilépés a főoldalra</a>
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
                    <input type="number" id="cikkszam" class="form-control" name="productCode" required>
                </div>

                <div class="mb-3">
                    <label for="leiras" class="form-label">Leírás</label>
                    <textarea class="form-control" id="leiras" name="productDescription" rows="3" required readonly></textarea>
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
                    <input type="file" class="form-control" name="productImages[]" id="productImages" multiple accept=".webp">
                </div>

                <button type="submit" id="felvitel_button" class="btn btn-primary d-inline-flex align-items-center gap-1" name="felvitel">
                    <img src="../img/folder.png" alt="Felvitel" width="24" height="24"> Felvitel
                </button>
            </form>

        </div>
        <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>
        <div class="modal fade" id="editDescriptionModal" tabindex="-1" aria-labelledby="editDescriptionModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editDescriptionModalLabel">Leírás szerkesztése</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <textarea class="form-control" id="modalLeirasTextarea" rows="15"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelModalButton">Mégse</button>
                        <button type="button" class="btn btn-danger" id="clearModalButton">Törlés</button>
                        <button type="button" class="btn btn-primary" id="saveModalButton">Mentés</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>