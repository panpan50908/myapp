const themeButton = document.getElementById("themeButton");
const messageButton = document.getElementById("messageButton");
const messageBox = document.getElementById("message");

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeButton.textContent = isDark ? "Switch to Light Mode" : "Toggle Dark Mode";
}

function showMessage() {
  messageBox.classList.remove("hidden");
  messageBox.textContent = "JavaScript is connected and the button works!";
}

if (themeButton) {
  themeButton.addEventListener("click", toggleTheme);
}

if (messageButton) {
  messageButton.addEventListener("click", showMessage);
}
