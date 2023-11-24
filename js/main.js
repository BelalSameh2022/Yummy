let data = document.getElementById("data");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;


// =====================> Preloader <=====================
$(function () {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500);
        $("body").css("overflow", "visible");
    });
});


// =====================> Side Navbar <=====================
function openSideNav() {
    $(".side-nav-menu").animate({ left: 0 }, 500)

    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-xmark");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({ top: 0 }, (i + 5) * 100)
    }
}

function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-xmark");

    $(".links li").animate({ top: 300 }, 500);
}

closeSideNav();

$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
})



// =====================> Meals <=====================
function displayMeals(arr) {
    let temp = "";
    for (let i = 0; i < arr.length; i++) {
        temp += `
            <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="Yummy">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `
    }
    data.innerHTML = temp;
}


// =====================> Categories <=====================
async function getCategories() {
    data.innerHTML = "";
    searchContainer.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();

    displayCategories(response.categories);
    $(".inner-loading-screen").fadeOut(400);
}

function displayCategories(arr) {
    let temp = "";
    for (let i = 0; i < arr.length; i++) {
        temp += `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${arr[i].strCategoryThumb}" alt="Yummy">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${arr[i].strCategory}</h3>
                    <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
        `
    }
    data.innerHTML = temp;
}

// =====================> Area <=====================
async function getAreas() {
    data.innerHTML = "";
    searchContainer.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();

    displayAreas(response.meals);
    $(".inner-loading-screen").fadeOut(400);
}

function displayAreas(arr) {
    let temp = "";
    for (let i = 0; i < arr.length; i++) {
        temp += `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${arr[i].strArea}</h3>
            </div>
        </div>
        `
    }
    data.innerHTML = temp;
}

// =====================> Ingredients <=====================
async function getIngredients() {
    data.innerHTML = "";
    searchContainer.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();

    displayIngredients(response.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(400);
}

function displayIngredients(arr) {
    let temp = "";
    for (let i = 0; i < arr.length; i++) {
        temp += `
            <div class="col-md-3">
                <div onclick="getIngredientMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${arr[i].strIngredient}</h3>
                    <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        `
    }
    data.innerHTML = temp;
}

// =====================> get Meals for Category, Area and Ingredient <=====================
async function getCategoryMeals(category) {
    data.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    displayMeals(response.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(400);
}

async function getAreaMeals(area) {
    data.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();

    displayMeals(response.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(400);
}

async function getIngredientMeals(ingredient) {
    data.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();

    displayMeals(response.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(400);
}


// =====================> Meal Details <=====================
async function getMealDetails(mealID) {
    closeSideNav();
    data.innerHTML = "";
    searchContainer.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();

    displayMealDetails(response.meals[0]);
    $(".inner-loading-screen").fadeOut(400);
}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";

    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-primary m-2 p-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",");
    // ignore undefined, null, empty, 0, false
    // let tags = meal.strTags.split(",");
    // console.log(tags);

    if (!tags) tags = ["No tags available!"];

    let tagsStr = '';
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `<li class="alert alert-warning m-2 p-2">${tags[i]}</li>`
    }

    let temp = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="Yummy">
            <h2>${meal.strMeal}</h2>
        </div>

        <div class="col-md-8">
            <h2>Instructions:</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area: </span><span class="fw-light">${meal.strArea}</span></h3>
            <h3><span class="fw-bolder">Category: </span><span class="fw-light">${meal.strCategory}</span></h3>
            <h3>Recipes:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>

            <h3>Tags:</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tagsStr}
            </ul>

            <a target="_blank" href="${meal.strSource}" class="btn btn-success text-uppercase">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger text-uppercase">Youtube</a>
        </div>`
    data.innerHTML = temp;
}


// =====================> Search <=====================
function showSearchInputs() {
    searchContainer.innerHTML = `
        <div class="row py-4">
            <div class="col-md-6 ">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name...">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter...">
            </div>
        </div>`
    data.innerHTML = "";
}

async function searchByName(term) {
    closeSideNav();
    data.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    $(".inner-loading-screen").fadeOut(400);
}

async function searchByFLetter(term) {
    closeSideNav();
    data.innerHTML = "";
    $(".inner-loading-screen").fadeIn(400);

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    response = await response.json();

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    console.log(response.meals);
    $(".inner-loading-screen").fadeOut(400);
}


// =====================> Contact Us <=====================
function showContactUs() {
    data.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter your name...">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed!
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter your nmail...">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            The email not valid! "exemple@yyy.zzz"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter your phone...">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid phone number!
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter your age...">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid age! "numbers only"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter your password...">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid password! "8 characters as a minimum, at least includes a letter and a number"
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Reenter your password...">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter the same password you have inserted!
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-secondary px-2 mt-3 text-uppercase">Submit</button>
            </div>
        </div>`
    submitBtn = document.getElementById("submitBtn");


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true;
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true;
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true;
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true;
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true;
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true;
    })
}


// =====================> Inputs Validation <=====================
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")
        }
    }

    if (emailInputTouched) {
        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")
        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")
        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
        }
    }
    
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}