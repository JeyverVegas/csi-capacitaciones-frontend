import { useEffect } from "react";
import { useState } from "react"
import Chart from "react-apexcharts";

const ColumnChart = ({
    categories = [],
    defaultSeries = [],
    label = 'value',
    labelEndAdornment = '',
    labelStartAdornment = '',
    height = 400,
    title = ""
}) => {

    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return labelStartAdornment + val + labelEndAdornment;
            },
            style: {
                fontSize: '12px',
                colors: ["#ffffff"]
            }
        },

        xaxis: {
            categories: categories,
            position: 'top',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return labelStartAdornment + val + labelEndAdornment;
                }
            }

        },
        title: {
            text: title,
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        }
    });

    return (
        <Chart options={options} series={defaultSeries} type="bar" height={height} />
    )
}

export default ColumnChart;