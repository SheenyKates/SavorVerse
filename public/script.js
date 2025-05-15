// script.js

const API_BASE = 'http://127.0.0.1:8000/api';

// Simple storage helpers
const Auth = {
  save(user, token) {
    localStorage.setItem('sv_user', JSON.stringify(user));
    localStorage.setItem('sv_token', token);
  },
  clear() {
    localStorage.removeItem('sv_user');
    localStorage.removeItem('sv_token');
    localStorage.removeItem('sv_country');
  },
  get() {
    const u = localStorage.getItem('sv_user'),
          t = localStorage.getItem('sv_token');
    return u && t ? { user: JSON.parse(u), token: t } : null;
  }
};

// Page detection
const path = window.location.pathname.split('/').pop();

// ROUTER
document.addEventListener('DOMContentLoaded', () => {
  switch (path) {
    case 'auth.html':
      initLogin();
      break;
    case 'signup.html':
      initSignup();
      break;
    case 'country.html':
      ensureAuth();
      initCountryPicker();
      break;
    case 'home.html':
      ensureAuth();
      initHome();
      break;
    // add further pages like detail.html if you create them
  }
});

/** Redirect to login if not auth */
function ensureAuth() {
  if (!Auth.get()) {
    window.location.href = 'auth.html';
  }
}

/** 1. LOGIN PAGE */
function initLogin() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { user, token } = await res.json();
      Auth.save(user, token);
      window.location.href = 'country.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

/** 2. SIGNUP PAGE */
function initSignup() {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name  = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass  = document.getElementById('signup-password').value;
    const pass2 = document.getElementById('signup-password-confirm').value;
    if (pass !== pass2) {
      return alert('Passwords must match');
    }
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password: pass, password_confirmation: pass2 })
      });
      if (!res.ok) throw new Error('Registration failed');
      const { user, token } = await res.json();
      Auth.save(user, token);
      window.location.href = 'country.html';
    } catch (err) {
      alert(err.message);
    }
  });
}

/** 3. COUNTRY PICKER PAGE */
async function initCountryPicker() {
  const select = document.getElementById('country-select'),
        btn    = document.getElementById('country-next'),
        logout = document.getElementById('logout-btn');

  logout.addEventListener('click', () => {
    Auth.clear();
    window.location.href = 'auth.html';
  });

  // load countries
  try {
    const res = await fetch(`${API_BASE}/countries`);
    const countries = await res.json();
    countries.sort((a,b) => a.name.common.localeCompare(b.name.common));
    for (let c of countries) {
      const opt = document.createElement('option');
      opt.value = c.name.common;
      opt.textContent = c.name.common;
      select.append(opt);
    }
  } catch (e) {
    console.error(e);
    alert('Could not load countries');
  }

  select.addEventListener('change', () => {
    btn.disabled = !select.value;
  });

  btn.addEventListener('click', () => {
    localStorage.setItem('sv_country', select.value);
    window.location.href = 'home.html';
  });
}

/** 4. HOME PAGE */
function initHome() {
  const auth = Auth.get(),
        country = localStorage.getItem('sv_country'),
        navUser = document.getElementById('nav-user'),
        logout  = document.getElementById('logout-btn'),
        dropdownLinks = document.querySelectorAll('.dropdown-menu a'),
        mealsSection   = document.getElementById('meals-section'),
        mealsHeading   = document.getElementById('meals-heading'),
        mealsContainer = document.getElementById('meals-container');

  // show user nav
  document.getElementById('nav-guest')?.classList.add('hidden');
  navUser.classList.remove('hidden');

  logout.addEventListener('click', () => {
    Auth.clear();
    window.location.href = 'auth.html';
  });

  // category selection
  dropdownLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const cat = a.dataset.cat;
      loadMeals(country, cat);
    });
  });
}

/** Fetch & display meals */
async function loadMeals(country, category) {
  const mealsHeading = document.getElementById('meals-heading'),
        mealsContainer = document.getElementById('meals-container'),
        mealsSection = document.getElementById('meals-section');

  mealsHeading.textContent = `${category} in ${country}`;
  mealsContainer.innerHTML = '';
  mealsSection.classList.remove('hidden');

  try {
    const res = await fetch(`${API_BASE}/recipes/country/${encodeURIComponent(country)}/category/${encodeURIComponent(category)}`);
    const { meals } = await res.json();
    for (let m of (meals||[])) {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${m.strMealThumb}" alt="${m.strMeal}" />
        <div class="card-content">
          <h3>${m.strMeal}</h3>
        </div>
      `;
      card.onclick = () => loadDetail(m.idMeal);
      mealsContainer.append(card);
    }
  } catch (e) {
    console.error(e);
    alert('Failed to load meals');
  }
}

/** Fetch & show detail in a modal or new page—you can extend */
async function loadDetail(id) {
  // for brevity, you might redirect to detail.html?id=...
  window.location.href = `detail.html?id=${id}`;
}
