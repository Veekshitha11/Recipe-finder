// Initialize AOS animations
AOS.init();

const apiKey = '8a6475fe88af4b9bb1e12258a09de153';
const cache = {};

// Show loader message
function showLoader() {
    const container = document.getElementById('recipes-container');
    container.innerHTML = '<p>Loading recipes...</p>';
}

// Sanitize user input
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z, ]/g, '').trim();
}

// Fetch Recipes
async function fetchRecipes(ingredients) {
    if (cache[ingredients]) {
        return cache[ingredients];
    }

    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}&number=10`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed!');
        const data = await response.json();
        cache[ingredients] = data;
        return data;
    } catch (error) {
        alert(`Error: ${error.message}`);
        return []; // Return an empty array on error
    }
}

// Display Recipes
function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Clear previous recipes

    if (recipes.length === 0) {
        container.innerHTML = '<p>No recipes found. Try different ingredients!</p>';
        return;
    }

    recipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`); // Add delay for animations

        // Ensure recipe properties are available before rendering
        const recipeImage = recipe.image || 'default-placeholder.jpg'; // Fallback image
        const recipeTitle = recipe.title || 'Untitled Recipe';
        const recipeId = recipe.id || '';

        card.innerHTML = `
            <img src="${recipeImage}" alt="${recipeTitle}">
            <h3>${recipeTitle}</h3>
            <a href="https://spoonacular.com/recipes/${recipeTitle}-${recipeId}" target="_blank">
                View Full Recipe
            </a>
            <button onclick="saveFavorite('${recipeId}', '${recipeTitle}', '${recipeImage}')">Save to Favorites</button>
        `;
        container.appendChild(card);
    });

    AOS.refresh(); // Refresh AOS to apply new animations
}

// Save recipe to favorites
function saveFavorite(id, title, image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favorite = { id, title, image };
    favorites.push(favorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(`${title} has been added to your favorites!`);
}

// Display favorites
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const container = document.getElementById('favorites-container');
    container.innerHTML = ''; // Clear previous favorites

    if (favorites.length === 0) {
        container.innerHTML = '<p>No favorites yet. Save some recipes!</p>';
        return;
    }

    favorites.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank">
                View Full Recipe
            </a>
        `;
        container.appendChild(card);
    });

    AOS.refresh(); // Refresh AOS to apply new animations
}

// Handle Search Button
document.getElementById('search-btn').addEventListener('click', async () => {
    const ingredientsInput = document.getElementById('ingredients-input');
    const rawIngredients = ingredientsInput.value;
    const ingredients = sanitizeInput(rawIngredients);

    if (!ingredients) {
        alert('Please enter valid ingredients!');
        return;
    }

    showLoader(); // Show loader while fetching recipes

    const recipes = await fetchRecipes(ingredients);
    displayRecipes(recipes);
});

// Load favorites on page load
document.addEventListener('DOMContentLoaded', displayFavorites);

// Show favorites when clicked
document.getElementById('show-favorites-btn').addEventListener('click', displayFavorites);
