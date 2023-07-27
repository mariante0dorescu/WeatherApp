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
        console.log(error)
      }
    )
  } else {
    console.error('Geolocation is not suppoerted by this browser')
  }  
}

// build url
function buildURL(lat, lng, key){
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`
}

function buildSearchURL(city, key){
  return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
}

// fetch data
async function getData(url) {
  try{
    const response = await fetch(url);
    const data = await response.json();
    createMainUI(data)
  } catch(err){
    console.log(err);
  }
}


// COMPONENTS
const app = document.querySelector('#app');

// create html content
// search form
function createSearchForm() {
  const container = document.createElement('div');
  container.setAttribute('class', 'search-form')

  const inputField = document.createElement('input');
  inputField.setAttribute('class', 'search-input')
  container.appendChild(inputField)

  const button = document.createElement('button')
  button.setAttribute('class', 'btn');
  button.innerText = "Search city"
  container.appendChild(button)

  app.appendChild(container)

  button.addEventListener('click', () => {
    console.log(inputField.value);
    const url = buildSearchURL(inputField.value, apiKey);
    console.log(url)
    getData(url)
    inputField.value = ""
  }) 
}


function createMainUI(object) {
  console.log(object)
}



// background changer depending on the weather
// show data
// graph???


createSearchForm();
loadLocation();