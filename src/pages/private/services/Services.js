import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServicesColumns from "../../../components/CustomTable/Columns/ServicesColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useServices from "../../../hooks/useServices";
import { mainPermissions } from "../../../util/MenuLinks";

const Services = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ services, total, numberOfPages, size, error: servicesError, loading }, getServices] = useServices({ params: { ...filters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteService] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getServices();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Servicio'
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

        if (servicesError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los servicios.',
                show: true
            });
        }
    }, [deleteError, servicesError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(services?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteService({ url: `/services/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El servicio ha sido eliminado exitosamente.',
                show: true
            });
            getServices();
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

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.services[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/servicios/crear"} className="btn btn-primary">
                            Crear Servicio
                        </Link>
                    </div>
                    :
                    null
            }
            <CustomTable
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                selectAll={selectAll}
                title={'Servicios'}
                updatePath={"/servicios"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={services}
                currentPage={filters?.page}
                collumns={ServicesColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Services;