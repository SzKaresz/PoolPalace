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

document.addEventListener('DOMContentLoaded', szamlaloAtiranyitas);