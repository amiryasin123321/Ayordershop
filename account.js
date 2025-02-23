document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("userAccount"));
    if (!userData) {
        window.location.href = "signup.html"; // Redirect if no user data is found
        return;
    }

    document.getElementById("email").textContent = userData.email;
    document.getElementById("phone").textContent = userData.phone;

    getTelegramUserInfo(userData.telegramId).then(userInfo => {
        if (userInfo) {
            document.getElementById("telegramName").textContent = userInfo.name;
            document.getElementById("telegramNameText").textContent = userInfo.name;
            document.getElementById("telegramPicText").textContent = userInfo.profilePicUrl ? "✅" : "❌";

            if (userInfo.profilePicUrl) {
                document.getElementById("telegramPic").style.backgroundImage = `url(${userInfo.profilePicUrl})`;
            } else {
                document.getElementById("noPicMessage").style.display = "block";
            }
        }
    });
});

function goBack() {
    window.history.back();
}

function logout() {
    localStorage.removeItem("userAccount");
    window.location.href = "signup.html"; // Redirect to login
}

// Fetch Telegram User Info
async function getTelegramUserInfo(telegramId) {
    const botToken = "7622062919:AAEuthHvVWDy5nrT7zb9XYu4wIutg9sMvZA"; // Replace with your bot token
    try {
        const chatResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat?chat_id=${telegramId}`);
        const chatData = await chatResponse.json();

        const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${telegramId}&limit=1`);
        const photoData = await photoResponse.json();

        if (chatData.ok) {
            const fullName = chatData.result.first_name + (chatData.result.last_name ? ' ' + chatData.result.last_name : '');
            let profilePicUrl = null;

            if (photoData.ok && photoData.result.photos.length > 0) {
                const photoFileId = photoData.result.photos[0][0].file_id;
                const fileResponse = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${photoFileId}`);
                const fileData = await fileResponse.json();

                profilePicUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            }

            return {
                name: fullName,
                profilePicUrl: profilePicUrl
            };
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
    return null;
}