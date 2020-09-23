import React, { useContext, useEffect, useState, createContext } from 'react';
import { ForecastContext } from './App';
import DailyChart from './DailyChart'
import dayjs from 'dayjs'
import './App.css'

export const DailyData = createContext(null);

function Forecast() {
    const params = useContext(ForecastContext);
    const forcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${params.latitude}&lon=${params.longitude}&units=${params.units}&appid=7f87ab11fbe404bb51f3e91e4f43251e`
    const [lists, setLists] = useState([])
    const [hourlylists, setHourlylists] = useState([])
    var getForecast = async () => {
        await fetch(forcastUrl)
            .then(status)
            .then(response => response.json())
            .then(responseJson => {
                responseJson.daily.splice(4, 3)
                setLists(responseJson.daily)
                setHourlylists(responseJson.hourly)

            })
            .catch((error) => console.log('error', error))
    }

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }
    useEffect(() => {
        if (params.latitude !== null) {
            getForecast()

        }
    }, [params.latitude, params.longitude, params.units])
    return (
        <div >
            <main className="card forecast">
                <header>5 Day Forecast</header>
                <ul >
                    {lists.map(day => {
                        return (<li className="grid">
                            <div>
                                <div className="forecast-date">
                                    <span>{dayjs.unix(day.dt).format("ddd, MMM D")}</span>
                                </div>
                                <div className="icon">
                                    <img className="forecast-icon" src={`http://openweathermap.org/img/wn/` + `${day.weather[0].icon}` + `@2x.png`}></img>
                                </div>
                                <div className="forecast-tempature">
                                    <span>{day.temp.max} °/ {day.temp.min}°</span>
                                </div>
                                <div className="description"> <p>{day.weather[0].description}</p></div>
                            </div>
                        </li>)
                    })}
                </ul>
            </main >
            <DailyData.Provider value={{ hourlylists, params }}>
                <DailyChart />
            </DailyData.Provider>
        </div>


    )
}

export default Forecast;