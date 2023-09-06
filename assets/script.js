const popularCitiesInUS = [
    "New York,US",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "Fort Worth",
    "Columbus",
    "Charlotte",
    "San Francisco",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Washington, D.C.",
    "Boston",
    "El Paso",
    "Nashville",
    "Detroit",
    "Oklahoma City",
    "Portland",
    "Las Vegas",
    "Memphis",
    "Louisville",
    "Baltimore"
];

var storage = [];

function getData(city) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const apiKey = '9a969d22bc86e0dad6ada6855e0396b7';

    // Construct the complete API URL with query parameters
    var completeUrl = `${apiUrl}?q=${city}&appid=${apiKey}&cnt=6`;



    // Make the API call using the fetch function
    fetch(completeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            display(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


var search_button = document.getElementById("search_button");
// add event listener for search button
search_button.addEventListener("click", function (event) {
    event.preventDefault();
    if (event.target == search_button) {
        update_info();
    }
});

// function that updates web page info
function update_info() {
    let text = document.getElementById('search_text').value;
    // exit function if search bar is nil
    if (text.trim() == "") {
        return;
    }
    //parse through cities list and find the best match
    for (let i = 0; i < popularCitiesInUS.length; i++) {
        if (popularCitiesInUS[i].toLocaleLowerCase().indexOf(text.toLowerCase()) !== -1) {
            getData(popularCitiesInUS[i]); // api call
            const index = storage.indexOf(popularCitiesInUS[i]);
            if (index !== -1) {
                storage.splice(index, 1); //sort local storage base on most recent search
            }
            storage.unshift(popularCitiesInUS[i]);
            localStorage.setItem('storage_array', JSON.stringify(storage)); // set local storage and update
            update_storage();
            break;
        }
    }
    //set search bar to nil
    document.getElementById('search_text').value = "";
}

// display function that displays info on web page
function display(data) {
    if (data) {
        //remove all existing info
        document.querySelectorAll('.card').forEach((element) => {
            element.remove();
        });

        //set main info
        for (let i = 0; i < data.list.length; i++) {
            let name = data.city.name + " (" + dayjs().format('MM/DD/YYYY') + ")";
            let temp = (data.list[i].main.temp - 273.15) * 9 / 5 + 32;
            let wind = data.list[i].wind.speed;
            let humid = data.list[i].main.humidity;
            if (i == 0) {
                document.getElementById('city_text').textContent = name;
                document.getElementById('temp_text').textContent = temp.toFixed(2) + " °F";
                document.getElementById('wind_text').textContent = wind.toFixed(2) + " MPH";
                document.getElementById('humid_text').textContent = humid.toFixed(2) + " %";
                continue;
            }

            // set forecast info
            let dateEl = document.createElement('div');
            dateEl.textContent = dayjs().add(i, 'day').format('MM/DD/YYYY');
            let tempEl = document.createElement('div');
            tempEl.textContent = temp.toFixed(2) + " °F";
            let windEl = document.createElement('div');
            windEl.textContent = wind.toFixed(2) + " MPH";
            let humidEl = document.createElement('div');
            humidEl.textContent = humid.toFixed(2) + " %";
            let card = document.createElement('div');
            card.setAttribute('class', 'card');
            card.append(dateEl);
            card.append(tempEl);
            card.append(windEl);
            card.append(humidEl);
            document.querySelector(".five_day_display").append(card);
        }
    }
}

// update search history items
function update_storage() {
    document.querySelectorAll('.history_button').forEach((element) => {
        element.remove();
    });
    for (let i = 0; i < storage.length; i++) {
        let El = document.createElement('div');
        El.setAttribute('class', 'history_button search_container_item');
        El.textContent = storage[i];
        El.setAttribute('id', storage[i]);
        document.querySelector('.search_history').append(El);
    }
}

// event listener for history items
document.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('history_button')) {
        var Element = event.target;
        document.getElementById('search_text').value = Element.id;
        update_info();
    }
});

// load local storage on init
function load_localStorage() {
    storage = JSON.parse(localStorage.getItem('storage_array'));
    update_storage();
}

$(function () {
    // Initialize the autocomplete widget
    $("#search_text").autocomplete({
        source: popularCitiesInUS
    });
});

load_localStorage();
