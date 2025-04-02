let urlap = document.getElementById('adataim-urlap');
let error_span = document.getElementsByClassName("error");


let mezok = {
    nev: {
        mezo: document.getElementById('nev'),
        ellenorzes: (ertek) => /^(?=.*[A-Z].*[A-Z])(?=.*\s).{6,}$/.test(ertek),
        hibaUzenet: 'A névnek tartalmaznia kell legalább egy szóközt, két nagybetűt és 6 karaktert!'
    },
    email: {
        mezo: document.getElementById('email'),
        ellenorzes: (ertek) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes e-mail címet adjon meg!'
    },
    telefon: {
        mezo: document.getElementById('telefonszam'),
        ellenorzes: (ertek) => /^(\+36|06)[0-9]{9}$/.test(ertek),
        hibaUzenet: 'Kérjük, adjon meg érvényes magyar telefonszámot (pl. +36301234567 vagy 06301234567)!'
    },
    regiJelszo: {
        mezo: document.getElementById('regi-jelszo'),
        ellenorzes: (ertek) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(ertek),
        hibaUzenet: 'A jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!'
    },
    ujJelszo: {
        mezo: document.getElementById('uj-jelszo'),
        ellenorzes: (ertek) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(ertek),
        hibaUzenet: 'A jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!'
    },
    ujJelszoUjra: {
        mezo: document.getElementById('uj-jelszo-ismet'),
        ellenorzes: (ertek) => ertek === document.getElementById('uj-jelszo').value,
        hibaUzenet: 'A megadott új jelszavak nem egyeznek meg!'
    },
    irszam: {
        mezo: document.getElementById('szallitasi-irsz'),
        ellenorzes: (ertek) => /^[0-9]{4}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!'
    },
    telepules: {
        mezo: document.getElementById('szallitasi-telepules'),
        ellenorzes: (ertek) => ertek.trim().length >= 2,
        hibaUzenet: 'A település neve legalább 2 karakter legyen!'
    },
    cim: {
        mezo: document.getElementById('szallitasi-utca'),
        ellenorzes: (ertek) => (ertek.split(' ').length >= 3 && ertek.trim().length >= 8 && /\d/.test(ertek)),
        hibaUzenet: 'Az utca és házszám megadása kötelező, legalább két szóköz és összesen minimum 8 karakter szükséges!'
    },
    szamlIrszam: {
        mezo: document.getElementById('szamlazasi-irsz'),
        ellenorzes: (ertek) => /^[0-9]{4}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!'
    },
    szamlTelepules: {
        mezo: document.getElementById('szamlazasi-telepules'),
        ellenorzes: (ertek) => ertek.trim().length >= 2,
        hibaUzenet: 'A település neve legalább 2 karakter legyen!'
    },
    szamlCim: {
        mezo: document.getElementById('szamlazasi-utca'),
        ellenorzes: (ertek) => (ertek.split(' ').length >= 3 && ertek.trim().length >= 8 && /\d/.test(ertek)),
        hibaUzenet: 'Az utca és házszám megadása kötelező, legalább két szóköz és összesen minimum 8 karakter szükséges!'
    }
};


function hibasAdatok(mezo, helyesAdat) {
    let errorSpan = mezo.nextElementSibling;

    if (helyesAdat) {
        mezo.classList.add('is-valid');
        mezo.classList.remove('is-invalid');
        if (errorSpan && errorSpan.classList.contains('error')) {
            errorSpan.style.display = "none";
        }
    } else {
        mezo.classList.add('is-invalid');
        mezo.classList.remove('is-valid');
        if (errorSpan && errorSpan.classList.contains('error')) {
            errorSpan.style.display = "block";
        }
    }
}

function urlapValidalas(event) {
    let hiba = false;

    for (let i = 0; i < Object.values(mezok).length; i++) {
        let { mezo, ellenorzes, hibaUzenet} = Object.values(mezok)[i];

        if (!ellenorzes(mezo.value)) {
            if (!ellenorzes(mezo.value)) {
                error_span[i].innerHTML = hibaUzenet;
                error_span[i].style.display = "block";
                hibasAdatok(mezo, false);
                hiba = true;
                break;
            }
            else {
                error_span[i].innerHTML = "";
                error_span[i].style.display = "none";
                hibasAdatok(mezo, true);
            }
        }
    }

    if (hiba) {
        event.preventDefault();
    }
}

function szamlaloAtiranyitas() {
    let visszaSzamlaloElem = document.getElementById('visszaSzamlalo-szam');

    if (visszaSzamlaloElem) {
        let visszaSzamlalo = 3;
        const szam = setInterval(() => {
            visszaSzamlalo--;
            visszaSzamlaloElem.textContent = visszaSzamlalo;
            if (visszaSzamlalo === 0) {
                clearInterval(szam);
                window.location.href = "../php/index.php";
            }
        }, 1000);
    }
}

function initInputEllenorzes() {
    Object.values(mezok).forEach(({ mezo, ellenorzes }) => {
        mezo.addEventListener('input', () => {
            hibasAdatok(mezo, ellenorzes(mezo.value));
        });
    });
}


urlap.addEventListener('submit', urlapValidalas);
document.addEventListener('DOMContentLoaded', szamlaloAtiranyitas);
document.addEventListener('DOMContentLoaded', initInputEllenorzes);