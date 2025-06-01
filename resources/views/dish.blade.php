<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dish Detail | SavorVerse</title>
     {{-- Vite CSS & JS --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
<header class="header">
    <div class="logo-area">
        <img src="{{ asset('logo2.png') }}" alt="SavorVerse Logo" class="logo" />
        <div class="text-group">
            <h1 class="app-title">Savor<span class="highlight">Verse</span></h1>
            <p class="tagline">Every craving. Every cuisine. All in one <span class="highlight">verse</span>.</p>
        </div>
    </div>
    <nav class="nav-links">
        <a href="{{ url('/home') }}" class="nav-item">HOME</a>
        <a href="{{ url('/category') }}" class="nav-item">CATEGORY</a>
        <a href="{{ url('/favorites') }}" class="nav-item">FAVORITES</a>
        <a href="{{ url('/explore') }}" class="nav-item">EXPLORE MORE</a>
        <a href="{{ url('/about') }}" class="nav-item">ABOUT US</a> 
        <div class="user-icon">
            <img src="{{ asset('user.png') }}" alt="User" id="user-img" />
            <div id="user-dropdown">
                <button id="logout-btn">Logout</button>
            </div>
        </div>
    </nav>
</header>

<main class="single-dish-container">
    <div class="single-dish-card">
        <div class="single-dish-top">
            <img id="dish-img" src="" alt="Dish Image" class="single-dish-img" />
            <h2 class="single-dish-title" id="dish-title"></h2>
        </div>

        <button id="bookmark-btn" title="Save to favorites"></button>

        <div class="single-details">
            <div class="single-ingredients-box">
                <h3>Ingredients :</h3>
                <ul class="single-ingredients-list" id="ingredients-list"></ul>
            </div>

            <div class="single-instructions-box">
                <h3>Instructions :</h3>
                <p id="dish-instructions">Loading instructions...</p>
            </div>

            <button onclick="history.back()" class="single-back-btn">BACK</button>
        </div>
    </div>
</main>

<footer class="footer">
    <div class="footer-left">
        <p>Connect with Us:<br />Follow us on social media for the latest recipes, food culture stories, and cooking inspiration:</p>
    </div>
    <p class="copyright">@2025 SavorVerse. All Rights Reserved.</p>
    <div class="footer-right">
        <p><img src="{{ asset('fb.png') }}" class="icon" /> Facebook: [facebook.com/SavorVerse]</p>
        <p><img src="{{ asset('insta.png') }}" class="icon" /> Instagram: [instagram.com/SavorVerse]</p>
        <p><img src="{{ asset('twit.png') }}" class="icon" /> Twitter: [twitter.com/SavorVerse]</p>
    </div>
</footer>
</body>
</html>
