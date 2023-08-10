import { Link, useParams } from "react-router-dom"
import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import { AiFillFileExcel, AiFillFilePdf, AiOutlineMinus, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import clsx from "clsx";
import { Dropdown } from "react-bootstrap";
import DateFormatter from "../../../components/DateFormatter";
import { dateFine } from "../../../util/Utilities";
import ColumnChart from "../../../components/Charts/ColumnChart";

const CostCenterManagement = () => {

    const { id } = useParams();

    const [{ data: costCenter, loading: costCenterLoading }, getCostCenter] = useAxios({ url: `/my-account/cost-centers/${id}` }, { useCache: false });

    const { loadMore, results: plans, loading: loadingPlans, canLoadMore, reset } = usePaginatedResourceWithAppend(`/my-account/cost-centers/${id}/plans`);

    const [{ data: accountClassificationsAmount, loading: loadingAccountClassificationsAmount }, getAccountClassificationsAmount] = useAxios({ url: `/my-account/cost-centers/${id}/total-by-account-classifications` }, { useCache: false });

    return (
        <div>

            <div className="row">
                <div className="col-md-12">
                    <h2>
                        {costCenter?.data?.name}
                    </h2>
                </div>
                <div className="col-md-12">
                    <div className="card p-4">
                        <div className="text-end">
                            <button onClick={() => reset()} className="btn btn-primary btn-xs">
                                Refrescar
                            </button>
                        </div>
                        <h3>
                            Historial de planes
                        </h3>
                        <ul className="custom-scrollbar scrollbar-primary px-2" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {
                                plans?.length === 0 && !loadingPlans ?
                                    <li className="text-center">
                                        No se encontrarón resultados.
                                    </li>
                                    :
                                    null
                            }
                            {
                                plans?.map((plan, i) => {
                                    return (
                                        <li key={i} className="py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid' }}>
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
                                                    <DateFormatter value={dateFine(plan?.planningProcess?.start)} dateFormat="dd LLLL yyyy" />
                                                </p>
                                            </div>
                                            <div>
                                                <small>
                                                    Fecha limite:
                                                </small>
                                                <br />
                                                <p className="m-0">
                                                    <DateFormatter value={dateFine(plan?.planningProcess?.end)} dateFormat="dd LLLL yyyy" />
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
                                            <div className="d-flex align-items-center">
                                                <Link to={`/gestionar-centro-de-costo/${id}/plans/${plan?.id}`} className="btn btn-primary btn-xs">
                                                    Detalles
                                                </Link>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="warning" style={{ padding: 6 }} size="sm" id="dropdown-basic">
                                                        Exportar
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item as="button" className="text-success">
                                                            <AiFillFileExcel style={{ fontSize: 15 }} />
                                                            Excel
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as="button" className="text-danger">
                                                            <AiFillFilePdf style={{ fontSize: 15 }} />
                                                            Pdf
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
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
                                canLoadMore && !loadingPlans ?
                                    <li className="text-center">
                                        <button
                                            onClick={(e) => loadMore()}
                                            type="button"
                                            className="btn btn-primary btn-xs"
                                        >
                                            Cargar más
                                        </button>
                                    </li>
                                    :
                                    null

                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="card p-4">
                        <h3>
                            Montos por clasificación de cuentas:
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

        </div>
    )
}

export default CostCenterManagement