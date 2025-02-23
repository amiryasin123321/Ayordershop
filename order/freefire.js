// Function to show the selected category and animate the underline
function showItems(category) {
    // Get all the menu buttons and remove the 'active' class from all of them
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add the 'active' class to the selected button
    const activeButton = document.querySelector(`.menu-btn[onclick="showItems('${category}')"]`);
    activeButton.classList.add('active');

    // Update the content based on the selected category
    const itemContainer = document.getElementById('item-container');
    itemContainer.innerHTML = ""; // Clear previous items

    if (productData[category]) {
        productData[category].forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("item");
            itemElement.innerHTML = `
                <span>${item.name} - ${item.price}</span>
                <button class="add-to-cart" onclick="addToCart('${item.name}', '${item.price}')">
                    <img src="https://cdn-icons-png.flaticon.com/512/3737/3737372.png" alt="Add to Cart" width="20" > BUY
                </button>
            `;
            itemContainer.appendChild(itemElement);
        });
    } else {
        itemContainer.innerHTML = "<p>No items available.</p>";
    }

    // Animate the swipe line to the active category with smooth transition
    const swipeLine = document.querySelector('.swipe-line');
    const activeButtonRect = activeButton.getBoundingClientRect();
    swipeLine.style.transition = "all 0.3s ease"; // Smooth transition for the swipe line
    swipeLine.style.left = `${activeButtonRect.left + window.scrollX}px`;
    swipeLine.style.width = `${activeButtonRect.width}px`;
}

// Function to add items to cart (store in localStorage for simplicity)
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}

// Initialize the swipe line and set default category
document.addEventListener('DOMContentLoaded', () => {
    const swipeLine = document.createElement('div');
    swipeLine.classList.add('swipe-line');
    document.querySelector('.menu-container').appendChild(swipeLine);
    showItems('Diamond-ff'); // Set a default category
});