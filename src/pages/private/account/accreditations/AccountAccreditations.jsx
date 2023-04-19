import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccreditationsColumns from "../../../../components/CustomTable/Columns/AccreditationsColumns";
import CustomTable from "../../../../components/CustomTable/CustomTable";
import { useFeedBack } from "../../../../context/FeedBackContext";
import useAxios from "../../../../hooks/useAxios";
import useForms from "../../../../hooks/useForms";
import { mainPermissions } from "../../../../util/MenuLinks";
import UserHavePermission from "../../../../util/UserHavePermission";
import useAccountAccreditations from "../../../../hooks/useAccountAccreditations";

const AccountAccreditations = () => {

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        serviceIds: ''
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ accreditations: records, total, numberOfPages, loading }, getRecords] = useAccountAccreditations({ params: { ...filters }, options: { useCache: false } });

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
        deleteRecord({ url: `accreditations/${value?.id}` }).then((data) => {
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
        deleteRecord({ url: `accreditations/multiple`, data: { ids: selectedValues } }).then((data) => {
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
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={'Acreditaciones'}
                entity={"accreditations"}
                updatePath={'/acreditaciones'}
                updateOptionString={'Ver'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={records}
                currentPage={filters?.page}
                collumns={AccreditationsColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}

export default AccountAccreditations;