const botToken = "7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA";
const ownerId = "5123439510";

// Function to go back to the previous
function goBack() {
    window.location.href = "../topup.html";
}

// Function to copy the Telebirr phone number to the clipboard
function copyPhoneNumber() {
    const phoneNumber = document.getElementById("phoneNumber").innerText;
    navigator.clipboard.writeText(phoneNumber)
}

// Function to submit payment proof to Telegram Bot
function submitPaymentProof() {
    let amount = document.getElementById("amount").value;
    let transactionId = document.getElementById("transactionId").value;
    let screenshotInput = document.getElementById("screenshot");

    let telegramId = localStorage.getItem("telegramId") || "Unknown User";
    let email = localStorage.getItem("userEmail") || "Not Provided";
    let phone = localStorage.getItem("phone") || "Not Provided";

    if (!amount || !transactionId || !screenshotInput.files.length) {
        alert("Please fill all fields and upload a screenshot.");
        return;
    }

    let file = screenshotInput.files[0];
    let formData = new FormData();
    formData.append("chat_id", ownerId);
    formData.append("photo", file);
    formData.append("caption", 
        `📌 *New Payment Proof Submitted*\n\n` +
        `👤 *User:* ${telegramId}\n` +
        `📧 *Email:* ${email}\n` +
        `📞 *Phone:* ${phone}\n` +
        `💰 *Amount:* ${amount} ETB\n` +
        `🔢 *Transaction ID:* ${transactionId}\n\n` +
        `✅ *Please verify and confirm the payment.*`
    );

    fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            alert("Payment proof submitted successfully!");
            document.getElementById("amount").value = "";
            document.getElementById("transactionId").value = "";
            document.getElementById("screenshot").value = "";
            window.location.href = "../topup.html";
        } else {
            alert("Error submitting payment proof. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to send payment proof.");
    });
}
