import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoriesColumns from "../../../components/CustomTable/Columns/CategoriesColumns";
import ProvidersColumns from "../../../components/CustomTable/Columns/ProvidersColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";
import { mainPermissions } from "../../../util/MenuLinks";

const Categories = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ categories, total, numberOfPages, error: categoriesError, loading }, getCategories] = useCategories({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ error: deleteError, loading: deleteLoading }, deleteCategories] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        console.log(categories);
    }, [categories])

    useEffect(() => {

    }, [filters])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando categorias'
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

        if (categoriesError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener las categorias.',
                show: true
            });
        }
    }, [deleteError, categoriesError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(categories?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteCategories({ url: `/categories/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'La categoria ha sido eliminada exitosamente.',
                show: true
            });
            getCategories();
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
        deleteCategories({ url: `/categories/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Las categorias han sido eliminadas exitosamente.',
                show: true
            });
            getCategories();
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.categories[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/categorias/crear"} className="btn btn-primary">
                            Crear categoria
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
                title={'Categorias'}
                updatePath={"/categorias"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={categories}
                currentPage={filters.page}
                collumns={CategoriesColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Categories;