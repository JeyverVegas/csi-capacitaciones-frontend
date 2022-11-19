import { useState } from "react"
import Chart from "react-apexcharts";

const BarChart = ({
    categories = [],
    defaultSeries = [],
}) => {

    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: true
        },
        xaxis: {
            categories: categories,
        }
    });

    return (
        <Chart options={options} series={defaultSeries} type="bar" height={350} />
    )
}

export default BarChart;