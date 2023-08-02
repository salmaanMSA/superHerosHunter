const publicKey = '0887df96aa8f8d8fd6fd8d4adf2ab5a3'; // Marvel API public key
const privateKey = '35201a2e103827cc9797fe049d3091454a20a1ad'; // Marvel API private key
const baseURL = 'https://gateway.marvel.com:443/v1/public/characters';
const ts = new Date().getTime();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();


const superheroDetailsContainer = document.getElementById('superheroDetails');

async function fetchAllCharacters() {
  const response = await fetch(`${baseURL}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  const data = await response.json();
  return data.data.results;
}

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
    // heroCard.querySelector('.add-favorite').addEventListener('click', addToFavorites);
    heroCard.addEventListener('click', () => openSuperheroPage(superhero.id));
    superheroesList.appendChild(heroCard);
  });
}

async function fetchAndDisplayAllCharacters() {
  const superheroes = await fetchAllCharacters();
  displaySuperheroes(superheroes);
}

fetchAndDisplayAllCharacters();




