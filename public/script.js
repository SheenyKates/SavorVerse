const API_BASE = 'https://www.themealdb.com/api/json/v1/1'; // TheMealDB API base

// Simple storage helpers for user and favorites
const Auth = {
  save(user) {
    localStorage.setItem('sv_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('sv_user');
    localStorage.removeItem('sv_country');
    localStorage.removeItem('sv_favorites');
  },
  get() {
    const user = localStorage.getItem('sv_user');
    return user ? JSON.parse(user) : null;
  }
};

const Favorites = {
  get() {
    const fav = localStorage.getItem('sv_favorites');
    return fav ? JSON.parse(fav) : [];
  },
  add(meal) {
    let fav = Favorites.get();
    if (!fav.find(m => m.idMeal === meal.idMeal)) {
      fav.push(meal);
      localStorage.setItem('sv_favorites', JSON.stringify(fav));
    }
  },
  remove(mealId) {
    let fav = Favorites.get();
    fav = fav.filter(m => m.idMeal !== mealId);
    localStorage.setItem('sv_favorites', JSON.stringify(fav));
  }
};

// --- COUNTRY SELECTION PAGE LOGIC ---
function initCountrySelector() {
  const countrySelect = document.getElementById('country-select');
  const nextBtn = document.getElementById('country-next');

  if (!countrySelect || !nextBtn) return;

  countrySelect.addEventListener('change', () => {
    nextBtn.disabled = !countrySelect.value;
  });

  nextBtn.addEventListener('click', () => {
    const selectedCountry = countrySelect.value;
    if (selectedCountry) {
      localStorage.setItem('sv_country', selectedCountry);
      window.location.href = 'home.html';
    }
  });
}

// --- HOME PAGE LOGIC ---
function initHomePage() {
  const user = Auth.get();
  if (!user) {
    // If no user, redirect to login
    window.location.href = 'auth.html';
    return;
  }

  const country = localStorage.getItem('sv_country');
  if (!country) {
    window.location.href = 'country.html';
    return;
  }

  const welcomeMsg = document.getElementById('welcome-message');
  if (welcomeMsg) {
    welcomeMsg.textContent = `Hello, ${user.name || 'Guest'}! Here are dishes from ${country}`;
  }

  // Load default category dishes (e.g., PORK)
  loadDishesByCountryAndCategory(country, 'Pork');

  // Setup category buttons
  const categoryButtons = document.querySelectorAll('#meal-categories button');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-category');
      loadDishesByCountryAndCategory(country, category);
    });
  });

  // Setup logout button if exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.clear();
      window.location.href = 'auth.html';
    });
  }

  // Explore More button (open country selector)
  const exploreBtn = document.getElementById('explore-more-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      window.location.href = 'country.html';
    });
  }
}

function loadDishesByCountryAndCategory(country, category) {
  const mealsSection = document.getElementById('meals-section');
  if (!mealsSection) return;

  mealsSection.innerHTML = '<p>Loading dishes...</p>';

  // TheMealDB API: filter.php?a=Area (country), filter.php?c=Category
  // We want intersection, so fetch by country and filter by category client-side

  fetch(`${API_BASE}/filter.php?a=${encodeURIComponent(country)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.meals) {
        mealsSection.innerHTML = '<p>No dishes found for this country.</p>';
        return;
      }
      // Filter by category (case-insensitive match on strCategory)
      const filteredMeals = data.meals.filter(meal =>
        meal.strCategory && meal.strCategory.toLowerCase() === category.toLowerCase()
      );

      if (filteredMeals.length === 0) {
        mealsSection.innerHTML = `<p>No ${category} dishes found for ${country}.</p>`;
        return;
      }

      mealsSection.innerHTML = '';

      filteredMeals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="card-content">
            <h3>${meal.strMeal}</h3>
            <button class="fav-btn" data-id="${meal.idMeal}">Add to Favorites</button>
          </div>
        `;

        // Favorite button click handler
        card.querySelector('.fav-btn').addEventListener('click', e => {
          Favorites.add(meal);
          e.target.textContent = 'Added';
          e.target.disabled = true;
        });

        mealsSection.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      mealsSection.innerHTML = '<p>Failed to load dishes.</p>';
    });
}

// --- FAVORITES PAGE LOGIC ---
function initFavoritesPage() {
  const user = Auth.get();
  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  const favoritesList = document.getElementById('favorites-list');
  if (!favoritesList) return;

  const favMeals = Favorites.get();
  if (favMeals.length === 0) {
    favoritesList.innerHTML = '<p>You have no favorite dishes yet.</p>';
    return;
  }

  favoritesList.innerHTML = '';

  favMeals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="card-content">
        <h3>${meal.strMeal}</h3>
        <button class="remove-fav-btn" data-id="${meal.idMeal}">Remove</button>
      </div>
    `;

    card.querySelector('.remove-fav-btn').addEventListener('click', e => {
      Favorites.remove(meal.idMeal);
      e.target.closest('.card').remove();
      if (Favorites.get().length === 0) {
        favoritesList.innerHTML = '<p>You have no favorite dishes yet.</p>';
      }
    });

    favoritesList.appendChild(card);
  });
}

// --- Initialization based on page ---

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();

  if (path === 'country.html') {
    initCountrySelector();
  } else if (path === 'home.html') {
    initHomePage();
  } else if (path === 'favorites.html') {
    initFavoritesPage();
  } else if (path === 'auth.html' || path === '') {
    // Optionally init auth page if needed
  }
});
