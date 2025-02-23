// Redirect to signup.html on button click
function redirectToSignUp() {
    window.location.href = "signup.html";
}

// JavaScript to handle smooth transitions
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    const description = document.querySelector(".description");
    const buttonContainer = document.querySelector(".button-container");

    if (header) {
        header.style.opacity = "0";
        header.style.transform = "translateY(-20px)";
    }

    if (description) {
        description.style.opacity = "0";
        description.style.transform = "translateY(-20px)";
    }

    if (buttonContainer) {
        buttonContainer.style.opacity = "0";
        buttonContainer.style.transform = "translateY(-20px)";
    }

    // Show header first
    setTimeout(() => {
        if (header) {
            header.style.opacity = "1";
            header.style.transform = "translateY(0)";
            header.style.transition = "opacity 1s ease, transform 1s ease";
        }
    }, 500); // Delay for header to appear

    // Show description after header
    setTimeout(() => {
        if (description) {
            description.style.opacity = "1";
            description.style.transform = "translateY(0)";
            description.style.transition = "opacity 1s ease, transform 1s ease";
        }
    }, 1500); // Delay for description to appear

    // Show button after description
    setTimeout(() => {
        if (buttonContainer) {
            buttonContainer.style.opacity = "1";
            buttonContainer.style.transform = "translateY(0)";
            buttonContainer.style.transition = "opacity 1s ease, transform 1s ease";
        }
    }, 2500); // Delay for button to appear
});