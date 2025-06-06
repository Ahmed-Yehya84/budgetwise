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

  setupPdfExport(monthFilter);

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("User not logged in.");
      return;
    }

    const appSection = document.getElementById("app");
    if (appSection) {
      appSection.style.display = "block";
      requestAnimationFrame(() => {
        appSection.classList.add("visible");
      });
    }

    const uid = user.uid;
    const userTransactionsRef = ref(db, `users/${uid}/transactions`);
    let transactions = {};

    const clearAllButton = document.getElementById("clear-data");

    function updateClearAllVisibility(hasTransactions) {
      if (clearAllButton) {
        clearAllButton.style.display = hasTransactions
          ? "inline-block"
          : "none";
      }
    }

    function displayTransactions(data, selectedMonth = null) {
      tbody.innerHTML = "";
      let totalIncome = 0;
      let totalExpenses = 0;
      const transactionsForChart = [];

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

            transactionsForChart.push(tx);

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

        renderExpensesChart(transactionsForChart);
        updateClearAllVisibility(transactionsForChart.length > 0);
      } else {
        tbody.innerHTML = `<tr><td colspan="5" class="transactions__td">No transactions found.</td></tr>`;
        document.getElementById("total-income").textContent = "0.00";
        document.getElementById("total-expenses").textContent = "0.00";
        document.getElementById("balance").textContent = "0.00";
        renderExpensesChart([]);
        updateClearAllVisibility(false);
      }
    }

    showSkeletonLoading(tbody);

    onValue(userTransactionsRef, (snapshot) => {
      transactions = snapshot.val() || {};
      displayTransactions(transactions, monthFilter?.value || null);
    });

    if (monthFilter) {
      monthFilter.addEventListener("change", () => {
        displayTransactions(transactions, monthFilter.value);
      });
    }

    if (clearAllButton) {
      clearAllButton.addEventListener("click", () => {
        showConfirmDialog({
          title: "Are you absolutely sure?",
          text: "This will permanently delete all your transactions. This action cannot be undone!",
          confirmButtonText: "Yes, delete everything!",
        }).then((result) => {
          if (result.isConfirmed) {
            clearAllButton.disabled = true;
            const originalText = clearAllButton.textContent;
            clearAllButton.textContent = "Deleting...";

            remove(userTransactionsRef)
              .then(() =>
                showSuccessToast("All transactions deleted successfully!")
              )
              .catch((error) => {
                console.error("Clear All failed:", error);
                showErrorToast("Failed to delete transactions.");
              })
              .finally(() => {
                clearAllButton.disabled = false;
                clearAllButton.textContent = originalText;
              });
          }
        });
      });
    }

    // ✅ Add transaction
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const desc = description.value.trim();
      const amt = parseFloat(amount.value);
      const selectedType = type.value;
      const categoryVal = category.value;
      const dateVal = dateInput.value;

      if (!desc || isNaN(amt) || !selectedType || !dateVal) {
        showErrorToast("Please fill in all fields correctly.");
        return;
      }

      const timestamp = new Date(dateVal).getTime();
      const newTransaction = {
        description: desc,
        amount: amt,
        type: selectedType,
        category: categoryVal,
        timestamp,
      };

      push(ref(db, `users/${uid}/transactions`), newTransaction)
        .then(() => {
          showSuccessToast("Transaction added!");
          form.reset();
          // ✅ Clear the date to show placeholder
          setTimeout(() => {
            dateInput.value = "";
          }, 0);
        })
        .catch((error) => {
          console.error("Add transaction error:", error);
          showErrorToast("Failed to add transaction.");
        });
    });
  });
});
