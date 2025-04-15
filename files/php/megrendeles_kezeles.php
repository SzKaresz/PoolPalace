<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Megrendelések kezelés</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">   
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <script defer src="../js/rendelesek.js"></script>
</head>

<body>
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
                        <a class="nav-link" href="./admin_felvitel.php" id="add-product-link">Felvitel</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./felhasznalo_kezeles.php" id="user-link">Felhasználók</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="./megrendeles_kezeles.php" id="order-link">Megrendelések</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div id="loading-overlay">
        <div class="spinner"></div>
        <p>Kérjük várjon...</p>
    </div>

    <div id="tartalom" class="m-4">
    <ul class="nav nav-tabs" id="rendelesTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="osszes-tab" data-bs-toggle="tab" data-bs-target="#osszes" type="button" role="tab" aria-controls="osszes" aria-selected="true">Összes</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="feldolgozas-tab" data-bs-toggle="tab" data-bs-target="#feldolgozas" type="button" role="tab" aria-controls="feldolgozas" aria-selected="false">Feldolgozás alatt</button>
        </li>
        <li class="nav-item" role="presentation">
             <button class="nav-link" id="fizetesre-var-tab" data-bs-toggle="tab" data-bs-target="#fizetesre-var" type="button" role="tab" aria-controls="fizetesre-var" aria-selected="false">Fizetésre vár</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="fizetve-tab" data-bs-toggle="tab" data-bs-target="#fizetve" type="button" role="tab" aria-controls="fizetve" aria-selected="false">Fizetve</button>
        </li>
         <li class="nav-item" role="presentation">
            <button class="nav-link" id="szallitas-alatt-tab" data-bs-toggle="tab" data-bs-target="#szallitas-alatt" type="button" role="tab" aria-controls="szallitas-alatt" aria-selected="false">Szállítás alatt</button>
        </li>
         <li class="nav-item" role="presentation">
            <button class="nav-link" id="teljesitve-tab" data-bs-toggle="tab" data-bs-target="#teljesitve" type="button" role="tab" aria-controls="teljesitve" aria-selected="false">Teljesítve</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="torolve-tab" data-bs-toggle="tab" data-bs-target="#torolve" type="button" role="tab" aria-controls="torolve" aria-selected="false">Törölve</button>
        </li>
    </ul>
    <div class="tab-content" id="rendelesTabContent">
        <div class="tab-pane fade show active" id="osszes" role="tabpanel" aria-labelledby="osszes-tab"></div>
        <div class="tab-pane fade" id="feldolgozas" role="tabpanel" aria-labelledby="feldolgozas-tab"></div>
        <div class="tab-pane fade" id="fizetesre-var" role="tabpanel" aria-labelledby="fizetesre-var-tab"></div>
        <div class="tab-pane fade" id="fizetve" role="tabpanel" aria-labelledby="fizetve-tab"></div>
         <div class="tab-pane fade" id="szallitas-alatt" role="tabpanel" aria-labelledby="szallitas-alatt-tab"></div>
         <div class="tab-pane fade" id="teljesitve" role="tabpanel" aria-labelledby="teljesitve-tab"></div>
         <div class="tab-pane fade" id="torolve" role="tabpanel" aria-labelledby="torolve-tab"></div>
    </div>
</div>
    <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>
    <div class="modal fade" id="torlesModal" tabindex="-1" aria-labelledby="torlesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="torlesModalLabel">Megerősítés</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    Biztosan törölni szeretnéd ezt a rendelést?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="megerositesTorles">Törlés</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="termektorlesModal" tabindex="-1" aria-labelledby="torlesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="torlesModalLabel">Megerősítés</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    Biztosan törölni szeretnéd a(z) <span id="cikkszam_torol"></span> cikkszámú terméket? Ha kitörlöd a terméket a rendelés automatikusan törlődni fog!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="termekmegerositesTorles">Törlés</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="termekModal" tabindex="-1" aria-labelledby="torlesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="torlesModalLabel">Megerősítés</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    Biztosan törölni szeretnéd a(z) <span id="cikkszam_torol2"></span> cikkszámú terméket?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="termekTorles">Törlés</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>