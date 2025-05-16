const apiBase = 'http://localhost/api'; // Change to your actual backend URL

// NAVIGATION ACTIVE LINK HIGHLIGHT
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.href === window.location.href || window.location.href.includes(link.getAttribute('href'))) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// USER MENU DROPDOWN
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('user-dropdown');

if (userIcon && userDropdown) {
  userIcon.addEventListener('click', () => {
    userDropdown.classList.toggle('visible');
  });

  document.addEventListener('click', (e) => {
    if (!userIcon.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove('visible');
    }
  });
}

// BACK BUTTON FUNCTIONALITY (dish-detail.html)
const backBtn = document.getElementById('back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => {
    window.history.back();
  });
}

// FETCH RECENT DISHES (home.html)
async function fetchRecentDishes() {
  const container = document.getElementById('recentDishesContainer');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/home/recent`);
    const dishes = await res.json();
    if (!dishes || dishes.length === 0) {
      container.innerHTML = '<p>No recent dishes found.</p>';
      return;
    }

    container.innerHTML = dishes.map(dish => `
      <article class="dish-card" data-id="${dish.idMeal}">
        <img src="${dish.strMealThumb}" alt="${dish.strMeal}" />
        <h4>${dish.strMeal}</h4>
        <button class="favorite-btn" aria-label="Toggle favorite for ${dish.strMeal}">♡</button>
      </article>
    `).join('');

    attachFavoriteListeners();
  } catch (err) {
    container.innerHTML = '<p>Error loading recent dishes.</p>';
    console.error(err);
  }
}

// FETCH FOOD TRIVIA (home.html)
async function fetchFoodTrivia() {
  const triviaEl = document.getElementById('foodTriviaText');
  if (!triviaEl) return;

  try {
    const res = await fetch(`${apiBase}/home/trivia`);
    const data = await res.json();
    triviaEl.textContent = data.trivia || 'No trivia available right now.';
  } catch {
    triviaEl.textContent = 'Failed to load trivia.';
  }
}

// FETCH COUNTRY LIST (country.html & explore-more.html)
async function fetchCountries() {
  const container = document.getElementById('countryList') || document.getElementById('exploreCountryList');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/countries`);
    const countries = await res.json();
    if (!countries || countries.length === 0) {
      container.innerHTML = '<p>No countries found.</p>';
      return;
    }

    container.innerHTML = countries.map(c => `
      <button class="country-btn">${c.strArea}</button>
    `).join('');

    // Attach country selection listeners here as needed
  } catch (err) {
    container.innerHTML = '<p>Error loading countries.</p>';
    console.error(err);
  }
}

// FETCH CATEGORY LIST (category.html & explore-more.html)
async function fetchCategories(country) {
  const container = document.getElementById('categoryList') || document.getElementById('exploreCategoryList');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/recipes/country/${encodeURIComponent(country)}/categories`);
    const data = await res.json();
    const categories = data.categories || [];

    container.innerHTML = categories.map(cat => `
      <button class="category-link">${cat}</button>
    `).join('');

    // Attach category selection listeners here as needed
  } catch (err) {
    container.innerHTML = '<p>Error loading categories.</p>';
    console.error(err);
  }
}

// FETCH DISHES BY COUNTRY & CATEGORY (category.html & explore-more.html)
async function fetchDishes(country, category) {
  const container = document.getElementById('dishesContainer') || document.getElementById('exploreDishesContainer');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/recipes/country/${encodeURIComponent(country)}/category/${encodeURIComponent(category)}`);
    const dishes = await res.json();
    if (!dishes || dishes.length === 0) {
      container.innerHTML = '<p>No dishes found.</p>';
      return;
    }

    container.innerHTML = dishes.map(dish => `
      <article class="dish-card" data-id="${dish.idMeal}">
        <img src="${dish.strMealThumb}" alt="${dish.strMeal}" />
        <h4>${dish.strMeal}</h4>
        <button class="favorite-btn" aria-label="Toggle favorite for ${dish.strMeal}">♡</button>
      </article>
    `).join('');

    attachFavoriteListeners();
  } catch (err) {
    container.innerHTML = '<p>Error loading dishes.</p>';
    console.error(err);
  }
}

// FETCH DISH DETAILS (dish-detail.html)
async function fetchDishDetails(id) {
  if (!id) return;

  try {
    const res = await fetch(`${apiBase}/recipes/detail/${encodeURIComponent(id)}`);
    const dish = await res.json();

    if (!dish || !dish.idMeal) {
      console.error('Dish not found');
      return;
    }

    document.getElementById('dish-title').textContent = dish.strMeal;
    document.getElementById('dish-image').src = dish.strMealThumb;
    document.getElementById('dish-image').alt = dish.strMeal;

    // Build ingredients list
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
      const ingredient = dish[`strIngredient${i}`];
      const measure = dish[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const li = document.createElement('li');
        li.textContent = `${measure ? measure : ''} ${ingredient}`.trim();
        ingredientsList.appendChild(li);
      }
    }

    // Instructions
    document.getElementById('instructions-text').textContent = dish.strInstructions || 'No instructions available.';
  } catch (err) {
    console.error('Failed to load dish details:', err);
  }
}

// FAVORITE BUTTONS HANDLING (simplified)
function attachFavoriteListeners() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dishCard = btn.closest('.dish-card');
      const mealId = dishCard ? dishCard.dataset.id : null;
      if (!mealId) return;

      if (btn.textContent === '♡') {
        btn.textContent = '❤️';
        // TODO: Add favorite API call here
      } else {
        btn.textContent = '♡';
        // TODO: Remove favorite API call here
      }
    });
  });
}

// INITIALIZATION PER PAGE
function init() {
  const path = window.location.pathname;

  if (path.includes('home.html')) {
    fetchRecentDishes();
    fetchFoodTrivia();
  }

  if (path.includes('country.html') || path.includes('exploremore.html')) {
    fetchCountries();
  }

  if (path.includes('category.html')) {
    // Example default country - ideally you fetch/store user choice
    const country = 'Canadian'; 
    fetchCategories(country);
    // You can add logic to fetch dishes after category selection
  }

  if (path.includes('exploremore.html')) {
    // Example default selections
    const country = 'Canadian';
    fetchCategories(country);
    // Attach handlers for country/category selections needed
  }

  if (path.includes('dish-detail.html')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    fetchDishDetails(id);
  }
}

document.addEventListener('DOMContentLoaded', init);
