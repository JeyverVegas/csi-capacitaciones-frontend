import { useEffect, useState } from "react";
import LineChart from "../../components/Charts/LineChart";
import useAxios from "../../hooks/useAxios";
import useCostCenters from "../../hooks/useCostCenters";
import { format } from "date-fns";
import useZones from "../../hooks/useZones";
import { Tab, Tabs } from "react-bootstrap";
import DetailsCard from "../../components/DetailsCard";
import ColumnChart from "../../components/Charts/ColumnChart";

const Dashboard = () => {

    const [filterBy, setFilterBy] = useState('costCenters');

    const [filterDatesBy, setFilterDatesBy] = useState('month');

    const [filters, setFilters] = useState({
        monthAndYear: `${format(new Date(), 'yyyy-MM')}`,
        start: '',
        end: '',
        costCenterIds: [],
        zoneIds: []
    });

    const [{ data, error, loading }, getDashboardData] = useAxios({ url: `/dashboard` }, { manual: true, useCache: false });

    const [{ costCenters, loading: costCentersLoading }, getCostCenters] = useCostCenters({ params: { perPage: 500, page: 1 }, options: { useCache: false } });

    const [{ zones, loading: zonesLoading }, getZones] = useZones({ params: { perPage: 500, page: 1 }, options: { useCache: false } });

    useEffect(() => {
        if (filterDatesBy === 'month') {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    start: '',
                    end: '',
                    monthAndYear: `${format(new Date(), 'yyyy-MM')}`
                }
            })
        }

        if (filterDatesBy === 'dates') {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    monthAndYear: '',
                    start: `${format(new Date(), 'yyyy-MM-dd')}`,
                    end: `${format(new Date(), 'yyyy-MM-dd')}`
                }
            })
        }
    }, [filterDatesBy])

    useEffect(() => {
        if (filterBy === 'costCenters') {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    costCenterIds: costCenters?.map(costCenter => costCenter.id),
                    zoneIds: []
                }
            })
        }

        if (filterBy == 'zones') {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    zoneIds: zones?.map(zone => zone.id),
                    costCenterIds: []
                }
            });
        }
    }, [filterBy]);

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                costCenterIds: costCenters?.map(costCenter => costCenter.id)
            }
        })
    }, [costCenters]);

    useEffect(() => {
        if (filters?.costCenterIds?.length > 0 || filters?.zoneIds?.length > 0) {
            getDashboardData({
                params: {
                    ...filters,
                    costCenterIds: filters?.costCenterIds.join(','),
                    zoneIds: filters?.zoneIds.join(',')
                }
            });
        }
    }, [filters]);

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    const handleCostCenter = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                costCenterIds: e.target.value ? [e.target.value] : costCenters?.map(costCenter => costCenter.id)
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

    return (
        <div>
            <div className="row mb-5">
                <div className="col-md-6">
                    <div className="card p-3">
                        <Tabs
                            activeKey={filterBy}
                            onSelect={(k) => setFilterBy(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="costCenters" title="Centros de costo">
                                {
                                    filterBy === 'costCenters' ?
                                        costCenters?.length > 1 ?
                                            <div className="form-group">
                                                <select className="form-control" onChange={handleCostCenter}>
                                                    <option value="">Todos</option>
                                                    {costCenters?.map((costCenter, i) => <option value={costCenter?.id} key={i}>
                                                        {costCenter?.name}
                                                    </option>
                                                    )}
                                                </select>
                                            </div>
                                            :
                                            <h4>
                                                {costCenters?.[0]?.name}
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
                        <Tabs
                            activeKey={filterDatesBy}
                            onSelect={(k) => setFilterDatesBy(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="month" title="Mes y año">
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
                            </Tab>
                            <Tab eventKey="dates" title="Rango de fechas">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Desde</label>
                                        <input
                                            type="date"
                                            id="start"
                                            name="start"
                                            className="form-control"
                                            value={filters?.start}
                                            onChange={(e) => setFilters((oldFilters) => {
                                                return {
                                                    ...oldFilters,
                                                    start: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Hasta</label>
                                        <input
                                            type="date"
                                            id="end"
                                            name="end"
                                            className="form-control"
                                            value={filters?.end}
                                            onChange={(e) => setFilters((oldFilters) => {
                                                return {
                                                    ...oldFilters,
                                                    end: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>


            <div className="row">
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Procesos de acreditación Anulados'}
                        loading={loading}
                        icon='fa fa-box'
                        value={data?.accreditationProccesesCountByStatus?.cancel}
                        gradient="gradient-19"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Procesos de acreditación Pendientes'}
                        loading={loading}
                        icon='fa fa-box'
                        value={data?.accreditationProccesesCountByStatus?.proccess}
                        gradient="gradient-20"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Procesos de acreditación Finalizados'}
                        loading={loading}
                        icon='fa fa-box'
                        value={data?.accreditationProccesesCountByStatus?.finish}
                        gradient="gradient-21"
                    />
                </div>
                <div className="col-md-12">
                    <div className="card p-5">
                        {
                            loading ?
                                <p className="text-center">Cargando</p>
                                :
                                data?.accreditationsCountByMonth ?
                                    <LineChart
                                        title="Acreditaciones por mes:"
                                        categories={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']}
                                        defaultSeries={[
                                            {
                                                name: 'acreditaciones',
                                                data: data?.accreditationsCountByMonth
                                            }
                                        ]}
                                    />
                                    :
                                    <p className="text-center">Sin datos</p>
                        }
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="card p-5">
                        {
                            loading ?
                                <p className="text-center">Cargando</p>
                                :
                                data?.accreditationsCountByCostCenter ?
                                    <>
                                        <h3>Acreditaciones por centro de costo</h3>
                                        <ColumnChart
                                            categories={data?.accreditationsCountByCostCenter.map(value => value?.cost_center)}
                                            defaultSeries={[
                                                {
                                                    name: 'Acreditaciones',
                                                    data: data?.accreditationsCountByCostCenter.map(value => value?.total),
                                                    color: '#34b4db'
                                                }
                                            ]}
                                        />
                                    </>
                                    :
                                    <p className="text-center">Sin datos</p>
                        }
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="card p-5">
                        {
                            loading ?
                                <p className="text-center">Cargando</p>
                                :
                                data?.accreditationProccesesByCostCenterAndStatus ?
                                    <>
                                        <h3>Procesos Acreditación por centro de costo</h3>
                                        <ColumnChart
                                            categories={Object?.keys(data?.accreditationProccesesByCostCenterAndStatus)?.map(key => key)}
                                            defaultSeries={[
                                                {
                                                    name: 'En proceso',
                                                    data: Object?.keys(data?.accreditationProccesesByCostCenterAndStatus)?.map(key => data?.accreditationProccesesByCostCenterAndStatus?.[key]?.['1'] || 0),
                                                    color: '#E59812'
                                                },
                                                {
                                                    name: 'Finalizados',
                                                    data: Object?.keys(data?.accreditationProccesesByCostCenterAndStatus)?.map(key => data?.accreditationProccesesByCostCenterAndStatus?.[key]?.['2'] || 0),
                                                    color: '#12E5A2'

                                                },
                                                {
                                                    name: 'Cancelados',
                                                    data: Object?.keys(data?.accreditationProccesesByCostCenterAndStatus)?.map(key => data?.accreditationProccesesByCostCenterAndStatus?.[key]?.['3'] || 0),
                                                    color: '#E51222'
                                                },
                                            ]}
                                        />
                                    </>
                                    :
                                    <p className="text-center">Sin datos</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;