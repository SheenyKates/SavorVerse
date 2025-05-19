const apiBase = 'http://127.0.0.1:8000/api'; // Updated base URL

// ✅ Highlight active nav link
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.href === window.location.href || window.location.href.includes(link.getAttribute('href'))) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ✅ User dropdown menu
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

// ✅ Quick Log In button handler
const quickLoginBtn = document.getElementById('quickLoginBtn');
if (quickLoginBtn) {
  quickLoginBtn.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to log in as guest?');
    if (confirmed) {
      window.location.href = 'category.html';
    }
  });
}

// ✅ Category click: save country to localStorage
const countryButtons = document.querySelectorAll('.country-btn');
countryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const country = btn.textContent;
    localStorage.setItem('selectedCountry', country);
    window.location.href = 'category.html';
  });
});

// ✅ Back button (dish-detail.html)
const backBtn = document.getElementById('back-btn');
if (backBtn) {
  backBtn.addEventListener('click', () => window.history.back());
}

// ✅ Fetch recent dishes (home.html)
async function fetchRecentDishes() {
  const container = document.getElementById('recentDishesContainer');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/home/recent`);
    const data = await res.json();
    if (!data.length) {
      container.innerHTML = '<p>No recent dishes found.</p>';
      return;
    }

    container.innerHTML = data.map(dish => `
      <article class="dish-card" data-id="${dish.idMeal}">
        <img src="${dish.strMealThumb}" alt="${dish.strMeal}" />
        <h4>${dish.strMeal}</h4>
      </article>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p>Error loading dishes.</p>';
  }
}

// ✅ Fetch food trivia (home.html)
async function fetchFoodTrivia() {
  const triviaEl = document.getElementById('foodTriviaText');
  if (!triviaEl) return;

  try {
    const res = await fetch(`${apiBase}/home/trivia`);
    const data = await res.json();
    triviaEl.textContent = data.trivia || 'No trivia available right now.';
  } catch {
    triviaEl.textContent = 'Trivia unavailable.';
  }
}

// ✅ Fetch categories for selected country (category.html)
async function fetchCategoriesForCountry(country) {
  const container = document.getElementById('categoryList');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/categories/for/${encodeURIComponent(country)}`);
    const data = await res.json();
    const categories = data.categories;

    container.innerHTML = categories.map(cat => `
      <button class="category-btn">${cat}</button>
    `).join('');

    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        fetchDishes(country, btn.textContent);
      });
    });
  } catch (err) {
    container.innerHTML = '<p>Error loading categories.</p>';
  }
}

// ✅ Fetch dishes by country + category
async function fetchDishes(country, category) {
  const container = document.getElementById('dishesContainer');
  if (!container) return;

  try {
    const res = await fetch(`${apiBase}/explore/${encodeURIComponent(country)}/${encodeURIComponent(category)}`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = '<p>No dishes found.</p>';
      return;
    }

    container.innerHTML = data.map(dish => `
      <article class="dish-card" data-id="${dish.idMeal}">
        <img src="${dish.strMealThumb}" alt="${dish.strMeal}" />
        <h4>${dish.strMeal}</h4>
        <a href="dish-detail.html?id=${dish.idMeal}">View Details</a>
      </article>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p>Error loading dishes.</p>';
  }
}

// ✅ Fetch dish details
async function fetchDishDetails(id) {
  try {
    const res = await fetch(`${apiBase}/dish/${id}`);
    const dish = await res.json();

    document.getElementById('dish-title').textContent = dish.strMeal;
    document.getElementById('dish-image').src = dish.strMealThumb;

    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
      const ing = dish[`strIngredient${i}`];
      const measure = dish[`strMeasure${i}`];
      if (ing && ing.trim()) {
        const li = document.createElement('li');
        li.textContent = `${measure || ''} ${ing}`.trim();
        ingredientsList.appendChild(li);
      }
    }

    document.getElementById('instructions-text').textContent = dish.strInstructions || 'No instructions available.';
  } catch (err) {
    console.error('Error loading dish detail', err);
  }
}

// ✅ Page Initializers
function initPage() {
  const path = window.location.pathname;

  if (path.includes('home.html')) {
    fetchRecentDishes();
    fetchFoodTrivia();
  }

  if (path.includes('category.html')) {
    const country = localStorage.getItem('selectedCountry') || 'Canadian';
    fetchCategoriesForCountry(country);
  }

  if (path.includes('dish-detail.html')) {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id) fetchDishDetails(id);
  }

  if (path.includes('exploremore.html')) {
    const country = new URLSearchParams(window.location.search).get('country') || 'Canadian';
    const categorySelect = document.getElementById('category-select');

    categorySelect.addEventListener('change', () => {
      const selected = categorySelect.value;
      fetchDishes(country, selected);
    });

    fetchDishes(country, categorySelect.value || 'Pork');
  }
}

document.addEventListener('DOMContentLoaded', initPage);
