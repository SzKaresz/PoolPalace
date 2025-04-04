let adatkezCheckbox = document.getElementById('adatkez');
let nemRobot = document.getElementsByClassName("g-recaptcha")[0];
let form = document.getElementById('uzenetKuldes-urlap');
let error_span = document.getElementsByClassName("error");
let recaptchaErrorSpan = document.querySelector(".error.recaptcha-error");

let mezok = {
    nev: {
        mezo: document.getElementById('nev'),
        ellenorzes: (ertek) => /^(?=.*[A-Z].*[A-Z])(?=.*\s).{5,}$/.test(ertek),
        hibaUzenet: 'A névnek tartalmaznia kell legalább egy szóközt, két nagybetűt és 5 karaktert!',
        kotelezo: true,
    },
    email: {
        mezo: document.getElementById('email'),
        ellenorzes: (ertek) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ertek),
        hibaUzenet: 'Kérjük, érvényes e-mail címet adjon meg!',
        kotelezo: true
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
    } else {
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

    Object.values(mezok).forEach(({ mezo, ellenorzes, hibaUzenet, kotelezo }, i) => {
        if ((kotelezo && !mezo.value) || (!kotelezo && mezo.value && !ellenorzes(mezo.value))) {
            error_span[i].innerHTML = hibaUzenet;
            error_span[i].style.display = "block";
            hibasAdatok(mezo, false);
            hiba = true;
        } else {
            error_span[i].innerHTML = "";
            error_span[i].style.display = "none";
            hibasAdatok(mezo, true);
        }
    });

    if (!adatkezCheckbox.checked) {
        let adatkezErrorSpan = document.querySelector(".error.adatkez-error");
        if (adatkezErrorSpan) {
            adatkezErrorSpan.style.display = 'inline';
        }
        hiba = true;
    }

    let recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        if (recaptchaErrorSpan) {
            recaptchaErrorSpan.style.display = 'inline';
            document.getElementById("st").hidden = false;
        }
        hiba = true;
    } else {
        if (recaptchaErrorSpan) {
            recaptchaErrorSpan.style.display = 'none';
            document.getElementById("st").hidden = true;
        }
    }

    if (hiba) {
        event.preventDefault();
    }
}

form.addEventListener('submit', urlapValidalas);
adatkezCheckbox.addEventListener('change', checkCheckbox);
document.addEventListener('DOMContentLoaded', initInputEllenorzes);

function initInputEllenorzes() {
    Object.values(mezok).forEach(({ mezo, ellenorzes }) => {
        mezo.addEventListener('input', () => {
            hibasAdatok(mezo, ellenorzes(mezo.value));
        });
    });
}

function checkCheckbox() {
    if (adatkezCheckbox.checked) {
        let adatkezErrorSpan = document.querySelector(".error.adatkez-error");
        if (adatkezErrorSpan) {
            adatkezErrorSpan.style.display = 'none';
        }
    }
}

function checkRecaptcha() {
    let recaptchaResponse = grecaptcha.getResponse();
    if (recaptchaResponse) {
        if (recaptchaErrorSpan) {
            recaptchaErrorSpan.style.display = 'none';
        }
    }
}

form.addEventListener('submit', urlapValidalas);
adatkezCheckbox.addEventListener('change', checkCheckbox);
document.addEventListener('DOMContentLoaded', initInputEllenorzes);

document.addEventListener('grecaptcha.onload', function () {
    grecaptcha.render('recaptcha-container', {
        'sitekey': '6Lfs-4kqAAAAACPZ6RbVLP0IAz9sBeCZrsYgRzHY',
        'callback': checkRecaptcha,
    });
});