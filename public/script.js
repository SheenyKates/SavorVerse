const API_BASE = "https://savorverse-backend.onrender.com/api/";
const user = JSON.parse(localStorage.getItem("user"));


function getAuthToken() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    console.error("No user token found");
  }
  return user?.token || "";
}


function authorizedFetch(url, options = {}) {
  const authToken = getAuthToken();
  console.log("Authorization token:", authToken);  // Check token value
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
}


function safeSetTextContent(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = text;
  } else {
    console.error(`Element with ID '${elementId}' not found.`);
  }
}

function updateFavoritesBadge() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const badge = document.getElementById("favorites-badge");
  if (!badge) return;
  badge.textContent = favorites.length;
  badge.style.display = favorites.length > 0 ? "inline-block" : "none";
}

// On load
window.onload = function () {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const successMsg = document.getElementById("signup-success");

  if (signupForm) signupForm.style.display = 'none';
  if (loginForm) loginForm.style.display = 'none';
  if (successMsg) successMsg.style.display = 'none';
};

function toggleForm() {
  console.log("toggleForm clicked");
  document.getElementById("signup-form").style.display = 'block';
  document.getElementById("login-form").style.display = 'none';
  document.getElementById("signup-success").style.display = 'none';
}


function switchToLogin() {
  document.getElementById("signup-form").style.display = 'none';
  document.getElementById("login-form").style.display = 'block';
  // Leave success message visible
}

function handleSignup() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-confirm").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: confirmPassword
    })
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.user) {
      const message = document.getElementById("signup-success");
      message.textContent = "✅ Account successfully created! Please log in.";
      message.style.display = "block";
      switchToLogin();
    } else {
      alert(data.message || "Sign up failed.");
    }
  })
  .catch((err) => {
    console.error("Signup error:", err);
    alert("Something went wrong during sign up.");
  });
}

function showCountryPicker() {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "none";
  document.getElementById("country-picker").style.display = "block";

  loadCountries();
}

function loadCountries() {
  const countryFixMap = {
    "American": "United States",
    "British": "United Kingdom",
    "Canadian": "Canada",
    "Chinese": "China",
    "Croatian": "Croatia",
    "Dutch": "Netherlands",
    "Egyptian": "Egypt",
    "Filipino": "Philippines",
    "French": "France",
    "Greek": "Greece",
    "Indian": "India",
    "Irish": "Ireland",
    "Italian": "Italy",
    "Jamaican": "Jamaica",
    "Japanese": "Japan",
    "Kenyan": "Kenya",
    "Malaysian": "Malaysia",
    "Mexican": "Mexico",
    "Moroccan": "Morocco",
    "Polish": "Poland",
    "Portuguese": "Portugal",
    "Russian": "Russia",
    "Spanish": "Spain",
    "Thai": "Thailand",
    "Tunisian": "Tunisia",
    "Turkish": "Turkey",
    "Ukrainian": "Ukraine",
    "Uruguayan": "Uruguay",
    "Vietnamese": "Vietnam"
  };

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then(res => res.json())
    .then(areaData => {
      const areas = areaData.meals.map(area => area.strArea);

      return fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(restCountries => {
          const container = document.getElementById("country-grid");
          container.innerHTML = "";

          areas.forEach(area => {
            const matchName = countryFixMap[area] || area;

            const match = restCountries.find(c =>
              c.name.common.toLowerCase() === matchName.toLowerCase()
            );

            const flagUrl = match?.flags?.svg || match?.flags?.png || "https://via.placeholder.com/24";

            const card = document.createElement("div");
            card.className = "country-card";
            card.innerHTML = `
              <img class="country-flag" src="${flagUrl}" alt="${area} flag">
              <span class="country-name">${area}</span>
            `;
            card.onclick = () => {
              localStorage.setItem("selectedCountry", area);
              window.location.href = "welcome.html";
            };
            container.appendChild(card);
          });

          if (!container.innerHTML.trim()) {
            container.innerHTML = `<p style="color: red;">⚠ No countries found.</p>`;
          }
        });
    })
    .catch(err => {
      console.error("Country load error:", err);
      document.getElementById("country-grid").innerHTML =
        `<p style="color: red;">⚠ Failed to load countries. Try again.</p>`;
    });
}

function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(async (res) => {
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP error ${res.status}: ${text}`);
    }
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      const text = await res.text();
      throw new Error(`Expected JSON but got: ${text}`);
    }
  })
  .then((data) => {
    if (data.user && data.token) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);  // 🔒 Save token for future use
      showCountryPicker();
    } else {
      alert(data.message || "Login failed.");
    }
  })
  .catch((err) => {
    console.error("Login error:", err);
    alert("Login failed: " + err.message);
  });
}

if (window.location.pathname.includes("welcome.html")) {
  setTimeout(() => {
    window.location.href = "home.html";
  }, 5000);
}

function loadUserHomeData() {
  const user = JSON.parse(localStorage.getItem("user"));
  const rawCountry = localStorage.getItem("selectedCountry");

  // Fix country name if needed
  const fixMap = {
    "Filipino": "Philippines",
    "American": "United States",
    "British": "United Kingdom",
    "Chinese": "China",
    "Dutch": "Netherlands",
    "Egyptian": "Egypt",
    "Greek": "Greece",
    "Indian": "India",
    "Irish": "Ireland",
    "Italian": "Italy",
    "Japanese": "Japan",
    "Mexican": "Mexico",
    "Moroccan": "Morocco",
    "Spanish": "Spain",
    "Thai": "Thailand",
    "Turkish": "Turkey",
    "Vietnamese": "Vietnam"
  };
  const country = fixMap[rawCountry] || rawCountry;

  // 👤 Gender Greeting
  fetch(`https://api.genderize.io?name=${user.name.split(" ")[0]}`)
    .then(res => res.json())
    .then(data => {
      const gender = data.gender;
      const greeting = gender === "female"
        ? "Welcome, foodie queen!"
        : gender === "male"
        ? "Welcome, food explorer!"
        : "Welcome, food explorer!";
      document.getElementById("greeting").textContent = greeting;
    });

  // 🌍 REST Countries Cultural Info
  fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data[0]) {
        console.error("Country data not found");
        return;
      }
      const c = data[0];
      document.getElementById("country-name").textContent = c.name.common;
      document.getElementById("flag-img").src = c.flags?.svg || c.flags?.png || "";
      document.getElementById("capital").textContent = c.capital?.[0] || "-";
      document.getElementById("region").textContent = c.region || "-";
      document.getElementById("subregion").textContent = c.subregion || "-";
      document.getElementById("population").textContent = c.population.toLocaleString();
      document.getElementById("languages").textContent = Object.values(c.languages || {}).join(", ");
      const currency = Object.values(c.currencies || {})[0];
      document.getElementById("currency").textContent = currency
        ? `${currency.name} (${currency.symbol})`
        : "-";
      document.getElementById("timezones").textContent = c.timezones?.[0] || "-";
    })
    .catch(err => {
      console.error("REST Countries API failed:", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Only run if quote elements exist
  if (document.getElementById("quote-text") && document.getElementById("quote-author")) {
    fetch("https://api.allorigins.win/raw?url=https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        const quote = data[0];
        document.getElementById("quote-text").textContent = quote.q;
        document.getElementById("quote-author").textContent = "- " + quote.a;
      })
      .catch(err => console.error("Quote fetch error:", err));
  }

  // Only run if trivia element exists
  if (document.getElementById("food-trivia")) {
    fetch(`https://api.spoonacular.com/food/trivia/random?apiKey=${SPOONACULAR_KEY}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("food-trivia").textContent = data.text;
      })
      .catch(err => console.error("Trivia fetch error:", err));
  }
});



// Auto-redirect welcome → home after 5s
if (window.location.pathname.includes("welcome.html")) {
  setTimeout(() => {
    window.location.href = "home.html";
  }, 5000);
}

if (document.querySelector(".category-wrapper")) {
  const API_BASE = "http://localhost:8000/api";
  const rawCountry = localStorage.getItem("selectedCountry") || "Philippines";

  // Country fix map
  const fixMap = {
    Filipino: "Philippines",
    American: "United States",
    British: "United Kingdom",
    Chinese: "China",
    Dutch: "Netherlands",
    Egyptian: "Egypt",
    French: "France",
    Greek: "Greece",
    Indian: "India",
    Irish: "Ireland",
    Italian: "Italy",
    Jamaican: "Jamaica",
    Japanese: "Japan",
    Mexican: "Mexico",
    Moroccan: "Morocco",
    Russian: "Russia",
    Spanish: "Spain",
    Thai: "Thailand",
    Turkish: "Turkey",
    Vietnamese: "Vietnam"
  };

  const selectedCountry = fixMap[rawCountry] || rawCountry;
  console.log("Using country:", selectedCountry); // ✅ debug

  function loadDishesByCategory(category) {
    const selectedCountry = localStorage.getItem("selectedCountry");
    if (!selectedCountry) {
        alert("Please select a country first.");
        window.location.href = "countrySelection.html";  // Redirect to selection page
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Please log in to view dishes.");
        window.location.href = "login.html";  // Redirect to login page
        return;
    }

    console.log(`Using country: ${selectedCountry}`);
    console.log(`Authorization token: ${token}`);

    fetch(`${API_BASE}/explore/${selectedCountry}/${category}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                alert("Unauthorized. Please log in again.");
                window.location.href = "login.html";
                return Promise.reject(new Error("Unauthorized"));
            } else if (response.status === 404) {
                throw new Error("Category or country not found.");
            } else {
                throw new Error(`HTTP error ${response.status}`);
            }
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById("dish-results");
        container.innerHTML = "";

        const meals = Array.isArray(data) ? data : data.meals;
        if (!meals || meals.length === 0) {
            container.innerHTML = "<p>No dishes found.</p>";
            return;
        }

        meals.forEach(meal => {
            const card = document.createElement("div");
            card.className = "dish-card";
            card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="dish-content">
                    <h4>${meal.strMeal}</h4>
                </div>
            `;
            card.onclick = () => {
                localStorage.setItem("selectedMealId", meal.idMeal);
                window.location.href = "dish.html";
            };
            container.appendChild(card);
        });
    })
    .catch(err => {
        console.error("Error fetching dishes:", err);
        alert(`Failed to load dishes: ${err.message}`);
    });
}



  document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      loadDishesByCategory(button.dataset.category);
    });
  });

  // Auto-load the active/default category
  const defaultCategory = document.querySelector(".category-btn.active")?.dataset.category;
  if (defaultCategory) {
    loadDishesByCategory(defaultCategory);
  }
}

if (document.querySelector(".dish-container")) {
  const API_BASE = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  const selectedDishName = localStorage.getItem("selectedDish");

  if (!selectedDishName) {
    document.getElementById("dish-title").textContent = "Dish not found.";
  }

  fetch(`${API_BASE}${selectedDishName}`)
    .then(res => res.json())
    .then(data => {
      const dish = data.meals[0];
      document.getElementById("dish-title").textContent = dish.strMeal;
      document.getElementById("dish-img").src = dish.strMealThumb;
      document.getElementById("dish-instructions").textContent = dish.strInstructions;

      // Ingredients
      const ingredientsBox = document.getElementById("ingredients-list");
      for (let i = 1; i <= 20; i++) {
        const ingredient = dish[`strIngredient${i}`];
        const measure = dish[`strMeasure${i}`]; 
        if (ingredient && ingredient.trim()) {
          const item = document.createElement("div");
          item.textContent = `${ingredient}${measure ? `: ${measure}` : ''}`;
          ingredientsBox.appendChild(item);
        }
      }
    })
    .catch(err => {
      console.error("Error loading dish:", err);
      document.getElementById("dish-instructions").textContent = "Failed to load dish data.";
    });
}


// Load and display favorites from localStorage on the favorites page
if (document.getElementById("favorites-list")) {
  function loadFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const list = document.getElementById("favorites-list");
    list.innerHTML = "";

    if (favorites.length === 0) {
      list.textContent = "No favorites saved yet.";
      return;
    }

    favorites.forEach(meal => {
      const card = document.createElement("div");
      card.className = "favorite-card";
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="favorite-content">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strArea} - ${meal.strCategory}</p>
          <a href="dish.html" data-id="${meal.idMeal}" class="view-details">View Details</a>
        </div>
      `;
      list.appendChild(card);
    });

    // Add event listener for view details links
    document.querySelectorAll(".view-details").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const mealId = e.target.getAttribute("data-id");
        localStorage.setItem("selectedMealId", mealId);
        window.location.href = "dish.html";
      });
    });

    // Add event listener for remove buttons
    document.querySelectorAll(".remove-fav-btn").forEach(button => {
      button.addEventListener("click", e => {
        const mealId = e.target.getAttribute("data-id");
        if (confirm("Remove this dish from favorites?")) {
          let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          favorites = favorites.filter(fav => fav.idMeal !== mealId);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          loadFavoritesList(); // Reload list
          updateFavoritesBadge(); // Update badge count if you have one
        }
      });
    });
  }

  loadFavoritesList();
}


if (window.location.pathname.includes("explore.html")) {
  loadExploreCountries();
}

function loadExploreCountries() {
  const fixMap = {
    "American": "United States",
    "British": "United Kingdom",
    "Canadian": "Canada",
    "Chinese": "China",
    "Croatian": "Croatia",
    "Dutch": "Netherlands",
    "Egyptian": "Egypt",
    "Filipino": "Philippines",
    "French": "France",
    "Greek": "Greece",
    "Indian": "India",
    "Irish": "Ireland",
    "Italian": "Italy",
    "Jamaican": "Jamaica",
    "Japanese": "Japan",
    "Kenyan": "Kenya",
    "Malaysian": "Malaysia",
    "Mexican": "Mexico",
    "Moroccan": "Morocco",
    "Polish": "Poland",
    "Portuguese": "Portugal",
    "Russian": "Russia",
    "Spanish": "Spain",
    "Thai": "Thailand",
    "Tunisian": "Tunisia",
    "Turkish": "Turkey",
    "Ukrainian": "Ukraine",
    "Uruguayan": "Uruguay",
    "Vietnamese": "Vietnam"
  };

  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then(res => res.json())
    .then(areaData => {
      const areas = areaData.meals.map(a => a.strArea);

      fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(restCountries => {
          const grid = document.getElementById("explore-country-grid");
          grid.innerHTML = "";

          areas.forEach(area => {
            const matchName = fixMap[area] || area;
            const match = restCountries.find(
              c => c.name.common.toLowerCase() === matchName.toLowerCase()
            );

            const flagUrl = match?.flags?.svg || match?.flags?.png || "https://via.placeholder.com/24";
            const card = document.createElement("div");
            card.className = "country-card";
            card.innerHTML = `
              <img class="country-flag" src="${flagUrl}" alt="${area} flag">
              <span class="country-name">${area}</span>
            `;
            card.onclick = () => {
              localStorage.setItem("exploreCountry", area);
              window.location.href = "explore-category.html";
            };
            grid.appendChild(card);
          });
        });
    });
}

// --- Step 2: Load categories + dishes for explore-category.html ---
if (window.location.pathname.includes("explore-category.html")) {
  const selectedCountry = localStorage.getItem("exploreCountry") || "Philippines";
  document.getElementById("selected-country").textContent = selectedCountry;

  function loadExploreDishes(category) {
    authorizedFetch(`${API_BASE}/explore/${selectedCountry}/${category}`)
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("explore-dish-results");
        container.innerHTML = "";
        if (!data.meals || data.meals.length === 0) {
          container.innerHTML = "<p>No dishes found.</p>";
          return;
        }

        data.meals.forEach(meal => {
          const card = document.createElement("div");
          card.className = "dish-card";
          card.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="dish-content">
              <h4>${meal.strMeal}</h4>
            </div>
          `;
          card.onclick = () => {
            localStorage.setItem("selectedMealId", meal.idMeal);
            window.location.href = "dish.html";
          };
          container.appendChild(card);
        });
      })
      .catch(err => console.error("Error fetching dishes:", err));
}

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadExploreDishes(btn.dataset.category);
    });
  });
}

if (window.location.pathname.includes("explore-category.html")) {
  const selectedCountry = localStorage.getItem("exploreCountry") || "Philippines";
  document.getElementById("selected-country").textContent = selectedCountry;

  function loadDishesByCategory(category) {
    const container = document.getElementById("explore-dish-results");
    container.innerHTML = "Loading...";

    console.log("Fetching dishes for category:", category);  // Debugging log

    authorizedFetch(`${API_BASE}/explore/${selectedCountry}/${category}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);  // Debugging log
        container.innerHTML = "";

        const meals = Array.isArray(data) ? data : data.meals;
        if (!meals || meals.length === 0) {
          container.innerHTML = "<p>No dishes found.</p>";
          return;
        }

        meals.forEach(meal => {
          const card = document.createElement("div");
          card.className = "dish-card";
          card.innerHTML = `
         <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
         <div class="dish-content">
          <h4>${meal.strMeal}</h4>
          </div>
`         ;
          card.onclick = () => {
          localStorage.setItem("selectedMealId", meal.idMeal);
          window.location.href = "dish.html";
          };
          container.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Fetch error:", err);
        container.innerHTML = "<p>Error loading dishes.</p>";
      });
}


  // Bind event to buttons
  document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      loadDishesByCategory(button.dataset.category);
    });
  });
}

 if (window.location.pathname.includes("home.html")) {
  console.log("✅ Running loadUserHomeData()");
  loadUserHomeData();
}

if (window.location.pathname.includes("dish.html")) {
  const mealId = localStorage.getItem("selectedMealId");
  if (!mealId) {
    console.warn("No meal selected.");
  } else {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];
        document.getElementById("dish-img").src = meal.strMealThumb;
        document.getElementById("dish-img").alt = meal.strMeal;
        document.getElementById("dish-title").textContent = meal.strMeal;
        document.getElementById("dish-instructions").textContent = meal.strInstructions;

        const ingredientsBox = document.getElementById("ingredients-list");
        ingredientsBox.innerHTML = "";

        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim() !== "") {
            const item = document.createElement("li");
            item.textContent = `${measure} ${ingredient}`;
            ingredientsBox.appendChild(item);
          }
        }

        // Bookmark icon logic
        const bookmarkBtn = document.getElementById("bookmark-btn");
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const isSaved = favorites.some(fav => fav.idMeal === meal.idMeal);

        if (isSaved) {
          bookmarkBtn.classList.add("saved");
        }

        bookmarkBtn.addEventListener("click", () => {
          const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          const index = favorites.findIndex(fav => fav.idMeal === meal.idMeal);

          if (index !== -1) {
            favorites.splice(index, 1);
            bookmarkBtn.classList.remove("saved");
          } else {
            favorites.push(meal);
            bookmarkBtn.classList.add("saved");
          }

          localStorage.setItem("favorites", JSON.stringify(favorites));
        });
      })
      .catch(err => {
        console.error("Error loading meal:", err);
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const userImg = document.getElementById("user-img");
  const userDropdown = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  if (!userImg || !userDropdown || !logoutBtn) return; // safety check

  userImg.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", () => {
    userDropdown.style.display = "none";
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
});
