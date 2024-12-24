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
        return JSON.parse(localStorage.getItem("transaction")) || [];
    }

    saveTransaction() {
        localStorage.setItem("transaction", JSON.stringify(this.transactions));
    }

    initEventListeners() {
        // Handle transaction deletion
        this.transactionList.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-btn")) {
                const id = parseInt(event.target.dataset.id, 10);
                if (!isNaN(id)) {
                    this.deleteTransaction(id);
                }
            }
        });

        // Handle form submission
        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            const description = this.form.elements["description"].value.trim();
            const amount = parseFloat(this.form.elements["amount"].value);
            const type = this.form.elements["type"].value;

            if (!description || isNaN(amount)) {
                alert("Please enter a valid description and amount.");
                return;
            }

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
            .sort((a, b) => b.id - a.id) // Sort by newest first
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
        this.saveTransaction();
        this.renderTransactions();
        this.updateBalance();
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        this.saveTransaction();
        this.renderTransactions();
        this.updateBalance();
    }

    updateBalance() {
        const balance = this.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        this.balanceElement.textContent = `₹${balance.toFixed(2)}`;
    }
}

// Initialize the BudgetTracker
const budgetTracker = new BudgetTracker();
