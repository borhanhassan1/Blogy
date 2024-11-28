function updateAuthElements() {
  // Check local storage for cached auth data
  const cachedAuthData = JSON.parse(localStorage.getItem("authData"));

  if (cachedAuthData && cachedAuthData.loggedIn) {
    // Use cached data if available
    updateUI(cachedAuthData);
  } else {
    // Fetch from the server if no cached data or logged out
    fetch("/api/auth/status")
      .then((response) => response.json())
      .then((data) => {
        // Cache the response in local storage
        localStorage.setItem("authData", JSON.stringify(data));
        updateUI(data);
      })
      .catch((error) => console.error("Error fetching auth status:", error));
  }
}

function updateUI(data) {
  const authLink = document.getElementById("auth-link");
  const searchButton = document.getElementById("searchButton");
  const dashboardLink = document.getElementById("dashboardLink");

  if (data.loggedIn) {
    authLink.innerHTML = '<a href="/logout">Logout</a>';
    searchButton.style.display = "inline-block"; // Show search button if logged in

    if (data.role === "admin") {
      dashboardLink.style.display = "inline-block";
    } else {
      dashboardLink.style.display = "none";
    }
  } else {
    authLink.innerHTML = '<a href="/login">Login</a>';
    searchButton.style.display = "none"; // Hide search button if not logged in
    dashboardLink.style.display = "none"; // Hide dashboard link if not logged in
  }
}

// Clear local storage on logout
document.addEventListener("click", (event) => {
  if (event.target.closest('a[href="/logout"]')) {
    localStorage.removeItem("authData");
  }
});

// Call the function on page load
window.onload = updateAuthElements;
