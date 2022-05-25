import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import { useTheme } from "../../../context/ThemeContext";
import useAxios from "../../../hooks/useAxios";
import Toggle from "react-toggle";
import { Button, Modal } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import update from 'immutability-helper';
import notImage from "../../../images/not-image.jpg"

const defaultProducts = [
    {
        name: "Botas de seguridad",
        imgPath: 'https://seguridad.fun/i/2021/12/botas-de-seguridad-black-hammer-cuero-marron-s3-src-320.jpg',
        code: 'Bt-0001',
        price: 100
    },
    {
        name: "Casco de seguridad",
        imgPath: 'https://www.totaltools.com.ve/wp-content/uploads/2021/02/TSP2608-1.jpg',
        code: 'Casc-0001',
        price: 200
    },
    {
        name: "Botas de seguridad",
        imgPath: 'https://seguridad.fun/i/2021/12/botas-de-seguridad-black-hammer-cuero-marron-s3-src-320.jpg',
        code: 'Bt-0003',
        price: 100
    }
]


const OrdersCreate = () => {

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();

    const navigate = useNavigate();

    const [products, setProducts] = useState(defaultProducts);

    const { setCustomAlert, setLoading } = useFeedBack();

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        perPage: 200,
        page: 1
    });

    const [data, setData] = useState({
        spareParts: false,
        orderTypeCode: '',
        serviceId: '',
        orderItems: []
    });

    const [newProductData, setNewProductData] = useState({
        name: '',
        price: 0
    });

    const [showAddItemModal, setShowAddItemModal] = useState(false);

    const [total, setTotal] = useState(0);

    const [{ data: createData, loading: createLoading, error: createError }, createRegister] = useAxios({ url: `/orders`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        var total = 0;
        data?.orderItems?.forEach((item) => {
            total = item?.price * item?.quantity + total;
        });

        setTotal(total);
    }, [data.orderItems])

    useEffect(() => {
        customMenuToggle(true);
    }, []);

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
    }, [createError])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (createLoading) {
            return;
        }
    }

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

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
                        name: product.name,
                        quantity: 1,
                        imgPath: product?.imgPath,
                        price: product?.price,
                        code: product?.code
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
        })
    }

    const handleItemChange = (e, index) => {
        const newOrderItems = update(data?.orderItems, { [index]: { [e.target.name]: { $set: e.target.value } } });
        setData((oldData) => {
            return {
                ...oldData,
                orderItems: newOrderItems
            }
        });
    }

    const handleChangeNewProduct = (e) => {
        setNewProductData((oldNewProductData) => {
            return {
                ...oldNewProductData,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleAddItem = (e) => {
        e.preventDefault?.();
        setData((oldData) => {
            return {
                ...oldData,
                orderItems: [...oldData?.orderItems, {
                    name: newProductData.name,
                    quantity: 1,
                    imgPath: null,
                    price: newProductData?.price,
                    code: '--'
                }]
            }
        });

        setNewProductData({
            name: '',
            price: 0
        })

        setShowAddItemModal(false);
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="row" style={{ marginBottom: '50px' }}>
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="basic-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="row align-items-center justify-content-between">
                                        <div className="col-md-4">
                                            <label htmlFor="order_type">Tipo de pedido</label>
                                            <select onChange={handleChange} name="orderTypeCode" className="form-control" id="order_type" value={data.orderTypeCode}>
                                                <option value="mensual">Mensual</option>
                                                <option value="extraordinary">Extraordinario</option>
                                                <option value="manual">Manual</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="service">Servicio</label>
                                            <select onChange={handleChange} name="serviceId" className="form-control" id="service" value={data.serviceId}>
                                                <option value="1">Tarapaca</option>
                                                <option value="2">Antofagasta</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 align-items-center">
                                            <h5>¿Es para repuestos?</h5>
                                            <Toggle onChange={(e) => { setData((oldData) => { return { ...oldData, spareParts: !oldData.spareParts } }) }} checked={data?.spareParts} />
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-center my-4">
                                        <h2>Productos</h2>
                                    </div>
                                    <Droppable droppableId="order-items">
                                        {
                                            (dropableProvided, snapShot) => {
                                                return (
                                                    <div
                                                        className="col-md-12"
                                                        {...dropableProvided.droppableProps}
                                                        ref={dropableProvided.innerRef}
                                                        style={{
                                                            transition: 'all .3s',
                                                            boxShadow: snapShot?.isDraggingOver && '0px 0px 15px -5px rgba(0,0,0,0.6)',
                                                            borderRadius: '5px'
                                                        }}
                                                    >
                                                        <table className="table text-center">
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>#</th>
                                                                    <th>Codigo</th>
                                                                    <th>Item</th>
                                                                    <th>Cantidad</th>
                                                                    <th>Precio</th>
                                                                    <th>Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    data?.orderItems.length === 0 ?
                                                                        <tr className="order-tr">
                                                                            <td colSpan={7}>
                                                                                <h4 className="text-center">
                                                                                    Por favor cargue productos.
                                                                                </h4>
                                                                            </td>
                                                                        </tr>
                                                                        :
                                                                        data?.orderItems?.map((product, i) => {
                                                                            return (
                                                                                <tr className="order-tr" key={i}>
                                                                                    <td>
                                                                                        <button onClick={() => { handleRemove(i) }} type="button" className="btn btn-danger btn-sm">
                                                                                            <i className="fa fa-times" title="Eliminar"></i>
                                                                                        </button>
                                                                                    </td>
                                                                                    <td>{i + 1}</td>
                                                                                    <td>{product.code}</td>
                                                                                    <td>
                                                                                        {
                                                                                            product.imgPath ?
                                                                                                <img style={{ width: '40px', height: '40px', borderRadius: '10px' }} src={product.imgPath} alt="" />
                                                                                                :
                                                                                                <img style={{ width: '40px', height: '40px', borderRadius: '10px' }} src={notImage} alt="" />
                                                                                        }
                                                                                        <span style={{ display: 'block' }}>{product.name}</span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <input
                                                                                            type="number"
                                                                                            name="quantity"
                                                                                            required
                                                                                            min={1}
                                                                                            autoFocus
                                                                                            onChange={(e) => { handleItemChange(e, i) }}
                                                                                            value={product?.quantity}
                                                                                            className="form-control"
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type="text" value={`${product?.price}$`} readOnly min={1} className="form-control" />
                                                                                    </td>
                                                                                    <td>
                                                                                        <input type="text" min={1} value={`${product?.price * product.quantity}$`} readOnly className="form-control" />
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                }
                                                                {
                                                                    data?.orderTypeCode === 'manual' &&
                                                                    <tr>
                                                                        <td colSpan={7} className="text-center">
                                                                            <button className="btn btn-success" onClick={() => { setShowAddItemModal((old) => !old) }}>
                                                                                Añadir producto
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                }
                                                                <tr>
                                                                    <td colSpan={6}>
                                                                        <h3>Total:</h3>
                                                                    </td>
                                                                    <td>
                                                                        <h3>
                                                                            {total}$
                                                                        </h3>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        {dropableProvided.placeholder}
                                                    </div>
                                                )
                                            }
                                        }
                                    </Droppable>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div className="card-header">
                            <h4 className="card-title">Productos</h4>
                            <button className="btn btn-primary btn-xs" onClick={() => { setShowFilters((oldShowFilters) => !oldShowFilters) }}>Mostrar Filtros</button>
                        </div>
                        <div className="card-body">
                            <div className="widget-media dz-scroll p-3">
                                <Droppable droppableId="products">
                                    {
                                        (dropableProvided) => {
                                            return (
                                                <ul
                                                    className="timeline"
                                                    {...dropableProvided.droppableProps}
                                                    ref={dropableProvided.innerRef}
                                                >
                                                    {products.map((product, i) => {
                                                        return (
                                                            <Draggable draggableId={`${product.code}`} key={i} index={i} >
                                                                {
                                                                    (draggableProvided) => {
                                                                        return (
                                                                            <li
                                                                                {...draggableProvided.draggableProps}
                                                                                ref={draggableProvided.innerRef}
                                                                                {...draggableProvided.dragHandleProps}
                                                                                className=""
                                                                            >
                                                                                <div className="timeline-panel">
                                                                                    <div className="media me-2">
                                                                                        <img
                                                                                            alt="images"
                                                                                            width={50}
                                                                                            src={product?.imgPath} />
                                                                                    </div>
                                                                                    <div className="media-body">
                                                                                        <h6 className="mb-1">{product.code} - {product.name}</h6>
                                                                                        <small className="d-block">Precio: {product.price}$</small>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    }
                                                                }
                                                            </Draggable>
                                                        )
                                                    })}
                                                    {dropableProvided.placeholder}
                                                </ul>
                                            )
                                        }
                                    }
                                </Droppable>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal size="lg" className="fade" show={showFilters}>
                    <Modal.Header>
                        <Modal.Title>Filtrar Por:</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={() => setShowFilters(false)}
                        >

                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-8">
                                <div className="mb-4">
                                    <label>
                                        <h5>
                                            Nombre del Producto
                                        </h5>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        name="name"
                                        autoFocus
                                        value={data?.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-4">
                                    <label>
                                        <h5>
                                            Precio
                                        </h5>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Precio"
                                        name="price"
                                        autoFocus
                                        value={data?.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label>
                                        <h5>
                                            Referencia
                                        </h5>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Referencia"
                                        name="reference"
                                        autoFocus
                                        value={data?.reference}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-4">
                                    <label>
                                        <h5>
                                            Proveedor
                                        </h5>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Escribe el nombre"
                                        name="provider"
                                        autoFocus
                                        value={data?.provider}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => setShowFilters(false)}
                            variant="danger light"
                        >
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={() => setShowFilters(false)}>Filtrar</Button>
                    </Modal.Footer>
                </Modal>
                <Modal size="lg" className="fade" show={showAddItemModal}>
                    <Modal.Header>
                        <Modal.Title>Cargar Producto</Modal.Title>
                        <Button
                            variant="danger light"
                            className="btn-close"
                            onClick={() => setShowAddItemModal(false)}
                        >

                        </Button>
                    </Modal.Header>
                    <form onSubmit={handleAddItem}>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="mb-4">
                                        <label>
                                            <h5>
                                                Nombre del Producto
                                            </h5>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nombre"
                                            name="name"
                                            autoFocus
                                            value={newProductData?.name}
                                            onChange={handleChangeNewProduct}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-4">
                                        <label>
                                            <h5>
                                                Precio
                                            </h5>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Precio"
                                            name="price"
                                            value={newProductData?.price}
                                            onChange={handleChangeNewProduct}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={() => setShowAddItemModal(false)}
                                variant="danger light"
                                type="button"
                            >
                                Cerrar
                            </Button>
                            <Button variant="primary" type="submit" onClick={handleAddItem}>Añadir</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div >
        </DragDropContext >
    )
}
export default OrdersCreate;