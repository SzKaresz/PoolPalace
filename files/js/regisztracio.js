let egyezoAdatokCheckbox = document.getElementById('egyezo-adatok');
let osszesSzamlazasInput = document.querySelectorAll('.col-md-4:nth-child(3) .input-group input');
let osszesSzallitasiInput = document.querySelectorAll('.col-md-4:nth-child(2) .input-group input');
let aszfCheckbox = document.getElementById('aszf');
let form = document.getElementById('regisztracio-urlap');
let checkbox = document.getElementById('egyezo-adatok');
let label = document.querySelector('label[for="egyezo-adatok"]');
let szamlazasCheck = document.getElementById('szamlazas-checkbox-helye');
let alapSzuloElem = label.parentNode;
let error_span = document.getElementsByClassName("error");


let mezok = {
    nev: {
        mezo: document.getElementById('nev'),
        ellenorzes: (ertek) => /^(?=.*[A-Z].*[A-Z])(?=.*\s).{6,}$/.test(ertek),
        hibaUzenet: 'A névnek tartalmaznia kell legalább egy szóközt, két nagybetűt és 6 karaktert!',
        kotelezo: true,
    },
    email: {
        mezo: document.getElementById('email'),
        ellenorzes: (ertek) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes e-mail címet adjon meg!',
        kotelezo: true,
    },
    jelszo: {
        mezo: document.getElementById('jelszo'),
        ellenorzes: (ertek) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(ertek),
        hibaUzenet: 'A jelszónak minimum 8 karakter hosszúnak kell lennie, tartalmaznia kell kis- és nagybetűt, valamint számot!',
        kotelezo: true,
    },
    jelszoUjra: {
        mezo: document.getElementById('jelszo-ujra'),
        ellenorzes: (ertek) => ertek === document.getElementById('jelszo').value,
        hibaUzenet: 'A megadott jelszavak nem egyeznek meg!',
        kotelezo: true,
    },
    telefon: {
        mezo: document.getElementById('szall-telefon'),
        ellenorzes: (ertek) => /^(\+36|06)[0-9]{9}$/.test(ertek),
        hibaUzenet: 'Kérjük, adjon meg érvényes magyar telefonszámot (pl. +36301234567 vagy 06301234567)!',
        kotelezo: false,
    },
    irszam: {
        mezo: document.getElementById('szall-irszam'),
        ellenorzes: (ertek) => /^[0-9]{4}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!',
        kotelezo: false,
    },
    telepules: {
        mezo: document.getElementById('szall-telepules'),
        ellenorzes: (ertek) => ertek.trim().length >= 2,
        hibaUzenet: 'A település neve legalább 2 karakter legyen!',
        kotelezo: false,
    },
    cim: {
        mezo: document.getElementById('szall-cim'),
        ellenorzes: (ertek) => (ertek.split(' ').length >= 3 && ertek.trim().length >= 8 && /\d/.test(ertek)),
        hibaUzenet: 'Az utca és házszám megadása kötelező, legalább két szóköz és összesen minimum 8 karakter szükséges!',
        kotelezo: false,
    },
    szamlTelefon: {
        mezo: document.getElementById('szam-telefon'),
        ellenorzes: (ertek) => /^(\+36|06)[0-9]{9}$/.test(ertek),
        hibaUzenet: 'Kérjük, adjon meg érvényes magyar telefonszámot (pl. +36301234567 vagy 06301234567)!',
        kotelezo: false,
    },
    szamlIrszam: {
        mezo: document.getElementById('szam-irszam'),
        ellenorzes: (ertek) => /^[0-9]{4}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes irányítószámot adjon meg (4 számjegy)!',
        kotelezo: false,
    },
    szamlTelepules: {
        mezo: document.getElementById('szam-telepules'),
        ellenorzes: (ertek) => ertek.trim().length >= 2,
        hibaUzenet: 'A település neve legalább 2 karakter legyen!',
        kotelezo: false,
    },
    szamlCim: {
        mezo: document.getElementById('szam-cim'),
        ellenorzes: (ertek) => (ertek.split(' ').length >= 3 && ertek.trim().length >= 8 && /\d/.test(ertek)),
        hibaUzenet: 'Az utca és házszám megadása kötelező, legalább két szóköz és összesen minimum 8 karakter szükséges!',
        kotelezo: false,
    }
};

function hibasAdatok(mezo, helyesAdat) {
    if (helyesAdat) {
        mezo.classList.add('is-valid');
        mezo.classList.remove('is-invalid');
        let errorSpan = mezo.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error')) {
            errorSpan.style.display = "none";
        }
    }
    else {
        mezo.classList.add('is-invalid');
        mezo.classList.remove('is-valid');
        let errorSpan = mezo.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error')) {
            errorSpan.style.display = "block";
        }
    }
}


function urlapValidalas(event) {
    let hiba = false;

    for (let i = 0; i < Object.values(mezok).length; i++) {
        let { mezo, ellenorzes, hibaUzenet, kotelezo } = Object.values(mezok)[i];

        if ((kotelezo && !mezo.value) || (!kotelezo && mezo.value && !ellenorzes(mezo.value))) {
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

    if (!aszfCheckbox.checked && !hiba) {
        let aszfErrorSpan = document.querySelector(".error.aszf-error");
        if (aszfErrorSpan) {
            aszfErrorSpan.style.display = 'inline';
        }
        hiba = true;
    }

    if (hiba) {
        event.preventDefault();
    }
}

function szamlazasSzallitashozIgazitas() {
    let beVanJelolve = egyezoAdatokCheckbox.checked;

    osszesSzamlazasInput.forEach((mezo, index) => {
        mezo.readOnly = beVanJelolve;

        if (beVanJelolve) {
            mezo.value = osszesSzallitasiInput[index]?.value || '';
            mezo.style.backgroundColor = '#a0a0a0';
        }
        else {
            mezo.value = '';
            mezo.style.backgroundColor = '';
            hibasAdatok(
                mezo,
                mezok[`szaml${mezo.id.split('-')[1].charAt(0).toUpperCase() + mezo.id.split('-')[1].slice(1)}`]?.ellenorzes(mezo.value)
            );
        }
        mezo.classList.remove('is-valid', 'is-invalid');
    });
}

function helyValtoztatas() {
    if (window.innerWidth < 1200) {
        szamlazasCheck.insertBefore(label, szamlazasCheck.firstChild);
        label.insertBefore(checkbox, label.firstChild);
    }
    else {
        alapSzuloElem.appendChild(label);
        label.insertBefore(checkbox, label.firstChild);
    }
}

function szallitasiAdatokValtozas() {
    osszesSzallitasiInput.forEach((mezo, index) => {
        if (egyezoAdatokCheckbox.checked) {
            osszesSzamlazasInput[index].value = mezo.value;
        }
    });
}

function initInputEllenorzes() {
    Object.values(mezok).forEach(({ mezo, ellenorzes }) => {
        mezo.addEventListener('input', () => {
            hibasAdatok(mezo, ellenorzes(mezo.value));
        });
    });
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
                window.location.href = "../php/bejelentkezes.php";
            }
        }, 1000);
    }
}

form.addEventListener('submit', urlapValidalas);
egyezoAdatokCheckbox.addEventListener('change', szamlazasSzallitashozIgazitas);
window.addEventListener('resize', helyValtoztatas);
document.addEventListener('DOMContentLoaded', helyValtoztatas);
document.addEventListener('DOMContentLoaded', szamlaloAtiranyitas);
document.addEventListener('DOMContentLoaded', initInputEllenorzes);
osszesSzallitasiInput.forEach((mezo) => {
    mezo.addEventListener('input', szallitasiAdatokValtozas);
});