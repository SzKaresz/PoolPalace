function feltolesKartyakkal(adatok){
    let kartyak = document.getElementById("kartyak");
    for (const adat of adatok) {
        if(adat.cikkszam.toString().startsWith("1")){
            let col = document.createElement("div");
            col.classList.add("col", "col-sm-6", "col-lg-4");
            let card = document.createElement("div");
            card.classList.add("card");
            let img = document.createElement("img");
            img.src = `../img/termekek/${adat.cikkszam}.webp`;
            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            let cardTitle = document.createElement("h5");
            cardTitle.innerHTML = adat.nev;
            let cardTitle2 = document.createElement("h6");
            cardTitle2.innerHTML = adat.egysegar + " Ft";
            let cardText = document.createElement("p");
            cardText.innerHTML = adat.cikkszam;
            let button = document.createElement("a");
            button.setAttribute("href", `../php/termekOldal.php?cikkszam=${adat.cikkszam}`);
            button.classList.add("btn", "btn-primary");
            button.innerHTML = "Bővebben";
            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            cardBody.appendChild(cardTitle2)
            cardBody.appendChild(button);
            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);
            kartyak.appendChild(col);
        }
    }
}

async function adatbazisbolLekeres(){
    try {
        let eredmeny = await fetch("../php/termekOldal.php/cikkszam");
        if(eredmeny.ok){
            let valasz = await eredmeny.json();
            console.log(valasz);
            feltolesKartyakkal(valasz);
        }
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("load", adatbazisbolLekeres);

document.getElementById("back-to-top").hidden = true;

window.onscroll = function() {gorgetes()}

function gorgetes(){
    let eddig = document.documentElement.scrollTop;
    if(eddig >= 125){
        document.getElementById("back-to-top").hidden = false;
    }
    else{
        document.getElementById("back-to-top").hidden = true;
    }
}