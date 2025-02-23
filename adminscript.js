const API_URL = "https://your-api-url.com"; // Change to your backend API URL

// **1. Show Sections**
function showSection(sectionId) {
    document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

// **2. Load Top-Up Requests**
async function loadTopUps() {
    let response = await fetch(`${API_URL}/admin/topups`);
    let topups = await response.json();

    let topupList = document.getElementById("topupList");
    topupList.innerHTML = "";

    topups.forEach(topup => {
        let topupItem = document.createElement("div");
        topupItem.classList.add("topup-item");
        topupItem.innerHTML = `
            <p><strong>Name:</strong> ${topup.name}</p>
            <p><strong>Phone:</strong> ${topup.phone}</p>
            <p><strong>Amount:</strong> $${topup.amount}</p>
            <p><strong>Transaction ID:</strong> ${topup.transactionId}</p>
            <button onclick="approveTopUp('${topup.id}', ${topup.amount})">Approve</button>
            <button onclick="rejectTopUp('${topup.id}')">Reject</button>
        `;
        topupList.appendChild(topupItem);
    });
}

// **3. Approve Top-Up**
async function approveTopUp(id, amount) {
    let response = await fetch(`${API_URL}/admin/topup/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, amount })
    });

    let data = await response.json();
    if (data.success) {
        alert("Top-Up Approved!");
        loadTopUps();
    } else {
        alert("Failed to approve top-up.");
    }
}

// **4. Reject Top-Up**
async function rejectTopUp(id) {
    let response = await fetch(`${API_URL}/admin/topup/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });

    let data = await response.json();
    if (data.success) {
        alert("Top-Up Rejected!");
        loadTopUps();
    } else {
        alert("Failed to reject top-up.");
    }
}

// **5. Load User Orders**
async function loadOrders() {
    let response = await fetch(`${API_URL}/admin/orders`);
    let orders = await response.json();

    let orderList = document.getElementById("orderList");
    orderList.innerHTML = "";

    orders.forEach(order => {
        let orderItem = document.createElement("div");
        orderItem.classList.add("order-item");
        orderItem.innerHTML = `
            <p><strong>User:</strong> ${order.user}</p>
            <p><strong>Item:</strong> ${order.item}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <button onclick="completeOrder('${order.id}')">Complete</button>
        `;
        orderList.appendChild(orderItem);
    });
}

// **6. Complete Order**
async function completeOrder(id) {
    let response = await fetch(`${API_URL}/admin/order/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });

    let data = await response.json();
    if (data.success) {
        alert("Order Completed!");
        loadOrders();
    } else {
        alert("Failed to complete order.");
    }
}

// **7. Admin Logout**
function logout() {
    alert("Logged out!");
    window.location.href = "signup.html"; // Redirect to login page
}

// **8. Load Data on Page Load**
document.addEventListener("DOMContentLoaded", () => {
    loadTopUps();
    loadOrders();
});