document.addEventListener('DOMContentLoaded', function () {
    const productContainer = document.querySelector('.add-to-cart-section');
    const carouselElement = document.getElementById('productCarousel');

    const quantityInput = productContainer?.querySelector('.quantity-input');
    const minusBtn = productContainer?.querySelector('.quantity-btn.minus');
    const plusBtn = productContainer?.querySelector('.quantity-btn.plus');
    const addToCartBtn = productContainer?.querySelector('.add-to-cart');

    let cikkszam = null;
    let maxStock = 1;
    let quantityInCart = 0;

    if (productContainer) {
        cikkszam = productContainer.dataset.cikkszam;
        maxStock = parseInt(productContainer.dataset.maxKeszlet || '1');
        quantityInCart = parseInt(productContainer.dataset.inCartQuantity || '0');
    } else {
        setupCarousel();
        updateCartCountOnLoad();
        return;
    }

    if (quantityInput && minusBtn && plusBtn && addToCartBtn && cikkszam) {

        function updateQuantityButtons() {
            try {
                const currentValue = parseInt(quantityInput.value);
                if (minusBtn) minusBtn.disabled = currentValue <= 1;
                if (plusBtn) plusBtn.disabled = currentValue >= maxStock;
            } catch (e) {
                console.error("Hiba a gombok frissítésekor:", e);
            }
        }

        function handleCounterChange(change) {
            let currentValue = parseInt(quantityInput.value);
            if (isNaN(currentValue)) currentValue = 1;
            let newValue = currentValue + change;

            if (newValue < 1) newValue = 1;
            else if (newValue > maxStock) newValue = maxStock;

            quantityInput.value = newValue;
            updateQuantityButtons();
        }

        function handleManualInputChange() {
            let currentValue = parseInt(quantityInput.value);
            if (isNaN(currentValue) || currentValue < 1) currentValue = 1;
            else if (currentValue > maxStock) currentValue = maxStock;

            quantityInput.value = currentValue;
            updateQuantityButtons();
        }

        function handleAddToCart(event) {
            const quantityToAdd = parseInt(quantityInput.value);
            if (isNaN(quantityToAdd) || quantityToAdd < 1) {
                showToast("Kérjük, adjon meg érvényes mennyiséget (legalább 1).", "warning");
                quantityInput.value = 1;
                updateQuantityButtons();
                return;
            }

            quantityInCart = parseInt(productContainer.dataset.inCartQuantity || '0');

            if ((quantityInCart + quantityToAdd) > maxStock) {
                const availableToAdd = maxStock - quantityInCart;
                let message = `Sajnos csak ${maxStock} db van raktáron. `;
                if (quantityInCart > 0) message += `Jelenleg ${quantityInCart} db van a kosaradban. `;
                message += availableToAdd > 0 ? `Maximum ${availableToAdd} db-ot tudsz hozzáadni.` : `Nem tudsz többet hozzáadni.`;
                showToast(message, "warning");
                quantityInput.value = Math.max(1, availableToAdd);
                updateQuantityButtons();
                return;
            }

            addToCartBtn.disabled = true;
            addToCartBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Feldolgozás...`;

            fetch("../php/kosarMuvelet.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    action: "add",
                    termek_id: cikkszam,
                    mennyiseg: quantityToAdd
                })
            })
                .then(res => {
                    if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
                    return res.json();
                })
                .then(data => {
                    if (data && data.success) {
                        updateCartCount();
                        if (typeof animateToCart === 'function') animateToCart(event);

                        quantityInput.value = 1;
                        updateQuantityButtons();

                        if (typeof data.uj_kosar_mennyiseg_termek !== "undefined") {
                            productContainer.dataset.inCartQuantity = data.uj_kosar_mennyiseg_termek;
                        } else {
                            productContainer.dataset.inCartQuantity = quantityInCart + quantityToAdd;
                        }

                    } else {
                        showToast(data?.error || "Nem sikerült a terméket kosárba tenni.", "danger");
                    }
                })
                .catch(error => {
                    console.error("Hiba a kosárba helyezéskor:", error);
                    showToast("Hálózati hiba vagy szerverhiba történt a kosárba helyezéskor.", "danger");
                })
                .finally(() => {
                    addToCartBtn.disabled = false;
                    addToCartBtn.innerHTML = `<img src="../img/cart.png" class="cart-icon-img" alt="Kosár"> Kosárba`;
                });
        }

        plusBtn.addEventListener('click', () => handleCounterChange(1));
        minusBtn.addEventListener('click', () => handleCounterChange(-1));
        quantityInput.addEventListener('change', handleManualInputChange);
        quantityInput.addEventListener('blur', handleManualInputChange);
        quantityInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                handleManualInputChange();
                quantityInput.blur();
            }
        });
        addToCartBtn.addEventListener('click', handleAddToCart);

        function initializeQuantity() {
            fetch("../php/kosarMuvelet.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ action: "getCart" })
            })
                .then(res => {
                    if (!res.ok) { throw new Error(`HTTP error! status: ${res.status}`); }
                    return res.json();
                })
                .then(data => {
                    let actualInCart = 0;
                    if (data.success && Array.isArray(data.kosar)) {
                        const foundItem = data.kosar.find(item => item.termek_id === cikkszam);
                        if (foundItem) {
                            actualInCart = parseInt(foundItem.darabszam || '0');
                        }
                    } else if (data.success === false) {
                        console.log("Kosár lekérése sikertelen (pl. nincs bejelentkezve?), inicializálás 0-val.");
                        actualInCart = 0;
                    } else {
                        console.warn("Váratlan válasz a kosár lekérésekor, inicializálás 0-val.");
                        actualInCart = 0;
                    }
                    productContainer.dataset.inCartQuantity = actualInCart;

                    quantityInput.value = 1;
                    updateQuantityButtons();
                })
                .catch(error => {
                    console.error("Hiba a kosár tartalmának kezdeti lekérésekor:", error);
                    quantityInput.value = 1;
                    updateQuantityButtons();
                });
        }

        initializeQuantity();

    } else {

    }

    function setupCarousel() {
        if (carouselElement) {
            const thumbnails = document.querySelectorAll('.thumbnail-item');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function () {
                    document.querySelector('.thumbnail-item.active')?.classList.remove('active');
                    this.classList.add('active');
                });
            });

            carouselElement.addEventListener('slid.bs.carousel', event => {
                const activeIndex = event.to;
                document.querySelector('.thumbnail-item.active')?.classList.remove('active');
                const activeThumbnail = document.querySelector(`.thumbnail-item[data-bs-slide-to="${activeIndex}"]`);
                if (activeThumbnail) {
                    activeThumbnail.classList.add('active');
                }
            });
        }
    }
    setupCarousel();

    function updateCartCountOnLoad() {
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
    }
    updateCartCountOnLoad();

    const imageZoomModalElement = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const productCarouselElement = document.getElementById('productCarousel');
    const modalBody = imageZoomModalElement ? imageZoomModalElement.querySelector('.modal-body') : null;

    let imageZoomModalInstance = null;
    if (imageZoomModalElement) {
        imageZoomModalInstance = new bootstrap.Modal(imageZoomModalElement);
    }

    let isDragging = false;
    let startX, startY;
    let initialImageX = 0;
    let initialImageY = 0;
    let currentX = 0;
    let currentY = 0;

    if (productCarouselElement && zoomedImage && imageZoomModalInstance) {
        productCarouselElement.addEventListener('click', function (event) {
            const activeItem = productCarouselElement.querySelector('.carousel-item.active');
            if (!activeItem) return;

            const clickedImage = event.target.closest('.zoomable-image');

            if (clickedImage && activeItem.contains(clickedImage)) {
                event.preventDefault();
                zoomedImage.style.transform = 'translate(0px, 0px)';
                initialImageX = 0;
                initialImageY = 0;
                currentX = 0;
                currentY = 0;
                zoomedImage.src = clickedImage.src;
                imageZoomModalInstance.show();
            }
        });
    }

    if (modalBody && zoomedImage) {
        modalBody.addEventListener('mousedown', (e) => {
            if (zoomedImage.offsetWidth > modalBody.clientWidth || zoomedImage.offsetHeight > modalBody.clientHeight) {
                isDragging = true;
                startX = e.pageX;
                startY = e.pageY;
                initialImageX = currentX;
                initialImageY = currentY;
                modalBody.classList.add('zoomed-image-dragging');
                e.preventDefault();
            }
        });

        modalBody.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.pageX - startX;
            const dy = e.pageY - startY;

            currentX = initialImageX + dx;
            currentY = initialImageY + dy;

            const imageWidth = zoomedImage.offsetWidth;
            const imageHeight = zoomedImage.offsetHeight;
            const bodyWidth = modalBody.clientWidth;
            const bodyHeight = modalBody.clientHeight;

            const maxX = imageWidth > bodyWidth ? (imageWidth - bodyWidth) / 2 : 0;
            const minX = imageWidth > bodyWidth ? -(imageWidth - bodyWidth) / 2 : 0;
            const maxY = imageHeight > bodyHeight ? (imageHeight - bodyHeight) / 2 : 0;
            const minY = imageHeight > bodyHeight ? -(imageHeight - bodyHeight) / 2 : 0;

            currentX = Math.max(minX, Math.min(maxX, currentX));
            currentY = Math.max(minY, Math.min(maxY, currentY));

            zoomedImage.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        modalBody.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                modalBody.classList.remove('zoomed-image-dragging');
            }
        });

        modalBody.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                modalBody.classList.remove('zoomed-image-dragging');
            }
        });
    }

    if (imageZoomModalElement) {
        imageZoomModalElement.addEventListener('hidden.bs.modal', () => {
            isDragging = false;
            if (modalBody) modalBody.classList.remove('zoomed-image-dragging');
            if (zoomedImage) zoomedImage.style.transform = 'translate(0px, 0px)';
            initialImageX = 0;
            initialImageY = 0;
            currentX = 0;
            currentY = 0;
        });
    }

});

function getProductImageForAnimation() {
    const firstThumbnail = document.querySelector(".carousel-thumbnails .thumbnail-item");
    if (firstThumbnail) {
        return firstThumbnail;
    }

    const firstCarouselImage = document.querySelector("#productCarousel .carousel-item img");
    if (firstCarouselImage) {
        return firstCarouselImage;
    }

    console.warn("Nem található kép az animációhoz.");
    return null;
}

function showToast(message, type = "danger") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        console.error("Toast container elem (#toast-container) nem található a DOM-ban!");
        return;
    }

    const maxToastCount = 3;
    const currentToasts = toastContainer.querySelectorAll(".toast");
    if (currentToasts.length >= maxToastCount) {
        currentToasts[0].remove();
    }

    let toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    try {
        const toastInstance = new bootstrap.Toast(toast, { delay: 5000, autohide: true });
        toastInstance.show();
    } catch (e) {
        console.error("Bootstrap Toast hiba:", e);
        setTimeout(() => toast.remove(), 5000);
    }
}

function animateToCart(event) {
    const cartIcon = document.querySelector(".cart-icon img");
    if (!cartIcon) { console.warn("Kosár ikon (.cart-icon img) nem található."); return; }

    const productImage = getProductImageForAnimation();
    if (!productImage) { console.warn("Nem található kép az animációhoz."); return; }

    const img = document.createElement("img");
    img.src = productImage.src;
    img.classList.add("floating-image");
    document.body.appendChild(img);

    const productRect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    img.style.position = "fixed";
    img.style.left = `${productRect.left}px`;
    img.style.top = `${productRect.top}px`;
    img.style.width = `${productRect.width}px`;
    img.style.height = `${productRect.height}px`;
    img.style.zIndex = "9999";
    img.style.pointerEvents = "none";
    img.style.objectFit = "contain";

    const endX = (cartRect.left + cartRect.width / 2) - (productRect.width / 2);
    const endY = (cartRect.top + cartRect.height / 2) - (productRect.height / 2);

    img.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${endX - productRect.left}px, ${endY - productRect.top}px) scale(0.2)`, opacity: 0 }
    ], {
        duration: 800, easing: "ease-in-out", fill: "forwards"
    });

    setTimeout(() => { img.remove(); }, 800);
}

function updateCartCount() {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ action: "getCount" })
    })
        .then(res => {
            if (!res.ok) { console.error(`HTTP error! status: ${res.status}`); return null; }
            return res.json();
        })
        .then(data => {
            if (data && data.success) {
                let cartCountElement = document.getElementById("cart-count");
                const count = data.uj_mennyiseg || 0;

                if (count > 0) {
                    if (!cartCountElement) {
                        const cartIcon = document.querySelector(".cart-icon");
                        if (!cartIcon) { return; }
                        cartCountElement = document.createElement("span");
                        cartCountElement.id = "cart-count";
                        cartCountElement.className = "badge rounded-pill bg-danger";
                        cartCountElement.style.position = 'absolute';
                        cartCountElement.style.top = '-5px';
                        cartCountElement.style.right = '-10px';
                        cartIcon.style.position = 'relative';
                        cartIcon.appendChild(cartCountElement);
                    }
                    cartCountElement.textContent = count;
                    cartCountElement.style.display = "inline-block";
                } else {
                    if (cartCountElement) {
                        cartCountElement.style.display = "none";
                    }
                }
            } else if (data && data.success === false) {
                let cartCountElement = document.getElementById("cart-count");
                if (cartCountElement) {
                    cartCountElement.style.display = "none";
                }
            } else {
                console.error("Érvénytelen válasz a kosárszám lekérésekor:", data);
            }
        })
        .catch(error => console.error("Hiba a kosár darabszám frissítésekor:", error));
}