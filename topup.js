// Function to go back to the previous page
function goBack() {
    window.history.back();
}

// Show Telebirr payment section
function openTelebirr() {
    document.getElementById("telebirrSection").style.display = "block";
}

// Placeholder function for M-Pesa (future use)
function openMpesa() {
    alert("M-Pesa payment method will be available soon.");
}

// Function to copy the Telebirr phone number to the clipboard
function copyPhoneNumber() {
    const phoneNumber = document.getElementById("phoneNumber").innerText;
    navigator.clipboard.writeText(phoneNumber)
}

// Submit payment proof to Telegram Bot
function submitPaymentProof() {
    let amount = document.getElementById("amount").value;
    let transactionId = document.getElementById("transactionId").value;
    let screenshotInput = document.getElementById("screenshot");
    let telegramId = localStorage.getItem("telegramId");
    let email = localStorage.getItem("userEmail");
    let phone = localStorage.getItem("userPhone");

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
            document.getElementById("telebirrSection").reset();
            window.location.href = "account.html";
        } else {
            alert("Error submitting payment proof. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to send payment proof.");
    });
}