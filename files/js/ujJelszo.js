function szamlaloAtiranyitas() {
    let visszaSzamlaloElem = document.getElementById('visszaSzamlalo-szam');

    if (visszaSzamlaloElem) {
        let visszaSzamlalo = 5;
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

document.addEventListener('DOMContentLoaded', szamlaloAtiranyitas);