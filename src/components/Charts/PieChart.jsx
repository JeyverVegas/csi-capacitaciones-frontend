import { useState } from "react"
import Chart from "react-apexcharts";

const PieChart = ({
    labels = [],
    defaultSeries = [],
    title = '',
    colors = [],
    label = 'percent',
    labelEndAdornment = '',
    labelStartAdornment = ''
}) => {

    const [options, setOptions] = useState({
        chart: {
            width: '100%',
            type: 'pie',
        },
        labels: labels,
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -5
                }
            }
        },
        colors: colors,
        title: {
            text: title
        },
        legend: {
            show: false
        }
    });

    return (
        <Chart options={options} series={defaultSeries} type="pie" />
    )
}

export default PieChart;