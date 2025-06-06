import { db, auth } from "./firebase.js";
import { ref, push, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { showConfirmDialog } from "./notifications.js";
import { showSuccessToast, showErrorToast } from "./toast.js";
import { renderExpensesChart } from "./chart.js";
import { setupPdfExport } from "./pdf.js";
import { setupThemeToggle } from "./toggle-theme.js";

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();

  const form = document.getElementById("transaction-form");
  const description = document.getElementById("description");
  const amount = document.getElementById("amount");
  const type = document.getElementById("type");
  const dateInput = document.getElementById("date");
  const category = document.getElementById("category");
  const tbody = document.getElementById("transaction-list");
  const monthFilter = document.getElementById("month-filter");

  function showSkeletonLoading(target, rows = 5, cols = 5) {
    target.innerHTML = "";
    for (let i = 0; i < rows; i++) {
      const row = document.createElement("tr");
      row.classList.add("transaction-skeleton__row");
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement("td");
        cell.classList.add("transaction-skeleton__cell");
        row.appendChild(cell);
      }
      target.appendChild(row);
    }
  }

  if (monthFilter && !monthFilter.value) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    monthFilter.value = `${yyyy}-${mm}`;
  }

  if (!form || !description || !amount || !type || !tbody) {
    console.error("Missing form elements");
    return;
  }

  setupPdfExport(monthFilter); // 👈 Only calling PDF download

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("User not logged in.");
      return;
    }

    const uid = user.uid;
    const userTransactionsRef = ref(db, `users/${uid}/transactions`);
    let allTransactions = {};

    function displayTransactions(data, selectedMonth = null) {
      tbody.innerHTML = "";
      let totalIncome = 0;
      let totalExpenses = 0;
      const transactions = [];

      if (data) {
        Object.entries(data)
          .map(([key, tx]) => ({ id: key, ...tx }))
          .filter((tx) => {
            if (!selectedMonth) return true;
            const txDate = new Date(tx.timestamp);
            const [year, month] = selectedMonth.split("-");
            return (
              txDate.getFullYear() === parseInt(year) &&
              txDate.getMonth() + 1 === parseInt(month)
            );
          })
          .sort((a, b) => a.timestamp - b.timestamp)
          .forEach((tx) => {
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
                <button class="transactions__delete-button" data-id="${
                  tx.id
                }">🗑️ Delete</button>
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
    }

    // Show skeleton while loading data
    showSkeletonLoading(tbody);

    onValue(userTransactionsRef, (snapshot) => {
      allTransactions = snapshot.val() || {};
      displayTransactions(allTransactions, monthFilter?.value || null);
    });

    if (monthFilter) {
      monthFilter.addEventListener("change", () => {
        displayTransactions(allTransactions, monthFilter.value);
      });
    }
  });
});
