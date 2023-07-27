import "./styles.css";
import "./styles.scss";
import {apiKey} from "./api_key.js"

// FUNCTIONS
// get lat and long
async function loadLocation() {
  if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          const url =  buildURL(lat.toFixed(2), long.toFixed(2), apiKey);
          getData(url)
      },
      (error) => {
        if(error.code == 1) {
          displayError("The acquisition of the geolocation information failed because the page didn't have the necessary permissions")
        } else if(error.code == 2) {
          displayError("The acquisition of the geolocation failed because at least one internal source of position returned an internal error.")
      } else if(error.code == 3) {
        displayError("The time allowed to acquire the geolocation was reached before the information was obtained.")
      } 
  })
  } else {
    displayError('Geolocation is not suppoerted by this browser')
  }  
}

// build url
function buildURL(lat, lng, key){
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`
}

function buildSearchURL(city, key){
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
}

// error handling
function displayError(msg){
  const main = document.getElementById('main');
  const p = document.createElement('p')
  p.setAttribute('class', 'error')
  p.innerText = msg;
  main.appendChild(p)
  setTimeout(() => {
    p.remove()
  }, 3000)
}

// fetch data
async function getData(url) {
  try{
    const response = await fetch(url);
    
    if(response.status === 200) {
      const data = await response.json();
      createMainUI(data)
    } else {
      displayError(response.statusText)
    }

  } catch(err){
    displayError(err)
  }
}


// COMPONENTS
const app = document.querySelector('#app');

// create html content

// search form
function createSearchForm() {
  const container = document.createElement('div');
  container.setAttribute('class', 'search')

  const inputField = document.createElement('input');
  inputField.setAttribute('class', 'search__input')
  container.appendChild(inputField)

  const button = document.createElement('button')
  button.setAttribute('class', 'search__btn btn');
  button.innerText = "Search city"
  container.appendChild(button)

  app.appendChild(container)

  button.addEventListener('click', () => {
    const url = buildSearchURL(inputField.value, apiKey);
    getData(url)
    inputField.value = ""
  }) 
}

// create ui with city weather
function createMainUI(data) {
  const main = document.getElementById('main');
  main.innerHTML = ""
  const dataFromObject = {
    description: data.weather[1].description,
    icon: data.weather[1].icon,
    mainTemp: data.main.temp + "°C",
    feels: data.main.feels_like + "°C",
    minTemp: data.main.temp_min + "°C",
    maxTemp: data.main.temp_max + "°C",
    humidity: data.main.humidity  + "%",
    country: data.sys.country,
    city: data.name,
    localHours: new Date(data.dt*1000).getHours(),
    minutes: new Date(data.dt*1000).getMinutes(),
  }
  console.table(dataFromObject)
}

// create main div to display weather or error message
function createMainDiv() {
  const div = document.createElement('div');
  div.setAttribute('id', 'main')
  div.setAttribute('class', 'main')
  app.appendChild(div)
}

// background changer depending on the weather
// show data
// graph???

/** {"coord":{"lon":26.1063,"lat":44.4323},
 * "weather":[
 *    {"id":200,"main":"Thunderstorm","description":"thunderstorm with light rain","icon":"11d"},
 *    {"id":501,"main":"Rain","description":"moderate rain","icon":"10d"}],
 * "base":"stations",
 * "main":{"temp":22.91,"feels_like":23.06,"temp_min":21.01,"temp_max":24.44,"pressure":1004,"humidity":69},
 * "visibility":10000,
 * "wind":{"speed":5.66,"deg":10},
 * "rain":{"1h":1.19},
 * "clouds":{"all":40},
 * "dt":1690448765,
 * "sys":{"type":2,"id":2037828,"country":"RO","sunrise":1690426583,"sunset":1690480052},
 * "timezone":10800,"id":683506,"name":"Bucharest","cod":200} */

createSearchForm();
createMainDiv();
loadLocation();