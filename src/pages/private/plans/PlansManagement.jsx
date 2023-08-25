import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import { dateFine, generateArray } from "../../../util/Utilities";
import TabPanel from "../../../components/Tabs/TabPanel";
import DateFormatter from "../../../components/DateFormatter";
import clsx from "clsx";
import PlanAccountsForm from "../../../components/Plans/PlanAccountsForm";
import Toggle from "react-toggle";
import { BsFilter } from "react-icons/bs";
import useAccountClassifications from "../../../hooks/useAccountClassifications";

const PlansManagement = () => {

    const { id } = useParams();

    const [{ data: planResponse, loading: planLoading }, getPlan] = useAxios({ url: `/plans/${id}` }, { useCache: false });

    const [{ loading: updatePlanStatusLoading }, updatePlanStatus] = useAxios({ url: `/plans/${id}/toggle-status`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ accountClassifications }, getAccountClassifications] = useAccountClassifications({ params: { perPage: 50 }, options: { useCache: false } });

    const [currentMonth, setCurrentMonth] = useState(1);

    const [filters, setFilters] = useState({
        name: '',
        classificationId: '',
        code: '',
        type: ''
    });

    const [showFilters, setShowFilters] = useState(false);

    const [currentPlanStatus, setCurrentPlanStatus] = useState(null);

    useEffect(() => {
        if (planResponse) {
            setCurrentPlanStatus(planResponse?.data?.status);
        }
    }, [planResponse])

    const handleTogglePlanStatus = async () => {
        try {
            const statusResponse = await updatePlanStatus();

            setCurrentPlanStatus(statusResponse?.data);

        } catch (error) {
            alert('Ha ocurrido un error al actualizar');
        }
    }

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <div>
            <br /><br />
            {
                planResponse?.data &&
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h1>
                            {planResponse?.data?.costCenter?.name}
                        </h1>
                        <p>
                            Planificación de gastos del año {planResponse?.data?.planningProcess?.forYear}
                        </p>
                        <p>
                            <b>Fecha de inicio:</b> <DateFormatter value={dateFine(planResponse?.data?.planningProcess?.start)} dateFormat="dd/MM/yyyy" />
                        </p>
                        <p>
                            <b>Fecha de finalización:</b> <DateFormatter value={dateFine(planResponse?.data?.planningProcess?.end)} dateFormat="dd/MM/yyyy" />
                        </p>
                        <p>
                            <b>Estatus del proceso:</b> <span className={clsx({
                                'text-success': planResponse?.data?.planningProcess?.open,
                                'text-danger': !planResponse?.data?.planningProcess?.open
                            })}>{planResponse?.data?.planningProcess?.open ? 'Abierto' : 'Cerrado'}</span>
                        </p>
                    </div>
                    <div>
                        {
                            !planResponse?.data?.planningProcess?.isClose ?
                                <div>
                                    <div className="d-flex align-items-center">
                                        <h3 style={{ marginRight: 10 }}>
                                            Cerrar Plan:
                                        </h3>
                                        <Toggle onChange={handleTogglePlanStatus} checked={currentPlanStatus === 'CLOSED'} />
                                    </div>
                                    <small>Cuidado: Al cerrar el plan estaras haciendo que los demas responsables no puedan editar el plan.</small>
                                    <br />
                                    <small><span className="text-danger">Importante</span>: Una vez cierre el plan. Esté se tomará como finalizado.</small>
                                </div>
                                :
                                <div>
                                    <h6>
                                        La edición esta deshabilita. Debido a que el proceso de planificación ha sido cerrado o la fecha no esta dentro de los rangos.
                                    </h6>
                                </div>
                        }
                    </div>
                </div>
            }
            <br /><br />
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
                                {
                                    DateFormatter({
                                        value: `2023-${monthNumber}-15 12:00:00`,
                                        dateFormat: 'LLLL'
                                    })
                                }
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
            <br /><br />
            <div className="card p-3" style={{ position: 'fixed', top: '30vh', left: showFilters ? '0' : '-15vw', width: '15vw', background: 'white', height: 'fit-content' }}>
                <button onClick={() => setShowFilters(old => !old)} className="btn btn-primary" title="Filtrar cuentas" style={{ position: 'absolute', left: '100%', top: 0 }}>
                    <BsFilter />
                </button>
                <h4>Filtrar Cuentas</h4>
                <div>
                    <input
                        name="name"
                        value={filters?.name}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                    />
                    <br />
                    <input
                        name="code"
                        value={filters?.code}
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        placeholder="Código"
                    />
                    <br />
                    <select
                        name="classificationId"
                        value={filters?.classificationId}
                        className="form-control"
                        onChange={handleChange}
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
                        onChange={handleChange}
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

            {
                generateArray(12, 1).map((monthNumber, i) => {
                    return (
                        <TabPanel eventKey={monthNumber} value={currentMonth} key={i}>
                            <PlanAccountsForm

                                costCenterId={planResponse?.data?.costCenter?.id}
                                planId={id}
                                additionalFilters={filters}
                                month={monthNumber}
                                pathForUpdatePlanAccount={`/plan-accounts`}
                                pathForUfAccounts={`/plans/${id}/uf-accounts`}
                                pathForAccounts={`/plans/${id}/accounts`}
                                pathForSummary={`/plans/${id}/summary`}
                            />
                        </TabPanel>
                    )
                })
            }

            <TabPanel eventKey={'year'} value={currentMonth}>
                <PlanAccountsForm
                    costCenterId={planResponse?.data?.costCenter?.id}
                    planId={id}
                    additionalFilters={filters}
                    forYear
                    pathForAccounts={`/plans/${id}/accounts`}
                    pathForSummary={`plans/${id}/summary`}
                />
            </TabPanel>

        </div>
    )
}

export default PlansManagement;