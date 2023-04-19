import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import handleChange from "../../../util/handleChange";
import update from 'immutability-helper';
import useAxios from "../../../hooks/useAxios";
import { useFeedBack } from "../../../context/FeedBackContext";
import useUsers from "../../../hooks/useUsers";
import AsyncSelect from 'react-select/async';
import mapValues from "../../../util/mapValues";
import handleLoadSelectOptions from "../../../util/handleLoadSelectOptions";
import CustomTable from "../../../components/CustomTable/CustomTable";
import AccreditationProcessesColumns from "../../../components/CustomTable/Columns/AccreditationProcessesColumns";


const AnalystsEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [filters, setFilters] = useState({
        page: 1,
        analystId: id
    });

    const [data, setData] = useState(null);


    const { setLoading, setCustomAlert } = useFeedBack();

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
        </div>
    )
}

export default AnalystsEdit;