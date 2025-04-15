<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Termékkezelés</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <script defer src="../js/admin.js"></script>
</head>

<body>
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
                        <a class="nav-link active" href="./admin.php" id="products-link">Termékek</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="./admin_felvitel.php" id="add-product-link">Felvitel</a>
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
    <form id="searchForm" class="search-container">
        <input type="text" name="query" id="keresomezo" placeholder="Keresés..." class="form-control" />
    </form>
    </div>

    <div id="tartalom" class="m-4"></div>


    <div class="modal fade" id="leirasModal" tabindex="-1" aria-labelledby="leirasModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="leirasModalLabel">Leírás Megtekintése/Szerkesztése</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    <textarea id="leirasTextarea" class="form-control" rows="15" readonly></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="leirasMegseBtn" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-info" id="leirasSzerkesztesBtn">Szerkesztés</button>
                    <button type="button" class="btn btn-danger d-none" id="leirasTartalomTorlesBtn">Tartalom törlése</button>
                    <button type="button" class="btn btn-primary d-none" id="leirasMenteseBtn">Mentés és bezárás</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="kepModal" tabindex="-1" aria-labelledby="kepModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="kepModalLabel">Termékképek Kezelése</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    <div id="productCarousel" class="carousel slide" data-bs-interval="false">
                        <div class="carousel-inner" id="carouselImages">
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Előző</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Következő</span>
                        </button>
                    </div>
                    <div class="d-flex justify-content-center flex-wrap gap-2 mt-3" id="carouselThumbnails">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="torlesModal" tabindex="-1" aria-labelledby="torlesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="torlesModalLabel">Termék Törlés Megerősítése</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    Biztosan törölni szeretné ezt a terméket?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="megerositesTorles">Törlés</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="kepTorlesModal" tabindex="-1" aria-labelledby="kepTorlesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="kepTorlesModalLabel">Kép Törlés Megerősítése</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    Biztosan törölni szeretné ezt a képet?
                    <p><strong id="kepTorlesFajlnev"></strong></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="megerositesKepTorles">Törlés</button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="confirmOrderDeleteModal" tabindex="-1" aria-labelledby="confirmOrderDeleteModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmOrderDeleteModalLabel">Figyelmeztetés!</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    Ez a termék szerepel legalább egy megrendelésben. A törlésével ezekből a megrendelésekből is el lesz távolítva.
                    <br><br>
                    <strong>Biztosan törölni szeretné?</strong>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="confirmOrderDeleteBtn">Törlés</button>
                </div>
            </div>
        </div>
    </div>

    <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>