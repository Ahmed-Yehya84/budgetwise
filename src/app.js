import { db } from "./firebase.js";
import { ref, push, onValue, remove } from "firebase/database";
import { showConfirmDialog } from "./notifications.js";
import { showSuccessToast, showErrorToast } from "./toast.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const auth = getAuth(app);

// DOM Elements
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const appSection = document.getElementById("app");

const logoutButton = document.getElementById("logout-button");

const showLoginLink = document.getElementById("show-login");
const showSignupLink = document.getElementById("show-signup");

// Toggle views based on user login state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    loginSection.style.display = "none";
    signupSection.style.display = "none";
    appSection.style.display = "block";
    logoutButton.style.display = "inline-block";
  } else {
    // User is not logged in
    loginSection.style.display = "block";
    signupSection.style.display = "none";
    appSection.style.display = "none";
    logoutButton.style.display = "none";
  }
});

if (showLoginLink && showSignupLink) {
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    signupSection.style.display = "none";
    loginSection.style.display = "block";
  });

  showSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    signupSection.style.display = "block";
  });
}

document.getElementById("show-signup").addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.style.display = "none";
  signupSection.style.display = "block";
});

document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  signupSection.style.display = "none";
  loginSection.style.display = "block";
});

// logout

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      Toastify({
        text: "Successfully logged out.",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, #FF416C, #FF4B2B)" },
      }).showToast();
    })
    .catch((error) => {
      Toastify({
        text: "Error logging out.",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, #FF5F6D, #FFC371)" },
      }).showToast();
      console.error(error);
    });
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginSection.style.display = "none";
    signupSection.style.display = "none";
    appSection.style.display = "block";
  } else {
    loginSection.style.display = "block";
    signupSection.style.display = "none";
    appSection.style.display = "none";
  }
});

// Signup form
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      Toastify({
        text: "Signup successful! You are now logged in.",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "#4caf50" },
      }).showToast();

      // Show app and hide signup/login
      document.getElementById("signup-section").style.display = "none";
      document.getElementById("login-section").style.display = "none";
      document.getElementById("app").style.display = "block";
    })
    .catch((error) => {
      Toastify({
        text: error.message,
        duration: 4000,
        gravity: "top",
        position: "center",
        style: { background: "#f44336" },
      }).showToast();
    });
});

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
