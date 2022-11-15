import { useEffect } from "react";
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
        dataLabels: {
            formatter(val, opts) {
                const name = opts.w.globals.labels[opts.seriesIndex]

                if (label === 'percent') {
                    return [name, val.toFixed(1) + '%']
                }

                if (label === 'value') {
                    return [name, `${labelStartAdornment} ${opts.w.config.series[opts.seriesIndex]} ${labelEndAdornment}`]
                }

                if (label === 'valueAndPercent') {
                    return [name, `${labelStartAdornment}${opts.w.config.series[opts.seriesIndex]}${labelEndAdornment} - ${val.toFixed(1)}%`]
                }
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