document.addEventListener("DOMContentLoaded", function () {
    const placeOrderBtn = document.getElementById("place-order-btn");
    const guestModalElement = document.getElementById("guestModal");
    const guestModal = guestModalElement ? new bootstrap.Modal(guestModalElement) : null;
    const saveAccountBtn = document.getElementById("save-account-btn");
    const modalPassword = document.getElementById("modal-password");
    const modalPasswordConfirm = document.getElementById("modal-password-confirm");
    const passwordAlert = document.getElementById("password-alert");
    const loadingOverlay = document.getElementById("loading-overlay");
    const isGuestDataElement = document.getElementById("is-guest-data");
    const isGuest = isGuestDataElement ? JSON.parse(isGuestDataElement.textContent.trim()) : true;

    let orderData = {};
    let tooltipInstances = {};

    if (!placeOrderBtn) {
        console.error("A 'place-order-btn' gomb nem található a DOM-ban!");
    }

    const validationRules = [
        { id: "name", label: "Név", regex: /^(?=.*[A-Z].*[A-Z])(?=.*\s).{6,}$/, error: "Legalább 6 karakter, 1 szóköz, 2 nagybetű." },
        { id: "email", label: "Email", regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, error: "Érvényes e-mail cím szükséges." },
        { id: "phone", label: "Telefonszám", regex: /^(\+36|06)[0-9]{9}$/, error: "Formátum: +36.. vagy 06.. (11 számjegy)." },
        { id: "shipping-postal_code", label: "Sz. Irányítószám", regex: /^[0-9]{4}$/, error: "4 jegyű szám." },
        { id: "shipping-city", label: "Sz. Település", regex: /^.{2,}$/, error: "Minimum 2 karakter." },
        { id: "shipping-address", label: "Sz. Utca, házszám", regex: /^(?=.*\d)(?=.*\s).{8,}$/, error: "Min. 8 kar., 2 szóköz, 1 szám." },
        { id: "billing-postal_code", label: "Szla. Irányítószám", regex: /^[0-9]{4}$/, error: "4 jegyű szám." },
        { id: "billing-city", label: "Szla. Település", regex: /^.{2,}$/, error: "Minimum 2 karakter." },
        { id: "billing-address", label: "Szla. Utca, házszám", regex: /^(?=.*\d)(?=.*\s).{8,}$/, error: "Min. 8 kar., 2 szóköz, 1 szám." }
    ];

    validationRules.forEach(rule => {
        const field = document.getElementById(rule.id);
        if (field) {
            tooltipInstances[rule.id] = new bootstrap.Tooltip(field, {
                title: rule.error,
                trigger: 'hover focus',
                placement: 'top',
                customClass: 'tooltip-invalid',
                fallbackPlacements: ['bottom', 'right', 'left'],
                container: 'body'
            });
            tooltipInstances[rule.id].disable();
        }
    });

    function validateField(field, rule) {
        if (!field) return true;
        const value = field.value.trim();
        const isValid = rule.regex.test(value);
        const tooltipInstance = tooltipInstances[field.id];

        if (!isValid) {
            field.classList.add("is-invalid");
            field.classList.remove("is-valid");
            if (tooltipInstance) {
                field.setAttribute('data-bs-original-title', rule.error);
                tooltipInstance.enable();
            }
        } else {
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");
            if (tooltipInstance) {
                tooltipInstance.hide();
                tooltipInstance.disable();
                field.removeAttribute('data-bs-original-title');
            }
        }
        return isValid;
    }

    validationRules.forEach(rule => {
        const field = document.getElementById(rule.id);
        if (!field) return;

        field.addEventListener("input", function () {
            const tooltipInstance = tooltipInstances[field.id];
            if (tooltipInstance) {
                tooltipInstance.hide();
                field.dataset.persistTooltip = 'false';
            }
            validateField(field, rule);
        });
        field.addEventListener("blur", function () {
            const tooltipInstance = tooltipInstances[field.id];
            if (field.dataset.persistTooltip === 'true' && field.classList.contains('is-invalid') && tooltipInstance) {
                setTimeout(() => {
                    if (field.classList.contains('is-invalid')) {
                        tooltipInstance.show();
                    }
                }, 50);
            } else if (tooltipInstance) {
                tooltipInstance.hide();
            }
            validateField(field, rule);
        });
    });

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function () {
            let firstErrorField = null;
            let hasError = false;

            Object.keys(tooltipInstances).forEach(fieldId => {
                const instance = tooltipInstances[fieldId];
                const element = document.getElementById(fieldId);
                if (instance) {
                    instance.hide();
                    instance.disable();
                }
                if (element) {
                    element.dataset.persistTooltip = 'false';
                }
            });

            const sameAsShippingCheckbox = document.getElementById("same-as-shipping");
            const isBillingSame = sameAsShippingCheckbox ? sameAsShippingCheckbox.checked : false;

            validationRules.forEach(rule => {
                if (isBillingSame && rule.id.startsWith('billing-')) {
                    const field = document.getElementById(rule.id);
                    if (field) field.classList.remove("is-invalid", "is-valid");
                    return;
                }
                const field = document.getElementById(rule.id);
                if (!field) return;
                const isValid = validateField(field, rule);

                if (!isValid) {
                    hasError = true;
                    if (!firstErrorField) {
                        firstErrorField = field;
                    }
                }
            });

            if (hasError) {
                if (firstErrorField) {
                    const accordionParent = firstErrorField.closest('.accordion-collapse.collapse');
                    if (accordionParent && accordionParent.classList.contains('collapse')) {
                        const collapseInstance = bootstrap.Collapse.getOrCreateInstance(accordionParent);
                        collapseInstance.show();

                        const toggleButton = document.querySelector(`[data-bs-target="#${accordionParent.id}"]`);
                        if (toggleButton) {
                            toggleButton.classList.remove('disabled');
                            toggleButton.removeAttribute('aria-disabled');
                        }
                    }

                    firstErrorField.focus();
                    const firstTooltipInstance = tooltipInstances[firstErrorField.id];
                    if (firstTooltipInstance) {
                        firstErrorField.dataset.persistTooltip = 'true';
                        firstTooltipInstance.show();
                    }
                }
                return;
            }

            const cartItemsDataElement = document.getElementById("cart-items-data");
            const totalPriceDataElement = document.getElementById("total-price-data");
            let cartItems = []; let total = 0;
            try { cartItems = JSON.parse(cartItemsDataElement?.textContent?.trim() || '[]'); total = parseFloat(totalPriceDataElement?.textContent || '0'); }
            catch (e) { console.error("Hiba az adatok olvasása közben:", e); showToast("Hiba a rendelési adatok feldolgozása közben.", "danger"); return; }
            if (!Array.isArray(cartItems) || cartItems.length === 0) { showToast("A kosár üres, nem adhat le rendelést!", "warning"); return; }

            orderData = {
                action: 'placeOrder', total: total, cart_items: cartItems,
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                shipping_postal_code: document.getElementById("shipping-postal_code").value.trim(),
                shipping_city: document.getElementById("shipping-city").value.trim(),
                shipping_address: document.getElementById("shipping-address").value.trim(),
                billing_postal_code: document.getElementById("billing-postal_code").value.trim(),
                billing_city: document.getElementById("billing-city").value.trim(),
                billing_address: document.getElementById("billing-address").value.trim(),
                payment_method: document.querySelector('input[name="payment-method"]:checked')?.value?.trim() || ''
            };
            if (!orderData.payment_method) { showToast("Kérjük, válasszon fizetési módot!", "warning"); return; }

            if (isGuest && guestModal) {
                if (modalPassword) { modalPassword.value = ''; modalPassword.classList.remove('is-valid', 'is-invalid'); }
                if (modalPasswordConfirm) { modalPasswordConfirm.value = ''; modalPasswordConfirm.classList.remove('is-valid', 'is-invalid'); }
                if (passwordAlert) { passwordAlert.innerHTML = ''; }
                guestModal.show();
            } else { sendOrder(orderData); }
        });
    }

    if (modalPassword && modalPasswordConfirm) {
        modalPassword.addEventListener("input", validatePasswordInModal);
        modalPasswordConfirm.addEventListener("input", validatePasswordInModal);
    }
    function validatePasswordInModal() {
        if (!modalPassword || !modalPasswordConfirm || !passwordAlert) return true;
        const pwd = modalPassword.value.trim(); const pwdConfirm = modalPasswordConfirm.value.trim(); let errorMessage = "";
        if (pwd === "" && pwdConfirm === "") { modalPassword.classList.remove("is-invalid", "is-valid"); modalPasswordConfirm.classList.remove("is-invalid", "is-valid"); passwordAlert.innerHTML = ""; return true; }
        if (pwd.length < 8) { errorMessage = "A jelszónak legalább 8 karakter hosszúnak kell lennie!"; }
        else if (!/[A-Z]/.test(pwd)) { errorMessage = "A jelszónak tartalmaznia kell legalább egy nagybetűt!"; }
        else if (!/\d/.test(pwd)) { errorMessage = "A jelszónak tartalmaznia kell legalább egy számot!"; }
        else if (pwd !== pwdConfirm) { errorMessage = "A jelszavak nem egyeznek!"; }
        if (errorMessage) { modalPassword.classList.add("is-invalid"); modalPasswordConfirm.classList.add("is-invalid"); modalPassword.classList.remove("is-valid"); modalPasswordConfirm.classList.remove("is-valid"); passwordAlert.innerHTML = `<div class="alert alert-danger p-2 mt-2">${errorMessage}</div>`; return false; }
        else { modalPassword.classList.remove("is-invalid"); modalPasswordConfirm.classList.remove("is-invalid"); modalPassword.classList.add("is-valid"); modalPasswordConfirm.classList.add("is-valid"); passwordAlert.innerHTML = ""; return true; }
    }

    if (saveAccountBtn && guestModal) {
        saveAccountBtn.addEventListener("click", function () { if (!validatePasswordInModal()) return; orderData.register = true; orderData.password = modalPassword.value.trim(); if (passwordAlert) passwordAlert.innerHTML = ''; guestModal.hide(); sendOrder(orderData); });
    }

    const guestModalNoButton = document.querySelector("#guestModal .btn-secondary");
    if (guestModalNoButton && guestModal) { guestModalNoButton.addEventListener("click", function () { orderData.register = false; guestModal.hide(); sendOrder(orderData); }); }

    let isSubmitting = false;
    function sendOrder(orderData) {
        if (isSubmitting) return; isSubmitting = true;
        if (loadingOverlay) loadingOverlay.classList.add("active");
        Object.values(tooltipInstances).forEach(instance => instance?.hide());

        fetch('../php/megrendeles.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) })
            .then(response => {
                if (!response.ok) { return response.json().then(errData => { throw new Error(errData.error || `HTTP error! status: ${response.status}`); }).catch(() => { throw new Error(`HTTP error! status: ${response.status}`); }); }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    document.getElementById("order-id").textContent = data.order_id;
                    const successModalElement = document.getElementById('orderSuccessModal');
                    if (successModalElement) { bootstrap.Modal.getOrCreateInstance(successModalElement).show(); }
                    const cartCountElement = document.getElementById("cart-count");
                    if (cartCountElement) { cartCountElement.textContent = '0'; cartCountElement.style.display = 'none'; }
                } else {
                    showToast(data.error || "Ismeretlen szerverhiba.", "danger");
                    if (data.error_field) {
                        const errorField = document.getElementById(data.error_field);
                        if (errorField) {
                            errorField.classList.add("is-invalid");
                            const tooltipInstance = tooltipInstances[data.error_field];
                            if (tooltipInstance) {
                                errorField.setAttribute('data-bs-original-title', data.error);
                                tooltipInstance.enable();
                                tooltipInstance.show();
                                errorField.dataset.persistTooltip = 'true';
                            }
                            errorField.focus();
                        }
                    }
                }
            })
            .catch(error => { console.error("Hiba a kérés során:", error); showToast(`Hiba történt a rendelés leadása során: ${error.message}`, "danger"); })
            .finally(() => { if (loadingOverlay) loadingOverlay.classList.remove("active"); isSubmitting = false; });
    }

    function showToast(message, type = "danger") {
        let tc = document.getElementById("toast-container"); if (!tc) { tc = document.createElement("div"); tc.id = "toast-container"; Object.assign(tc.style, { position: 'fixed', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: '1100', width: 'auto', minWidth: '250px', maxWidth: '80%' }); document.body.appendChild(tc); } const max = 3; current = tc.querySelectorAll(".toast"); if (current.length >= max) { current[0].remove(); } let t = document.createElement("div"); t.className = `toast align-items-center text-white bg-${type} border-0 shadow show`; Object.assign(t, { role: "alert", "aria-live": "assertive", "aria-atomic": "true", "data-bs-delay": "5000", "data-bs-autohide": "true" }); t.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`; tc.appendChild(t); try { const ti = new bootstrap.Toast(t); ti.show(); t.addEventListener('hidden.bs.toast', function () { this.remove(); }); } catch (e) { console.error("Bootstrap Toast hiba:", e); t.style.display = 'block'; setTimeout(() => { t.remove(); }, 5000); }
    }

    const userDataElement = document.getElementById("user-data");
    if (userDataElement && !isGuest) { try { const userData = JSON.parse(userDataElement.textContent.trim()); const nameField = document.getElementById("name"); if (nameField) nameField.value = userData.nev || ""; const emailField = document.getElementById("email"); if (emailField) { emailField.value = userData.email || ""; emailField.setAttribute("readonly", "true"); } const phoneField = document.getElementById("phone"); if (phoneField) phoneField.value = userData.telefonszam || ""; const shipPostal = document.getElementById("shipping-postal_code"); if (shipPostal) shipPostal.value = userData.szallitasi_iranyitoszam || ""; const shipCity = document.getElementById("shipping-city"); if (shipCity) shipCity.value = userData.szallitasi_telepules || ""; const shipAddr = document.getElementById("shipping-address"); if (shipAddr) shipAddr.value = userData.szallitasi_utca_hazszam || ""; const billPostal = document.getElementById("billing-postal_code"); if (billPostal) billPostal.value = userData.szamlazasi_iranyitoszam || ""; const billCity = document.getElementById("billing-city"); if (billCity) billCity.value = userData.szamlazasi_telepules || ""; const billAddr = document.getElementById("billing-address"); if (billAddr) billAddr.value = userData.szamlazasi_utca_hazszam || ""; } catch (e) { console.error("Hiba a felhasználói adatok feldolgozása közben:", e); } }

    const sameAsShippingCheckbox = document.getElementById("same-as-shipping");
    const billingCollapseElement = document.getElementById("billingCollapse");
    const billingToggle = document.querySelector('[data-bs-target="#billingCollapse"]');

    if (sameAsShippingCheckbox && billingCollapseElement && billingToggle) {
        const billingFields = ["postal_code", "city", "address"];
        const billingCollapseInstance = new bootstrap.Collapse(billingCollapseElement, { toggle: false });

        billingFields.forEach(fs => {
            const sf = document.getElementById(`shipping-${fs}`);
            const bf = document.getElementById(`billing-${fs}`);
            if (sf && bf && !sf.dataset.listenerAttached) {
                sf.addEventListener("input", () => {
                    if (sameAsShippingCheckbox.checked) {
                        bf.value = sf.value;
                        const r = validationRules.find(rl => rl.id === `billing-${fs}`);
                        if (r) validateField(bf, r);
                    }
                });
                sf.dataset.listenerAttached = 'true';
            }
        });

        sameAsShippingCheckbox.addEventListener("change", function () {
            const isChecked = this.checked;
            billingFields.forEach(fs => {
                const bf = document.getElementById(`billing-${fs}`);
                const sf = document.getElementById(`shipping-${fs}`);
                if (bf && sf) {
                    if (isChecked) {
                        bf.value = sf.value;
                        bf.setAttribute("readonly", true);
                        bf.classList.remove("is-invalid");
                        const r = validationRules.find(rl => rl.id === `billing-${fs}`);
                        if (r && r.regex.test(bf.value)) {
                            bf.classList.add("is-valid");
                        } else {
                            bf.classList.remove("is-valid");
                        }
                    } else {
                        bf.removeAttribute("readonly");
                        bf.classList.remove("is-invalid", "is-valid");
                    }
                }
            });

            if (isChecked) {
                billingCollapseInstance.hide();
                billingToggle?.classList.add("disabled");
                billingToggle?.setAttribute("aria-disabled", "true");
            } else {
                billingCollapseInstance.show();
                billingToggle?.classList.remove("disabled");
                billingToggle?.removeAttribute("aria-disabled");
            }
        });

        if (sameAsShippingCheckbox.checked) {
            sameAsShippingCheckbox.dispatchEvent(new Event('change'));
        } else {
            billingCollapseInstance.hide();
            if (billingToggle && !billingToggle.classList.contains('collapsed')) {
                billingToggle.classList.add('collapsed');
            }
            if (billingToggle) {
                billingToggle.setAttribute('aria-expanded', 'false');
                billingToggle.classList.remove("disabled");
                billingToggle.removeAttribute("aria-disabled");
            }
        }
    }
});