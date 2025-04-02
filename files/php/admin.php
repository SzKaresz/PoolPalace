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
            <a class="navbar-brand" href="./index.php">Főoldal</a>
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


    <div class="modal fade" id="kepModal" tabindex="-1" aria-labelledby="kepModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" style="max-width: 70%">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="kepModalLabel">Termék képei</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                    <!-- Carousel container -->
                    <div id="productCarousel" class="carousel slide mb-3 mx-auto" data-bs-ride="false" data-bs-interval="false" style="max-width: 70%">
                        <div class="carousel-inner bg-light rounded border" id="carouselImages">
                            <!-- Itt töltődnek be a képek dinamikusan -->
                        </div>

                        <!-- Ha több kép van, akkor a vezérlők megjelennek -->
                        <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Előző</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Következő</span>
                        </button>

                        <!-- Bélyegképek -->
                        <div class="carousel-thumbnails d-flex flex-wrap justify-content-center gap-2" id="carouselThumbnails">
                            <!-- Bélyegképek ide kerülnek -->
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezárás</button>
                </div>
            </div>
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
                    Biztosan törölni szeretnéd ezt a terméket?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Mégse</button>
                    <button type="button" class="btn btn-danger" id="megerositesTorles">Törlés</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>