import clsx from "clsx";
import { AiFillCloseCircle, AiFillEye, AiFillCheckCircle, AiFillFileExcel, AiOutlineMinus, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import DateFormatter from "../DateFormatter";
import { dateFine } from "../../util/Utilities";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import fileDownload from "js-file-download";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Dropdown } from "react-bootstrap";

const PlanLiComponent = ({ plan: defaultPlan, planDetailPath }) => {

    const { user } = useAuth();

    const [plan, setPlan] = useState(null);

    const [{ loading: loadingExport }, exportPlanExcel] = useAxios({ url: `/plans/${defaultPlan?.id}/excel`, responseType: 'blob' }, { useCache: false, manual: true })

    const [{ loading: loadingApproved }, approvePlan] = useAxios({ url: `/plans/${defaultPlan?.id}/approve`, method: 'PUT' }, { useCache: false, manual: true })

    useEffect(() => {
        if (defaultPlan) {
            setPlan(defaultPlan);
        }
    }, [defaultPlan])

    const handleExport = async (e) => {
        try {
            const exportPlanExcelResponse = await exportPlanExcel();

            fileDownload(exportPlanExcelResponse?.data, `Planificación de gastos - ${plan?.costCenter?.name} - ${plan?.planningProcess?.forYear}.xlsx`);

        } catch (error) {
            alert('Ha ocurrido un error al descargar el excel.');
        }
    }

    const handleApproved = async () => {

        try {

            const planApprovedResponse = await approvePlan();
            console.log(planApprovedResponse?.data?.data);
            setPlan(planApprovedResponse?.data?.data);

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <li className="py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid' }}>
            <div>
                <small className="text-primary">
                    Año:
                </small>
                <br />
                <p className="m-0">{plan?.planningProcess?.forYear}</p>
            </div>
            <div>
                <small className="text-success">
                    <AiOutlineArrowUp />
                    Ingresos:
                </small>
                <br />
                <p className="m-0">{plan?.totalIncome}$</p>
            </div>
            <div>
                <small className="text-danger">
                    <AiOutlineArrowDown />
                    Gastos:
                </small>
                <br />
                <p className="m-0">{plan?.totalSpent}$</p>
            </div>
            <div>
                <small className={clsx({
                    "text-warning": plan?.total === 0,
                    "text-danger": plan?.total < 0,
                    "text-success": plan?.total > 0
                })}>
                    {
                        plan?.total === 0 &&
                        <AiOutlineMinus />
                    }
                    {
                        plan?.total < 0 &&
                        <AiOutlineArrowDown />
                    }
                    {
                        plan?.total > 0 &&
                        <AiOutlineArrowUp />
                    }
                    Total:
                </small>
                <br />
                <p className="m-0">{plan?.total}$</p>
            </div>
            <div>
                <small>
                    Fecha de inicio:
                </small>
                <br />
                <p className="m-0">
                    {plan?.planningProcess?.start && <DateFormatter value={dateFine(plan?.planningProcess?.start)} dateFormat="dd LLLL yyyy" />}
                </p>
            </div>
            <div>
                <small>
                    Fecha limite:
                </small>
                <br />
                <p className="m-0">
                    {plan?.planningProcess?.end && <DateFormatter value={dateFine(plan?.planningProcess?.end)} dateFormat="dd LLLL yyyy" />}
                </p>
            </div>
            {
                plan?.closedAt ?
                    <span className="btn btn-success btn-xs">
                        Cerrado el: <span style={{ textTransform: 'capitalize' }}><DateFormatter value={`${plan?.closedAt} 12:00:00`} dateFormat="dd LLLL" /></span>
                    </span>
                    :
                    <span className="btn btn-danger btn-xs">
                        Abierto
                    </span>
            }
            {
                plan?.approvedAt ?
                    <span className="btn btn-success btn-xs">
                        Revisado el: <span style={{ textTransform: 'capitalize' }}><DateFormatter value={dateFine(plan?.approvedAt)} dateFormat="dd LLLL" /></span>
                    </span>
                    :
                    <span className="btn btn-danger btn-xs">
                        No ha sido revisado
                    </span>
            }
            <div className="d-flex align-items-center">
                <Dropdown autoClose="outside">
                    <Dropdown.Toggle variant="primary" id="dropdown-basic" className="btn-xs">
                        Acciones
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href={planDetailPath}>
                            <AiFillEye style={{ fontSize: 15 }} />
                            Detalles
                        </Dropdown.Item>
                        <Dropdown.Item as='button' onClick={handleExport} title="Exportar a excel" disabled={loadingExport}>
                            {
                                loadingExport ?
                                    'Cargando...'
                                    :
                                    <>
                                        <AiFillFileExcel style={{ fontSize: 15 }} />
                                        Descargar Excel
                                    </>
                            }
                        </Dropdown.Item>
                        {
                            plan?.costCenter?.planificationGeneralResponsibleId == user?.id &&
                            <Dropdown.Item as='button' onClick={handleApproved} title="Marcar como revisado" disabled={loadingApproved}>
                                {
                                    loadingApproved ?
                                        'Cargando...'
                                        :
                                        plan?.approvedAt ?
                                            <>
                                                <AiFillCloseCircle style={{ fontSize: 15 }} />
                                                Quitar aprovación
                                            </>
                                            :
                                            <>
                                                <AiFillCheckCircle style={{ fontSize: 15 }} />
                                                Aprobar
                                            </>

                                }
                            </Dropdown.Item>
                        }

                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </li>
    )
}

export default PlanLiComponent;