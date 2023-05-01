import { useEffect } from "react";
import { useState } from "react"
import Chart from "react-apexcharts";

const ColumnChart = ({
    categories = [],
    defaultSeries = [],
    label = 'value',
    labelEndAdornment = '',
    labelStartAdornment = '',
    height = 400
}) => {

    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        },
                        formatter(val, opts) {
                            return `${labelStartAdornment}${val}${labelEndAdornment}`
                        }
                    }
                }
            },
        },
        dataLabels: {
            formatter(val, opts) {
                if (label === 'value') {
                    return `${labelStartAdornment}${opts.w.config.series[opts.seriesIndex].data[opts?.dataPointIndex]}${labelEndAdornment}`
                }

                if (label === 'valueAndPercent') {
                    return `${labelStartAdornment}${opts.w.config.series[opts.seriesIndex].data[opts?.dataPointIndex]}${labelEndAdornment} - ${val.toFixed(1)}%`
                }
            }
        },
        xaxis: {
            type: 'string',
            categories: categories,
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        }
    });

    return (
        <Chart options={options} series={defaultSeries} type="bar" height={height} />
    )
}

export default ColumnChart;