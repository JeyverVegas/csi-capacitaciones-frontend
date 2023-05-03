import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import useUsers from "../../../hooks/useUsers";
import CustomTable from "../../../components/CustomTable/CustomTable";
import AccreditationProcessesColumns from "../../../components/CustomTable/Columns/AccreditationProcessesColumns";
import useCostCenters from "../../../hooks/useCostCenters";
import useZones from "../../../hooks/useZones";
import { format } from "date-fns";
import ColumnChart from "../../../components/Charts/ColumnChart";
import { Tab, Tabs } from "react-bootstrap";
import DetailsCard from "../../../components/DetailsCard";
import LineChart from "../../../components/Charts/LineChart";


const AnalystsEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const { setLoading, setCustomAlert } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        analystId: id
    });

    const [data, setData] = useState(null);

    const [filterBy, setFilterBy] = useState('costCenters');

    const [filterDatesBy, setFilterDatesBy] = useState('month');

    const [chartsFilters, setChartsFilters] = useState({
        monthAndYear: `${format(new Date(), 'yyyy-MM')}`,
        start: '',
        end: '',
        costCenterIds: [],
        zoneIds: []
    });

    const [{ data: chartsData, error, loading: chartsLoading }, getDashboardData] = useAxios({ url: `/analysts/${id}/dashboard` }, { manual: true, useCache: false });

    const [{ costCenters, loading: costCentersLoading }, getCostCenters] = useCostCenters({ params: { perPage: 500, page: 1 }, options: { useCache: false } });

    const [{ zones, loading: zonesLoading }, getZones] = useZones({ params: { perPage: 500, page: 1 }, options: { useCache: false } });

    const [{ users, loading: usersLoading }, getUsers] = useUsers({ options: { useCache: false, manual: true } });

    const [{ data: dataToUpdate, loading: loadingData }, getRecord] = useAxios({ url: `/analysts/${id}` }, { useCache: false });

    const [{ data: response, loading }, getAnalystsProcess] = useAxios({ url: `/analysts/${id}/process`, params: filters }, { useCache: false });

    useEffect(() => {
        setLoading({
            show: loadingData,
            message: 'Obteniendo el registro'
        })
    }, [loadingData]);


    useEffect(() => {
        if (dataToUpdate) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...dataToUpdate?.data
                }
            })
        }
    }, [dataToUpdate]);

    useEffect(() => {
        if (filterDatesBy === 'month') {
            setChartsFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    start: '',
                    end: '',
                    monthAndYear: `${format(new Date(), 'yyyy-MM')}`
                }
            })
        }

        if (filterDatesBy === 'dates') {
            setChartsFilters((oldFilters) => {
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
            setChartsFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    costCenterIds: costCenters?.map(costCenter => costCenter.id),
                    zoneIds: []
                }
            })
        }

        if (filterBy == 'zones') {
            setChartsFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    zoneIds: zones?.map(zone => zone.id),
                    costCenterIds: []
                }
            });
        }
    }, [filterBy]);

    useEffect(() => {
        setChartsFilters((oldFilters) => {
            return {
                ...oldFilters,
                costCenterIds: costCenters?.map(costCenter => costCenter.id)
            }
        })
    }, [costCenters]);

    useEffect(() => {
        if (chartsFilters?.costCenterIds?.length > 0 || chartsFilters?.zoneIds?.length > 0) {
            getDashboardData({
                params: {
                    ...chartsFilters,
                    costCenterIds: chartsFilters?.costCenterIds.join(','),
                    zoneIds: chartsFilters?.zoneIds.join(',')
                }
            });
        }
    }, [chartsFilters]);

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    const handlePageChange = (page) => {
        if (page < 11 && page > 0) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: page
                }
            })
        }
    }

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
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Detalle del analista
                </h3>
                {
                    <>
                        <Link to={"/analistas/listar"} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <div className="card p-4">
                <div className="row">
                    <div className="col-md-6">
                        <label className="text-primary">Nombre del analista</label>
                        <input type="text" value={data?.name} className="form-control" readOnly />
                    </div>
                    <div className="col-md-6">
                        <label className="text-primary">Centro de costo del analista</label>
                        <input type="text" value={data?.costCenter?.name} className="form-control" readOnly />
                    </div>
                </div>
            </div>
            <br />
            <br />
            <CustomTable
                loading={loading}
                title={'Procesos de acreditación'}
                entity={"accreditationProcesses"}
                updatePath={'/proceso-de-acreditaciones'}
                updateOptionString={'Editar'}
                pages={data?.meta?.last_page}
                withoutGlobalActions
                total={data?.meta?.total}
                values={response?.data}
                currentPage={filters?.page}
                collumns={AccreditationProcessesColumns}
                changePage={handlePageChange}
            />
            <br /><br /><br />
            <h2 className="text-center">
                Graficos
            </h2>
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
                                    value={chartsFilters?.monthAndYear}
                                    onChange={(e) => setChartsFilters((oldFilters) => {
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
                                            value={chartsFilters?.start}
                                            onChange={(e) => setChartsFilters((oldFilters) => {
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
                                            value={chartsFilters?.end}
                                            onChange={(e) => setChartsFilters((oldFilters) => {
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
                        loading={chartsLoading}
                        icon='fa fa-box'
                        value={chartsData?.accreditationProccesesCountByStatus?.cancel}
                        gradient="gradient-4"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Procesos de acreditación Pendientes'}
                        loading={chartsLoading}
                        icon='fa fa-box'
                        value={chartsData?.accreditationProccesesCountByStatus?.proccess}
                        gradient="gradient-3"
                    />
                </div>
                <div className="col-xl-4 col-sm-6">
                    <DetailsCard
                        title={'Procesos de acreditación Finalizados'}
                        loading={chartsLoading}
                        icon='fa fa-box'
                        value={chartsData?.accreditationProccesesCountByStatus?.finish}
                        gradient="gradient-12"
                    />
                </div>
                <div className="col-md-12">
                    <div className="card p-5">
                        {
                            chartsLoading ?
                                <p className="text-center">Cargando</p>
                                :
                                chartsData?.accreditationsCountByMonth ?
                                    <LineChart
                                        title="Acreditaciones por mes:"
                                        categories={['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']}
                                        defaultSeries={[
                                            {
                                                name: 'acreditaciones',
                                                data: chartsData?.accreditationsCountByMonth
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
                            chartsLoading ?
                                <p className="text-center">Cargando</p>
                                :
                                chartsData?.accreditationsCountByCostCenter ?
                                    <>
                                        <h3>Acreditaciones por centro de costo</h3>
                                        <ColumnChart
                                            categories={chartsData?.accreditationsCountByCostCenter.map(value => value?.cost_center)}
                                            defaultSeries={[
                                                {
                                                    name: 'Acreditaciones',
                                                    data: chartsData?.accreditationsCountByCostCenter.map(value => value?.total),
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
                            chartsLoading ?
                                <p className="text-center">Cargando</p>
                                :
                                chartsData?.accreditationProccesesByCostCenterAndStatus ?
                                    <>
                                        <h3>Procesos Acreditación por centro de costo</h3>
                                        <ColumnChart
                                            categories={Object?.keys(chartsData?.accreditationProccesesByCostCenterAndStatus)?.map(key => key)}
                                            defaultSeries={[
                                                {
                                                    name: 'En proceso',
                                                    data: Object?.keys(chartsData?.accreditationProccesesByCostCenterAndStatus)?.map(key => chartsData?.accreditationProccesesByCostCenterAndStatus?.[key]?.['1'] || 0),
                                                    color: '#E59812'
                                                },
                                                {
                                                    name: 'Finalizados',
                                                    data: Object?.keys(chartsData?.accreditationProccesesByCostCenterAndStatus)?.map(key => chartsData?.accreditationProccesesByCostCenterAndStatus?.[key]?.['2'] || 0),
                                                    color: '#12E5A2'

                                                },
                                                {
                                                    name: 'Cancelados',
                                                    data: Object?.keys(chartsData?.accreditationProccesesByCostCenterAndStatus)?.map(key => chartsData?.accreditationProccesesByCostCenterAndStatus?.[key]?.['3'] || 0),
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

export default AnalystsEdit;