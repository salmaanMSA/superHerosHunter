async function fetchHeroDetails(superheroId) {
    const response = await fetch(`${baseURL}/${superheroId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    const data = await response.json();
    return data.data.results[0];
}


// Display the superhero details on the superhero detail page
async function displaySuperheroDetails(superheroId) {
    try {
        const superhero = await fetchHeroDetails(superheroId);
        console.log(superhero);
        const superheroName = document.querySelector('.superhero-name');
        const superheroImage = document.querySelector('.superhero-image');
        const superheroBio = document.querySelector('.superhero-bio');
        superheroName.textContent = superhero.name;
        superheroImage.src = superhero.thumbnail.path + '.' + superhero.thumbnail.extension;
        superheroBio.textContent = superhero.description || "Description Not Available";

        const comicsList = document.querySelector('.comics-events');
        const comicsItems = superhero.comics.items ? superhero.comics.items.slice(0, 10) : [];
        comicsList.innerHTML = comicsItems.map(comic => `<li class="list-group-item">${comic.name}</li>`).join('');
    } catch (error) {
        console.log('Error fetching superhero details:', error);
    }
}

// Get the superhero ID from the URL query string (or any other method you are using to get the ID)
const urlParams = new URLSearchParams(window.location.search);
const superheroId = urlParams.get('id');

// Call the displaySuperheroDetails function with the superhero ID to fetch and display the details
displaySuperheroDetails(superheroId);


document.addEventListener("DOMContentLoaded", function() {
    // Get the back button element
    const backButton = document.getElementById("back-button");
  
    // Get the previous URL from the browser history
    const previousUrl = document.referrer;
  
    // Update the back button href
    if (previousUrl) {
      backButton.href = previousUrl;
    } else {
      // If there's no previous URL, disable the back button or set a default URL
      backButton.href = "/html/home.html";
    }
  });
