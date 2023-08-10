import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import { BsPencilSquare, BsEyeFill, BsFillArrowRightCircleFill } from "react-icons/bs";
import { Button, Dropdown } from "react-bootstrap";


const Dashboard = () => {

    const [{ data: responseData, loading: costCentersLoading }, getCostCenters] = useAxios({ url: `my-account/cost-centers` }, { useCache: false });

    const [currentCostCenters, setCurrentCostCenters] = useState([]);

    useEffect(() => {
        if (responseData) {
            setCurrentCostCenters(responseData?.data);
        }
    }, [responseData]);

    return (
        <div>
            {
                costCentersLoading &&
                <div className="spinner" style={{ marginTop: '30vh' }}>
                    <div className="double-bounce1 bg-primary"></div>
                    <div className="double-bounce2 bg-primary"></div>
                </div>
            }
            {
                !costCentersLoading ?
                    <div>
                        <h3 className="my-3">Tus centros de costos</h3>
                        <div className="row">
                            {
                                currentCostCenters?.map((costCenter, i) => {
                                    return (
                                        <div className="col-md-3" key={i}>
                                            <div className="card p-4">
                                                <div>
                                                    <h5 className="text-center">
                                                        {costCenter?.name}
                                                    </h5>
                                                    <br />
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <Link to={`/gestionar-centro-de-costo/${costCenter?.id}`} className="btn btn-block btn-primary">
                                                                Gestionar
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Dashboard;