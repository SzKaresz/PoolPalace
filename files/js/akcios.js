function feltolesKartyakkalAkcios(adatok) {
    let kartyak = document.getElementById("kartyak");
    for (const adat of adatok) {
        if (adat.akcios_ar > -1) {
            let col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3");

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
            img.alt = adat.termek_nev;
            img.classList.add("card-img-top");
            card_header.appendChild(img);

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "d-flex", "flex-column");

            let cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
            cardTitle.innerHTML = adat.termek_nev;

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

            let cardText = document.createElement("p");
            cardText.classList.add("card-text");
            cardText.innerHTML = adat.cikkszam;

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
                kosarbaTesz(adat.cikkszam);
            };

            let buttonContainer = document.createElement("div");
            buttonContainer.classList.add("d-flex", "justify-content-between", "mt-auto", "w-100");
            buttonContainer.appendChild(cartButton);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardTitle2);
            cardBody.appendChild(buttonContainer);

            card.appendChild(cardBody);
            col.appendChild(card);

            kartyak.appendChild(col);
        }
    }
}

async function adatbazisbolLekeres() {
    try {
        let eredmeny = await fetch("../php/adatokLekerese.php");
        if (eredmeny.ok) {
            let valasz = await eredmeny.json();
            feltolesKartyakkalAkcios(valasz);
        }
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("load", adatbazisbolLekeres);