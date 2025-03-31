document.addEventListener("DOMContentLoaded", function() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    const mainImage = document.getElementById("main-image");
    let currentIndex = 0;
    let intervalId;

    // Ha csak 1 kép van, nem kell sem automatikus, sem kézi váltás
    if (thumbnails.length <= 1) return;

    function showImage(index) {
        const selected = thumbnails[index];
        if (!selected) return;

        const container = document.querySelector(".main-image-container");
        const currentImage = container.querySelector("img");

        // Új kép (jobbról érkezik)
        const newImage = document.createElement("img");
        newImage.src = selected.src;
        newImage.style.left = "100%";
        container.appendChild(newImage);

        // Régi kép (marad a helyén egy pillanatig)
        if (currentImage) {
            currentImage.style.left = "0";
        }

        // Animáció indítása következő tick-ben
        setTimeout(() => {
            newImage.style.left = "0";
            if (currentImage) {
                currentImage.style.transition = "left 0.5s ease";
                currentImage.style.left = "-100%";
            }
        }, 20);

        // Takarítás animáció után
        setTimeout(() => {
            if (currentImage) currentImage.remove();
            newImage.id = "main-image";
        }, 500);

        // Aktív bélyegkép frissítése
        thumbnails.forEach(t => t.classList.remove("active"));
        selected.classList.add("active");
        currentIndex = index;
    }

    // Manuális váltás
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            showImage(index);
            resetInterval();
        });
    });

    function startAutoSlide() {
        intervalId = setInterval(() => {
            let nextIndex = (currentIndex + 1) % thumbnails.length;
            showImage(nextIndex);
        }, 3000);
    }

    function resetInterval() {
        clearInterval(intervalId);
        startAutoSlide();
    }

    startAutoSlide();
});