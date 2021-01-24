const main = document.getElementById('main');
const addUserBtn = document.getElementById('add-user');
const doubleBtn = document.getElementById('double');
const showMillionairesBtn = document.getElementById('show-millionaires');
const sortBtn = document.getElementById('sort');
const calculateWealthBtn = document.getElementById('calculate-wealth');


let data = [];

getRandomUser();
getRandomUser();
getRandomUser();

// fetch random user and add money
async function getRandomUser() {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();
    const user = data.results[0];
    const newUser = {
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000)
    }

    addData(newUser);
}

// add new object to data array
function addData(obj) {
    data.push(obj);
    updateDOM();
}

function updateDOM(providedData = data) {
    // clear the main div
    main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';
    providedData.forEach(item => {
        const element = document.createElement('div');
        element.classList.add('person');
        element.innerHTML = `<strong>${item.name}</strong> ${formatMoney(item.money)}`;
        main.appendChild(element);
    })
}

// format number as money
function formatMoney(money) {
    return '$' + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Double money
function doubleMoney() {
    data = data.map(user => {
        return { ...user, money: user.money * 2 };
    })
    updateDOM();
}

// sort richest
function sortByRichest() {
    data.sort((a, b) => b.money - a.money);
    updateDOM();
}

// show millionaires
function showMillionaires() {
    data = data.filter(item => item.money > 1000000)
    updateDOM();
}

// calculate total wealth
function calculateWealth() {
    const wealth = data.reduce((total, person) =>
        (total += person.money)
        , 0);
    const wealthElem = document.createElement('div');
    wealthElem.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(wealth)}</strong></h3>`
    main.appendChild(wealthElem);
}

// Event Listeners
addUserBtn.addEventListener('click', getRandomUser);
doubleBtn.addEventListener('click', doubleMoney);
sortBtn.addEventListener('click', sortByRichest);
showMillionairesBtn.addEventListener('click', showMillionaires)
calculateWealthBtn.addEventListener('click', calculateWealth);