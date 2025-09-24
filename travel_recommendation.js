// Switch between Home, About, Contact
function showSectionFromHash() {
    const hash = (location.hash || "#home").toLowerCase();
    ["home","about","contact"].forEach(id => {
      document.getElementById(id).classList.toggle("active", "#" + id === hash);
      document.getElementById("link-" + id).classList.toggle("active", "#" + id === hash);
    });
    // Search bar only on Home
    document.getElementById("search-bar").style.display = (hash === "#home") ? "block" : "none";
  }
  window.addEventListener("hashchange", showSectionFromHash);
  window.addEventListener("DOMContentLoaded", showSectionFromHash);
  
  // Load JSON once
  let apiData = null;
  async function loadData() {
    try {
      const res = await fetch("./travel_recommendation_api.json");
      apiData = await res.json();
    } catch (e) {
      console.error("Error loading JSON", e);
    }
  }
  loadData();
  
  // Search
  function searchRecommendations() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const results = document.getElementById("results");
    if (!keyword) {
      results.innerHTML = "<p class='muted'>Enter a keyword like beach, temple, or a country.</p>";
      return;
    }
    if (!apiData) return;
  
    let items = [];
    if (keyword.includes("beach")) items = apiData.beaches;
    else if (keyword.includes("temple")) items = apiData.temples;
    else {
      const match = apiData.countries.find(c => c.name.toLowerCase().includes(keyword));
      if (match) items = match.cities;
    }
  
    if (!items.length) {
      results.innerHTML = "<p class='muted'>No results found.</p>";
    } else {
      results.innerHTML = "";
      items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p class="muted">${item.description}</p>
        `;
        results.appendChild(card);
      });
    }
  }
  
  // Clear
  function clearResults() {
    document.getElementById("searchInput").value = "";
    document.getElementById("results").innerHTML = "<p class='muted'>Cleared. Enter a new keyword.</p>";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBtn").addEventListener("click", searchRecommendations);
    document.getElementById("clearBtn").addEventListener("click", clearResults);
  });
  