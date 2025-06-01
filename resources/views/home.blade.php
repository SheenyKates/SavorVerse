<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SavorVerse - Home</title>
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

<main class="main-content">
  <section class="main-card">
    <h2 class="main-title" id="greeting">Loading greeting...</h2>

    <div class="info-card culture-card">
      <h3>You're from the <span id="country-name">...</span> — here's a glimpse of your culture!</h3>
      <div class="culture-info">
        <div>
          <p><strong>Flag:</strong> <img id="flag-img" src="" alt="Country Flag" /></p>
          <p><strong>Capital:</strong> <span id="capital"></span></p>
          <p><strong>Region:</strong> <span id="region"></span></p>
          <p><strong>Subregion:</strong> <span id="subregion"></span></p>
        </div>
        <div>
          <p><strong>Population:</strong> <span id="population"></span></p>
          <p><strong>Languages:</strong> <span id="lan
