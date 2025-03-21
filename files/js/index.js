function feltolesKartyakkal(adatok) {
  let kartyak = document.getElementById("kartyak");
  for (const adat of adatok) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.cursor = "pointer";

    card.addEventListener("click", function () {
      window.location.href = `../php/termekOldal.php?cikkszam=${adat.cikkszam}`;
    });

    let card_header = document.createElement('div');
    card_header.classList.add("card-header");
    card.appendChild(card_header);

    let img = document.createElement("img");
    img.src = `../img/termekek/${adat.cikkszam}.webp`;
    img.alt = adat.nev;
    img.classList.add("card-img-top");
    card_header.appendChild(img);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerHTML = adat.nev;

    let cardTitle2 = document.createElement("h6");
    cardTitle2.classList.add("card-subtitle", "mb-2", "text-muted");

    let akcios_ar = parseFloat(adat.akcios_ar.replace(/\s/g, ''));
    let egysegar = parseFloat(adat.egysegar.replace(/\s/g, ''));
    if (akcios_ar > -1 && akcios_ar < egysegar) {
      cardTitle2.innerHTML = `<span class="original-price">${adat.egysegar} Ft</span> 
                           <span class="discounted-price">${adat.akcios_ar} Ft</span>`;
      card_header.innerHTML += `<div class="badge">Akció!</div>`;
    } else {
      cardTitle2.innerHTML = `${adat.egysegar} Ft`;
    }

    let cartButton = document.createElement("button");
    cartButton.classList.add("btn", "btn-success", "d-flex", "align-items-center", "gap-2");
    cartButton.innerHTML = `
                                  <span>
                                      <img src="../img/cart.png" alt="Kosár ikon" width="25" height="25">
                                  </span> Kosárba
                              `;
    cartButton.setAttribute("data-id", adat.cikkszam);
    cartButton.style.border = 0;
    cartButton.style.transition = "box-shadow 0.3s ease-in-out";

    cartButton.onmouseover = function () {
      cartButton.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.8)";
    };
    cartButton.onmouseout = function () {
      cartButton.style.boxShadow = "none";
    };

    cartButton.onclick = function (event) {
      event.stopPropagation();
      kosarbaTesz(adat.cikkszam, event);
    };

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("d-flex", "justify-content-between", "mt-auto", "w-100");
    buttonContainer.appendChild(cartButton);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardTitle2);
    cardBody.appendChild(buttonContainer);

    card.appendChild(cardBody);

    kartyak.appendChild(card);
  }
}

function kosarbaTesz(termekId, event) {
  if (!event) {
      console.error("Nincs eseményobjektum!");
      return;
  }

  fetch("../php/kosarMuvelet.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", termek_id: termekId, mennyiseg: 1 })
  })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              let cartCountElement = document.getElementById("cart-count");

              if (cartCountElement) {
                  cartCountElement.textContent = data.uj_mennyiseg;
              } else {
                  const cartIcon = document.querySelector(".cart-icon");
                  const badge = document.createElement("span");
                  badge.id = "cart-count";
                  badge.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
                  badge.textContent = data.uj_mennyiseg;
                  cartIcon.appendChild(badge);
              }
              animateToCart(event);
          }
      })
      .catch(error => console.error("Hiba:", error));
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
      feltolesKartyakkal(valasz);
    }
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", adatbazisbolLekeres);