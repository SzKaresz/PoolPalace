document.addEventListener('DOMContentLoaded', function() {
    const cartItems = JSON.parse(document.getElementById('cart-items-data').textContent);
    const total = parseFloat(document.getElementById('total-price-data').textContent);
    const isGuest = JSON.parse(document.getElementById('is-guest-data').textContent);

    document.getElementById('place-order-btn').addEventListener('click', function() {
        const formData = {
            action: 'placeOrder',
            cart_items: cartItems,
            total: total
        };

        if (isGuest) {
            formData.name = document.getElementById('name').value;
            formData.email = document.getElementById('email').value;
            formData.phone = document.getElementById('phone').value;
            formData.postal_code = document.getElementById('postal_code').value;
            formData.city = document.getElementById('city').value;
            formData.address = document.getElementById('address').value;
        }

        fetch('megrendeles.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Megrendelés sikeresen leadva!');
                window.location.href = 'kosar.php';
            } else {
                alert('Hiba történt a megrendelés során: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hiba történt a megrendelés során.');
        });
    });
});