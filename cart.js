// Function to load the cart items from localStorage and display them on the cart page
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartContainer = document.getElementById('cart-items');
  const totalAmountElem = document.getElementById('total-amount');

  // Clear the container before adding items
  cartContainer.innerHTML = '';
  let totalAmount = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <span>${item.name} - ${item.price} <br> Added on: ${item.date}</span>
        <button class="remove-button" data-index="${index}">
            <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Remove Icon">
        </button>
      `;
      cartContainer.appendChild(cartItem);

      // Add the item's price to total amount
      totalAmount += parseFloat(item.price.replace(' BIRR', '').replace(',', ''));
    });

    // Display total amount
    totalAmountElem.innerText = `${totalAmount.toFixed(2)} BIRR`;
  }
}

// Function to handle the remove item action
document.getElementById('cart-items').addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('remove-button')) {
    const itemIndex = event.target.getAttribute('data-index');
    removeFromCart(itemIndex);
  }
});

// Function to remove item from cart
function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Function to handle the order button click
document.querySelector('.order-button').addEventListener('click', function() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = parseFloat(document.getElementById('total-amount').innerText.replace(' BIRR', '').replace(',', ''));

  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before placing an order.");
    return;
  }

  // Fetch user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userAccount'));

  if (!userData) {
    alert("Please login before placing an order.");
    return;
  }

  // Format the cart items and send the order details to the bot
  let orderDetails = cart.map(item => `${item.name} - ${item.price}`).join('\n');
  const orderMessage = `
  New Order from Cart:
    ${orderDetails}
    
  Total Amount: ${totalAmount.toFixed(2)} BIRR
    
    Customer Details:
  Name: ${userData.name}
  Email: ${userData.email}
  Phone: ${userData.phone}
  Telegram ID: ${userData.telegramId}
  `;

  sendOrderToBot(orderMessage);
});

// Function to send the order details to the bot
function sendOrderToBot(orderMessage) {
  const botAPI = 'https://api.telegram.org/bot7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA/sendMessage';
  const ownerId = '5123439510';

  const url = `${botAPI}?chat_id=${ownerId}&text=${encodeURIComponent(orderMessage)}`;

  // Sending the order to Telegram bot
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('cart'); // Clear the cart after placing the order
        window.location.href = 'home.html'; // Redirect to home or another page
      } else {
        alert('Error placing order. Please try again later.');
      }
    })
    .catch(error => {
      alert('Error sending order to bot: ' + error.message);
    });
}

// Run the loadCart function when the page loads
window.onload = loadCart;