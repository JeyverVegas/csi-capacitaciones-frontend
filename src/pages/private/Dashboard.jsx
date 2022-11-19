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

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { perPage: 500, currentUserServices: true, page: 1 }, options: { useCache: false } });

    const [{ zones, loading: zonesLoading }, getZones] = useZones({ params: { perPage: 500, currentUserZones: true, page: 1 }, options: { useCache: false } });

    const [{ data, loading: loadingOrdersCount }, getOrdersCount] = useAxios({ url: `/orders/count`, params: { ...filters } }, { manual: true, useCache: false });

    const [{ data: countByZone, loading: loadingOrdersCountByZone }, getOrdersCountByZone] = useAxios({ url: `/orders/count-by-zone`, params: { ...filters } }, { manual: true, useCache: false });

    const [{ data: countByServices, loading: loadingOrdersCountByServices }, getOrdersCountByServices] = useAxios({ url: `/orders/count-by-services`, params: { ...filters } }, { manual: true, useCache: false });

    const [{ data: amountByServices, loading: loadingOrdersAmountByServices }, getOrdersAmountByServices] = useAxios({ url: `/orders/amount-by-services`, params: { ...filters } }, { manual: true, useCache: false });

    const [{ data: amountByOrderTypes, loading: loadingAmountByOrderTypes }, getAmountByOrderTypes] = useAxios({ url: `/orders/amount-by-order-types`, params: { ...filters } }, { manual: true, useCache: false });

    const [{ data: itemsCount, loading: loadingItemsCount }, getItemsCount] = useAxios({ url: `/orders/items-count`, params: { ...filters } }, { manual: true, useCache: false });

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
            getOrdersCount({
                params: {
                    ...filters,
                    serviceIds: filters?.serviceIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
            getOrdersCountByZone({
                params: {
                    ...filters,
                    serviceIds: filters?.serviceIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
            getOrdersCountByServices({
                params: {
                    ...filters,
                    serviceIds: filters?.serviceIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
            getOrdersAmountByServices({
                params: {
                    ...filters,
                    serviceIds: filters?.serviceIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
            getAmountByOrderTypes({
                params: {
                    ...filters,
                    serviceIds: filters?.serviceIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
            getItemsCount({
                params: {
                    ...filters, serviceIds: filters?.serviceIds.join(','),
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
                return '#878ee3';
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
                        loading={loadingOrdersCount}
                        icon='fa fa-box'
                        value={data?.manual || '--'}
                        gradient="gradient-11"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Pedidos Mensuales'}
                        loading={loadingOrdersCount}
                        icon='fa fa-box'
                        value={data?.monthly || '--'}
                        gradient="gradient-12"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Pedidos Extraordinarios'}
                        loading={loadingOrdersCount}
                        icon='fa fa-box'
                        value={data?.extraordinary || '--'}
                        gradient="gradient-15"
                    />
                </div>
            </div>
            {
                countByZone &&
                <>
                    <h3 className="text-center my-5">
                        Graficos por zona
                    </h3>
                    <div className="row mb-5 justify-content-center">
                        {
                            Object.keys(countByZone).length > 0 && !loadingOrdersCountByZone ?
                                Object.keys(countByZone).map((key, i) => {
                                    const { zone, ...rest } = countByZone[key]
                                    return (
                                        <div className="col-md-4">
                                            <PieChart
                                                title={key}
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
                countByServices &&
                <>
                    <h3 className="text-center my-5">
                        Tipo de pedido por servicio
                    </h3>
                    <div className="row mb-5">
                        {
                            Object.keys(countByServices).length > 0 && !loadingOrdersCountByServices ?
                                <div className="col-md-12">
                                    <ColumnChart
                                        categories={Object.keys(countByServices).map(key => countByServices[key]?.service.toLocaleUpperCase())}
                                        defaultSeries={[
                                            {
                                                name: 'Mensual',
                                                data: Object.keys(countByServices).map(key => countByServices[key]?.Mensual || 0),
                                                color: '#878ee3'
                                            },
                                            {
                                                name: 'Extraordinario',
                                                data: Object.keys(countByServices).map(key => countByServices[key]?.Extraordinario || 0),
                                                color: '#df6adb'

                                            },
                                            {
                                                name: 'Manual',
                                                data: Object.keys(countByServices).map(key => countByServices[key]?.Manual || 0),
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
                        amountByOrderTypes && Object.keys(amountByOrderTypes).length > 0 && !loadingAmountByOrderTypes ?
                            <PieChart
                                label="valueAndPercent"
                                labelEndAdornment='$'
                                labels={['Mensual', 'Extraordinario', 'Manual']}
                                defaultSeries={Object.keys(amountByOrderTypes).map((key2) => amountByOrderTypes[key2] || 0)}
                                colors={['#878ee3', '#df6adb', '#5e74f4']}
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
                        data && Object.keys(data).length > 0 && !loadingOrdersCount ?
                            <PieChart
                                labels={['Extraordinario', 'Manual', 'Mensual']}
                                defaultSeries={Object.keys(data).map((key2) => data[key2])}
                                colors={['#df6adb', '#5e74f4', '#878ee3']}
                            />
                            :
                            <h3 className="text-center text-danger">
                                No hay datos para mostrar.
                            </h3>
                    }
                </div>
            </div>

            {
                amountByServices &&
                <>
                    <h3 className="text-center my-5">
                        Monto de pedidos por servicio
                    </h3>
                    <div className="row mb-5">
                        {
                            Object.keys(amountByServices).length > 0 && !loadingOrdersAmountByServices ?
                                <div className="col-md-12">
                                    <ColumnChart
                                        label="value"
                                        labelEndAdornment='$'
                                        categories={Object.keys(amountByServices).map(key => amountByServices[key]?.service.toLocaleUpperCase())}
                                        defaultSeries={[
                                            {
                                                name: 'Mensual',
                                                data: Object.keys(amountByServices).map(key => amountByServices[key]?.Mensual || 0),
                                                color: '#878ee3'
                                            },
                                            {
                                                name: 'Extraordinario',
                                                data: Object.keys(amountByServices).map(key => amountByServices[key]?.Extraordinario || 0),
                                                color: '#df6adb'

                                            },
                                            {
                                                name: 'Manual',
                                                data: Object.keys(amountByServices).map(key => amountByServices[key]?.Manual || 0),
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
                itemsCount &&
                <>
                    <h3 className="text-center mt-5">
                        Conteo de items
                    </h3>
                    <div className="row mb-5 justify-content-center">
                        {
                            Object.keys(itemsCount).length > 0 && !loadingItemsCount ?
                                Object.keys(itemsCount).map((key, i) => {
                                    return (
                                        <div className={`col-md-${12 / Object.keys(itemsCount).length}`} key={i}>
                                            <h5 className="text-center my-4">
                                                Pedido {key}
                                            </h5>
                                            <BarChart
                                                categories={itemsCount?.[key]?.map(value => value?.name.toLocaleUpperCase())}
                                                defaultSeries={[
                                                    {
                                                        data: itemsCount?.[key]?.map(value => Number(value?.count))
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