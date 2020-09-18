import React, { useState, useEffect, createContext } from 'react';
import moment from 'moment';
import Forecast from './Forecast';
import './App.css';
//import { ReactComponent as Logo } from './wind.svg'
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
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState({
    tempature: '--',
    max: '--',
    min: '--',
    description: '--',
    icon: '01d',
    city: '',
    country: '--',
    feels_like: '--',
    pressure: '--',
    sunrise: '--',
    sunset: '--',
  });

  const weahtherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=7f87ab11fbe404bb51f3e91e4f43251e`

  //Handle Error
  var status = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }
  var getWeather = async () => {
    await fetch(weahtherUrl)
      .then(status)
      .then(response => response.json())
      .then(data => {
        setWeather({
          ...weather,
          tempature: data.main.temp,
          max: data.main.temp_max,
          min: data.main.temp_min,
          city: data.name,
          country: data.sys.country,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
          feels_like: data.main.feels_like,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
        })
      })
      .catch(setError[error], console.log('error inApp', error))
  }


  useEffect(() => {
    //Get Current Location by Callback function
    navigator.geolocation.getCurrentPosition(currentPosition => {
      setLongitude(currentPosition.coords.longitude)
      setLatitude(currentPosition.coords.latitude)
    })
    if (longitude !== null && latitude !== null) {
      getWeather()
    }
  }, [latitude, longitude, units])

  const onClick = () => {
    if (units === 'metric') {
      setUnits('imperial')
    } else {
      setUnits('metric')
    }

  }
  return (
    <ForecastContext.Provider value={{ latitude, longitude, units }}>
      <div className="app">
        <div className="container">
          <div className="card">
            <section>
              <div className="error"> <p>{error}</p></div>
              <div className="location">
                <LocationOnIcon /> <p>{weather.city}, {weather.country}</p></div>
              <div className="time"> <p>{moment().format('hh:mm a, MMM Do YYYY')}</p></div>
              <a onClick={onClick} href="#">
                <div className="tempature"> <p>{weather.tempature}{units === 'metric' ? '°C' : '°F'}</p></div>
              </a>
              <div className="icon">
                <img src={`http://openweathermap.org/img/wn/` + `${weather.icon}` + `@2x.png`}></img>
              </div>
              <div className="maxmin"> <p>{weather.max}{units === 'metric' ? '°C' : '°F'} / {weather.min}{units === 'metric' ? '°C' : '°F'}</p></div>
              <div className="description"> <p>{weather.description}</p></div>
            </section>
          </div>

          <div className="card">
            <section>
              <header> Weather Today in {weather.city}</header>
              <a onClick={onClick} href="#">
                <p>Feels like</p>
                <div className="tempature"> <p> {weather.feels_like}{units === 'metric' ? '°C' : '°F'}</p></div>
              </a>
              <div className="weather-details-container">

                <div className="weather-details-listItem">
                  <PriorityHighIcon/>
                  <div className="weather-details-title">
                    High/Low</div>
                  <div className="weather-details-data">
                    <span>{weather.max} °/ {weather.min}°</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
               <ClearAllIcon/>
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
                  <ImportExportIcon/>
                  <div className="weather-details-title">Pressure</div>
                  <div className="weather-details-data">
                    <span>{weather.pressure} mb</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <WbSunnyOutlinedIcon/>
                  <div className="weather-details-title"> Sunrise </div>
                  <div className="weather-details-data">
                    <span>{moment.unix(weather.sunrise).format("hh:mm a")}</span>
                  </div>
                </div>
                <div className="weather-details-listItem">
                  <WbSunnyRoundedIcon />
                  <div className="weather-details-title">Sunset</div>
                  <div className="weather-details-data">
                    <span>{moment.unix(weather.sunset).format("hh:mm a")}</span>
                  </div>
                </div>
              </div>

            </section>

          </div>
          <Forecast></Forecast>
        </div>

      </div>

    </ForecastContext.Provider>

  );
}

export default App;
