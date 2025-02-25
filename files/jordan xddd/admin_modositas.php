<?php
include './sql_fuggvenyek.php';
?>
<!DOCTYPE html>
<html lang="hu">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Termékfelvitel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script defer src="../js/admin_modositas_torles.js"></script>
    <link rel="stylesheet" href="../css/admin.css">
</head>

<body class="min-vh-100 d-flex flex-column">
    <div class="d-flex">
        <div class="me-3 mt-5">
            <a href="./admin.php" class="btn btn-custom">
                <img src="../img/arrow.png" alt="Gomb képe" title="Vissza az admin oldalra">
            </a>
        </div>
        <div class="container py-5 mt-5">
            <h2 class="mb-4">Termékek módosítás/törlés</h2>
            <form method="post">
                <div class="mb-3">
                    <label for="termek_select" class="form-label">Kategóriák</label>
                    <select class="form-select" name="termek" id="kategoria_select">
                        <option value="">Válassz Kategoriát...</option>
                        <?php
                        $leker_kategoria = "SELECT id, nev FROM `kategoria`";
                        $eredmeny_kategoria = adatokLekerdezese($leker_kategoria);
                        if (is_array($eredmeny_kategoria)) {
                            foreach ($eredmeny_kategoria as $kat) {
                                echo '<option value="' . $kat['id'] . '">' . $kat["nev"] . '</option>';
                            }
                        }
                        ?>
                    </select>
                </div>

                <!-- Termék választás -->
                <div class="mb-3">
                    <label for="termek_select" class="form-label">Termék</label>
                    <select class="form-select" name="termek" id="termek_select">
                        <option value="">Válassz Terméket...</option>
                    </select>
                </div>
                <input type="button" class="btn btn-primary" value="Módosítás" name="modositas" id="modositas_gomb">
                <input type="submit" class="btn btn-primary" value="Törlés" name="torles">

                <div id="szerkeszto_form" class="mt-3"></div>

            </form>
        </div>


        <?php
        if (isset($_POST['torles'])) {
            $id = $_POST["termek"];
            $leker = "DELETE FROM `termekek` WHERE cikkszam = {$id}";
            $eredmeny = adatokValtoztatasa($leker);
        }

        ?>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>