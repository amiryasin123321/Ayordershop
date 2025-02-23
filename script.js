const botToken = "7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA"; // Replace with your actual bot token

// Send the verification code to the Telegram user
function sendCode() {
    let telegramId = document.getElementById("telegramId").value;
    let errorMessage = document.getElementById("error-message");

    if (!telegramId) {
        errorMessage.innerHTML = "Please enter your Telegram ID.";
        return;
    }

    // Hide any error message when proceeding to next step
    errorMessage.style.display = "none"; // Hide error message

    // Show processing state
    let btn = document.querySelector(".send-code-btn");
    btn.innerText = "Processing...";
    btn.classList.add("processing");

    let verificationCode = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit code
    localStorage.setItem("telegramCode", verificationCode);
    localStorage.setItem("telegramId", telegramId);

    // Send the verification code to the Telegram bot
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: telegramId,
            text: `Login code:  <code>${verificationCode}</code>. Do not give this code to anyone, even if they say they are from the website!

This code can be used to log in to your Telegram account. We never ask for it for anything else.

If you didn't request this code by trying to log in on another device, simply ignore this message.`,
            parse_mode: "HTML"  // Ensures HTML tags like <b> are parsed correctly
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            // If the code is sent successfully, hide the first step and show the second step
            document.getElementById("step1").style.display = "none";
            document.getElementById("step2").style.display = "block";

            setTimeout(() => {
                btn.innerText = "Code Sent ✔";
                btn.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
            }, 2000); // 2 seconds delay for effect

            // Fetch and display user info (for profile pic and name)
            getTelegramUserInfo(telegramId).then(userInfo => {
                if (userInfo) {
                    displayUserInfo(userInfo);
                }
            });
        } else {
            // Show an error message if sending the code fails
            errorMessage.innerHTML = `
                Error sending code. Please check your Telegram ID. 
                If you haven't started the bot, please 
                <a href="https://t.me/ayordershopBot?start=website" target="_blank">start the bot here</a>.
                After starting the bot, click "processing" again.`;
            errorMessage.style.display = "block"; // Ensure error message is shown if there's an issue
        }
    })
    .catch(error => {
        errorMessage.innerHTML = "Failed to send code. Please try again later.";
        errorMessage.style.display = "block"; // Show error message on failure
    });
}

// Handle /start command from the user to send a welcome message
function handleStartCommand() {
    const startMessage = "Welcome to our bot! 🎉\n\nPlease follow the steps to complete your registration and get started. If you need assistance, type 'Help'.";
    
    // Get the Telegram user ID from URL parameters or query string
    let telegramId = new URLSearchParams(window.location.search).get('start');
    if (telegramId) {
        // Send the welcome message to the user when they start the bot
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: telegramId,
                text: startMessage,
                parse_mode: "HTML"
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Welcome message sent successfully.");
        })
        .catch(error => {
            console.error("Error sending welcome message:", error);
        });
    }
}

// Get Telegram user info (using getChat API to get name and getUserProfilePhotos API to get profile picture)
async function getTelegramUserInfo(telegramId) {
    try {
        // Fetch user details (name)
        const chatResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${telegramId}`);
        const chatData = await chatResponse.json();

        // Fetch user's profile photo
        const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${telegramId}&limit=1`);
        const photoData = await photoResponse.json();

        if (chatData.ok && photoData.ok) {
            const fullName = chatData.result.first_name + (chatData.result.last_name ? ' ' + chatData.result.last_name : '');
            let profilePicUrl = null;

            if (photoData.result.photos.length > 0) {
                const photoFileId = photoData.result.photos[0][0].file_id;
                const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${photoFileId}`);
                const fileData = await fileResponse.json();

                profilePicUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            }

            return {
                name: fullName,
                profilePicUrl: profilePicUrl
            };
        } else {
            return { name: telegramId, profilePicUrl: null }; // No profile picture available
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

// Display user info (name and profile picture)
function displayUserInfo(userInfo) {
    const userInfoDiv = document.getElementById('userInfo');
    const telegramPicDiv = document.getElementById('telegramPic');
    const telegramNamePara = document.getElementById('telegramName');
    const noPicMessage = document.getElementById('noPicMessage');

    // Display name
    telegramNamePara.textContent = userInfo.name;

    // Check if user has a profile picture
    if (userInfo.profilePicUrl) {
        telegramPicDiv.style.backgroundImage = `url(${userInfo.profilePicUrl})`;
        telegramPicDiv.style.backgroundSize = 'cover'; // To make the image fit within the circle
        telegramPicDiv.style.display = 'inline-block';
        noPicMessage.style.display = 'none';  // Hide "no pic" message
    } else {
        telegramPicDiv.style.display = 'none'; // Hide profile pic
        noPicMessage.style.display = 'block';  // Show "no pic" message
    }

    userInfoDiv.style.display = 'block';  // Show the user info section
}

// Verify the code entered by the user
function verifyCode() {
    let enteredCode = document.getElementById("verifyCode").value;
    let storedCode = localStorage.getItem("telegramCode");

    if (enteredCode === storedCode) {
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
    } else {
        document.getElementById("error-message").innerHTML = "Incorrect verification code. Please try again.";
        document.getElementById("error-message").style.display = "block"; // Show error if code is incorrect
    }
}

// Save the account details and validate them
function saveAccount() {
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let telegramId = localStorage.getItem("telegramId");

    // Validate email (must contain "@" and ".")
    if (!email || !email.includes("@") || !email.includes(".")) {
        document.getElementById("error-message").innerHTML = "Please enter a valid email address.";
        return;
    }

    // Validate phone number (must be numeric and have length of 13, start with +251)
    if (!phone || phone.length !== 13 || !phone.startsWith("+251") || isNaN(phone.substring(1))) {
        document.getElementById("error-message").innerHTML = "Enter a valid phone number (starts with +251 and contains only numbers).";
        return;
    }

    // Save user data to localStorage
    let userData = { telegramId, email, phone };
    localStorage.setItem("userAccount", JSON.stringify(userData));

    document.getElementById("error-message").innerHTML = "Account created successfully!";
    window.location.href = "home.html"; // Redirect to the main website page
}