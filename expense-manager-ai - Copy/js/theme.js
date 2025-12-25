/* ================= THEME HANDLING ================= */

// Apply saved theme on load
const savedTheme = localStorage.getItem("theme") || "light";

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

/* Toggle theme (USED EVERYWHERE IN HTML) */
function toggleTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}
