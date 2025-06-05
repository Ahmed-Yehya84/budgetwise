import { db, auth } from "./firebase.js";
import { ref, push, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { showConfirmDialog } from "./notifications.js";
import { showSuccessToast, showErrorToast } from "./toast.js";
import { renderExpensesChart } from "./chart.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transaction-form");
  const description = document.getElementById("description");
  const amount = document.getElementById("amount");
  const type = document.getElementById("type");
  const dateInput = document.getElementById("date");
  const category = document.getElementById("category");
  const tbody = document.getElementById("transaction-list");

  if (!form || !description || !amount || !type || !tbody) {
    console.error("Missing form elements");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("User not logged in.");
      return;
    }

    const uid = user.uid;
    const userTransactionsRef = ref(db, `users/${uid}/transactions`);

    // Add transaction to Firebase
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const transaction = {
        description: description.value.trim(),
        amount: parseFloat(amount.value),
        type: type.value,
        category: category.value,
        timestamp: dateInput.value
          ? new Date(dateInput.value).getTime()
          : Date.now(),
      };

      if (
        !transaction.description ||
        isNaN(transaction.amount) ||
        !["income", "expense"].includes(transaction.type)
      ) {
        showErrorToast("Invalid transaction input.");
        return;
      }

      push(userTransactionsRef, transaction)
        .then(() => {
          showSuccessToast("Transaction saved!");
          form.reset();
        })
        .catch((error) => {
          console.error("Error saving transaction:", error);
          showErrorToast("Error saving transaction");
        });
    });

    // Read and display transactions (sorted by date)
    onValue(userTransactionsRef, (snapshot) => {
      const data = snapshot.val();
      tbody.innerHTML = "";

      let totalIncome = 0;
      let totalExpenses = 0;

      const transactions = [];

      if (data) {
        const sortedEntries = Object.entries(data).sort(([, a], [, b]) => {
          return a.timestamp - b.timestamp; // Ascending (oldest to newest)
        });

        sortedEntries.forEach(([key, tx]) => {
          if (
            typeof tx.amount !== "number" ||
            !["income", "expense"].includes(tx.type)
          )
            return;

          if (tx.type === "income") totalIncome += tx.amount;
          if (tx.type === "expense") totalExpenses += tx.amount;

          transactions.push(tx);

          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="transactions__td">${new Date(
              tx.timestamp
            ).toLocaleDateString()}</td>
            <td class="transactions__td">${tx.description}</td>
            <td class="transactions__td">${tx.amount.toFixed(2)}</td>
            <td class="transactions__td">${tx.category || "—"}</td>
            <td class="transactions__td">
              <button class="transactions__delete-button" data-id="${key}">🗑️ Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });

        document.getElementById("total-income").textContent =
          totalIncome.toFixed(2);
        document.getElementById("total-expenses").textContent =
          totalExpenses.toFixed(2);
        document.getElementById("balance").textContent = (
          totalIncome - totalExpenses
        ).toFixed(2);

        document
          .querySelectorAll(".transactions__delete-button")
          .forEach((button) => {
            button.addEventListener("click", () => {
              const key = button.getAttribute("data-id");

              showConfirmDialog({
                title: "Are you sure?",
                text: "This transaction will be permanently deleted!",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  const transactionRef = ref(
                    db,
                    `users/${uid}/transactions/${key}`
                  );
                  remove(transactionRef)
                    .then(() =>
                      showSuccessToast("Transaction deleted successfully!")
                    )
                    .catch((error) => {
                      console.error("Delete failed:", error);
                      showErrorToast("Delete failed!");
                    });
                }
              });
            });
          });

        renderExpensesChart(transactions);
      } else {
        tbody.innerHTML = `<tr><td colspan="5" class="transactions__td">No transactions found.</td></tr>`;
        document.getElementById("total-income").textContent = "0.00";
        document.getElementById("total-expenses").textContent = "0.00";
        document.getElementById("balance").textContent = "0.00";
        renderExpensesChart([]);
      }
    });
  });
});
