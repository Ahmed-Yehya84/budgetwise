import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");
  const appSection = document.getElementById("app");
  const logoutButton = document.getElementById("logout-button");

  const showSignupBtn = document.getElementById("show-signup");
  const showLoginBtn = document.getElementById("show-login");

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Defensive check
  if (
    !loginSection ||
    !signupSection ||
    !appSection ||
    !logoutButton ||
    !showSignupBtn ||
    !showLoginBtn ||
    !loginForm ||
    !signupForm
  ) {
    console.error("Missing one or more auth DOM elements.");
    return;
  }

  // Toggle sections based on auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginSection.style.display = "none";
      signupSection.style.display = "none";
      appSection.style.display = "block";
      logoutButton.style.display = "inline-block";
    } else {
      loginSection.style.display = "block";
      signupSection.style.display = "none";
      appSection.style.display = "none";
      logoutButton.style.display = "none";
    }
  });

  // Switch between login and signup views
  showSignupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.style.display = "none";
    signupSection.style.display = "block";
  });

  showLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signupSection.style.display = "none";
    loginSection.style.display = "block";
  });

  // Handle signup
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

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
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

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
});
