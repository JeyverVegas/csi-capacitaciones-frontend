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
                        {
                            currentCostCenters?.map((costCenter, i) => {
                                return (
                                    <div className="card p-3" key={i}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h5>
                                                    {costCenter?.name}
                                                </h5>
                                            </div>
                                            <div >
                                                <div className="d-flex align-items-center">
                                                    <Button style={{ marginRight: 10 }} href={`gestionar-centro-de-costo/${costCenter?.id}`} variant="outline-primary" title="Ver detalles">
                                                        <BsFillArrowRightCircleFill />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default Dashboard;