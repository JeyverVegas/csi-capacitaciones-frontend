import { useState } from "react"
import Chart from "react-apexcharts";

const LineChart = ({
    categories = [],
    defaultSeries = [],
    height = 350,
    title = ''
}) => {

    const [options, setOptions] = useState({
        chart: {
            height: height,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: title || '',
            align: title?.align || 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: categories,
        }
    });

    return (
        <Chart options={options} series={defaultSeries} type="line" height={height} />
    )
}

export default LineChart;