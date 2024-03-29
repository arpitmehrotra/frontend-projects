const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');

// search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    single_mealEl.innerHTML = ''

    // Get the search term
    const term = search.value;

    // Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search Results for '${term}':`;

                if (data.meals === null) {
                    resultHeading.innerHTML = '<p>There are no search results. Try again!</p>'
                }
                else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                        </div>
                    `).join('')
                }
            });
        // Clear Search Text
        search.value = ''
    }
    else {
        alert("Please enter a search term");
    }
}

// Fetch meal by ID 
async function getMealById(mealID) {
    const mealData = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const res = mealData.json();
    res.then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    })
}

// Fetch random meal from API
async function getRandomMeal() {
    // Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    const randomArr = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const res = randomArr.json();
    res.then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    })
}

function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        }
        else {
            break;
        }
    }
    single_mealEl.innerHTML = `
        <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        </div>
    `
}

// Event Listener 
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        }
        return false;
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})

random.addEventListener('click', getRandomMeal)