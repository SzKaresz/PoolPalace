<?php
ob_start();
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
    <link rel="stylesheet" href="../css/termekek.css">
    <link rel="icon" href="../img/logo_icon.ico" type="image/x-icon">
    <title>PoolPalace - Termékek</title>
    <script defer src="../js/dualslider.js"></script>
    <script defer src="../js/termekek.js"></script>
</head>

<body>
    <?php include './navbar.php'; ?>
    <div id="kontener" class="container-fluid">
        <div id="termekek-container">
            <!-- Szűrőpanel -->
            <div id="szuro-container">
                <div class="szurofejlec">
                    <div class="fejlec_szoveg">
                        <h4>Szűrés</h4>
                    </div>
                    <div id="szuro_kep">
                        <img style="height: 20px;" src="../img/filter.png" alt="Szűrő ikon">
                    </div>
                </div>
                <div class="szuroContent">
                    <a href="javascript:void(0)" id="clear-filters" class="clear-filters-link">Paraméterek törlése</a>
                    <form id="szures_form" method="post">
                        <div class="szuroSector kategoriak">
                            <div id="kategoriak"></div>
                        </div>
                        <div class="szuroSector gyartok">
                            <div id="gyartok"></div>
                        </div>
                        <div class="szuroSector ar">
                            <div id="ar">
                                <h6>Ár</h6>
                                <div class="range_container">
                                    <div class="sliders_control">
                                        <input id="fromSlider" type="range" value="0" min="0" max="5000000" />
                                        <input id="toSlider" type="range" value="5000000" min="0" max="5000000" />
                                    </div>
                                    <div class="form_control">
                                        <div class="form_control_container">
                                            <div class="form_control_container__time">Min</div>
                                            <input class="form_control_container__time__input" type="number" id="fromInput" value="0" min="0" max="5000000">
                                        </div>
                                        <div class="form_control_container">
                                            <div class="form_control_container__time">Max</div>
                                            <input class="form_control_container__time__input" type="number" id="toInput" value="5000000" min="0" max="5000000">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="szuroSector">
                            <input type="button" value="Szűrés" id="szures_button">
                        </div>
                    </form>
                </div>
            </div>

            <!-- Termékkártyák -->
            <div id="kartyak-container">
                <div id="fejlec-container">
                    <div id="talalatok">
                        Találatok: <span id="talalatok-szam">0</span> termék
                    </div>
                    <div id="fejlec-rendezes">
                        <button id="szures-button" class="btn btn-dark">Szűrők elrejtése</button>
                        <div class="dropdown">
                            <button id="dropdown-button" class="btn btn-secondary dropdown-toggle" type="button" aria-expanded="false" onclick="toggleDropdown()">
                                Rendezés
                            </button>
                            <ul id="dropdown-options" class="dropdown-menu dropdown-products">
                                <li data-sort="kiemelt">Kiemelt</li>
                                <li data-sort="ar-novekvo">Ár növekvő</li>
                                <li data-sort="ar-csokkeno">Ár csökkenő</li>
                                <li data-sort="nev-az">Név A-Z</li>
                                <li data-sort="nev-za">Név Z-A</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id="kartyak"></div>
                <div class="pagination-container">
                    <div class="pagination-side pagination-left">
                        <button>«</button>
                        <button><</button>
                    </div>

                    <div class="pagination-center"></div>

                    <div class="pagination-side pagination-right">
                        <button>></button>
                        <button>»</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include './back-to-top.php'; ?>
    <?php include './footer.php'; ?>
    <?php
    ob_end_flush();
    ?>
</body>

</html>