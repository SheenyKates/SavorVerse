const API_BASE = "http://localhost:8000/api";

// On load
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signup-form").style.display = 'none';
  document.getElementById("login-form").style.display = 'none';
  document.getElementById("signup-success").style.display = 'none';
});

function toggleForm() {
  console.log("toggleForm called"); // Debug line
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
              window.location.href = "home.html";
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
  .then((res) => res.json())
  .then((data) => {
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      showCountryPicker(); // ✅ THIS is the correct next step
    } else {
      alert(data.message || "Login failed.");
    }
  })
  .catch((err) => {
    console.error("Login error:", err);
    alert("Something went wrong during login.");
  });
}

// ✅ Redirect to home.html after 5 seconds (for welcome.html only)
if (window.location.pathname.includes("welcome.html")) {
  setTimeout(() => {
    window.location.href = "home.html";
  }, 5000);
}

// === HOME PAGE LOGIC ===

function loadUserHomeData() {
  const user = JSON.parse(localStorage.getItem("user"));
  const country = localStorage.getItem("selectedCountry");

  // 1. Gender Greeting
  fetch(`https://api.genderize.io?name=${user.name.split(" ")[0]}`)
    .then(res => res.json())
    .then(data => {
      const gender = data.gender;
      const greeting = gender === "female" ? "Welcome, foodie queen!" :
                       gender === "male" ? "Welcome, food explorer!" :
                       "Welcome, food explorer!";
      document.getElementById("greeting").textContent = greeting;
    });

  // 2. REST Countries Cultural Info
  fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
    .then(res => res.json())
    .then(data => {
      const c = data[0];
      document.getElementById("country-name").textContent = c.name.common;
      document.getElementById("flag").src = c.flags.svg;
      document.getElementById("capital").textContent = c.capital?.[0] || "-";
      document.getElementById("population").textContent = c.population.toLocaleString();
      document.getElementById("region").textContent = c.region;
      document.getElementById("subregion").textContent = c.subregion;
      document.getElementById("languages").textContent = Object.values(c.languages || {}).join(", ");
      const currency = Object.values(c.currencies || {})[0];
      document.getElementById("currency").textContent = `${currency.name} (${currency.symbol})`;
      document.getElementById("timezones").textContent = c.timezones?.[0] || "-";
    });

  // 3. Spoonacular Trivia
  fetch(`https://api.spoonacular.com/food/trivia/random?apiKey=${SPOONACULAR_KEY}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("trivia-text").textContent = data.text;
    });

  // 4. ZenQuotes
  fetch("https://zenquotes.io/api/random")
    .then(res => res.json())
    .then(data => {
      const quote = data[0];
      document.getElementById("quote-text").textContent = quote.q;
      document.getElementById("quote-author").textContent = "- " + quote.a;
    });
}

// Auto-redirect welcome → home after 5s
if (window.location.pathname.includes("welcome.html")) {
  setTimeout(() => {
    window.location.href = "home.html";
  }, 5000);
}

if (document.querySelector(".category-wrapper")) {
  const API_BASE = "http://localhost:8000/api";
  const selectedCountry = localStorage.getItem("selectedCountry") || "Philippines";

  function loadDishesByCategory(category) {
    fetch(`${API_BASE}/recipes/country/${selectedCountry}/category/${category}`)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById("dish-results");
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
              <p>${meal.strInstructions?.slice(0, 120) || "No description available"}...</p>
            </div>
          `;
          container.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Error fetching dishes:", err);
      });
  }

  document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const category = button.dataset.category;
      loadDishesByCategory(category);
    });
  });

  // Load default category on page load
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
    return;
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

// === FAVORITES PAGE ===
if (document.getElementById("favorites-list")) {
  fetch(`${API_BASE}/favorites`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("favorites-list");
      list.innerHTML = "";

      if (!data || data.length === 0) {
        list.innerHTML = "<p>No favorites saved yet.</p>";
        return;
      }

      data.forEach(dish => {
        const card = document.createElement("div");
        card.className = "favorite-card";
        card.innerHTML = `
          <img src="${dish.image}" alt="${dish.name}">
          <div class="favorite-content">
            <h3>${dish.name}</h3>
            <p>${dish.description}</p>
          </div>
          <img src="bookmark.png" class="bookmark-icon" alt="Remove" title="Remove from Favorites" />
        `;

        // Handle delete (click on bookmark icon)
        card.querySelector(".bookmark-icon").addEventListener("click", () => {
          if (confirm(`Remove "${dish.name}" from favorites?`)) {
            fetch(`${API_BASE}/favorites/remove`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: dish.name }) // Adjust key if you're using ID
            })
            .then(res => res.json())
            .then(() => card.remove())
            .catch(err => console.error("Remove failed:", err));
          }
        });

        list.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load favorites:", err);
    });
}

// === ADD TO FAVORITES FUNCTION ===
// Call this from any page to save a dish
function saveToFavorites(name, image, description) {
  fetch(`${API_BASE}/favorites/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, image, description })
  })
    .then(res => res.json())
    .then(() => {
      alert(`Saved "${name}" to favorites!`);
    })
    .catch(err => {
      console.error("Save failed:", err);
    });
}

