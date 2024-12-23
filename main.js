const transactions = [
    {
        id: Date.now() + 1, // Ensuring unique IDs
        description: "Monthly Salary",
        amount: 3500,
        type: "income",
    },
    {
        id: Date.now() + 2, // Ensuring unique IDs
        description: "Freelance Income",
        amount: 1500,
        type: "income",
    }
];

class BudgetTracker {
    constructor() {
        this.transactions = this.loadTransaction();
        this.form = document.getElementById("transactionform");
        this.transactionList = document.getElementById("transactionlist");
        this.balanceElement = document.getElementById("balance");

        this.initEventListeners();
        this.renderTransactions();
        this.updateBalance();
    }

    loadTransaction() {
        return transactions;
    }

    initEventListeners() {
        // Example: Adding event listener for delete buttons
        this.transactionList.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-btn")) {
                const id = parseInt(event.target.dataset.id, 10);
                this.deleteTransaction(id);
            }
        });

        // Form submission handling
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const description = this.form.elements["description"].value;
            const amount = parseFloat(this.form.elements["amount"].value);
            const type = this.form.elements["type"].value;

            this.addTransaction({ 
                id: Date.now(), 
                description, 
                amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount), 
                type 
            });

            this.form.reset();
        });
    }

    renderTransactions() {
        this.transactionList.innerHTML = "";
        this.transactions
            .slice()
            .sort((a, b) => b.id - a.id)
            .forEach((transaction) => {
                const transactionDiv = document.createElement("div");
                transactionDiv.classList.add("transaction", transaction.type);
                transactionDiv.innerHTML = `
                    <span>${transaction.description}</span>
                    <span class="transaction-amount-container">₹${Math.abs(transaction.amount).toFixed(2)} 
                    <button class="delete-btn" data-id="${transaction.id}">Delete</button></span>
                `;
                this.transactionList.appendChild(transactionDiv);
            });
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
        this.renderTransactions();
        this.updateBalance();
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.renderTransactions();
        this.updateBalance();
    }

    updateBalance() {
        const balance = this.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        this.balanceElement.textContent = `₹${balance.toFixed(2)}`;
    }
}


const budgetTracker = new BudgetTracker();
