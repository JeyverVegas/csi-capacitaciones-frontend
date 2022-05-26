import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../../context/FeedBackContext";
import { useOrderCrud } from "../../../../context/OrderCrudContext";
import useAxios from "../../../../hooks/useAxios";
import update from 'immutability-helper';
import useProducts from "../../../../hooks/useProducts";
import SystemInfo from "../../../../util/SystemInfo";
import notImage from "../../../../images/not-image.jpg";
import { cutString } from "../../../../util/Utilities";
import { Droppable, DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Button, Modal } from "react-bootstrap";
import useProviders from "../../../../hooks/useProviders";
import checkEmpty from "../../../../images/check-empty.png";
import check from "../../../../images/check.png";


const StepFour = () => {
    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const [showModal, setShowModal] = useState(false);

    const [providersFilters, setProvidersFilters] = useState({
        name: '',
        page: 1
    });

    const [filters, setFilters] = useState({
        name: '',
        serviceId: '',
        reference: '',
        providerName: '',
        price: '',
        isReplacement: false,
        serviceId: '',
        page: 1
    })

    const { data, setData } = useOrderCrud();

    const [currentProviders, setCurrentProviders] = useState([]);

    const [currentProducts, setCurrentProducts] = useState([]);

    const [newItemData, setNewItemData] = useState({
        name: '',
        price: 0,
        providerId: ''
    });

    const [{ data: service, loading: loadingService }, getService] = useAxios({ url: `/services/${data?.serviceId}` }, { useCache: false, manual: true });

    const [{ providers, numberOfPages: providerPages, loading: loadingProviders }, getProviders] = useProviders({ axiosConfig: { params: { ...providersFilters } }, options: { useCache: false } });

    const [{ products, total: productsTotal, numberOfPages, loading: loadingProducts }, getProducts] = useProducts({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ data: createData, loading: createLoading, error: createError }, createOrder] = useAxios({ url: `/orders`, method: 'POST' }, { manual: true, useCache: false });

    const [total, setTotal] = useState(0);

    useEffect(() => {
        setCurrentProviders([]);
    }, [providersFilters?.name]);

    useEffect(() => {
        if (products?.length > 0) {
            setCurrentProducts((oldProducts) => {
                return [...oldProducts, ...products]
            });
        }
    }, [products])

    useEffect(() => {
        if (providers?.length > 0) {
            setCurrentProviders((oldProviders) => {
                return [...oldProviders, ...providers]
            });
        }
    }, [providers])

    useEffect(() => {
        setCurrentProducts([]);
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: 1
            }
        });
    }, [filters?.name, filters?.serviceId, filters?.reference, filters?.providerName, filters?.price, filters?.isReplacement, filters?.serviceId])

    useEffect(() => {
        if (data?.serviceId) {
            getService();
        }
    }, [data?.serviceId])

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                serviceId: data?.serviceId || '',
                isReplacement: data?.isReplacement ? true : false,
            }
        });
    }, [data?.service, data?.isReplacement])

    useEffect(() => {
        var total = 0;
        data?.orderItems?.forEach((item) => {
            total = total + (item?.price * item?.quantity)
        });

        setTotal(total);
    }, [data?.orderItems]);

    useEffect(() => {
        if (createData) {
            setCustomAlert({
                title: '¡Operacion Exitosa!',
                severity: 'success',
                message: 'El pedido fue creado exitosamente.',
                show: true
            });
            navigate('/pedidos');
        }
    }, [createData])

    useEffect(() => {
        if (createError) {
            setCustomAlert({
                title: 'Error',
                severity: 'danger',
                message: 'Ha ocurrido un error.',
                show: true
            });
        }
    }, [createError]);

    const handleDragEnd = (e) => {
        const { source, destination } = e;
        if (!destination) {
            return;
        }

        if (source?.droppableId === destination?.droppableId) {
            return;
        }

        const product = products.find(x => x.code === e.draggableId);

        const orderHasProduct = data?.orderItems?.find(x => x.code === product.code);

        if (orderHasProduct) {
            alert('El producto ye se encuentra en el pedido.');
            return;
        }

        setData((oldData) => {
            return {
                ...oldData,
                orderItems: [
                    ...oldData?.orderItems,
                    {
                        name: product?.name,
                        quantity: 1,
                        price: product?.price,
                        code: product?.code,
                        providerId: product?.provider?.id
                    }
                ]
            }
        })
    }

    const handleRemove = (index) => {
        data?.orderItems?.splice(index, 1);

        var total = 0;

        data?.orderItems?.forEach((item) => {
            total = item?.price * item?.quantity + total;
        });

        setTotal(total);

        setData((oldData) => {
            return {
                ...oldData,
                orderItems: data?.orderItems
            }
        });
    }

    const handleArrayChange = (e, index, arrayName) => {
        const newArrayValues = update(data?.[arrayName], { [index]: { [e.target.name]: { $set: e.target.value } } });
        setData((oldData) => {
            return {
                ...oldData,
                [arrayName]: newArrayValues
            }
        });
    }

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleNewItemChange = (e) => {
        setNewItemData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        });
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <h1 className="text-center">{data?.isReplacement ? 'Repuestos' : 'Productos'}</h1>
                        <div className="mb-4 bg-white rounded shadow-sm">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 form-group mb-2">
                                        <input type="text" className="form-control" placeholder="Nombre..." name="name" onChange={handleChange} value={filters?.name} />
                                    </div>
                                    <div className="col-md-6 form-group mb-2">
                                        <input type="text" className="form-control" placeholder="referencia..." name="reference" onChange={handleChange} value={filters?.reference} />
                                    </div>
                                    <div className="col-md-6 form-group mb-2">
                                        <input type="text" className="form-control" placeholder="proveedor..." name="providerName" onChange={handleChange} value={filters?.providerName} />
                                    </div>
                                    <div className="col-md-6 form-group mb-2">
                                        <input type="number" className="form-control" placeholder="Precio..." name="price" onChange={handleChange} value={filters?.price} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Droppable droppableId="products">
                            {(droppableProvided) => <div
                                {...droppableProvided?.droppableProps}
                                ref={droppableProvided?.innerRef}
                                className="row align-items-center"
                            >
                                {
                                    currentProducts?.length > 0 ?
                                        currentProducts?.map((product, i) => {
                                            return (
                                                <Draggable key={i} draggableId={product?.code} index={i}>
                                                    {(draggableProvided) => <div
                                                        {...draggableProvided?.draggableProps}
                                                        ref={draggableProvided?.innerRef}
                                                        {...draggableProvided?.dragHandleProps}
                                                        className="col-md-4 animate__animated animate__fadeIn"
                                                    >
                                                        <div className="bg-white rounded" style={{ overflow: 'hidden' }}>
                                                            <img src={`${SystemInfo?.host}${product?.imagePath || notImage}`} style={{ maxWidth: '100%' }} alt="" />
                                                            <div className="p-3">
                                                                <div className="d-flex justify-content-between">
                                                                    <h5>{cutString(product?.name, 10, 0, '...')}</h5>
                                                                    <span>{product?.price}$</span>
                                                                </div>
                                                                <div>
                                                                    <span>
                                                                        Categoria: <b>{product?.category?.name}</b>
                                                                    </span>
                                                                </div>
                                                                <span>
                                                                    Proveedor: <b>{product?.provider?.name}</b>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    }
                                                </Draggable>
                                            )
                                        })
                                        :
                                        !loadingProducts &&
                                        <div className="text-center">
                                            No se encontraron productos.
                                        </div>
                                }
                                {
                                    loadingProducts &&
                                    <div className="col-md-4 animate__animated animate__fadeIn">
                                        Cargando...
                                    </div>
                                }
                                {
                                    data?.orderTypeId !== 3 &&
                                    <div className="col-md-4">
                                        <button className="btn btn-success" onClick={() => { setShowModal(true) }}>
                                            Añadir Manual
                                        </button>
                                    </div>
                                }
                                {
                                    droppableProvided?.placeholder
                                }
                            </div>
                            }
                        </Droppable>
                    </div>
                    <div className="col-md-5">
                        <Droppable droppableId="orderItems">
                            {
                                (droppableProvided, snapshot) => <div
                                    {...droppableProvided?.droppableProps}
                                    ref={droppableProvided?.innerRef}
                                    className="bg-white rounded shadow-sm"
                                    style={{ position: 'relative', overflow: 'hidden', minHeight: '60vh' }}
                                >
                                    {
                                        snapshot.isDraggingOver &&
                                        <div className="animate__animated animate__fadeIn" style={{ display: 'flex', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, background: 'rgba(0,0,0, .5)' }}>
                                            <h5 className="m-auto text-white animate__animated animate__fadeInUp animate__faster">
                                                Suelte el producto para añadirlo
                                            </h5>
                                        </div>
                                    }
                                    <div className="card-header">
                                        <h3 className="card-title">Pedido</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-2">
                                            <div className="col-md-6">
                                                Tipo de pedido:
                                            </div>
                                            <div className="col-md-6 text-end">
                                                <b>Mensual</b>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6">
                                                Servicio:
                                            </div>
                                            <div className="col-md-6 text-end">
                                                {
                                                    loadingService ?
                                                        <b>Cargado...</b>
                                                        :
                                                        <b>{service?.data?.name}</b>
                                                }
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-md-6">
                                                Es Para Repuestos:
                                            </div>
                                            <div className="col-md-6 text-end">
                                                <b>{data?.isReplacement ? 'SI' : 'NO'}</b>
                                            </div>
                                        </div>
                                        <div className="text-center mt-2">
                                            <h4 style={{ marginBottom: 0 }}>{data?.isReplacement ? 'Repuestos' : 'Productos'}</h4>
                                        </div>
                                        <table className="table table-order" style={{ fontSize: '10px' }}>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Codigo</th>
                                                    <th>Item</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    data?.orderItems?.length > 0 ?
                                                        data?.orderItems?.map((item, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <i
                                                                            className="flaticon-381-trash-2 text-danger"
                                                                            style={{ fontSize: '13px', cursor: 'pointer' }}
                                                                            onClick={() => { handleRemove(i) }}></i>
                                                                    </td>
                                                                    <td>{item?.code}</td>
                                                                    <td>{cutString(`${item?.name} ohgohkghghghg kofghf`, 15, 0, '...')}</td>
                                                                    <td>
                                                                        <input type="number" className="form-control" name="quantity" value={item?.quantity} onChange={(e) => { handleArrayChange(e, i, 'orderItems') }} />
                                                                    </td>
                                                                    <td>{item?.price}$</td>
                                                                    <td>{item?.price * item?.quantity}$</td>
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr className="text-center">
                                                            <td colSpan={6} style={{ fontSize: 15 }}>
                                                                <p>{`Añada ${data?.isReplacement ? 'repuestos' : 'productos'} al pedido`}</p>
                                                            </td>
                                                        </tr>
                                                }
                                                <tr>
                                                    <td colSpan={4}>
                                                        <h3>Total:</h3>
                                                    </td>
                                                    <td colSpan={2}>
                                                        <h3>{total}$</h3>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        <button className="btn btn-success">
                                            Crear Pedido
                                        </button>
                                    </div>
                                </div>
                            }
                        </Droppable>
                    </div>
                </div>
            </div>
            <Modal show={showModal} className="fade" size="lg">
                <Modal.Header>
                    <Modal.Title>Añadir Item</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 form-group mb-4">
                            <label htmlFor="">Nombre</label>
                            <input value={newItemData?.name} onChange={handleNewItemChange} type="text" className="form-control" placeholder="Nombre..." />
                        </div>
                        <div className="col-md-6 form-group mb-4">
                            <label htmlFor="">Precio</label>
                            <input value={newItemData?.price} onChange={handleNewItemChange} type="number" className="form-control" placeholder="Precio..." />
                        </div>
                        <div className="col-md-12 form-group mb-2">
                            <h3>Proveedor</h3>
                            <input type="text" className="form-control" placeholder="Buscar..." value={providersFilters?.name} onChange={(e) => { setProvidersFilters({ name: e.target?.value, page: 1 }) }} />
                        </div>
                        <div className="col-md-12">
                            <ul style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                                {
                                    currentProviders?.length > 0 ?
                                        currentProviders?.map((provider, i) => {
                                            return (
                                                <li
                                                    key={i}
                                                    className="p-2"
                                                    style={{ borderBottom: '1px solid whitesmoke', display: 'flex', cursor: 'pointer', justifyContent: 'space-between' }}
                                                    onClick={() => { handleNewItemChange({ target: { name: 'providerId', value: provider?.id } }) }}
                                                >
                                                    <span>{provider?.name}</span>
                                                    <img src={newItemData?.providerId === provider?.id ? check : checkEmpty} width={30} height={30} />
                                                </li>
                                            )
                                        })
                                        :
                                        !loadingProviders &&
                                        <li className="text-center text-danger">
                                            No hay resultados.
                                        </li>
                                }
                                {
                                    loadingProviders &&
                                    <li>
                                        Cargando...
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-success">
                        Aceptar
                    </button>
                </Modal.Footer>
            </Modal>
        </DragDropContext>
    )
}

export default StepFour;