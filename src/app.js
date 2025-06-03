import { db } from "./firebase.js";
import { ref, push, onValue, remove } from "firebase/database";
import { showConfirmDialog } from "./notifications.js";
import { showSuccessToast, showErrorToast } from "./toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transaction-form");
  const description = document.getElementById("description");
  const amount = document.getElementById("amount");
  const type = document.getElementById("type");
  const tbody = document.getElementById("transaction-list");

  if (!form || !description || !amount || !type || !tbody) {
    console.error("Missing form elements");
    return;
  }

  // Add transaction to Firebase
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const transaction = {
      description: description.value,
      amount: parseFloat(amount.value),
      type: type.value,
      timestamp: Date.now(),
    };

    const transactionsRef = ref(db, "transactions");
    push(transactionsRef, transaction)
      .then(() => {
        showSuccessToast("Transaction saved!");

        form.reset();
      })
      .catch((error) => {
        console.error("Error saving transaction:", error);
        showErrorToast("Error saving transaction");
      });
  });

  // Read and display transactions
  const transactionsRef = ref(db, "transactions");

  onValue(transactionsRef, (snapshot) => {
    const data = snapshot.val();
    tbody.innerHTML = "";

    // Reset totals
    let totalIncome = 0;
    let totalExpenses = 0;

    if (data) {
      Object.entries(data).forEach(([key, tx]) => {
        if (!tx || typeof tx.amount !== "number" || !tx.type) return;
        if (tx.type === "income") {
          totalIncome += tx.amount;
        } else if (tx.type === "expense") {
          totalExpenses += tx.amount;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
        <td class="transactions__td">${tx.description}</td>
        <td class="transactions__td">${tx.amount.toFixed(2)}</td>
        <td class="transactions__td">${tx.type}</td>
        <td class="transactions__td">${new Date(
          tx.timestamp
        ).toLocaleDateString()}</td>
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
                const transactionRef = ref(db, `transactions/${key}`);
                remove(transactionRef)
                  .then(() =>
                    showSuccessToast("Transaction deleted successfully!")
                  )
                  .catch((error) => {
                    showErrorToast("Delete failed!");
                    console.error("Delete failed:", error);
                  });
              }
            });
          });
        });
    } else {
      tbody.innerHTML = `<tr><td colspan="5" class="transactions__td">No transactions found.</td></tr>`;
      document.getElementById("total-income").textContent = "0.00";
      document.getElementById("total-expenses").textContent = "0.00";
      document.getElementById("balance").textContent = "0.00";
    }
  });
});
