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
    const ujJelszoErtek = document.getElementById('uj-jelszo').value.trim();
    const jelszoModositasFolyamatban = ujJelszoErtek !== '';

    Object.values(mezok).forEach(({ mezo }) => {
        mezo.classList.remove('is-invalid', 'is-valid');
        let errorSpan = mezo.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error')) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
    });

    for (let kulcs in mezok) {
        let { mezo, ellenorzes, hibaUzenet, kotelezo } = mezok[kulcs];
        let ertek = mezo.value.trim();
        let ervenyes = true;
        let aktualisHibaUzenet = hibaUzenet;

        if (kulcs === 'regiJelszo' || kulcs === 'ujJelszo' || kulcs === 'ujJelszoUjra') {
            if (!jelszoModositasFolyamatban && ertek === '') {
                ervenyes = true;
            } else if (jelszoModositasFolyamatban && ertek === '') {
                ervenyes = false;
                aktualisHibaUzenet = "A jelszó módosításához mindhárom jelszó mezőt ki kell tölteni!";
            } else if (ertek !== '') {
                ervenyes = ellenorzes(ertek);
                if (kulcs === 'ujJelszoUjra' && !ervenyes) {
                    aktualisHibaUzenet = mezok.ujJelszoUjra.hibaUzenet;
                }
            } else {
                ervenyes = true;
            }
        } else {
            const isKotelezo = kotelezo === true;
            if (isKotelezo && ertek === '') {
                ervenyes = false;
                aktualisHibaUzenet = "Ez a mező kötelező!";
            } else if (ertek !== '') {
                ervenyes = ellenorzes(ertek);
            } else {
                ervenyes = true;
            }
        }

        if (!ervenyes) {
            hibasAdatok(mezo, false);
            let errorSpan = mezo.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('error')) {
                errorSpan.textContent = aktualisHibaUzenet;
                errorSpan.style.display = 'block';
            }
            hiba = true;
        } else {
            hibasAdatok(mezo, true);
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

const capsIcons = [
    document.getElementById("caps-icon-1"),
    document.getElementById("caps-icon-2"),
    document.getElementById("caps-icon-3")
];

function frissitCapsLock(e) {
    const aktiv = e.getModifierState && e.getModifierState("CapsLock");
    capsIcons.forEach(icon => {
        icon.style.display = aktiv ? "block" : "none";
    });
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const teszt = new KeyboardEvent("keydown", { key: "Shift" });
        if (teszt.getModifierState && teszt.getModifierState("CapsLock")) {
            capsIcons.forEach(icon => {
                icon.style.display = "block";
            });
        }
    }, 100);
});


window.addEventListener("keydown", frissitCapsLock);
window.addEventListener("keyup", frissitCapsLock);
urlap.addEventListener('submit', urlapValidalas);
document.addEventListener('DOMContentLoaded', szamlaloAtiranyitas);
document.addEventListener('DOMContentLoaded', initInputEllenorzes);