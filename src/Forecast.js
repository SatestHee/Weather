import React, { useContext, useEffect, useState, createContext } from 'react';
import { ForecastContext } from './App';
import DailyChart from './DailyChart'
import dayjs from 'dayjs'
import axios from 'axios'
import './App.css'

export const DailyData = createContext(null);

function Forecast() {
    const params = useContext(ForecastContext);
    const forcastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${params.geolocation.latitude}&lon=${params.geolocation.longitude}&units=${params.units}&appid=7f87ab11fbe404bb51f3e91e4f43251e`
    const [lists, setLists] = useState([])
    const [error, setError] = useState(null)
    const [hourlylists, setHourlylists] = useState([])
    var getForecast = async () => {
        try {
            const res = await axios.get(forcastUrl)
            res.data.daily.splice(4, 3)
            setLists(res.data.daily)
            setHourlylists(res.data.hourly)
        } catch (error) {
            setError(error)
        }
    }
    useEffect(() => {
        if (params.latitude !== null) {
            getForecast()

        }
    }, [params.geolocation.latitude, params.geolocation.longitude, params.units])
    const parseInt = (temp) => {
        return Math.floor(temp)
    }
    return (
        <div>
            <DailyData.Provider value={{ hourlylists, params }}>
                <DailyChart />
            </DailyData.Provider>
            <div className="card">
                <div className="forecast">
                    <div className="title"><span>5 Day Forecast</span></div>
                    <ul >
                        {lists.map((day, key) => {
                            return (<li className="grid" key={key}>
                                <div>
                                    <div className="forecast-date">
                                        <span>{dayjs.unix(day.dt).format("ddd, MMM D")}</span>
                                    </div>
                                    <div className="forecast-tempature">
                                        <span>{parseInt(day.temp.max)} °/ {parseInt(day.temp.min)}°</span>
                                    </div>
                                    <div className="icon">
                                        <img className="forecast-icon" src={`http://openweathermap.org/img/wn/` + `${day.weather[0].icon}` + `@2x.png`}></img>
                                    </div>

                                    <div className="description"> <span>{day.weather[0].description}</span></div>
                                </div>
                            </li>)
                        })}
                    </ul>
                </div>
            </div>

        </div>


    )
}

export default Forecast;