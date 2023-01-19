import { format } from "date-fns";
import { useEffect } from "react";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import BarChart from "../../components/Charts/BarChart";
import ColumnChart from "../../components/Charts/ColumnChart";
import PieChart from "../../components/Charts/PieChart";
import DetailsCard from "../../components/DetailsCard";
import { useAuth } from "../../context/AuthContext";
import useAxios from "../../hooks/useAxios";
import useServices from "../../hooks/useServices";
import useZones from "../../hooks/useZones";

const Dashboard = () => {

    const [filterBy, setFilterBy] = useState('services');

    const [filters, setFilters] = useState({
        monthAndYear: `${format(new Date(), 'yyyy-MM')}`,
        serviceIds: [],
        zoneIds: []
    });

    const [{ data: dashBoardSummary, loading }, getDashBoardSummary] = useAxios({ url: `/dashboard`, params: { ...filters } }, { manual: true, useCache: false });

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { perPage: 500, currentUserServices: true, page: 1 }, options: { useCache: false } });

    const [{ zones, loading: zonesLoading }, getZones] = useZones({ params: { perPage: 500, currentUserZones: true, page: 1 }, options: { useCache: false } });

    useEffect(() => {
        if (filterBy === 'services') {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    serviceIds: services?.map(service => service.id),
                    zoneIds: []
                }
            })
        }

        if (filterBy == 'zones') {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    zoneIds: zones?.map(zone => zone.id),
                    serviceIds: []
                }
            });
        }
    }, [filterBy])

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                serviceIds: services?.map(service => service.id)
            }
        })
    }, [services])

    useEffect(() => {
        if (filters?.serviceIds?.length > 0 || filters?.zoneIds?.length > 0) {
            getDashBoardSummary({
                params: {
                    ...filters,
                    serviceIds: filters?.serviceIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
        }
    }, [filters]);

    const handleService = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                serviceIds: e.target.value ? [e.target.value] : services?.map(service => service.id)
            }
        });
    }

    const handleZone = (e) => {

        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                zoneIds: e.target.value ? [e.target.value] : zones?.map(zone => zone.id)
            }
        })
    }

    const findColorPieChart = (key) => {
        switch (key) {
            case 'Extraordinario':
                return '#df6adb';
            case 'Manual':
                return '#5e74f4';
            case 'Mensual':
                return '#34b4db';
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card p-3">
                        <Tabs
                            activeKey={filterBy}
                            onSelect={(k) => setFilterBy(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="services" title="Servicios">
                                {
                                    filterBy === 'services' ?
                                        services?.length > 1 ?
                                            <div className="form-group">
                                                <select className="form-control" onChange={handleService}>
                                                    <option value="">Todos</option>
                                                    {services?.map((service, i) => <option value={service?.id} key={i}>
                                                        {service?.name}
                                                    </option>
                                                    )}
                                                </select>
                                            </div>
                                            :
                                            <h4>
                                                {services?.[0]?.name}
                                            </h4>
                                        :
                                        null
                                }
                            </Tab>
                            <Tab eventKey="zones" title="Zonas">
                                {
                                    filterBy === 'zones' ?
                                        zones?.length > 1 ?
                                            <div className="form-group">
                                                <select className="form-control" onChange={handleZone}>
                                                    <option value="">Todas</option>
                                                    {zones?.map((zone, i) => {
                                                        return (
                                                            <option value={zone.id} key={i}>
                                                                {zone?.name}
                                                            </option>
                                                        )
                                                    }
                                                    )}
                                                </select>
                                            </div>
                                            :
                                            <h4>
                                                {zones?.[0]?.name}
                                            </h4>
                                        :
                                        null
                                }
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">

                        <div className="form-group">
                            <label>Mes y Año</label>
                            <input
                                type="month"
                                id="start"
                                name="start"
                                className="form-control"
                                value={filters?.monthAndYear}
                                onChange={(e) => setFilters((oldFilters) => {
                                    return {
                                        ...oldFilters,
                                        monthAndYear: e.target.value
                                    }
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Pedidos Manuales'}
                        loading={loading}
                        icon='fa fa-box'
                        value={dashBoardSummary?.ordersCountByType?.manual || '--'}
                        gradient="gradient-11"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Pedidos Mensuales'}
                        loading={loading}
                        icon='fa fa-box'
                        value={dashBoardSummary?.ordersCountByType?.monthly || '--'}
                        gradient="gradient-12"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Pedidos Extraordinarios'}
                        loading={loading}
                        icon='fa fa-box'
                        value={dashBoardSummary?.ordersCountByType?.extraordinary || '--'}
                        gradient="gradient-15"
                    />
                </div>
            </div>
            {
                dashBoardSummary?.ordersCountByZone &&
                <>
                    <h3 className="text-center my-5">
                        Gráficos por zona
                    </h3>
                    <div className="row mb-5 justify-content-center">
                        {
                            Object.keys(dashBoardSummary?.ordersCountByZone).length > 0 && !loading ?
                                Object.keys(dashBoardSummary?.ordersCountByZone).map((key, i) => {
                                    const { zone, ...rest } = dashBoardSummary?.ordersCountByZone[key]
                                    return (
                                        <div className="col-md-4">
                                            <PieChart
                                                title={key.toUpperCase()}
                                                key={i}
                                                labels={Object.keys(rest).map((key2) => key2)}
                                                defaultSeries={Object.keys(rest).map((key2) => rest[key2])}
                                                colors={Object.keys(rest).map((key2) => findColorPieChart(key2))}
                                            />
                                        </div>
                                    )
                                })
                                :
                                <h3 className="text-center text-danger">
                                    No hay datos para mostrar.
                                </h3>
                        }

                    </div>
                </>
            }

            {
                dashBoardSummary?.ordersCountByService &&
                <>
                    <h3 className="text-center my-5">
                        Tipo de pedido por servicio
                    </h3>
                    <div className="row mb-5">
                        {
                            Object.keys(dashBoardSummary?.ordersCountByService).length > 0 && !loading ?
                                <div className="col-md-12">
                                    <ColumnChart
                                        categories={Object.keys(dashBoardSummary?.ordersCountByService).map(key => dashBoardSummary?.ordersCountByService[key]?.service.toLocaleUpperCase())}
                                        defaultSeries={[
                                            {
                                                name: 'Mensual',
                                                data: Object.keys(dashBoardSummary?.ordersCountByService).map(key => dashBoardSummary?.ordersCountByService[key]?.Mensual || 0),
                                                color: '#34b4db'
                                            },
                                            {
                                                name: 'Extraordinario',
                                                data: Object.keys(dashBoardSummary?.ordersCountByService).map(key => dashBoardSummary?.ordersCountByService[key]?.Extraordinario || 0),
                                                color: '#df6adb'

                                            },
                                            {
                                                name: 'Manual',
                                                data: Object.keys(dashBoardSummary?.ordersCountByService).map(key => dashBoardSummary?.ordersCountByService[key]?.Manual || 0),
                                                color: '#5e74f4'
                                            },
                                        ]}
                                    />
                                </div>
                                :
                                <h3 className="text-center text-danger">
                                    No hay datos para mostrar.
                                </h3>
                        }

                    </div>
                </>
            }
            <div className="row">
                <div className="col-md-6">
                    <h3 className="text-center my-5">
                        Monto por tipo de pedido
                    </h3>
                    {
                        dashBoardSummary?.ordersAmountByType && Object.keys(dashBoardSummary?.ordersAmountByType).length > 0 && !loading ?
                            <PieChart
                                label="valueAndPercent"
                                labelStartAdornment='$'
                                labels={['Mensual', 'Extraordinario', 'Manual']}
                                defaultSeries={Object.keys(dashBoardSummary?.ordersAmountByType).map((key2) => dashBoardSummary?.ordersAmountByType[key2] ? Number(dashBoardSummary?.ordersAmountByType[key2]) : 0)}
                                colors={['#34b4db', '#df6adb', '#5e74f4']}
                            />
                            :
                            <h3 className="text-center text-danger">
                                No hay datos para mostrar.
                            </h3>
                    }
                </div>
                <div className="col-md-6">
                    <h3 className="text-center my-5">
                        Porcentaje tipo de pedido
                    </h3>
                    {
                        dashBoardSummary?.ordersCountByType && Object.keys(dashBoardSummary?.ordersCountByType).length > 0 && !loading ?
                            <PieChart
                                labels={['Extraordinario', 'Manual', 'Mensual']}
                                defaultSeries={Object.keys(dashBoardSummary?.ordersCountByType).map((key2) => dashBoardSummary?.ordersCountByType[key2])}
                                colors={['#df6adb', '#5e74f4', '#34b4db']}
                            />
                            :
                            <h3 className="text-center text-danger">
                                No hay datos para mostrar.
                            </h3>
                    }
                </div>
            </div>

            {
                dashBoardSummary?.ordersAmountByService &&
                <>
                    <h3 className="text-center my-5">
                        Monto de pedidos por servicio
                    </h3>
                    <div className="row mb-5">
                        {
                            Object.keys(dashBoardSummary?.ordersAmountByService).length > 0 && !loading ?
                                <div className="col-md-12">
                                    <ColumnChart
                                        label="value"
                                        labelStartAdornment='$ '
                                        categories={Object.keys(dashBoardSummary?.ordersAmountByService).map(key => dashBoardSummary?.ordersAmountByService[key]?.service.toLocaleUpperCase())}
                                        defaultSeries={[
                                            {
                                                name: 'Mensual',
                                                data: Object.keys(dashBoardSummary?.ordersAmountByService).map(key => dashBoardSummary?.ordersAmountByService[key]?.Mensual || 0),
                                                color: '#34b4db'
                                            },
                                            {
                                                name: 'Extraordinario',
                                                data: Object.keys(dashBoardSummary?.ordersAmountByService).map(key => dashBoardSummary?.ordersAmountByService[key]?.Extraordinario || 0),
                                                color: '#df6adb'

                                            },
                                            {
                                                name: 'Manual',
                                                data: Object.keys(dashBoardSummary?.ordersAmountByService).map(key => dashBoardSummary?.ordersAmountByService[key]?.Manual || 0),
                                                color: '#5e74f4'
                                            },
                                        ]}
                                    />
                                </div>
                                :
                                <h3 className="text-center text-danger">
                                    No hay datos para mostrar.
                                </h3>
                        }

                    </div>
                </>
            }
            {
                dashBoardSummary?.orderItemsCount &&
                <>
                    <h3 className="text-center mt-5">
                        Artículos más pedidos del mes
                    </h3>
                    <div className="row mb-5 justify-content-center">
                        {
                            Object.keys(dashBoardSummary?.orderItemsCount).length > 0 && !loading ?
                                Object.keys(dashBoardSummary?.orderItemsCount).map((key, i) => {
                                    return (
                                        <div className={`col-md-${12 / Object.keys(dashBoardSummary?.orderItemsCount).length}`} key={i}>
                                            <h5 className="text-center my-4">
                                                Pedido {key}
                                            </h5>
                                            <BarChart
                                                categories={dashBoardSummary?.orderItemsCount?.[key]?.map(value => value?.name.toLocaleUpperCase())}
                                                defaultSeries={[
                                                    {
                                                        data: dashBoardSummary?.orderItemsCount?.[key]?.map(value => Number(value?.count))
                                                    }
                                                ]}
                                            />
                                        </div>
                                    )
                                })
                                :
                                <h3 className="text-center text-danger">
                                    No hay datos para mostrar.
                                </h3>
                        }

                    </div>
                </>
            }
            <br />
            <br />

        </div>
    )
}

export default Dashboard;