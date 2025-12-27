function generateBudget() {

    // CONSISTENT SESSION HANDLING
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!user || !user.email) {
        alert("Session expired. Please login again.");
        window.location.href = "index.html";
        return false;
    }

    // SAFE NUMBER PARSING
    const salary = Number(document.getElementById("salary").value);
    const rent = Number(document.getElementById("rent").value) || 0;
    const travel = Number(document.getElementById("travel").value) || 0;
    const other = Number(document.getElementById("other").value) || 0;
    const savingGoal = Number(document.getElementById("savingGoal").value) || 0;

    if (salary <= 0) {
        alert("Please enter a valid monthly salary");
        return false;
    }

    if (savingGoal > salary) {
        alert("Saving goal cannot be greater than salary");
        return false;
    }

    const totalFixed = rent + travel + other;
    const remaining = salary - totalFixed;

    let food = 0;
    let savings = 0;
    let message = "";
    let statusIcon = "";

    if (remaining < 0) {
        message = "Expenses exceed salary. Reduce fixed costs.";
        statusIcon = "🔴";
    } else {
        // SAFE DISTRIBUTION
        savings = remaining * 0.5;
        food = remaining * 0.5;

        if (savingGoal && savings >= savingGoal) {
            message = "Saving goal achievable ";
            statusIcon = "🟢";
        } else if (savings >= salary * 0.2) {
            message = "Healthy savings plan";
            statusIcon = "🟡";
        } else {
            message = "Savings are low. Try to reduce expenses.";
            statusIcon = "🟠";
        }
    }

    // UI UPDATE
    document.getElementById("result").innerHTML = `
        <h3> AI Budget Summary</h3>
        <ul>
            <li>🏠 Rent: ₹${rent}</li>
            <li>🚕 Travel: ₹${travel}</li>
            <li>🎉 Other Fixed: ₹${other}</li>
            <li>🍽 Food (Suggested): ₹${food.toFixed(0)}</li>
            <li>💰 Savings (Suggested): ₹${savings.toFixed(0)}</li>
            ${savingGoal ? `<li>🎯 Saving Goal: ₹${savingGoal}</li>` : ""}
        </ul>
        <strong>${statusIcon} ${message}</strong>
    `;

    // SAVE USER-WISE AI BUDGET (CORRECT KEY)
    const aiBudget = {
        salary,
        rent,
        travel,
        other,
        food,
        savings,
        savingGoal,
        remaining,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(
        `aiBudget_${user.email}`,
        JSON.stringify(aiBudget)
    );

    return false; // prevent page reload
}

