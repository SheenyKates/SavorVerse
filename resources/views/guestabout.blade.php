<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>About SavorVerse</title>
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
        <a href="{{ url('/') }}" class="nav-item active">HOME</a>
        <a href="{{ url('/about') }}" class="nav-item">ABOUT US</a>
        <button class="login-btn" onclick="toggleForm()">Log in / Sign up</button>
    </nav>
</header>

<main class="about-wrapper">
    <div class="about-outer-card">
        <div class="about-card">
            <h2 class="section-title">About SavorVerse</h2>
            <p>
                SavorVerse is your ultimate global food discovery platform, created to bring authentic traditional dishes from your home country — and from cultures all over the world — right to your kitchen...
            </p>
        </div>

        <div class="about-card">
            <h2 class="section-title">How it works:</h2>
            <p>
                Just select your country to unlock a curated collection of beloved local dishes, complete with easy-to-follow recipes, ingredient lists, and vivid visuals...
            </p>
            <p>
                Whether you're a home cook, a passionate foodie, or someone looking for the comforting flavors of home...
            </p>
            <p>
                Our vision is to build a vibrant community where food connects cultures...
            </p>
            <p>
                We value your privacy and feedback. Your data is handled securely, and we welcome your suggestions to help us improve your experience.
            </p>
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
