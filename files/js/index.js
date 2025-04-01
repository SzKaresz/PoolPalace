function feltolesKartyakkal(adatok) {
  const kartyak = document.getElementById("kartyak");
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
      cardPrice.innerHTML = `<span class="original-price">${adat.egysegar}</span> 
                             <span class="discounted-price">${adat.akcios_ar}</span>`;
      cardHeader.innerHTML += `<div class="badge">Akció!</div>`;
    } else {
      cardPrice.innerHTML = `${adat.egysegar}`;
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

    const quantityControl = document.createElement("div");
    quantityControl.classList.add("quantity-control");
    quantityControl.style.display = "none";

    const minusButton = document.createElement("button");
    minusButton.classList.add("quantity-btn", "minus");
    minusButton.textContent = "-";
    minusButton.onclick = (event) => {
      event.stopPropagation();
      updateCartItem(adat.cikkszam, -1, event);
    };

    const quantityInput = document.createElement("input");
    quantityInput.classList.add("quantity-input");
    quantityInput.type = "number";
    quantityInput.value = 1;
    quantityInput.setAttribute("min", "1");
    quantityInput.dataset.currentValue = 1;
    quantityInput.onchange = (event) => {
      const currentVal = parseInt(quantityInput.dataset.currentValue, 10);
      const newVal = parseInt(event.target.value, 10);
      updateCartItem(adat.cikkszam, newVal - currentVal, event);
    };

    const plusButton = document.createElement("button");
    plusButton.classList.add("quantity-btn", "plus");
    plusButton.textContent = "+";
    plusButton.onclick = (event) => {
      event.stopPropagation();
      updateCartItem(adat.cikkszam, 1, event);
    };

    quantityControl.appendChild(minusButton);
    quantityControl.appendChild(quantityInput);
    quantityControl.appendChild(plusButton);

    cartButtonContainer.appendChild(cartButton);
    cartButtonContainer.appendChild(quantityControl);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(cartButtonContainer);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    kartyak.appendChild(card);
  });

  checkCartState();
}

function feltolesAkcios(adatok) {
  const kartyak = document.getElementById("akciok");
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
      cardPrice.innerHTML = `<span class="original-price">${adat.egysegar}</span> 
                             <span class="discounted-price">${adat.akcios_ar}</span>`;
      cardHeader.innerHTML += `<div class="badge">Akció!</div>`;
    } else {
      cardPrice.innerHTML = `${adat.egysegar}`;
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

    const quantityControl = document.createElement("div");
    quantityControl.classList.add("quantity-control");
    quantityControl.style.display = "none";

    const minusButton = document.createElement("button");
    minusButton.classList.add("quantity-btn", "minus");
    minusButton.textContent = "-";
    minusButton.onclick = (event) => {
      event.stopPropagation();
      updateCartItem(adat.cikkszam, -1, event);
    };

    const quantityInput = document.createElement("input");
    quantityInput.classList.add("quantity-input");
    quantityInput.type = "number";
    quantityInput.value = 1;
    quantityInput.setAttribute("min", "1");
    quantityInput.dataset.currentValue = 1;
    quantityInput.onchange = (event) => {
      const currentVal = parseInt(quantityInput.dataset.currentValue, 10);
      const newVal = parseInt(event.target.value, 10);
      updateCartItem(adat.cikkszam, newVal - currentVal, event);
    };

    const plusButton = document.createElement("button");
    plusButton.classList.add("quantity-btn", "plus");
    plusButton.textContent = "+";
    plusButton.onclick = (event) => {
      event.stopPropagation();
      updateCartItem(adat.cikkszam, 1, event);
    };

    quantityControl.appendChild(minusButton);
    quantityControl.appendChild(quantityInput);
    quantityControl.appendChild(plusButton);

    cartButtonContainer.appendChild(cartButton);
    cartButtonContainer.appendChild(quantityControl);

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
    if (type === "success") {
      window.location.reload();
    }
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

      data.kosar.forEach(item => {
        const cartButtons = document.querySelectorAll(`.add-to-cart[data-id="${item.termek_id}"]`);

        cartButtons.forEach(cartButton => {
          const productCard = cartButton.closest(".card");
          if (!productCard) return;

          const quantityControl = productCard.querySelector(".quantity-control");
          const quantityInput = productCard.querySelector(".quantity-input");
          const minusButton = productCard.querySelector(".quantity-btn.minus");
          const plusButton = productCard.querySelector(".quantity-btn.plus");

          if (!quantityControl || !quantityInput) return;

          quantityInput.value = item.darabszam;
          quantityInput.dataset.currentValue = item.darabszam;
          quantityControl.style.display = "flex";

          minusButton.disabled = (item.darabszam <= 1);
          plusButton.disabled = (item.darabszam >= item.raktar_keszlet);
        });
      });
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

function animateFromCart(productCard) {
  const cartIcon = document.querySelector(".cart-icon img");
  const productImage = productCard.querySelector("img");
  if (!productImage || !cartIcon) return;

  // Lemásoljuk a termékképet
  const img = document.createElement("img");
  img.src = productImage.src;
  img.classList.add("floating-image");
  img.style.position = "fixed";

  const productRect = productImage.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // A kiinduló helyzet: a termék képe
  img.style.left = `${productRect.left}px`;
  img.style.top = `${productRect.top}px`;
  img.style.width = `${productRect.width}px`;
  img.style.height = `${productRect.height}px`;
  img.style.zIndex = "9999";
  img.style.pointerEvents = "none";

  document.body.appendChild(img);

  // Számoljuk a mozgás irányát: kosárból vissza a termékképhez
  const deltaX = productRect.left - (cartRect.left + cartRect.width / 2 - productRect.width / 2);
  const deltaY = productRect.top - (cartRect.top + cartRect.height / 2 - productRect.height / 2);

  // Animáció visszafelé a kosárból a termékhez
  img.animate([
    { transform: `translate(${-deltaX}px, ${-deltaY}px) scale(0.2)`, opacity: 0.6 },
    { transform: "translate(0, 0) scale(1)", opacity: 1 }
  ], {
    duration: 800,
    easing: "ease-in-out",
    fill: "forwards"
  });

  setTimeout(() => {
    img.remove();
  }, 800);
}

async function adatbazisbolLekeres() {
  try {
    let eredmeny = await fetch("../php/kezdolap.php");
    if (eredmeny.ok) {
      let valasz = await eredmeny.json();
      feltolesKartyakkal(valasz);
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
      feltolesAkcios(valasz);
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

function updateCartItem(termekId, change, event = null) {
  termekId = termekId.toString().padStart(6, '0');
  const productButtons = document.querySelectorAll(`.add-to-cart[data-id="${termekId}"]`);

  if (!productButtons.length) {
    console.error("Nem található kártya a termékhez.");
    return;
  }

  // 🔹 Lekérjük a raktárkészletet
  fetch('../php/kosarMuvelet.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'getStock', termek_id: termekId })
  })
    .then(response => response.json())
    .then(stockData => {
      if (!stockData.success) {
        showToast("Nem sikerült lekérni a készletet.");
        return;
      }

      const maxStock = stockData.raktar_keszlet;

      // 🔸 Meghatározzuk, hogy melyik DOM elemre kattintottunk ténylegesen
      const clickedCard = event?.target?.closest('.card');

      productButtons.forEach(button => {
        const productCard = button.closest('.card');
        const quantityInput = productCard.querySelector('.quantity-input');
        const minusButton = productCard.querySelector('.quantity-btn.minus');
        const plusButton = productCard.querySelector('.quantity-btn.plus');
        const quantityControl = productCard.querySelector('.quantity-control');

        let current = parseInt(quantityInput?.value) || 1;
        let uj = current + change;

        if (uj < 1) {
          fetch("../php/kosarMuvelet.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "remove", termek_id: termekId })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                updateCartCount();
                quantityControl.style.display = "none";
                button.style.display = "inline-block";

                if (clickedCard === productCard) {
                  animateFromCart(productCard); // 🔙 csak a kattintott kártyán
                }
              }
            });
          return;
        }

        if (uj > maxStock) uj = maxStock;

        fetch("../php/kosarMuvelet.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            termek_id: termekId,
            mennyiseg: uj
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              updateCartCount();

              quantityInput.value = uj;
              quantityInput.dataset.currentValue = uj;

              minusButton.disabled = (uj <= 1);
              plusButton.disabled = (uj >= maxStock);

              if (change > 0 && event && clickedCard === productCard) {
                animateToCart(event); // csak a kattintott kártyán
              }

              if (change < 0 && uj < current && clickedCard === productCard) {
                animateFromCart(productCard); // csak a kattintott kártyán
              }
            } else {
              showToast(data.error);
            }
          });
      });
    });
}

function disableCartButtons() {
  document.querySelectorAll(".cart-table tbody tr").forEach(row => {
    let termekId = row.dataset.id.padStart(6, '0');
    let quantityElement = row.querySelector(".quantity");
    let plusButton = row.querySelector(".quantity-btn.plus");
    let minusButton = row.querySelector(".quantity-btn.minus");

    if (!quantityElement || !plusButton || !minusButton) return;

    let currentQuantity = parseInt(quantityElement.textContent, 10);

    // 🔹 Lekérjük a raktárkészletet minden termékre
    fetch('../php/kosarMuvelet.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'getStock',
        termek_id: termekId
      })
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) return;

        let maxStock = data.raktar_keszlet;

        // 🔹 Ha elérte a maximumot, a `+` gomb inaktiválása
        plusButton.disabled = (currentQuantity >= maxStock);

        // 🔹 Ha már 1 a mennyiség, a `-` gomb inaktiválása
        minusButton.disabled = (currentQuantity <= 1);
      });
  });
}

function updateQuantity(termekId, change) {
  termekId = termekId.toString().padStart(6, '0');
  const quantityElement = document.querySelector(`tr[data-id='${termekId}'] .quantity`);

  if (!quantityElement) {
    console.error("A quantity elem nem található a DOM-ban.");
    return;
  }

  let currentQuantity = parseInt(quantityElement.textContent, 10);
  let newQuantity = currentQuantity + change;

  // 🔹 Lekérjük a termék raktárkészletét az adatbázisból
  fetch('../php/kosarMuvelet.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'getStock',
      termek_id: termekId
    })
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.error("Hiba történt a készlet lekérdezésekor:", data.error);
        return;
      }

      let maxStock = data.raktar_keszlet;

      // 🔹 Nem engedjük a mínusz gombot 1 alá menni
      if (newQuantity < 1) {
        newQuantity = 1;
      }

      // 🔹 Nem engedjük a plusz gombot a készlet fölé menni
      if (newQuantity > maxStock) {
        newQuantity = maxStock;
      }

      // 🔹 Frissítsük az adatbázist
      fetch('../php/kosarMuvelet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          termek_id: termekId,
          mennyiseg: newQuantity
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            quantityElement.textContent = newQuantity;
            const row = quantityElement.closest('tr');
            updateRowTotal(row, newQuantity);
            updateCartTotal();
            updateCartCount();

            // 🔹 + és - gombok frissítése
            const plusButton = row.querySelector(".quantity-btn.plus");
            const minusButton = row.querySelector(".quantity-btn.minus");

            if (plusButton) {
              plusButton.disabled = (newQuantity >= maxStock);
            }

            if (minusButton) {
              minusButton.disabled = (newQuantity <= 1);
            }
          } else {
            console.error("Hiba történt a mennyiség frissítésekor:", data.error);
          }
        });
    })
    .catch(error => console.error("Hiba:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  adatbazisbolLekeres();
  adatbazisbolAkcios();
  checkCartState();
  disableCartButtons();
});