import { useEffect } from "react";
import { useState } from "react"
import Chart from "react-apexcharts";

const PieChart = ({ labels = [], defaultSeries = [], title = '' }) => {

    const [options, setOptions] = useState({
        chart: {
            width: '100%',
            type: 'pie',
        },
        labels: labels,
        theme: {
            monochrome: {
                enabled: true
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -5
                }
            }
        },
        title: {
            text: title
        },
        dataLabels: {
            formatter(val, opts) {
                const name = opts.w.globals.labels[opts.seriesIndex]
                return [name, val.toFixed(1) + '%']
            }
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