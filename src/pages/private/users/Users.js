import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PositionsColumns from "../../../components/CustomTable/Columns/PositionsColumns";
import UsersColumns from "../../../components/CustomTable/Columns/UsersColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useUsers from "../../../hooks/useUsers";
import { mainPermissions } from "../../../util/MenuLinks";

const Users = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ users, total, numberOfPages, size, error: usersError, loading }, getUsers] = useUsers({ params: { ...filters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteUser] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Usuario(s)'
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

        if (usersError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los usuarios.',
                show: true
            });
        }
    }, [deleteError, usersError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(users?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteUser({ url: `/users/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El usuario ha sido eliminado exitosamente.',
                show: true
            });
            getUsers();
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
        deleteUser({ url: `/users/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los usuarios han sido eliminados exitosamente.',
                show: true
            });
            getUsers();
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.users[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/usuarios/crear"} className="btn btn-primary">
                            Crear usuario
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
                loading={loading}
                title={'Usuarios'}
                updatePath={"/usuarios"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={users}
                currentPage={filters.page}
                collumns={UsersColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Users;