import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import { dateFine, generateArray } from "../../../util/Utilities";
import { format } from "date-fns";
import DateFormatter from "../../../components/DateFormatter";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import clsx from "clsx";
import PieChart from "../../../components/Charts/PieChart";
import PlanAccountsForm from "../../../components/Plans/PlanAccountsForm";
import TabPanel from "../../../components/Tabs/TabPanel";
import { BsFilter } from "react-icons/bs";
import ColumnChart from "../../../components/Charts/ColumnChart";
import fileDownload from "js-file-download";


const PlanificationsEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Proceso de planificación',
        url: 'planning-processes',
        frontendUrl: '/planificacion-de-gastos',
        camelName: 'planningProcesses',
    };

    const navigate = useNavigate();

    const [yearsOptions, setYearsOptions] = useState([]);

    const [showFilters, setShowFilters] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(1);

    const [showPlanningAccountsTotal, setShowPlanningAccountsTotal] = useState(false);

    const [filters, setFilters] = useState({
        name: '',
        classificationId: '',
        code: '',
        type: ''
    });

    const [data, setData] = useState({
        start: '',
        end: '',
        forYear: new Date().getFullYear(),
        open: ''
    });

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/${entity?.url}/${id}`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ data: planCount, loading: planCountLoading }, getPlanCount] = useAxios({ url: `/${entity?.url}/${id}/plans/count` }, { useCache: false });

    const [{ data: accountClassificationsAmount, loading: loadingAccountClassificationsAmount }, getAccountClassificationsAmount] = useAxios({ url: `/${entity?.url}/${id}/total-by-account-classifications` }, { useCache: false });

    const [{ loading: loadingPlanExport }, exportPlanExcel] = useAxios({ url: `/${entity?.url}/${id}/excel`, responseType: 'blob' }, { useCache: false, manual: true })

    const [{ loading: loadingPlanKpiExport }, exportPlanKpiExcel] = useAxios({ url: `/${entity?.url}/${id}/kpi/excel`, responseType: 'blob' }, { useCache: false, manual: true })

    const { loadMore, results: plans, loading: loadingPlans, canLoadMore } = usePaginatedResourceWithAppend(`/planning-processes/${id}/plans`);

    const { loadMore: loadMoreAccountsClassifications, results: accountClassifications } = usePaginatedResourceWithAppend(`/account-classifications`);

    useEffect(() => {

        var year = new Date().getFullYear();

        var yearsBack = year - 50;

        var yearsNext = year + 50;

        var years = [];

        for (let index = yearsBack; index < yearsNext; index++) {
            years.push(index);
        }

        setYearsOptions(years);
    }, [])

    useEffect(() => {
        if (dataToUpdate) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...dataToUpdate?.data,
                    start: DateFormatter({ value: dateFine(dataToUpdate?.data?.start), dateFormat: 'yyyy-MM-dd' }),
                    end: DateFormatter({ value: dateFine(dataToUpdate?.data?.end), dateFormat: 'yyyy-MM-dd' }),
                    open: dataToUpdate?.data?.open ? 'si' : 'no'
                }
            });
        }
    }, [dataToUpdate])

    useEffect(() => {
        setLoading({
            show: loading,
            message: 'Actualizando el registro'
        })
    }, [loading]);

    useEffect(() => {
        setLoading({
            show: loadingDataToUpdate,
            message: 'Obteniendo información'
        });
    }, [loadingDataToUpdate]);


    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue actualizado exitosamente.'
            });
            navigate(`${entity?.frontendUrl}/listar`);
        }
    }, [updateData])

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        });
    }

    const handleFiltersChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e) => {
        e?.preventDefault();

        updateRecord({ data });
    }

    const handleExport = async (e) => {
        try {
            const exportPlanExcelResponse = await exportPlanExcel();

            fileDownload(exportPlanExcelResponse?.data, `Planificación de gastos (Resumen) - ${data?.forYear}.xlsx`);

        } catch (error) {
            alert('Ha ocurrido un error al descargar el excel.');
        }
    }

    const handleExportKpi = async (e) => {
        try {
            const exportPlanKpiExcelResponse = await exportPlanKpiExcel();

            fileDownload(exportPlanKpiExcelResponse?.data, `Planificación de gastos (KPI) - ${data?.forYear}.xlsx`);

        } catch (error) {
            alert('Ha ocurrido un error al descargar el excel.');
        }
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    Editar {entity?.name}
                </h3>
                {
                    <>
                        <Link to={`${entity?.frontendUrl}/listar`} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>

            <form className="card p-4" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Inicia <small className="text-danger">*</small>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={handleChange}
                                name="start"
                                value={data?.start}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Finaliza <small className="text-danger">*</small>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                onChange={handleChange}
                                name="end"
                                value={data?.end}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Planificación del año: <small className="text-danger">*</small>
                            </label>
                            <select
                                value={data?.forYear}
                                className="form-control"
                                name="forYear"
                                onChange={handleChange}
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                {
                                    yearsOptions.map((year, i) => {
                                        return (
                                            <option value={year} key={i}>{year}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="form-group">
                            <label className="text-primary">
                                Estado del proceso: <small className="text-danger">*</small>
                            </label>
                            <select
                                value={data?.open}
                                className="form-control"
                                name="open"
                                onChange={handleChange}
                            >
                                <option value="" disabled>Seleccione una opción</option>
                                <option value="no">Cerrado</option>
                                <option value="si">Abierto</option>
                            </select>
                        </div>
                    </div>
                </div>
                <br />
                <div className="text-center">
                    <button className="btn btn-block btn-primary">
                        Actualizar
                    </button>
                </div>
            </form>
            <br /> <br />
            <div className="row">
                <div className="col-md-6">
                    <div className="card p-4">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h3>Estatus de los centros de costos</h3>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="text-center">
                                        <p className="text-success">
                                            Finalizados
                                        </p>
                                        {
                                            planCountLoading ?
                                                <div className="spinner">
                                                    <div className="double-bounce1 bg-primary"></div>
                                                    <div className="double-bounce2 bg-primary"></div>
                                                </div>
                                                :
                                                <h4>
                                                    {planCount?.closed}
                                                </h4>
                                        }
                                    </div>
                                    <div className="text-center">
                                        <p className="text-danger">
                                            Pendientes
                                        </p>
                                        {
                                            planCountLoading ?
                                                <div className="spinner">
                                                    <div className="double-bounce1 bg-primary"></div>
                                                    <div className="double-bounce2 bg-primary"></div>
                                                </div>
                                                :
                                                <h4>
                                                    {planCount?.open}
                                                </h4>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul className="container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {
                                plans?.map((plan, i) => {
                                    return (
                                        <li className="row" key={i}>
                                            <div className="col-4">
                                                <Link to={`/centros-de-costos/plans/${plan?.id}`}>
                                                    <b>
                                                        {plan?.costCenter?.name}
                                                    </b>
                                                </Link>
                                            </div>
                                            <div className="col-4">
                                                <p className={clsx({
                                                    'text-success': plan?.totalSpent < plan?.totalIncome,
                                                    'text-danger': plan?.totalSpent > plan?.totalIncome,
                                                })}>
                                                    <b>Resultado:</b>
                                                    <br />
                                                    {plan?.total}$
                                                </p>
                                            </div>
                                            <div className="col-4 text-end">
                                                {
                                                    plan?.closedAt ?
                                                        <span className="btn btn-success btn-xs">
                                                            Finalizado el: <span style={{ textTransform: 'capitalize' }}><DateFormatter value={`${plan?.closedAt} 12:00:00`} dateFormat="dd LLLL" /></span>
                                                        </span>
                                                        :
                                                        <span className="btn btn-danger btn-xs">
                                                            Gestionando
                                                        </span>
                                                }
                                            </div>
                                        </li>
                                    )
                                })
                            }
                            {
                                loadingPlans &&
                                <li>
                                    <div className="spinner my-5">
                                        <div className="double-bounce1 bg-primary"></div>
                                        <div className="double-bounce2 bg-primary"></div>
                                    </div>
                                </li>
                            }
                            {
                                !loadingPlans && canLoadMore ?
                                    <li className="text-center">
                                        <button className="btn btn-primary btn-xs" onClick={() => loadMore()}>
                                            Cargar más
                                        </button>
                                    </li>
                                    :
                                    null
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-4">
                        <h4>
                            % Pendientes / Finalizados
                        </h4>
                        <br />
                        {
                            planCountLoading ?
                                <div className="spinner my-5">
                                    <div className="double-bounce1 bg-primary"></div>
                                    <div className="double-bounce2 bg-primary"></div>
                                </div>
                                :
                                <PieChart
                                    title={""}
                                    labels={['Pendientes', 'Finalizados']}
                                    defaultSeries={[planCount?.open, planCount?.closed]}
                                    colors={['#FF6746', '#37D159']}
                                />
                        }

                    </div>
                </div>
                <div className="col-md-12">
                    <div className="card p-4">
                        <div className="d-flex align-items-center justify-content-between mb-5">
                            <h3 className="mb-4">
                                Resumen del plan:
                            </h3>
                            <div>
                                <button disabled={loadingPlanKpiExport} className="btn btn-success btn-xs mx-3" onClick={handleExportKpi}>
                                    {
                                        loadingPlanKpiExport ?
                                            'Cargando...'
                                            :
                                            'Generar excel KPI'
                                    }
                                </button>
                                <button disabled={loadingPlanExport} className="btn btn-success btn-xs mx-3" onClick={handleExport}>
                                    {
                                        loadingPlanExport ?
                                            'Cargando'
                                            :
                                            'Generar excel Resumen'
                                    }

                                </button>
                                <button className="btn btn-primary btn-xs mx-3" onClick={() => setShowPlanningAccountsTotal(old => !old)}>
                                    {showPlanningAccountsTotal ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>
                        </div>
                        {
                            showPlanningAccountsTotal &&
                            <>
                                <div className="card p-3" style={{ position: 'fixed', top: '30vh', left: showFilters ? '0' : '-15vw', width: '15vw', background: 'white', height: 'fit-content' }}>
                                    <button onClick={() => setShowFilters(old => !old)} className="btn btn-primary" title="Filtrar cuentas" style={{ position: 'absolute', left: '100%', top: 0 }}>
                                        <BsFilter />
                                    </button>
                                    <h4>Filtrar Cuentas</h4>
                                    <div>
                                        <input
                                            name="name"
                                            value={filters?.name}
                                            onChange={handleFiltersChange}
                                            type="text"
                                            className="form-control"
                                            placeholder="Nombre"
                                        />
                                        <br />
                                        <input
                                            name="code"
                                            value={filters?.code}
                                            onChange={handleFiltersChange}
                                            type="text"
                                            className="form-control"
                                            placeholder="Código"
                                        />
                                        <br />
                                        <select
                                            name="classificationId"
                                            value={filters?.classificationId}
                                            className="form-control"
                                            onChange={handleFiltersChange}
                                        >
                                            <option value="">Clasificación</option>
                                            {
                                                accountClassifications?.map((classification, i) => {
                                                    return (
                                                        <option value={classification?.id} key={i}>{classification?.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <br />
                                        <select
                                            name="type"
                                            value={filters?.type}
                                            className="form-control"
                                            onChange={handleFiltersChange}
                                        >
                                            <option value="">Tipo</option>
                                            <option value="spent">Gasto</option>
                                            <option value="income">Ingreso</option>
                                        </select>
                                        <br />
                                        <div className="text-center">
                                            <button
                                                onClick={() => setFilters({ name: '', type: '', classificationId: '', code: '' })}
                                                className="btn btn-primary btn-xs"
                                            >
                                                Reestablecer
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <ul className="d-flex align-items-center w-100" style={{ flexWrap: 'wrap' }}>
                                    {
                                        generateArray(12, 1)?.map((monthNumber, i) => {
                                            return (
                                                <li
                                                    onClick={() => setCurrentMonth(monthNumber)}
                                                    className={
                                                        clsx(["btn"], {
                                                            'btn-primary': monthNumber === currentMonth
                                                        })
                                                    }
                                                    key={i}
                                                    style={{ marginRight: 15, textTransform: 'capitalize' }}
                                                >
                                                    <DateFormatter value={`2023-${monthNumber}-15 12:00:00`} dateFormat="LLLL" />
                                                </li>
                                            )
                                        })
                                    }
                                    <li
                                        onClick={() => setCurrentMonth('year')}
                                        className={
                                            clsx(["btn"], {
                                                'btn-primary': 'year' === currentMonth
                                            })
                                        }
                                        style={{ marginRight: 15, textTransform: 'capitalize' }}
                                    >
                                        Resultado del Año
                                    </li>
                                </ul>
                                <br /><br /><br />
                                {
                                    generateArray(12, 1).map((monthNumber, i) => {
                                        return (
                                            <TabPanel eventKey={monthNumber} value={currentMonth} key={i}>
                                                <PlanAccountsForm
                                                    additionalFilters={filters}
                                                    month={monthNumber}
                                                    pathForAccounts={`/${entity?.url}/${id}/accounts`}
                                                    pathForSummary={`/${entity?.url}/${id}/summary`}
                                                    disabledAccounts
                                                />
                                            </TabPanel>
                                        )
                                    })
                                }

                                <TabPanel eventKey={'year'} value={currentMonth}>
                                    <PlanAccountsForm
                                        additionalFilters={filters}
                                        pathForAccounts={`/${entity?.url}/${id}/accounts`}
                                        pathForSummary={`/${entity?.url}/${id}/summary`}
                                        disabledAccounts
                                    />
                                </TabPanel>
                            </>
                        }
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="card p-4">
                        <h3>
                            Resumen por clasificación de cuentas:
                        </h3>
                        <br />
                        {
                            accountClassificationsAmount &&
                            <ColumnChart
                                categories={accountClassificationsAmount?.data?.map(value => value?.name)}
                                title=""
                                defaultSeries={[
                                    {
                                        name: 'Total',
                                        data: accountClassificationsAmount?.data?.map(value => value?.amount ? Number(value?.amount) : 0)
                                    }
                                ]}
                                labelEndAdornment="$"
                            />
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PlanificationsEdit;