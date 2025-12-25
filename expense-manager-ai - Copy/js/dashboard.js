/* ================= SESSION ================= */
const user = JSON.parse(localStorage.getItem("loggedUser"));
if (!user || !user.email) {
    window.location.href = "index.html";
}

/* ================= STORAGE KEYS ================= */
const expensesKey = `expenses_${user.email}`;
const aiBudgetKey = `aiBudget_${user.email}`;
const tipKey = `dailyTip_${user.email}`;

/* ================= LOAD DATA ================= */
const expenses = JSON.parse(localStorage.getItem(expensesKey)) || [];
const aiBudget = JSON.parse(localStorage.getItem(aiBudgetKey));

/* ================= TOTAL EXPENSE ================= */
let total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

const totalExpenseEl = document.getElementById("totalExpense");
if (totalExpenseEl) {
    totalExpenseEl.innerText = `₹ ${total}`;
}

/* ================= AI BUDGET STATUS ================= */
let statusText = "No AI data available ❌";

if (aiBudget && aiBudget.salary) {
    const maxAllowed = aiBudget.salary * 0.8;

    if (total <= maxAllowed) {
        statusText = "✅ You are under budget";
    } else if (total <= aiBudget.salary) {
        statusText = "⚠️ Slightly over budget";
    } else {
        statusText = "❌ Over budget! Reduce expenses";
    }
}

const aiStatusEl = document.getElementById("aiStatus");
if (aiStatusEl) aiStatusEl.innerText = statusText;

/* ================= HEALTH METER ================= */
const healthFill = document.getElementById("healthFill");
const healthText = document.getElementById("healthText");

if (healthFill && healthText && aiBudget?.salary > 0) {
    const percentUsed = (total / aiBudget.salary) * 100;

    if (percentUsed <= 60) {
        healthFill.style.width = `${percentUsed}%`;
        healthFill.style.background = "green";
        healthText.innerText = "🟢 Healthy spending";
    } else if (percentUsed <= 80) {
        healthFill.style.width = `${percentUsed}%`;
        healthFill.style.background = "orange";
        healthText.innerText = "🟡 Warning: spending is increasing";
    } else {
        healthFill.style.width = "100%";
        healthFill.style.background = "red";
        healthText.innerText = "🔴 Overspending! Reduce expenses";
    }
} else if (healthText) {
    healthText.innerText =
        "Enter salary in AI Planner to see health status";
}

/* ================= CATEGORY ANALYSIS ================= */
const categoryTotals = {
    Food: 0,
    Rent: 0,
    Travel: 0,
    Shopping: 0,
    Other: 0
};

expenses.forEach(exp => {
    if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += Number(exp.amount || 0);
    }
});

const warningList = document.getElementById("categoryWarnings");
if (warningList) {
    warningList.innerHTML = "";

    if (aiBudget) {
        warningList.innerHTML +=
            categoryTotals.Food > (aiBudget.food || 0)
                ? `<li>❌ Food expense too high</li>`
                : `<li>✅ Food expense is healthy</li>`;

        warningList.innerHTML +=
            categoryTotals.Travel > (aiBudget.travel || 0)
                ? `<li>❌ Travel expense too high</li>`
                : `<li>✅ Travel expense is controlled</li>`;

        warningList.innerHTML +=
            categoryTotals.Other > (aiBudget.other || 0)
                ? `<li>❌ Other expenses need control</li>`
                : `<li>✅ Other expenses are fine</li>`;
    } else {
        warningList.innerHTML =
            `<li>⚠️ Enter salary in AI Planner to get AI warnings</li>`;
    }
}

/* ================= PIE CHART ================= */
const chartEl = document.getElementById("expenseChart");
if (chartEl && typeof Chart !== "undefined") {
    new Chart(chartEl, {
        type: "pie",
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: [
                    "#42a5f5",
                    "#66bb6a",
                    "#ffa726",
                    "#ab47bc",
                    "#ef5350"
                ]
            }]
        },
        options: { responsive: true }
    });
}

/* ================= SMART ALERT ================= */
(function showSmartAlerts() {
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alertMessage");
    if (!alertBox || !alertMessage || !aiBudget) return;

    if (total > aiBudget.salary) {
        alertBox.style.display = "block";
        alertMessage.innerText =
            "❌ You have exceeded your monthly salary limit!";
        alertBox.style.borderLeft = "5px solid red";
    } else if (categoryTotals.Food > (aiBudget.food || 0)) {
        alertBox.style.display = "block";
        alertMessage.innerText =
            "⚠️ Food expenses are higher than recommended!";
        alertBox.style.borderLeft = "5px solid orange";
    } else {
        alertBox.style.display = "block";
        alertMessage.innerText =
            "✅ Good job! Your spending is under control.";
        alertBox.style.borderLeft = "5px solid green";
    }
})();

/* ================= AI TIP OF THE DAY ================= */
(function showAITip() {
    const aiTipEl = document.getElementById("aiTip");
    if (!aiTipEl) return;

    const tips = [
        "Track every small expense – small leaks sink big ships.",
        "Try saving at least 20% of your income every month.",
        "Avoid impulse buying: wait 24 hours before big purchases.",
        "Reduce subscriptions you don’t actively use.",
        "Emergency fund should cover 3 months of expenses."
    ];

    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem(tipKey));

    if (saved?.date === today) {
        aiTipEl.innerText = saved.tip;
        return;
    }

    const tip = tips[Math.floor(Math.random() * tips.length)];
    localStorage.setItem(tipKey, JSON.stringify({ date: today, tip }));
    aiTipEl.innerText = tip;
})();

/* ================= MONTHLY COMPARISON ================= */
(function showMonthlyComparison() {
    const thisMonthEl = document.getElementById("thisMonthExpense");
    const lastMonthEl = document.getElementById("lastMonthExpense");
    const comparisonText = document.getElementById("monthComparisonText");

    if (!thisMonthEl || !lastMonthEl || !comparisonText) return;

    const now = new Date();
    const thisMonthKey = now.toISOString().slice(0, 7);

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = lastMonthDate.toISOString().slice(0, 7);

    let thisMonthTotal = 0;
    let lastMonthTotal = 0;

    expenses.forEach(exp => {
        const month = exp.date?.slice(0, 7);
        if (month === thisMonthKey) thisMonthTotal += Number(exp.amount || 0);
        if (month === lastMonthKey) lastMonthTotal += Number(exp.amount || 0);
    });

    thisMonthEl.innerText = thisMonthTotal;
    lastMonthEl.innerText = lastMonthTotal;

    if (lastMonthTotal === 0 && thisMonthTotal > 0) {
        comparisonText.innerText = "🆕 First month of tracking";
    } else if (thisMonthTotal > lastMonthTotal) {
        comparisonText.innerText =
            `⬆️ Spending increased by ₹${thisMonthTotal - lastMonthTotal}`;
    } else if (thisMonthTotal < lastMonthTotal) {
        comparisonText.innerText =
            `⬇️ Good job! You saved ₹${lastMonthTotal - thisMonthTotal}`;
    } else {
        comparisonText.innerText = "➖ Spending unchanged";
    }
})();
