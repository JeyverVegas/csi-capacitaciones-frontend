import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAccountClassifications from "../../../hooks/useAccountClassifications";
import AccountClassificationOption from "../../../components/AccountClassifications/AccountClassificationOption";


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

    const { setLoading, setCustomAlert } = useFeedBack();

    const [{ data: dataToUpdate, loading: loadingDataToUpdate }, getRecord] = useAxios({ url: `/${entity?.url}/${id}` }, { useCache: false });

    const [{ data: updateData, loading }, updateRecord] = useAxios({ url: `/${entity?.url}/${id}`, method: 'PUT' }, { manual: true, useCache: false });

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
            show: loading,
            message: 'Creando el registro'
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
                message: 'El registro fue creado exitosamente.'
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
        })
    }

    const handleToggleAccountClassification = (accountClassification) => {

        const accountExists = data?.accountClassificationIds?.includes(accountClassification?.id);

        if (accountExists) {
            const filtersAccountClassifications = data?.accountClassificationIds?.filter((value) => value != accountClassification?.id);

            setData((oldData) => {
                return {
                    ...oldData,
                    accountClassificationIds: filtersAccountClassifications
                }
            });

        } else {
            setData((oldData) => {
                return {
                    ...oldData,
                    accountClassificationIds: [...oldData?.accountClassificationIds, accountClassification?.id]
                }
            });
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
                <div className="col-md-12">
                    <div className="card p-4">
                        <h3>
                            Cuentas:
                        </h3>
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
                                            onChange={(e) => handleToggleAccountClassification(accountClassification)}
                                            costCenterId={id}
                                        />
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-4">
                        <h3>
                            Historial de planes
                        </h3>
                        <ul>

                        </ul>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CostCentersEdit;