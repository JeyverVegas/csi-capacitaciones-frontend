import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlanificationColumns from "../../../components/CustomTable/Columns/PowerBiColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import usePowerBi from "../../../hooks/usePowerBi";
import PowerBiColumns from "../../../components/CustomTable/Columns/PowerBiColumns";

const Powerbis = () => {

    const entity = {
        name: 'Power Bi',
        url: 'power-bi',
        frontendUrl: '/power-bi',
        camelName: 'powerBi',
    };

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        zoneId: '',
        title: '',
        url: ''
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ [entity.camelName]: records, total, numberOfPages, loading }, getRecords] = usePowerBi({ params: { ...filters }, options: { useCache: false } });

    const [{ error: deleteError, loading: deleteLoading }, deleteRecord] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getRecords({
            params: filters
        });
    }, [filters])

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
        deleteRecord({ url: `${entity.url}/${value?.id}` }).then((data) => {
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
        if (numberOfPages >= page && page > 0) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: page
                }
            })
        }
    }

    const handleDeleteSelected = () => {
        deleteRecord({ url: `${entity.url}/multiple`, data: { ids: selectedValues } }).then((data) => {
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

    return (
        <div>
            <div className="my-4 justify-content-end d-flex">
                {
                    <>
                        <Link to={`${entity.frontendUrl}/crear`} className="btn btn-primary">
                            Crear {entity.name}
                        </Link>
                    </>
                }
            </div>
            <CustomTable
                recordNameProp='title'
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={entity?.name}
                entity={entity.url}
                updatePath={entity.frontendUrl}
                updateOptionString={'Editar'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={records}
                currentPage={filters?.page}
                collumns={PowerBiColumns}
                changePage={handlePageChange}
                filters={filters}
                excelUrl={`${entity.url}/export/excel`}
                perPage={filters?.perPage}
                onPerPageChange={(e) => setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        [e.target.name]: e.target.value
                    }
                })}
            />
        </div>
    )
}

export default Powerbis;