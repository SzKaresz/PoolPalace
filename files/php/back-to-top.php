<a id="back-to-top" href="#" class="btn btn-light btn-lg back-to-top" role="button" style="position: fixed; bottom: 25px; right: 25px; border: 1px solid #293144;">
    <i class="bi bi-arrow-up"></i>
</a>
<script>
    document.getElementById("back-to-top").hidden = true;

    window.onscroll = function () {
        let eddig = document.documentElement.scrollTop;
        document.getElementById("back-to-top").hidden = eddig < 125;
    };
</script>