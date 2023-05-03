import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnalystsColumns from "../../../components/CustomTable/Columns/AnalystsColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAnalysts from "../../../hooks/useAnalysts";
import useAxios from "../../../hooks/useAxios";
import { mainPermissions } from "../../../util/MenuLinks";
import UserHavePermission from "../../../util/UserHavePermission";

const Analysts = () => {

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        costCenterName: '',
        name: ''
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ analysts: records, total, numberOfPages, loading }, getRecords] = useAnalysts({ params: { ...filters }, options: { useCache: false } });

    const [{ error: deleteError, loading: deleteLoading }, deleteRecord] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getRecords();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Registros'
        })
    }, [deleteLoading])

    useEffect(() => {
        if (deleteError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al eliminar.',
                show: true
            });
        }
    }, [deleteError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(records?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteRecord({ url: `analysts/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El registro ha sido eliminado exitosamente.',
                show: true
            });
            getRecords();
        })
    }

    const handleSelectALL = () => {
        setSelectAll((oldSelectAll) => !oldSelectAll);
    }

    const handleSelectValue = (selectedValue) => {
        const value = selectedValues?.includes(Number(selectedValue?.id));
        if (value) {
            const newValues = selectedValues?.filter(n => n !== Number(selectedValue?.id));
            setSelectedValues(newValues);
        } else {
            setSelectedValues((oldSelectedValues) => [...oldSelectedValues, Number(selectedValue?.id)])
        }
    }

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

    const handleDeleteSelected = () => {
        deleteRecord({ url: `analysts/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los registros han sido eliminados exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getRecords();
        });
    }

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
                page: 1
            }
        })
    }

    return (
        <div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="form-group">
                            <label htmlFor="" className="form-label">Nombre del trabajador</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Escriba el nombre..."
                                value={filters?.name}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="form-group">
                            <label htmlFor="" className="form-label">Nombre del centro de costo</label>
                            <input
                                type="text"
                                name="costCenterName"
                                placeholder="Centro de costo..."
                                value={filters?.costCenterName}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={'Analistas'}
                entity={"analysts"}
                updatePath={'/analistas'}
                updateOptionString={'Ver'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={records}
                currentPage={filters?.page}
                collumns={AnalystsColumns}
                changePage={handlePageChange}
                filters={filters}
                excelUrl={'/analysts/export/excel'}
            />
        </div>
    )
}

export default Analysts;