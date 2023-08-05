import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import { dateFine, generateArray } from "../../../util/Utilities";
import TabPanel from "../../../components/Tabs/TabPanel";
import DateFormatter from "../../../components/DateFormatter";
import clsx from "clsx";
import PlanAccountsForm from "../../../components/Plans/PlanAccountsForm";
import Toggle from "react-toggle";

const PlansDetail = () => {

    const { id } = useParams();

    const [{ data: planResponse, loading: planLoading }, getPlan] = useAxios({ url: `/cost-centers/plans/${id}` }, { useCache: false });

    const [{ loading: updatePlanStatusLoading }, updatePlanStatus] = useAxios({ url: `/cost-centers/plans/${id}/toggle-status`, method: 'PUT' }, { manual: true, useCache: false });

    const [currentMonth, setCurrentMonth] = useState(1);

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
                            <b>Fecha de culmino:</b> <DateFormatter value={dateFine(planResponse?.data?.planningProcess?.end)} dateFormat="dd/MM/yyyy" />
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
            {
                generateArray(12, 1).map((monthNumber, i) => {
                    return (
                        <TabPanel eventKey={monthNumber} value={currentMonth} key={i}>
                            <PlanAccountsForm
                                planId={id}
                                month={monthNumber}
                                pathForUfAccounts="/cost-centers/plans/uf-accounts"
                                pathForAccounts="/cost-centers/plans/accounts"
                            />
                        </TabPanel>
                    )
                })
            }

            <TabPanel eventKey={'year'} value={currentMonth}>
                <PlanAccountsForm
                    planId={id}
                    month={null}
                    pathForAccounts="/cost-centers/plans/accounts-total"
                />
            </TabPanel>

        </div>
    )
}

export default PlansDetail;