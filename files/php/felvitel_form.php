<form enctype="multipart/form-data">
    <div class="mb-3">
        <label for="cikkszam" class="form-label">Cikkszám:</label>
        <input type="text" id="cikkszam" name="cikkszam" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="nev" class="form-label">Terméknév:</label>
        <input type="text" id="nev" name="nev" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="egysegar" class="form-label">Egységár (Ft):</label>
        <input type="number" id="egysegar" name="egysegar" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="leiras" class="form-label">Leírás</label>
        <textarea class="form-control" id="leiras" name="productDescription" rows="3" required readonly></textarea>
    </div>
    <div class="mb-3">
        <label for="kategoria_id" class="form-label">Kategória:</label>
        <select id="kategoria_id" name="kategoria_id" class="form-select" required>
            <?php
            include './sql_fuggvenyek.php';
            $kategoriak = lekerKategoria();
            foreach ($kategoriak as $kategoria) {
                echo "<option value='{$kategoria['id']}'>{$kategoria['nev']}</option>";
            }
            ?>
        </select>
    </div>
    <div class="mb-3">
        <label for="gyarto_id" class="form-label">Gyártó:</label>
        <select id="gyarto_id" name="gyarto_id" class="form-select" required>
            <?php
            $gyartok = lekerGyarto();
            foreach ($gyartok as $gyarto) {
                echo "<option value='{$gyarto['id']}'>{$gyarto['nev']}</option>";
            }
            ?>
        </select>
    </div>
    <div class="mb-3">
        <label for="productImages" class="form-label">Képek feltöltése:</label>
        <input type="file" id="productImages" name="productImages[]" class="form-control" accept="image/*" multiple>
    </div>
    <button type="submit" class="btn btn-success" id="felvitel_button">Termék felvitele</button>
</form>
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