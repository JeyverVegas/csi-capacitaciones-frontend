import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QuotesColumns from "../../../components/CustomTable/Columns/QuotesColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useServices from "../../../hooks/useServices";
import { mainPermissions } from "../../../util/MenuLinks";
import useUserQuotes from "../../../hooks/useUserQuotes";

const MyQuotes = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        serviceIds: ''
    });

    const [servicesFilters, setServicesFilters] = useState({
        currentUserServices: true
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { ...servicesFilters } }, { useCache: false });

    const [{ quotes, total, numberOfPages, error: quotesError, loading }, getQuotes] = useUserQuotes({ params: { ...filters }, options: { useCache: false } });

    const [{ error: deleteError, loading: deleteLoading }, deleteRecord] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getQuotes();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando registros'
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

        if (quotesError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los registros.',
                show: true
            });
        }
    }, [deleteError, quotesError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(quotes?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteRecord({ url: `/quotes/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El registro ha sido eliminado exitosamente.',
                show: true
            });
            getQuotes();
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
        deleteRecord({ url: `/quotes/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los registros han sido eliminados exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getQuotes();
        });
    }

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.quotes[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/cotizaciones/crear"} className="btn btn-primary">
                            Crear Cotización
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
                title={'Cotizaciones'}
                updatePath={"/mis-cotizaciones"}
                entity={"quotes"}
                updateOptionString={'Ver Detalles'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={quotes}
                currentPage={filters?.page}
                collumns={QuotesColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}

export default MyQuotes;