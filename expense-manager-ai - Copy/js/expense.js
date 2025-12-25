/* ================= SESSION ================= */
const user = JSON.parse(localStorage.getItem("loggedUser"));
if (!user || !user.email) {
    window.location.href = "index.html";
}

/* ================= STORAGE KEY ================= */
const expensesKey = `expenses_${user.email}`;

/* ================= LOAD EXPENSES ================= */
let expenses = JSON.parse(localStorage.getItem(expensesKey)) || [];
displayExpenses();

/* ================= ADD EXPENSE ================= */
function addExpense() {
    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!title || amount <= 0) {
        alert("Please enter valid title and amount");
        return false;
    }

    expenses.push({
        id: Date.now(),              // ✅ unique ID
        title,
        amount,                      // ✅ number
        category,
        date: new Date().toISOString() // ✅ for monthly comparison
    });

    localStorage.setItem(expensesKey, JSON.stringify(expenses));

    // clear inputs
    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";

    displayExpenses();
    return false; // prevent form reload
}

/* ================= DISPLAY EXPENSES ================= */
function displayExpenses() {
    const table = document.getElementById("expenseTable");
    if (!table) return;

    table.innerHTML = "";

    if (expenses.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">No expenses added yet</td>
            </tr>
        `;
        return;
    }

    expenses.forEach(exp => {
        table.innerHTML += `
            <tr>
                <td>${exp.title}</td>
                <td>₹${exp.amount}</td>
                <td>${exp.category}</td>
                <td>
                    <button onclick="deleteExpense(${exp.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ================= DELETE EXPENSE ================= */
function deleteExpense(id) {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;

    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem(expensesKey, JSON.stringify(expenses));
    displayExpenses();
}

/* ================= TOTAL EXPENSE (UTILITY) ================= */
function getTotalExpense() {
    return expenses.reduce(
        (sum, exp) => sum + Number(exp.amount || 0),
        0
    );
}

/* ================= EXPORT CSV ================= */
function exportCSV() {
    if (expenses.length === 0) {
        alert("No expenses to export");
        return;
    }

    let csvContent = "Title,Amount,Category,Date\n";

    expenses.forEach(exp => {
        csvContent +=
            `${exp.title},${exp.amount},${exp.category},${exp.date}\n`;
    });

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Expense_Report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
