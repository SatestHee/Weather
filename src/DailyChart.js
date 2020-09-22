import * as d3 from 'd3';
import React, { useContext, useEffect, useRef } from 'react';
import { DailyData } from './Forecast'
import dayjs from 'dayjs'
function DailyChart() {
    const ref = useRef()
    const data = useContext(DailyData)
    var lists = data.hourlylists
    const units = data.params.units === 'metric' ? '°C' : '°F'
    var drawChart = () => {
        const svg = d3.select(ref.current)
        const margin = { top: 20, right: 20, bottom: 40, left: 60 }
        //set svg
        svg.attr("width", 600)
            .attr("height", 400)
            .attr("overflow", "visible");

        //set margin left & top
        svg.select('#g')
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        lists.forEach(day => {
            day.dt = new Date(day.dt * 1000)
        });
        //XAxis Date Format
        const x = d3.scaleTime()
            .domain(d3.extent(lists, d => d.dt))
            .range([0, width])
        svg.select('#x')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
        //YAxis
        const y = d3.scaleLinear()
            .domain([20, d3.max(lists, d => d.temp)])
            .range([height, 0]);
        svg.select('#y')
            .call(d3.axisLeft(y));

        //Select data
        svg.select("#path")
            .datum(lists)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(d => x(d.dt))
                .y(d => y(d.temp))
            )
        var focus = d3.select("#focus")

        focus.select(".tooltip")
            .attr("width", 150)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4)

        focus.select(".tooltip-date")
            .attr("x", 18)
            .attr("y", -2);

        focus.select(".tooltip-temp")
            .attr("x", 18)
            .attr("y", 18);

        svg.select("#overlay")
            .attr("width", width)
            .attr("height", height)
            .datum(lists)
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => focus.style("display", "none"))
            .on("mousemove", (e, lists) => mousemove(e, lists))
        var bisectDate = d3.bisector((d) => d.dt).right;

        function mousemove(e, lists) {
            var x0 = d3.pointer(e)
            var x1 = x.invert(x0[0])
            const index = bisectDate(lists, x1);
            if (index === 0) return;
            const a = lists[index - 1].dt
            const b = lists[index - 1].temp
            focus.attr("transform", `translate(${x(a)},${y(b)})`)
            focus.select(".tooltip-date")
                .text(dayjs(a).format("ddd, MMM D h:mm A"))
            focus.select(".tooltip-temp")
                .text('Tempature: ' + b + units)
        }
    }


    useEffect(() => {
        //init Chart
        drawChart()
    }, [lists])
    return (
        <div>
            <header>Next 48 Hour Weather</header>
            <div id='chart'>
                <svg ref={ref}>
                    <g id="g">
                        <g id="x"></g>
                        <g id="y"></g>
                        <path id="path"></path>
                        <g className="focus" id="focus" style={{ display: "none" }}>
                            <circle r="5" id="dot"></circle>
                            <rect className="tooltip"></rect>
                            <text className="tooltip-date"></text>
                            <text className="tooltip-temp"></text>
                        </g>
                        <rect className="overlay" id="overlay" fill="none" pointer-events="all"></rect>
                    </g>
                </svg>
            </div>
        </div>


    )
}

export default DailyChart;