import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAccountClassifications from "../../../hooks/useAccountClassifications";
import AccountClassificationOption from "../../../components/AccountClassifications/AccountClassificationOption";
import CostCenterPlansHistory from "../../../components/CostCenter/CostCenterPlansHistory";
import AddUfResponsiblesModal from "../../../components/CostCenter/AddUfResponsiblesModal";
import { Image } from "react-bootstrap";
import StaffForm from "../../../components/CostCenter/StaffForm";


const CostCentersEdit = () => {

    const { id } = useParams();

    const entity = {
        name: 'Centros de costos',
        url: 'cost-centers',
        frontendUrl: '/centros-de-costos',
        camelName: 'costCenters',
    };

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: '',
        accountClassificationIds: []
    });

    const [showUfResponsiblesModal, setShowUfResponsiblesModal] = useState(false);


    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: responsiblesUfData, loading: loadingUfResponsibles }, getUfResponsibles] = useAxios({ url: `/${entity?.url}/${id}/uf-responsibles` }, { useCache: false });

    const [{ }, deleteUfResponsible] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    const [{ accountClassifications, loading: loadingAccountClassifications }, getAccountClassifications] = useAccountClassifications({ params: { page: 1, perPage: 50 }, options: { useCache: false } });

    useEffect(() => {
        if (dataToUpdate) {
            setData((oldData) => {
                return {
                    ...oldData,
                    ...dataToUpdate?.data,
                    accountClassificationIds: dataToUpdate?.data?.accountClassifications?.map(value => value?.id)
                }
            });
        }
    }, [dataToUpdate])

    useEffect(() => {
        setLoading({
            show: loadingDataToUpdate,
            message: 'Obteniendo información'
        });
    }, [loadingDataToUpdate]);

    const handleClose = (e) => {
        setShowUfResponsiblesModal(false);
        if (e) {
            getUfResponsibles();
        }
    }

    const handleRemoveUfResponsible = async (responsibleId) => {
        try {
            await deleteUfResponsible({ url: `/${entity?.url}/uf-responsibles/${responsibleId}` });

            getUfResponsibles();

        } catch (error) {
            alert('Ha ocurrido un error al eliminar el responsable');
        }
    }

    return (
        <div>
            <div className="my-4 align-items-center justify-content-between d-flex">
                <h3>
                    {dataToUpdate?.data?.name}
                </h3>
                {
                    <>
                        <Link to={`${entity?.frontendUrl}/listar`} className="btn btn-primary">
                            Volver al listado
                        </Link>
                    </>
                }
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card p-4">
                        <h3>
                            Cuentas:
                        </h3>
                        <small>Por favor asigne las cuentas que va a manejar este centro de costo.</small>
                        <br />
                        {
                            loadingAccountClassifications &&
                            <div className="spinner my-5">
                                <div className="double-bounce1 bg-primary"></div>
                                <div className="double-bounce2 bg-primary"></div>
                            </div>
                        }

                        <ul>
                            {
                                !loadingAccountClassifications &&
                                accountClassifications?.map((accountClassification, i) => {
                                    return (
                                        <AccountClassificationOption
                                            defaultValues={data?.accountClassificationIds}
                                            accountClassification={accountClassification} key={i}
                                            costCenterId={id}
                                        />
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <CostCenterPlansHistory
                        costCenterId={id}
                    />
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3>Responsables del UF</h3>
                            <button className="btn btn-primary" onClick={(e) => setShowUfResponsiblesModal(true)}>
                                Agregar responsable
                            </button>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-6">
                                <input onChange={(e) => {
                                    getUfResponsibles({ params: { search: e.target.value } })
                                }} placeholder="Buscar..." type="text" className="form-control" />
                            </div>
                        </div>
                        <br /><br />
                        <ul className="custom-scrollbar scrollbar-primary" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {
                                !loadingUfResponsibles && responsiblesUfData?.data?.length > 0 ?
                                    responsiblesUfData?.data?.map((ufResponsible, i) => {
                                        return (
                                            <li
                                                key={i}
                                                className="d-flex custom-responsible-option mb-3 px-1 py-2"
                                                style={{ alignItems: 'center', justifyContent: 'space-between' }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <Image style={{ height: 40, width: 40, marginRight: 5 }} src={ufResponsible?.user?.imagePath} roundedCircle />
                                                    <div>
                                                        <h5 className="m-0">
                                                            {ufResponsible?.user?.name}
                                                        </h5>
                                                        <p className="m-0">
                                                            Rut: {ufResponsible?.user?.documentNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button onClick={() => handleRemoveUfResponsible(ufResponsible?.id)} className="btn btn-danger btn-xs">
                                                        Remover
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    })
                                    :
                                    <li className="text-center">
                                        No se encontrarón resultados
                                    </li>
                            }
                            {
                                loadingUfResponsibles &&
                                <li>
                                    <div className="spinner">
                                        <div className="double-bounce1 bg-primary"></div>
                                        <div className="double-bounce2 bg-primary"></div>
                                    </div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3>Dotación por mes</h3>
                        </div>
                        <br />
                        <StaffForm
                            costCenterId={id}
                            staff={data?.staff}
                        />
                    </div>
                </div>
            </div>
            <AddUfResponsiblesModal
                costCenterId={id}
                show={showUfResponsiblesModal}
                onClose={handleClose}
            />
        </div>
    )
}

export default CostCentersEdit;