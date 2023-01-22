import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProvidersColumns from "../../../components/CustomTable/Columns/ProvidersColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useProviders from "../../../hooks/useProviders";
import { mainPermissions } from "../../../util/MenuLinks";

const Providers = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ providers, total, numberOfPages, error: providersError, loading }, getProviders] = useProviders({ params: { ...filters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteProvider] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getProviders();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Proveedores'
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

        if (providersError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los proveedores.',
                show: true
            });
        }
    }, [deleteError, providersError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(providers?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteProvider({ url: `/providers/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El proveedor ha sido eliminado exitosamente.',
                show: true
            });
            getProviders();
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
        deleteProvider({ url: `/providers/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los proveedores han sido eliminados exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getProviders();
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.providers[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/proveedores/crear"} className="btn btn-primary">
                            Crear proveedor
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
                title={'Proveedores'}
                entity='providers'
                updatePath={"/proveedores"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={providers}
                currentPage={filters.page}
                collumns={ProvidersColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Providers;