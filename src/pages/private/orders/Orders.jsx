import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrdersColumns from "../../../components/CustomTable/Columns/OrdersColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useOrders from "../../../hooks/useOrders";
import useOrdersTypes from "../../../hooks/useOrdersTypes";
import useServices from "../../../hooks/useServices";
import { mainPermissions } from "../../../util/MenuLinks";

const Orders = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [showFilters, setShowFilters] = useState('');

    const [filters, setFilters] = useState({
        page: 1,
        serviceIds: '',
        start: '',
        end: '',
        orderTypeId: ''
    });

    const [servicesFilters, setServicesFilters] = useState({
        currentUserServices: true,
        perPage: 100
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { ...servicesFilters } }, { useCache: false });

    const [{ ordersTypes, loading: loadingOrdersTypes }, getOrdersTypes] = useOrdersTypes({ options: { useCache: false } });

    const [{ orders, total, numberOfPages, error: ordersError, loading }, getOrders] = useOrders({ params: { ...filters }, options: { useCache: false } });

    const [{ error: deleteError, loading: deleteLoading }, deleteProvider] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getOrders();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Pedidos'
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

        if (ordersError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener los pedidos.',
                show: true
            });
        }
    }, [deleteError, ordersError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(Orders?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteProvider({ url: `/orders/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El pedido ha sido eliminado exitosamente.',
                show: true
            });
            getOrders();
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
        deleteProvider({ url: `/orders/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los pedidos han sido eliminados exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getOrders();
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
                permissions?.includes?.(mainPermissions?.orders[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/pedidos/crear"} className="btn btn-primary">
                            Crear Pedido
                        </Link>
                    </div>
                    :
                    null
            }

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
                    <div className="card p-4">
                        <label>
                            Tipo de pedido
                        </label>
                        <select name="orderTypeId" className="form-control" value={filters?.orderTypeId} onChange={handleChange}>
                            <option value="">Seleccione uno</option>
                            {
                                ordersTypes?.map((orderType, i) => {
                                    return (
                                        <option key={i} value={orderType?.id}>{orderType?.displayText}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-4">
                        <label>
                            Fecha
                        </label>
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label>
                                    Desde:
                                </label>
                                <input
                                    type="date"
                                    onChange={handleChange}
                                    className="form-control"
                                    name="start"
                                    value={filters?.start}
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>
                                    Hasta:
                                </label>
                                <input
                                    type="date"
                                    onChange={handleChange}
                                    className="form-control"
                                    name="end"
                                    value={filters?.end}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={'Pedidos'}
                updatePath={"/pedidos/detalles"}
                entity={"orders"}
                updateOptionString={'Ver Detalles'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={orders}
                currentPage={filters?.page}
                collumns={OrdersColumns}
                changePage={handlePageChange}
            />
        </div >
    )
}
export default Orders;