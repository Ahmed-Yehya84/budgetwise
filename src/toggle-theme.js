export function setupThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");
  const main = document.querySelector(".main");

  if (!toggleButton || !main) {
    console.warn("Missing toggle button or main container");
    return;
  }

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    main.classList.remove("main--light");
    main.classList.add("main--dark");
    toggleButton.textContent = "☀️ Light Mode";
  } else {
    main.classList.remove("main--dark");
    main.classList.add("main--light");
    toggleButton.textContent = "🌙 Dark Mode";
  }

  // Toggle theme on click
  toggleButton.addEventListener("click", () => {
    const isDark = main.classList.contains("main--dark");
    main.classList.toggle("main--dark", !isDark);
    main.classList.toggle("main--light", isDark);
    toggleButton.textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
    localStorage.setItem("theme", isDark ? "light" : "dark");
  });
}
