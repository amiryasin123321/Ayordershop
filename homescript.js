// Function to toggle the visibility of the hamburger menu
function toggleMenu() {
  const menuItems = document.getElementById("menu-items");
  menuItems.style.display = menuItems.style.display === "none" || menuItems.style.display === "" ? "block" : "none";
}

// Toggle menu visibility when the hamburger icon is clicked
document.getElementById("hamburger-icon").addEventListener("click", function () {
  document.getElementById("menu-items").classList.toggle("active");
});

// Function to open the respective page based on the menu item clicked
function openPage(page) {
  window.location.href = page + ".html"; // Redirect to the respective page like home.html, account.html, etc.
}

// Function to show subcategories when a category button is clicked
function showSubcategories(category) {
  // Hide all categories first
  hideAllCategories();

  // Show the specific subcategory based on the category clicked
  if (category === 'telegram') {
    document.getElementById('telegram-subcategories').style.display = 'block';
  } else if (category === 'instagram') {
    document.getElementById('instagram-subcategories').style.display = 'block';
  } else if (category === 'tiktok') {
    document.getElementById('tiktok-subcategories').style.display = 'block';
  } else if (category === 'freefire') {
    // You can add Free Fire specific functionality if needed
  } else if (category === 'pubg') {
    // You can add PUBG specific functionality if needed
  }

  // Show the back button when any category is selected
  document.getElementById('back-button-container').style.display = 'block';
}

// Function to hide all categories
function hideAllCategories() {
  const subcategories = document.querySelectorAll('.sub-category');
  subcategories.forEach(subcategory => {
    subcategory.style.display = 'none';
  });

  // Hide the game categories (if any subcategory is active)
  document.getElementById('back-button-container').style.display = 'none';
}

// Function to go back to the main categories
function goBack() {
  // Hide all subcategories and show the main categories
  hideAllCategories();

  // Hide the back button
  document.getElementById('back-button-container').style.display = 'none';
}

// Function to filter the category (you can implement the specific filtering logic)
function filterCategory(categoryName) {
  // Implement filtering logic here (e.g., display content based on the category)
}