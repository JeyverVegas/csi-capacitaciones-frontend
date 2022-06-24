import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductsColumns from "../../../components/CustomTable/Columns/ProductsColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useProducts from "../../../hooks/useProducts";
import useServices from "../../../hooks/useServices";
import { mainPermissions } from "../../../util/MenuLinks";

const Products = () => {

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

    const [{ products, total, numberOfPages, error: productsError, loading }, getProducts] = useProducts({ params: { ...filters } }, { useCache: false });

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { ...servicesFilters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteProducts] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: 1
            }
        });
    }, [filters?.serviceIds])

    useEffect(() => {
        getProducts();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Productos'
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

        if (productsError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los productos.',
                show: true
            });
        }
    }, [deleteError, productsError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(products?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteProducts({ url: `/products/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El producto ha sido eliminado exitosamente.',
                show: true
            });
            getProducts();
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
        deleteProducts({ url: `/products/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los productos han sido eliminados exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getProducts();
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
            <div className="my-4 justify-content-end d-flex">
                {
                    permissions?.includes?.(mainPermissions?.products[1]) ?
                        <>
                            <Link to={"/productos/asociar-servicios"} className="btn btn-primary mx-1">
                                Asociar A los Servicios
                            </Link>
                            <Link to={"/productos/crear"} className="btn btn-primary">
                                Crear producto
                            </Link>
                        </>
                        :
                        null
                }
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card p-4">
                        <label>
                            Servicio
                        </label>
                        <select name="serviceIds" className="form-control" value={filters?.serviceIds} onChange={handleChange}>
                            <option value="">Seleccione uno</option>
                            {
                                services?.map((service, i) => {
                                    return (
                                        <option key={i} value={service?.id}>{service?.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                </div>
            </div>
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={'Productos'}
                updatePath={"/productos"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={products}
                currentPage={filters.page}
                collumns={ProductsColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Products;