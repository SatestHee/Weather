import React, { useState, useEffect, createContext } from 'react';
import dayjs from 'dayjs';
import axios from 'axios'
import Forecast from './Forecast';
import Footer from './Footer';
import './App.css';
import SearchIcon from '@material-ui/icons/Search';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import OpacityIcon from '@material-ui/icons/Opacity';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded';
import ImportExportIcon from '@material-ui/icons/ImportExport';

export const ForecastContext = createContext(null);
function App() {
  const [error, setError] = useState(null)
  const [cityname, setSearchValue] = useState('')
  const [geolocation, setGeolocation] = useState({
    latitude: null,
    longitude: null
  })
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState({
    tempature: '--',
    max: '--',
    min: '--',
    description: '--',
    icon: '01d',
    city: '--',
    country: '--',
    feels_like: '--',
    pressure: '--',
    sunrise: '--',
    sunset: '--',
  });

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.latitude}&lon=${geolocation.longitude}&units=${units}&appid=7f87ab11fbe404bb51f3e91e4f43251e`

  const getWeather = async () => {
    try {
      const res = await axios.get(weatherUrl)
      setWeather({
        ...weather,
        tempature: res.data.main.temp,
        max: res.data.main.temp_max,
        min: res.data.main.temp_min,
        city: res.data.name,
        country: res.data.sys.country,
        icon: res.data.weather[0].icon,
        description: res.data.weather[0].description,
        feels_like: res.data.main.feels_like,
        wind: res.data.wind.speed,
        humidity: res.data.main.humidity,
        pressure: res.data.main.pressure,
        sunrise: res.data.sys.sunrise,
        sunset: res.data.sys.sunset,
      })
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    if (geolocation.longitude === null || geolocation.latitude === null) {
      //Get Current Location by Callback function
      navigator.geolocation.getCurrentPosition(currentPosition => {
        setGeolocation({
          longitude: currentPosition.coords.longitude,
          latitude: currentPosition.coords.latitude
        })
      })
    }
    getWeather()

  }, [geolocation, units])

  const handleConverter = (e) => {
    setUnits(e.target.id)
  }
  const onClick = () => {
    units === 'metric' ? setUnits('imperial') : setUnits('metric')
  }

  const onChange = (e) => {
    setSearchValue(e.target.value)
    if (e.target.value.trim() === "") return;
    const autocomplete = new window.google.maps.places.Autocomplete((document.getElementById('locationSearch')), {
      types: ['geocode'],
    })
    window.google.maps.event.addListener(autocomplete, 'place_changed', function () {
      const lat = autocomplete.getPlace().geometry.location.lat()
      const long = autocomplete.getPlace().geometry.location.lng()
      const placeName = autocomplete.getPlace().name
      setGeolocation({
        longitude: long,
        latitude: lat
      })
      setSearchValue(placeName)

    })

    // return () => window.removeEventListener('place_changed', autocomplete);

  }
  const parseInt = (temp) => {
    return Math.floor(temp)
  }

  return (
    <ForecastContext.Provider value={{ geolocation, units }}>
      <div className="app">
        <div className="container">
          <header >
            <nav>
              <div className="search">
                <SearchIcon id="searchIcon"></SearchIcon>
                <input role="textbox"
                  id="locationSearch"
                  className="locationSearch"
                  type="text"
                  placeholder="Search City or Zip Code"
                  autoComplete="off"
                  onChange={onChange}
                  value={cityname}>
                </input>

              </div>
              <ul>
                <li>
                  <a onClick={handleConverter} href="#" id="metric">°C
                </a>
                </li>
                <li>|</li>
                <li>
                  <a onClick={handleConverter} href="#" id="imperial">°F
                </a>
                </li>
              </ul>
            </nav>
          </header>
          {/* <div className="error"> <p>{error}</p></div> */}

          <div className="card">
            <div className="current">
              <div className="location">
                <LocationOnIcon /> <p>{weather.city}, {weather.country}</p></div>
              <div className="time"> <p>{dayjs().format('MMM D, YYYY h:mm A')}</p></div>
              <a onClick={onClick} href="#">
                <div className="tempature"> <span>{parseInt(weather.tempature)}{units === 'metric' ? '°C' : '°F'}</span></div>
              </a>
              <div className="icon">
                <img src={`http://openweathermap.org/img/wn/` + `${weather.icon}` + `@2x.png`}></img>
              </div>
              {/* <div className="maxmin"> <span>{parseInt(weather.max)}{units === 'metric' ? '°C' : '°F'} / {parseInt(weather.min)}{units === 'metric' ? '°C' : '°F'}</span></div> */}
              <div className="description"> <span>{weather.description}</span></div>
            </div>

          </div>

          <div className="card">
            <div className="details">
              <div className="title"><span>Weather Today in {weather.city}</span> </div>
              <div className="feels_like">
                <a onClick={onClick} href="#">
                  <span>Feels like</span>
                  <div className="tempature"> <span> {parseInt(weather.feels_like)}{units === 'metric' ? '°C' : '°F'}</span></div>
                </a>
              </div>
              <div className="weather-details-container">
                <div className="weather-details-listItem">
                  <PriorityHighIcon />
                  <div className="weather-details-title">
                    High/Low</div>
                  <div className="weather-details-data">
                    <span>{parseInt(weather.max)} °/ {parseInt(weather.min)}°</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <ClearAllIcon />
                  <div className="weather-details-title"> Wind </div>
                  <div className="weather-details-data">
                    <span>{weather.wind} km/h</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <OpacityIcon />
                  <div className="weather-details-title">Humidity</div>
                  <div className="weather-details-data">
                    <span>{weather.humidity} %</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <ImportExportIcon />
                  <div className="weather-details-title">Pressure</div>
                  <div className="weather-details-data">
                    <span>{weather.pressure} mb</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <WbSunnyOutlinedIcon />
                  <div className="weather-details-title">Sunrise</div>
                  <div className="weather-details-data">
                    <span>{dayjs.unix(weather.sunrise).format("hh:mm a")}</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <WbSunnyRoundedIcon />
                  <div className="weather-details-title">Sunset</div>
                  <div className="weather-details-data">
                    <span>{dayjs.unix(weather.sunset).format("hh:mm a")}</span>
                  </div>
                </div>
              </div>


            </div>

          </div>
          <Forecast></Forecast>
          <Footer></Footer>

        </div>

      </div>

    </ForecastContext.Provider>

  );
}

export default App;
