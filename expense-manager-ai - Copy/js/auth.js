/* ================= AUTH UTILITIES ================= */
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
}

/* ================= REGISTER ================= */
function registerUser() {
    const name = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return false;
    }

    const users = getUsers();

    if (users.some(u => u.email === email)) {
        alert("Email already registered");
        return false;
    }

    users.push({ name, email, password });
    saveUsers(users);

    alert("Registration successful. Please login.");
    window.location.href = "index.html";
    return false;
}

/* ================= LOGIN ================= */
function login() {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const users = getUsers();
    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        alert("Invalid email or password");
        return false;
    }

    localStorage.setItem("loggedUser", JSON.stringify(user));
    alert("Login successful");
    window.location.href = "dashboard.html";
    return false;
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}

/* ================= CHANGE PASSWORD ================= */
function changePassword() {
    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (!oldPass || !newPass || !confirmPass) {
        alert("Please fill all fields");
        return false;
    }

    if (newPass !== confirmPass) {
        alert("New passwords do not match");
        return false;
    }

    const user = getLoggedUser();
    if (!user) {
        alert("Session expired. Please login again.");
        window.location.href = "index.html";
        return false;
    }

    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);

    if (index === -1 || users[index].password !== oldPass) {
        alert("Current password is incorrect");
        return false;
    }

    users[index].password = newPass;
    saveUsers(users);

    alert("Password updated. Please login again.");
    logout();
    return false;
}

/* ================= DELETE ACCOUNT ================= */
function deleteAccount() {
    const confirmPass = document.getElementById("confirmPassword").value;

    const user = getLoggedUser();
    if (!user) {
        alert("Session expired.");
        window.location.href = "index.html";
        return false;
    }

    if (!confirmPass) {
        alert("Please enter your password");
        return false;
    }

    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);

    if (index === -1 || users[index].password !== confirmPass) {
        alert("Password incorrect");
        return false;
    }

    users.splice(index, 1);
    saveUsers(users);

    // REMOVE ALL USER DATA
    localStorage.removeItem(`expenses_${user.email}`);
    localStorage.removeItem(`aiBudget_${user.email}`);
    localStorage.removeItem(`dailyTip_${user.email}`);

    logout();
    alert("Your account has been permanently deleted.");
    return false;
}

/* ================= RESET FINANCIAL DATA ================= */
function resetUserData() {
    const user = getLoggedUser();
    if (!user) {
        alert("Session expired.");
        window.location.href = "index.html";
        return;
    }

    localStorage.removeItem(`expenses_${user.email}`);
    localStorage.removeItem(`aiBudget_${user.email}`);
    localStorage.removeItem(`dailyTip_${user.email}`);

    alert("All financial data has been reset.");
    window.location.href = "dashboard.html";
}

