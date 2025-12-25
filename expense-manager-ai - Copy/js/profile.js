/* ================= SESSION ================= */
const user = JSON.parse(localStorage.getItem("loggedUser"));
if (!user || !user.email) {
    window.location.href = "index.html";
}

/* ================= STORAGE KEYS ================= */
const expensesKey = `expenses_${user.email}`;
const aiBudgetKey = `aiBudget_${user.email}`;

/* ================= LOAD DATA ================= */
const expenses = JSON.parse(localStorage.getItem(expensesKey)) || [];
const aiBudget = JSON.parse(localStorage.getItem(aiBudgetKey));

/* ================= CALCULATE TOTAL EXPENSE ================= */
const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
);

/* ================= FILL PROFILE DATA ================= */
const usernameEl = document.getElementById("profileUsername");
const expensesEl = document.getElementById("profileExpenses");
const salaryEl = document.getElementById("profileSalary");
const savingsEl = document.getElementById("profileSavings");
const goalEl = document.getElementById("profileGoal");

if (usernameEl) usernameEl.innerText = user.name || user.email;
if (expensesEl) expensesEl.innerText = totalExpense;

if (aiBudget) {
    if (salaryEl) salaryEl.innerText = aiBudget.salary;
    if (savingsEl) savingsEl.innerText = aiBudget.savings;
    if (goalEl)
        goalEl.innerText =
            aiBudget.savingGoal ? aiBudget.savingGoal : "Not set";
} else {
    if (salaryEl) salaryEl.innerText = "Not set";
    if (savingsEl) savingsEl.innerText = "0";
    if (goalEl) goalEl.innerText = "Not set";
}
