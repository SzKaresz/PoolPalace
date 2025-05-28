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

    <div class="container mt-4">
        <ul class="nav nav-tabs" id="felvitelTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="termek-tab" data-bs-toggle="tab" data-bs-target="#termek" type="button" role="tab" aria-controls="termek" aria-selected="true">Termék</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="kategoria-tab" data-bs-toggle="tab" data-bs-target="#kategoria" type="button" role="tab" aria-controls="kategoria" aria-selected="false">Kategória</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="gyarto-tab" data-bs-toggle="tab" data-bs-target="#gyarto" type="button" role="tab" aria-controls="gyarto" aria-selected="false">Gyártó</button>
            </li>
        </ul>

        <div class="tab-content" id="felvitelTabsContent">
            <div class="tab-pane fade show active" id="termek" role="tabpanel" aria-labelledby="termek-tab">
                <?php include './felvitel_form.php'; ?>
                <div class="tab-pane fade" id="kategoria" role="tabpanel" aria-labelledby="kategoria-tab">
                    <form id="kategoriaForm" method="POST" action="../php/kategoria_felvitel.php">
                        <div class="mb-3">
                            <label for="uj_kategoria" class="form-label">Új kategória neve:</label>
                            <input type="text" name="uj_kategoria" id="uj_kategoria" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary">Kategória hozzáadása</button>
                    </form>
                </div>
    
                <div class="tab-pane fade" id="gyarto" role="tabpanel" aria-labelledby="gyarto-tab">
                    <form id="gyartoForm" method="POST" action="../php/gyarto_felvitel.php">
                        <div class="mb-3">
                            <label for="uj_gyarto" class="form-label">Új gyártó neve:</label>
                            <input type="text" name="uj_gyarto" id="uj_gyarto" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary">Gyártó hozzáadása</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>