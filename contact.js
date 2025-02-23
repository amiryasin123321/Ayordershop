document.addEventListener("DOMContentLoaded", () => {
    // Back Button Redirection
    const backButton = document.getElementById("backBtn");
    backButton.addEventListener("click", () => {
        window.location.href = "home.html";  // Redirect to the home page
    });

    // Telegram Bot Message Sending Logic
    const botToken = "7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA";
    const chatId = "5123439510";  

    const userData = JSON.parse(localStorage.getItem("userAccount"));
    if (!userData) {
        window.location.href = "signup.html"; // Redirect if no user data is found
        return;
    }

    document.getElementById("contactForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const message = document.getElementById("message").value.trim();
        const statusMessage = document.getElementById("statusMessage");
        const sendBtn = document.getElementById("sendBtn");

        if (!message) {
            statusMessage.innerHTML = "⚠️ Please enter a message.";
            statusMessage.style.color = "yellow";
            return;
        }

        statusMessage.innerHTML = "⏳ Sending...";
        statusMessage.style.color = "white";
        sendBtn.innerText = "Sending...";
        sendBtn.disabled = true;

        const text = `📩 New Contact Message:
        \n📧 Email: ${userData.email}
        \n📞 Phone: ${userData.phone}
        \n🆔 Telegram ID: ${userData.telegramId}
        \n💬 Message: ${message}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "HTML" })
        }).then(response => response.json()).then(() => {
            statusMessage.innerHTML = "✅ Message Sent!";
            statusMessage.style.color = "lime";
            sendBtn.innerText = "Send";
            sendBtn.disabled = false;
            document.getElementById("contactForm").reset();
        }).catch(() => {
            statusMessage.innerHTML = "❌ Failed to send.";
            statusMessage.style.color = "red";
            sendBtn.innerText = "Send";
            sendBtn.disabled = false;
        });
        
    });
});