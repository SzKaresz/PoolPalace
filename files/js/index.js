function feltolesKartyakkal(adatok, id) {
  const kartyak = document.getElementById(id);
  kartyak.innerHTML = "";

  adatok.forEach(adat => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.addEventListener("click", (event) => {
      if (!event.target.closest("button") && !event.target.closest("input")) {
        window.location.href = `../php/termekOldal.php?cikkszam=${adat.cikkszam}`;
      }
    });

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const img = document.createElement("img");
    img.src = `../img/termekek/${adat.cikkszam}.webp`;
    img.alt = adat.nev;
    img.classList.add("card-img-top");
    cardHeader.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerHTML = adat.nev;

    const cardPrice = document.createElement("h6");
    cardPrice.classList.add("card-subtitle", "mb-2", "text-muted");

    const akcios_ar = parseFloat(adat.akcios_ar.replace(/\s/g, ''));
    const egysegar = parseFloat(adat.egysegar.replace(/\s/g, ''));
    if (akcios_ar > -1 && akcios_ar < egysegar) {
      cardPrice.innerHTML = `<span class="original-price">${adat.egysegar} Ft</span> 
                             <span class="discounted-price">${adat.akcios_ar} Ft</span>`;
      cardHeader.innerHTML += `<div class="badge">Akció!</div>`;
    } else {
      cardPrice.innerHTML = `${adat.egysegar} Ft`;
    }

    const cartButtonContainer = document.createElement("div");
    cartButtonContainer.classList.add("cart-button-container");

    const cartButton = document.createElement("button");
    cartButton.classList.add("btn", "add-to-cart");
    cartButton.innerHTML = `<img src="../img/cart.png" class="cart-icon-img" alt="Kosár"> Kosárba`;
    cartButton.setAttribute("data-id", adat.cikkszam);

    if (adat.raktar_keszlet === 0) {
      cartButton.disabled = true;
      cartButton.classList.add("disabled");
      cartButton.innerHTML = `Nincs készleten`;
    } else {
      cartButton.onclick = function (event) {
        event.stopPropagation();
        kosarbaTesz(adat.cikkszam, event, adat.raktar_keszlet);
      };
    }

    cartButtonContainer.appendChild(cartButton);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(cartButtonContainer);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    kartyak.appendChild(card);
  });

  checkCartState();
}

function kosarbaTesz(termekId, event, maxStock) {
  if (!event) return;

  fetch("../php/kosarMuvelet.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", termek_id: termekId, mennyiseg: 1 })
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

function showToast(message, type = "danger") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const maxToastCount = 3;
  const currentToasts = toastContainer.querySelectorAll(".toast");
  if (currentToasts.length >= maxToastCount) {
    currentToasts[currentToasts.length - 1].remove();
  }

  let toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0 shadow`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
      <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
  `;

  toastContainer.appendChild(toast);

  let toastInstance = new bootstrap.Toast(toast);
  toastInstance.show();

  setTimeout(() => {
    toast.remove();
  }, 6000);
}

function checkCartState() {
  fetch("../php/kosarMuvelet.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getCart" })
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success || !Array.isArray(data.kosar)) {
        console.error("Hiba: a kosár adat nem megfelelő formátumú vagy nincs meghatározva.", data);
        return;
      }
    })
    .catch(error => console.error("Hiba a kosárállapot betöltésénél:", error));
}

function animateToCart(event) {
  if (!event || !event.target) {
    console.error("Nincs érvényes event objektum!");
    return;
  }

  const cartIcon = document.querySelector(".cart-icon img");
  if (!cartIcon) return;

  const productCard = event.target.closest(".card");
  const productImage = productCard.querySelector("img");
  if (!productImage) return;

  const img = document.createElement("img");
  img.src = productImage.src;
  img.classList.add("floating-image");
  document.body.appendChild(img);

  const productRect = productImage.getBoundingClientRect();
  img.style.position = "fixed";
  img.style.left = `${productRect.left}px`;
  img.style.top = `${productRect.top}px`;
  img.style.width = `${productRect.width}px`;
  img.style.height = `${productRect.height}px`;

  const cartRect = cartIcon.getBoundingClientRect();
  const deltaX = (cartRect.left + cartRect.width / 2) - (productRect.left + productRect.width / 2);
  const deltaY = (cartRect.top + cartRect.height / 2) - (productRect.top + productRect.height / 2);

  img.animate([
    { transform: "translate(0, 0) scale(1)", opacity: 1 },
    { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2)`, opacity: 0 }
  ], {
    duration: 800,
    easing: "ease-in-out",
    fill: "forwards"
  });

  setTimeout(() => {
    img.remove();

    // **Ne növeljük a számlálót kézzel, hanem kérjünk frissítést a szerverről!**
    if (typeof updateCartCount === "function") {
      updateCartCount(); // **A kosar.js frissíti a valódi értéket**
    }

  }, 800);
}

async function adatbazisbolLekeres() {
  try {
    let eredmeny = await fetch("../php/kezdolap.php");
    if (eredmeny.ok) {
      let valasz = await eredmeny.json();
      feltolesKartyakkal(valasz, "kartyak");
    }
  } catch (error) {
    console.log(error);
  }
}

async function adatbazisbolAkcios() {
  try {
    let eredmeny = await fetch("../php/akcios.php");
    if (eredmeny.ok) {
      let valasz = await eredmeny.json();
      feltolesKartyakkal(valasz, "akciok");
    }
  } catch (error) {
    console.log(error);
  }
}

function updateCartCount() {
  fetch("../php/kosarMuvelet.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getCount" })
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
          cartIcon.appendChild(badge);
        } else {
          cartCountElement.textContent = data.uj_mennyiseg;
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

document.addEventListener("DOMContentLoaded", function () {
  adatbazisbolLekeres();
  adatbazisbolAkcios();
  checkCartState();
});