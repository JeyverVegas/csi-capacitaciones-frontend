import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccreditationProcessesColumns from "../../../../components/CustomTable/Columns/AccreditationProcessesColumns";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { useFeedBack } from "../../../../context/FeedBackContext";
import useAxios from "../../../../hooks/useAxios";
import useForms from "../../../../hooks/useForms";
import { mainPermissions } from "../../../../util/MenuLinks";
import UserHavePermission from "../../../../util/UserHavePermission";
import useAccountAccreditationProcesses from "../../../../hooks/useAccountAccreditationProcesses";

const AccountAccreditationProcesses = () => {

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        statusId: '',
        start: '',
        end: '',
        costCenterName: ''
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ accreditationProcess: records, total, numberOfPages, loading }, getRecords] = useAccountAccreditationProcesses({ params: { ...filters }, options: { useCache: false } });

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
        deleteRecord({ url: `forms/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El registros ha sido eliminado exitosamente.',
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
        deleteRecord({ url: `forms/multiple`, data: { ids: selectedValues } }).then((data) => {
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

                <div className="col-md-6">
                    <div className="card p-3">
                        <h6>Fecha de creación</h6>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Desde:</label>
                                    <input
                                        type="date"
                                        name="start"
                                        placeholder="Escriba el nombre..."
                                        value={filters?.start}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Hasta:</label>
                                    <input
                                        type="date"
                                        name="end"
                                        placeholder="Escriba el nombre..."
                                        value={filters?.end}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="form-group">
                            <label className="form-label">Estatus</label>
                            <select name="statusId" className="form-control" value={filters?.statusId} onChange={handleChange}>
                                <option value="">Seleccione una opción</option>
                                <option value="1">En proceso</option>
                                <option value="2">Finalizado</option>
                                <option value="3">Cancelado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3">
                        <div className="form-group">
                            <label className="form-label">Duración en días</label>
                            <input
                                type="number"
                                name="days"
                                value={filters?.days}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Ej. 1"
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
                title={'Procesos de acreditación'}
                entity={"accreditationProcesses"}
                updatePath={'/mi-cuenta/proceso-de-acreditaciones'}
                updateOptionString={'Ver'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={records}
                currentPage={filters?.page}
                collumns={AccreditationProcessesColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}

export default AccountAccreditationProcesses;