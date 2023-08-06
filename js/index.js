const publicKey = '0887df96aa8f8d8fd6fd8d4adf2ab5a3'; // Marvel API public key
const privateKey = '35201a2e103827cc9797fe049d3091454a20a1ad'; // Marvel API private key
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';
const ts = new Date().getTime();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

const superheroDetailsContainer = document.getElementById('superheroDetails');
const searchInput = document.getElementById('searchBar');

if (searchInput !== undefined || searchInput !== null){
  searchInput.addEventListener('input', debounce(searchSuperheroes, 500));
}

// Debounce function to avoid frequent API requests while typing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}


/* Logic For Search Input for SuperHeros */

// function for fetching on search input
async function fetchSearchedSuperheros(searchQuery) {
  const response = await fetch(`${baseURL}?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${searchQuery}`);
  const data = await response.json();
  return data.data.results;
}

// function taking user input
async function searchSuperheroes() {
  const query = searchInput.value.trim();
  if (query.length === 0) {
    fetchAndDisplayAllCharacters();
  }

  const superheroes = await fetchSearchedSuperheros(query);
  displaySuperheroes(superheroes);
}

/*****  --------- Logic Ends  ---------    *****/


/* Logic for fetching and Displaying All SuperHero Lists */

// function fetching all characters
async function fetchAllCharacters() {
  const response = await fetch(`${baseURL}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  const data = await response.json();
  return data.data.results;
}

// function for creating a inner html element foreach super heros
function displaySuperheroes(superheroes) {
  superheroesList.innerHTML = '';
  superheroes.forEach(superhero => {
    const heroCard = document.createElement('div');
    heroCard.className = 'hero-card';
    heroCard.innerHTML = `
      <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
      <h3>${superhero.name}</h3>
      <button class="add-favorite" data-id="${superhero.id}">Add to Favorites</button>
    `;
    heroCard.querySelector('.add-favorite').addEventListener('click', addToFavorites);
    heroCard.addEventListener('click', () => openSuperheroPage(superhero.id));
    superheroesList.appendChild(heroCard);
  });
}

// function for displaying superhero lists
async function fetchAndDisplayAllCharacters() {
  const superheroes = await fetchAllCharacters();
  displaySuperheroes(superheroes);
}

fetchAndDisplayAllCharacters();

/*****  --------- Logic Ends  ---------    *****/



/* Logic for LocalStorage of all favorite super hero lists */

// Local Storage for Favorite heros
const favoritesString = localStorage.getItem('favoriteSuperheroes');
const favorites = JSON.parse(favoritesString) || []; // Convert JSON string back to an array or an empty array if no data found

// add new super heros into array
function addToFavorites(event) {
  const superheroId = event.target.dataset.id;
  const favorites = getFavoriteSuperheroes();

  if (!favorites.includes(superheroId)) {
    favorites.push(superheroId);
    saveFavoriteSuperheroes(favorites);
    event.target.disabled = true; // Disable the "Add to Favorites" button after it's added
    showNotification("SuperHero Added to Your Favorite List");
  }
  else {
    showNotification("SuperHero Already Added to Your Favorite List");
  }
}

// logic for removing superheros from favorite lists
function removeFromFavorites(event) {
  const superheroId = event.target.dataset.id;
  let favorites = getFavoriteSuperheroes();

  favorites = favorites.filter(id => id !== superheroId);
  saveFavoriteSuperheroes(favorites);

  const superheroCard = event.target.closest('.favorite-card');
  if (superheroCard) {
    superheroCard.remove();
  }
  showNotification("SuperHero Removed From Your Favorite List");
}

// logic for fetching favorite heros from LocalStorage
function getFavoriteSuperheroes() {
  const favoritesString = localStorage.getItem('favoriteSuperheroes');
  return JSON.parse(favoritesString) || [];
}

// logic for saving favorite item in local storage
function saveFavoriteSuperheroes(favorites) {
  localStorage.setItem('favoriteSuperheroes', JSON.stringify(favorites));
  // displayFavoriteSuperheroes(favorites);
}

/*****  --------- Logic Ends  ---------    *****/

function openSuperheroPage(superheroId) {
  window.location.href = `/html/superhero.html?id=${superheroId}`;
}

function showNotification(message) {
  const notificationElement = document.getElementById('notification');
  notificationElement.textContent = message;
  notificationElement.classList.add('show');

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notificationElement.classList.remove('show');
  }, 3000);
}

$(".nav .nav-link").on("click", function () {
  $(".nav").find(".active").removeClass("active");
  $(this).addClass("active");
});