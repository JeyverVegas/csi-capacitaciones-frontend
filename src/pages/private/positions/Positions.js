import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PositionsColumns from "../../../components/CustomTable/Columns/PositionsColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import usePositions from "../../../hooks/usePositions";
import { mainPermissions } from "../../../util/MenuLinks";

const Positions = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ positions, total, numberOfPages, size, error: positionsError, loading }, getPositions] = usePositions({ params: { ...filters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deletePosition] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getPositions();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Cargo(s)'
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

        if (positionsError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los cargos.',
                show: true
            });
        }
    }, [deleteError, positionsError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(positions?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deletePosition({ url: `/positions/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El cargo ha sido eliminado exitosamente.',
                show: true
            });
            getPositions();
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
        deletePosition({ url: `/positions/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los cargos han sido eliminados exitosamente.',
                show: true
            });
            getPositions();
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.positions[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/cargos/crear"} className="btn btn-primary">
                            Crear cargo
                        </Link>
                    </div>
                    :
                    null
            }
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={'Cargos'}
                updatePath={"/cargos"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={positions}
                currentPage={filters.page}
                collumns={PositionsColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Positions;