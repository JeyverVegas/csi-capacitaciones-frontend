import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RolesColumns from "../../../components/CustomTable/Columns/RolesColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useRoles from "../../../hooks/useRoles";
import { mainPermissions } from "../../../util/MenuLinks";

const Roles = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ roles, total, numberOfPages, size, error: rolesError, loading }, getRoles] = useRoles({ params: { ...filters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteRole] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getRoles();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Registro(s)'
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

        if (rolesError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los roles.',
                show: true
            });
        }
    }, [deleteError, rolesError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(roles?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteRole({ url: `/roles/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El rol ha sido eliminado exitosamente.',
                show: true
            });
            getRoles();
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
        deleteRole({ url: `/roles/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los roles han sido eliminados exitosamente.',
                show: true
            });
            getRoles();
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.roles[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/roles/crear"} className="btn btn-primary">
                            Crear rol
                        </Link>
                    </div>
                    :
                    null
            }
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                selectAll={selectAll}
                title={'Roles'}
                updatePath={"/roles"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={roles}
                currentPage={filters.page}
                collumns={RolesColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Roles;