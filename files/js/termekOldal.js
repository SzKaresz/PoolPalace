document.addEventListener('DOMContentLoaded', function () {
    const productContainer = document.querySelector('.add-to-cart-section');
    const carouselElement = document.getElementById('productCarousel');
    const quantityInput = productContainer.querySelector('.quantity-input');
    const minusBtn = productContainer.querySelector('.quantity-btn.minus');
    const plusBtn = productContainer.querySelector('.quantity-btn.plus');
    const addToCartBtn = productContainer.querySelector('.add-to-cart');
    const cikkszam = productContainer?.dataset.cikkszam;
    const maxStock = parseInt(productContainer?.dataset.maxKeszlet || '1');

    function updateQuantityButtons(value) {
        minusBtn.disabled = value <= 1;
        plusBtn.disabled = value >= maxStock;
    }

    function animateAndSend(change, event = null) {
        let currentVal = parseInt(quantityInput.value);
        if (isNaN(currentVal) || currentVal < 0) currentVal = 0;
        let newVal = currentVal + change;

        if (newVal < 1) {
            newVal = 1;
        } else if (newVal > maxStock) {
            newVal = maxStock;
        }

        quantityInput.value = newVal;
        updateQuantityButtons(newVal);

        // Küldés a backendre
        fetch("../php/kosarMuvelet.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "update",
                termek_id: cikkszam,
                mennyiseg: newVal
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    updateCartCount();

                    if (change > 0 && event) {
                        animateToCart(event);
                    }
                    if (change < 0 && event) {
                        animateFromCart(document.querySelector('.product-main-image'));
                    }
                } else {
                    showToast(data.error || "Hiba történt frissítéskor.");
                }
            });
    }

    plusBtn.addEventListener('click', function (event) {
        animateAndSend(+1, event);
    });

    minusBtn.addEventListener('click', function (event) {
        animateAndSend(-1, event);
    });

    function handleQuantityChange() {
        let val = parseInt(quantityInput.value);
        if (isNaN(val) || val < 0) val = 0;
        if (val > maxStock) val = maxStock;
        quantityInput.value = val;

        const action = val === 0 ? "remove" : "update";

        fetch("../php/kosarMuvelet.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action,
                termek_id: cikkszam,
                mennyiseg: val
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    updateCartCount();
                    updateQuantityButtons(val);
                } else {
                    showToast(data.error || "Nem sikerült frissíteni.");
                }
            });
    }

    quantityInput.addEventListener("blur", handleQuantityChange);
    quantityInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            handleQuantityChange();
            quantityInput.blur(); // így biztosan lefut a blur is
        }
    });

    // 2️⃣ Kosárba gomb frissítés: input mezőt is állítsuk a válasz alapján
    addToCartBtn.addEventListener('click', function (event) {
        fetch("../php/kosarMuvelet.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "add", // most már minden alkalommal 1 db-ot adunk hozzá
                termek_id: cikkszam,
                mennyiseg: 1
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (typeof data.uj_mennyiseg !== "undefined") {
                        quantityInput.value = data.uj_mennyiseg;
                        updateQuantityButtons(data.uj_mennyiseg);
                    }
                    updateCartCount();
                    animateToCart(event);
                } else {
                    showToast(data.error || "Nem sikerült kosárba tenni.");
                }
            });
    });

    updateQuantityButtons(parseInt(quantityInput.value));

    // Thumbnail klikk és carousel csúszás figyelése az aktív class frissítéséhez
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
    } // end if(carouselElement)

    const carouselEl = document.getElementById('productCarousel');
    if (carouselEl) {
        const carousel = new bootstrap.Carousel(carouselEl, {
            interval: false,
            ride: false
        });

        // Első léptetés
        setTimeout(() => {
            carousel.next();

            // Majd 4 másodpercenként újra léptetjük manuálisan
            setInterval(() => {
                carousel.next();
            }, 4000);
        }, 1000);
    }

    // 1️⃣ Betöltéskor lekérjük, van-e a kosárban már ez a termék
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "getItem",
            termek_id: cikkszam
        })
    })
        .then(res => res.json())
        .then(data => {
            let aktualisMennyiseg = 0;
            if (data.success && data.uj_mennyiseg > 0) {
                aktualisMennyiseg = data.uj_mennyiseg;
            }
            quantityInput.value = aktualisMennyiseg;
            updateQuantityButtons(aktualisMennyiseg);
        });
});

// kosar_funkciok.js (vagy a te fájlod neve)

// Toast Üzenet Megjelenítése
function showToast(message, type = "danger") {
    let toastContainer = document.getElementById("toast-container");
    // Ha nincs konténer, létrehozzuk (bár a HTML-ben már ott kellene lennie)
    if (!toastContainer) {
        console.warn("Toast container not found, creating one.");
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        // Stílusokat CSS-ben kell megadni!
        document.body.appendChild(toastContainer);
    }

    // Egyszerre max 3 toast (opcionális)
    const maxToastCount = 3;
    const currentToasts = toastContainer.querySelectorAll(".toast");
    if (currentToasts.length >= maxToastCount) {
        currentToasts[0].remove(); // Legrégebbit távolítja el
    }

    let toast = document.createElement("div");
    // Bootstrap 5 toast struktúra
    toast.className = `toast align-items-center text-bg-${type} border-0 show`; // show class kell az azonnali megjelenéshez, ha nem triggereli a JS
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.setAttribute("data-bs-autohide", "true"); // Automatikusan eltűnik
    toast.setAttribute("data-bs-delay", "5000"); // 5 másodperc múlva (állítható)

    toast.innerHTML = `
<div class="d-flex">
    <div class="toast-body">${message}</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
</div>
`;

    toastContainer.prepend(toast); // Új toast kerüljön felülre

    // Bootstrap Toast inicializálása (ha még nem lenne 'show' class és manuálisan kellene)
    // const toastInstance = new bootstrap.Toast(toast);
    // toastInstance.show();

    // Eltávolítás az animáció után (ha data-bs-autohide false lenne vagy biztosra akarunk menni)
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

// Animáció a kosárhoz
function animateToCart(event) {
    const cartIcon = document.querySelector(".cart-icon img");
    if (!cartIcon) return;

    const productImage = document.querySelector(".carousel-thumbnails .thumbnail-item");

    if (!productImage) {
        console.warn("Nem található thumbnail kép az animációhoz.");
        return;
    }

    const img = document.createElement("img");
    img.src = productImage.src;
    img.classList.add("floating-image");
    img.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
    img.style.borderRadius = "8px";
    img.style.transition = "transform 1.2s ease, opacity 1.2s ease";
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

    const deltaX = (cartRect.left + cartRect.width / 2) - (productRect.left + productRect.width / 2);
    const deltaY = (cartRect.top + cartRect.height / 2) - (productRect.top + productRect.height / 2);

    img.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.4)`, opacity: 0.1 }
    ], {
        duration: 800,
        easing: "ease-in-out",
        fill: "forwards"
    });

    setTimeout(() => {
        img.remove();
        if (typeof updateCartCount === "function") updateCartCount();
    }, 800);
}

function animateFromCart(source = null) {
    const cartIcon = document.querySelector(".cart-icon img");
    if (!cartIcon) return;

    const productImage = document.querySelector(".carousel-thumbnails .thumbnail-item");

    if (!productImage) {
        console.warn("Nem található thumbnail kép az animációhoz.");
        return;
    }

    const img = document.createElement("img");
    img.src = productImage.src;
    img.classList.add("floating-image");
    img.style.position = "fixed";

    const productRect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    img.style.left = `${productRect.left}px`;
    img.style.top = `${productRect.top}px`;
    img.style.width = `${productRect.width}px`;
    img.style.height = `${productRect.height}px`;
    img.style.zIndex = "9999";
    img.style.pointerEvents = "none";

    document.body.appendChild(img);

    const deltaX = productRect.left - (cartRect.left + cartRect.width / 2 - productRect.width / 2);
    const deltaY = productRect.top - (cartRect.top + cartRect.height / 2 - productRect.height / 2);

    img.animate([
        {
            transform: `translate(${-deltaX}px, ${-deltaY}px) scale(0.2)`,
            opacity: 0.6
        },
        {
            transform: "translate(0, 0) scale(1)",
            opacity: 1
        }
    ], {
        duration: 800,
        easing: "ease-in-out",
        fill: "forwards"
    });

    setTimeout(() => {
        img.remove();
    }, 800);
}

// Kosár darabszám frissítése a Navbárban
function updateCartCount() {
    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "getCount"
        })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) return;

            let cartCountElement = document.getElementById("cart-count");

            if (data.uj_mennyiseg > 0) {
                if (!cartCountElement) {
                    const cartIcon = document.querySelector(".cart-icon");
                    if (!cartIcon) {
                        console.warn("cart-icon nem található a DOM-ban.");
                        return;
                    }

                    const badge = document.createElement("span");
                    badge.id = "cart-count";
                    badge.className = "badge rounded-pill bg-danger";
                    badge.textContent = data.uj_mennyiseg;
                    badge.style.display = "inline-block"; // biztosan látható legyen
                    cartIcon.appendChild(badge);
                } else {
                    cartCountElement.textContent = data.uj_mennyiseg;
                    cartCountElement.style.display = "inline-block"; // újra megjelenítjük, ha előtte el volt rejtve
                }
            } else {
                if (cartCountElement) {
                    cartCountElement.textContent = "0";
                    cartCountElement.style.display = "none";
                }
            }
        })
        .catch(error => console.error("Hiba a kosár frissítésében:", error));
}

function kosarbaTesz(termekId, event, maxStock) {
    if (!event) return;

    fetch("../php/kosarMuvelet.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "add",
            termek_id: termekId,
            mennyiseg: 1
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data && data.success) {
                updateCartCount();
                checkCartState();
                animateToCart(event);
            } else {
                let hiba = data?.error || "Ismeretlen hiba történt!";
                showToast(hiba, "danger");
            }
        })
        .catch(error => {
            console.error("Hiba:", error);
            showToast("Hálózati hiba történt!", "danger");
        });
}

// Oldal betöltődésekor frissítsük a kosár számot (ha van bejelentkezett user és session)
document.addEventListener('DOMContentLoaded', function () {
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});