const addBudget = document.querySelector("#addBudget");
const submitBudget = document.querySelector("#submitBudget");
const displayTotalBudget = document.querySelector("#totalBudgetText");

const displaySpentAmount = document.querySelector("#spentAmountText");
const displayRemainingAmount = document.querySelector("#remainingAmountText");

const addExpense = document.querySelector("#addAmount");
const submitExpense = document.querySelector("#submitExpense");

const category = document.querySelector("#category");
const expenseDate = document.querySelector("#expenseDate");

let budget = 0;
let expenseValue = 0;
let totalexpense = 0;
let balance = 0;

let allExpenses = [];

// ---------------------- Load Saved Data ----------------------
loadData();

function loadData() {
    const savedBudget = localStorage.getItem("budget");
    const savedExpenses = localStorage.getItem("expenses");

    if (savedBudget) {
        budget = Number(savedBudget);
        displayTotalBudget.innerText = budget;
    }

    if (savedExpenses) {
        allExpenses = JSON.parse(savedExpenses);

        totalexpense = allExpenses.reduce((sum, expense) => {
            return sum + expense.amount;
        }, 0);

        balance = budget - totalexpense;

        displaySpentAmount.innerText = totalexpense;
        displayRemainingAmount.innerText = balance;

        checkBalance();
        displayExpenses();
    }
}

// ---------------------- Budget ----------------------
submitBudget.addEventListener("click", (e) => {
    e.preventDefault();

    budget = Number(addBudget.value);

    if (budget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    addBudget.value = "";

    displayTotalBudget.innerText = budget;

    // Save budget
    localStorage.setItem("budget", budget);

    // Reset previous expenses
    clearValue();
});

// ---------------------- Expense ----------------------
submitExpense.addEventListener("click", (e) => {
    e.preventDefault();

    if (budget === 0) {
        alert("Enter Your Budget First");
        addExpense.value = "";
        return;
    }

    expenseValue = Number(addExpense.value);

    if (
        expenseValue <= 0 ||
        category.value === "" ||
        expenseDate.value === ""
    ) {
        alert("Please fill all expense details.");
        return;
    }

    addExpense.value = "";

    totalexpense += expenseValue;

    displaySpentAmount.innerText = totalexpense;

    balance = budget - totalexpense;

    displayRemainingAmount.innerText = balance;

    checkBalance();

    addExpenseToList();
});

// ---------------------- Balance ----------------------
function checkBalance() {
    if (balance < 0) {
        displayRemainingAmount.style.color = "red";
        alert("Your Balance is below zero. Kindly add a new Budget.");
    } else {
        displayRemainingAmount.style.color = "#2563eb";
    }
}

// ---------------------- Reset Data ----------------------
function clearValue() {
    displaySpentAmount.innerText = "";
    displayRemainingAmount.innerText = "";

    totalexpense = 0;
    balance = budget;

    allExpenses = [];

    localStorage.removeItem("expenses");

    displayExpenses();
}

// ---------------------- Add Expense ----------------------
function addExpenseToList() {
    const expense = {
        date: expenseDate.value,
        title: category.value,
        amount: expenseValue,
        id: Date.now()
    };

    expenseDate.value = "";

    allExpenses.push(expense);

    // Save expenses
    localStorage.setItem("expenses", JSON.stringify(allExpenses));

    displayExpenses();
}

// ---------------------- Display Expenses ----------------------
function displayExpenses() {
    const expenseList = document.querySelector("#expenseList");

    expenseList.innerHTML = "";

    allExpenses.forEach((expense) => {
        expenseList.innerHTML += `
            <div class="expense-item">
                <span>${expense.title}</span>
                <span>₹${expense.amount}</span>
                <span>${expense.date}</span>
                <button onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </div>
        `;
    });
}

// ---------------------- Delete Expense ----------------------
function deleteExpense(id) {

    allExpenses = allExpenses.filter((expense) => expense.id !== id);

    // Save updated list
    localStorage.setItem("expenses", JSON.stringify(allExpenses));

    // Recalculate totals
    totalexpense = allExpenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    balance = budget - totalexpense;

    displaySpentAmount.innerText = totalexpense;
    displayRemainingAmount.innerText = balance;

    checkBalance();

    displayExpenses();
}