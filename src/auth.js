import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// DOM elements
const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const appSection = document.getElementById("app");
const logoutButton = document.getElementById("logout-button");
const showSignupLink = document.getElementById("show-signup");
const showLoginLink = document.getElementById("show-login");
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

if (
  !loginSection ||
  !signupSection ||
  !appSection ||
  !logoutButton ||
  !showSignupLink ||
  !showLoginLink ||
  !signupForm ||
  !loginForm
) {
  console.error("One or more required DOM elements are missing.");
} else {
  // Toggle sections based on auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginSection.style.display = "none";
      signupSection.style.display = "none";
      appSection.style.display = "block";
      logoutButton.style.display = "inline-block";

      // Optional: log user info or store UID
      console.log("Logged in as:", user.email, "UID:", user.uid);
    } else {
      loginSection.style.display = "block";
      signupSection.style.display = "none";
      appSection.style.display = "none";
      logoutButton.style.display = "none";
    }
  });

  // Switch to signup view
  showSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    signupSection.style.display = "block";
  });

  // Switch to login view
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    signupSection.style.display = "none";
    loginSection.style.display = "block";
  });

  // Handle signup
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!email || !password) {
      Toastify({
        text: "Email and password are required.",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, #FF5F6D, #FFC371)" },
      }).showToast();
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toastify({
          text: "Signup successful!",
          duration: 3000,
          gravity: "top",
          position: "center",
          style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
        }).showToast();
      })
      .catch((error) => {
        Toastify({
          text: `Signup failed: ${error.message}`,
          duration: 3000,
          gravity: "top",
          position: "center",
          style: { background: "linear-gradient(to right, #FF5F6D, #FFC371)" },
        }).showToast();
      });
  });

  // Handle login
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      Toastify({
        text: "Email and password are required.",
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background: "linear-gradient(to right, #FF5F6D, #FFC371)" },
      }).showToast();
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Toastify({
          text: "Login successful!",
          duration: 3000,
          gravity: "top",
          position: "center",
          style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
        }).showToast();
      })
      .catch((error) => {
        Toastify({
          text: `Login failed: ${error.message}`,
          duration: 3000,
          gravity: "top",
          position: "center",
          style: { background: "linear-gradient(to right, #FF5F6D, #FFC371)" },
        }).showToast();
      });
  });

  // Handle logout
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
          text: `Logout error: ${error.message}`,
          duration: 3000,
          gravity: "top",
          position: "center",
          style: { background: "linear-gradient(to right, #FF5F6D, #FFC371)" },
        }).showToast();
      });
  });
}
