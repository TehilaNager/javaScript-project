const APIKEY = "48431db5050d5d5bfccc8ac7da4578ba";
const URL = `https://api.openweathermap.org/data/2.5/weather?appid=${APIKEY}&units=metric&q=`;
const cityValue = document.getElementById("inputCity");
const button = document.querySelector("button");
const cityName = document.getElementById("city");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const weatherIcon = document.getElementById("weatherIcon");

weatherIcon.style.display = "none";

function getWeather(city) {
    fetch(URL + city)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod == 200) {
                cityName.innerText = data.name;
                temp.innerText = Math.round(data.main.temp) + "°C";
                description.innerText = data.weather[0].description;
                const icon = data.weather[0].icon;
                weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                weatherIcon.style.display = "inline";
            } else {
                cityName.innerText = "";
                temp.innerText = "";
                description.innerText = "";
                weatherIcon.src = "";
                weatherIcon.style.display = "none";
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'City not found!',
                });
            }
        });
}

button.addEventListener('click', () => {
    const city = cityValue.value.trim();
    if (city) {
        getWeather(city);
        cityValue.value = "";
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Input needed',
            text: 'Please enter a city name before searching.'
        });
    }
});

cityValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        button.click();
    }
});