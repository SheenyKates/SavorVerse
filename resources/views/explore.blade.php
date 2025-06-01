<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Explore Dishes - SavorVerse</title>
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
        <a href="{{ url('/explore') }}" class="nav-item active">EXPLORE MORE</a>
        <a href="{{ url('/about') }}" class="nav-item">ABOUT US</a>
        <div class="user-icon">
            <img src="{{ asset('user.png') }}" alt="User" id="user-img" />
            <div id="user-dropdown">
                <button id="logout-btn">Logout</button>
            </div>
        </div>
    </nav>
</header>

<main class="explore-category-wrapper">
    <div class="main-card">
        <h2 class="section-title">Explore Dishes by Country</h2>
        <div class="country-white-wrapper">
            <div class="country-grid" id="explore-country-grid"></div>
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
