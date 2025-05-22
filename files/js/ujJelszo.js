function szamlaloAtiranyitas() {
    let visszaSzamlaloElemDiv = document.getElementById('visszaSzamlalo');

    if (visszaSzamlaloElemDiv && !document.getElementById('visszaSzamlalo-szam')) {
         let visszaSzamlalo = 3;
         showToast(`Sikeres jelszómódosítás! Átirányítás <span id="visszaSzamlalo-szam">${visszaSzamlalo}</span> másodperc múlva...`, 'success');

         const szam = setInterval(() => {
             visszaSzamlalo--;
             let szamlaloSpan = document.getElementById('visszaSzamlalo-szam');
             if(szamlaloSpan) {
                 szamlaloSpan.textContent = visszaSzamlalo;
             }
             if (visszaSzamlalo === 0) {
                 clearInterval(szam);
                 window.location.href = "../php/bejelentkezes.php";
             }
         }, 1000);
     }
}

function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1056';
        document.body.appendChild(toastContainer);
    }

    const maxToasts = 3;
    while (toastContainer.children.length >= maxToasts) {
        toastContainer.removeChild(toastContainer.firstChild);
    }

    let toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.setAttribute("data-bs-autohide", "true");
    toast.setAttribute("data-bs-delay", "5000");

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Bezárás"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    try {
        let toastInstance = new bootstrap.Toast(toast);
        toastInstance.show();
        toast.addEventListener('hidden.bs.toast', function () {
            toast.remove();
        });
    } catch (e) {
        console.error("Bootstrap Toast hiba:", e);
        setTimeout(() => toast.remove(), 5000);
    }
}

function updateCapsLockIndicators(event) {
    const capsLockOn = event.getModifierState && event.getModifierState("CapsLock");

    const capsIcons = [
        document.getElementById("caps-icon-uj"),
        document.getElementById("caps-icon-uj-ismet")
    ];

    capsIcons.forEach((icon) => {
        if (icon) {
            icon.style.display = capsLockOn ? "block" : "none";
        }
    });
}

window.addEventListener("keydown", updateCapsLockIndicators);
window.addEventListener("keyup", updateCapsLockIndicators);
window.addEventListener("DOMContentLoaded", () => {
    const testEvent = new KeyboardEvent("keydown", { key: "Shift" });
    if (testEvent.getModifierState && testEvent.getModifierState("CapsLock")) {
        const capsIcons = [
            document.getElementById("caps-icon-uj"),
            document.getElementById("caps-icon-uj-ismet")
        ];
        capsIcons.forEach((icon) => {
            if (icon) {
                icon.style.display = "block";
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', szamlaloAtiranyitas);