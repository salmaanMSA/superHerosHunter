const favoritesList = document.getElementById('favoritesList');

async function fetchSuperheroDetails(superheroId) {
    const response = await fetch(`${baseURL}/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    const data = await response.json();
    return data.data.results[0];
}

function displayFavoriteSuperheroes(favoriteSuperheroes) {
    favoritesList.innerHTML = '';
    favoriteSuperheroes.forEach(async superheroId => {
        const superhero = await fetchSuperheroDetails(superheroId);
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'favorite-card';
        favoriteCard.innerHTML = `
        <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
        <h3>${superhero.name}</h3>
        <button class="remove-favorite" data-id="${superhero.id}">Remove from Favorites</button>
      `;
        favoriteCard.querySelector('.remove-favorite').addEventListener('click', removeFromFavorites);
        favoriteCard.addEventListener('click', () => openSuperheroPage(superhero.id));
        favoritesList.appendChild(favoriteCard);
    });
}

// logic for fetching favorite heros from LocalStorage
function getFavoriteSuperheroes() {
    const favoritesString = localStorage.getItem('favoriteSuperheroes');
    return JSON.parse(favoritesString) || [];
}

function fetchAndDisplayFavoriteSuperheros() {
    const favoriteLists = getFavoriteSuperheroes();
    displayFavoriteSuperheroes(favoriteLists);
}

if (favoritesList !== undefined || favoritesList !== null) {
    fetchAndDisplayFavoriteSuperheros();
}

document.addEventListener('DOMContentLoaded', () => {
    const notificationMessage = window.location.hash.slice(1); // Remove the '#' from the hash
    if (notificationMessage) {
        showNotification(notificationMessage);
    }
});
