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
import useCategories from "../../../../hooks/useCategories";


const StepFour = () => {
    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const [showModal, setShowModal] = useState(false);

    const [detailProduct, setDetailProduct] = useState(null);

    const [showDetails, setShowDetails] = useState(false);

    const [filters, setFilters] = useState({
        serviceId: '',
        isReplacement: false,
        name: '',
        reference: '',
        providerName: '',
        price: '',
        page: 1,
        subCategoryId: '',
        categoryId: ''
    });

    const [categoriesFilters, setCategoriesFilters] = useState({
        page: 1,
        perPage: 200,
        parentsOnly: true
    });

    const [subCategoriesFilters, setSubCategoriesFilters] = useState({
        page: 1,
        perPage: 200
    });

    const { data, setData, setCurrentStep } = useOrderCrud();

    const [currentProviders, setCurrentProviders] = useState([]);

    const [currentProducts, setCurrentProducts] = useState([]);

    const [newItemData, setNewItemData] = useState({
        name: '',
        price: 0,
        providerName: '',
        description: ''
    });

    const [{ data: service, loading: loadingService }, getService] = useAxios({ url: `/services/${data?.serviceId}` }, { useCache: false, manual: true });

    const [{ products, total: productsTotal, numberOfPages, loading: loadingProducts }, getProducts] = useProducts({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ categories, loading: loadingCategories }] = useCategories({ axiosConfig: { params: { ...categoriesFilters } } });

    const [{ categories: subCategories, loading: loadingSubCategories }, getSubCategories] = useCategories({ axiosConfig: { params: { ...categoriesFilters } }, options: { manual: true } });

    const [{ data: createData, loading: createLoading, error: createError }, createOrder] = useAxios({ url: `/orders`, method: 'POST' }, { manual: true, useCache: false });

    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (filters?.categoryId) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    subCategoryId: ''
                }
            });
            getSubCategories({
                params: {
                    ...subCategoriesFilters,
                    parentId: filters?.categoryId
                }
            });
        }
    }, [filters.categoryId])

    useEffect(() => {
        if (products?.length > 0) {
            setCurrentProducts((oldProducts) => {
                return [...oldProducts, ...products]
            });
        }
    }, [products]);

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
                isReplacement: data?.isReplacement ? 'true' : 'false',
            }
        });
    }, [data?.serviceId, data?.isReplacement])

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

    const handleAddNewItem = () => {

        if (!newItemData?.name || !newItemData?.price || !newItemData?.providerId) {
            alert('Todos lo campos son obligatorios');
            return;
        }

        setData((oldData) => {
            return {
                ...oldData,
                orderItems: [
                    ...oldData?.orderItems,
                    {
                        name: newItemData?.name,
                        quantity: 1,
                        price: newItemData?.price,
                        code: '--',
                        providerId: newItemData?.providerId
                    }
                ]
            }
        });
        setShowModal(false);
        setNewItemData({
            name: '',
            price: '',
            providerId: ''
        })
    }

    const showProductDetails = (product) => {
        console.log(product);
        setDetailProduct(product);
        setShowDetails(true);
    }

    const handleToggleVersion = (productVersion) => {

        const res = orderHasProduct(productVersion?.code);

        if (res?.have) {
            data?.orderItems?.splice(res?.index, 1);

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
        } else {
            setData((oldData) => {
                return {
                    ...oldData,
                    orderItems: [
                        ...oldData?.orderItems,
                        {
                            name: `${detailProduct?.name} ${productVersion?.name}`,
                            quantity: 1,
                            price: productVersion?.price > 0 ? productVersion?.price : detailProduct?.price,
                            code: productVersion?.code,
                            providerId: detailProduct?.provider?.id
                        }
                    ]
                }
            });
        }
    }

    const orderHasProduct = ($code) => {
        const itemIndex = data?.orderItems?.findIndex(x => x.code === $code);

        if (itemIndex >= 0) {
            return { have: true, index: itemIndex };
        } else {
            return false;
        }
    }

    const handleBack = () => {
        setData((oldData) => {
            return {
                ...oldData,
                orderItems: []
            }
        });
        setCurrentStep((oldStep) => {
            return oldStep - 1
        });
    }

    const handleResetFilters = () => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                name: '',
                reference: '',
                providerName: '',
                price: '',
                page: 1,
                subCategoryId: '',
                categoryId: ''
            }
        })
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="container mb-5">
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
                                    <div className="col-md-6 form-group mb-2">
                                        <label>Categoria</label>
                                        <select disabled={loadingCategories} className="form-control" onChange={handleChange} value={filters?.categoryId} name="categoryId">
                                            <option value="">
                                                Seleccione una opcion
                                            </option>
                                            {
                                                categories?.map((category, i) => {
                                                    return (
                                                        <option value={category?.id} key={i}>
                                                            {category?.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-6 form-group mb-2">
                                        <label>Sub - Categorias</label>
                                        <select disabled={!filters?.categoryId || loadingSubCategories} className="form-control" name="subCategoryId" value={filters?.subCategoryId} onChange={handleChange}>
                                            <option value="">
                                                Seleccione una opcion
                                            </option>
                                            {
                                                subCategories?.map((category, i) => {
                                                    return (
                                                        <option value={category?.id} key={i}>
                                                            {category?.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-12 text-center mt-3">
                                        <button className="btn btn-danger btn-sm" onClick={handleResetFilters}>
                                            Limpiar filtros
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            data?.orderTypeId == 3 &&
                            <div className="col-md-12 mb-5">
                                <button className="btn btn-success btn-block" onClick={() => { setShowModal(true) }}>
                                    Añadir Manual
                                </button>
                            </div>
                        }
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
                                                                <div className="text-center mt-2">
                                                                    <button onClick={() => { showProductDetails(product) }} className="btn btn-primary btn-xs">
                                                                        Detalles
                                                                    </button>
                                                                </div>
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
                                        <table className="table table-order text-center" style={{ fontSize: '10px' }}>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Codigo</th>
                                                    <th>Item</th>
                                                    <th colSpan={2}>Cantidad</th>
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
                                                                    <td title={item?.name}>{cutString(`${item?.name}`, 15, 0, '...')}</td>
                                                                    <td colSpan={2}>
                                                                        <input type="number" min={1} style={{ borderRadius: '8px', width: '100%', border: '1px solid whitesmoke', padding: '5px' }} name="quantity" value={item?.quantity} onChange={(e) => { handleArrayChange(e, i, 'orderItems') }} />
                                                                    </td>
                                                                    <td>{item?.price}$</td>
                                                                    <td>{item?.price * item?.quantity}$</td>
                                                                </tr>
                                                            )
                                                        })
                                                        :
                                                        <tr className="text-center">
                                                            <td colSpan={7} style={{ fontSize: 15 }}>
                                                                <p>{`Añada ${data?.isReplacement ? 'repuestos' : 'productos'} al pedido`}</p>
                                                            </td>
                                                        </tr>
                                                }
                                                <tr>
                                                    <td colSpan={5}>
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
                                        <button type="button" className="btn btn-danger mx-1" onClick={handleBack}>
                                            Volver
                                        </button>
                                        <button className="btn btn-success mx-1">
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
                        <div className="col-md-12 form-group mb-4">
                            <label>Nombre</label>
                            <input value={newItemData?.name} onChange={handleNewItemChange} name="name" type="text" className="form-control" />
                        </div>
                        <div className="col-md-6 form-group mb-4">
                            <label>Precio Referencia</label>
                            <input value={newItemData?.price} onChange={handleNewItemChange} name="price" type="number" className="form-control" />
                        </div>
                        <div className="col-md-6 form-group mb-2">
                            <label>Proveedor</label>
                            <input value={newItemData?.providerName} type="text" className="form-control" name="providerName" onChange={handleNewItemChange} />
                        </div>
                        <div className="col-md-12 form-group mb-2">
                            <label>Descripcion</label>
                            <textarea
                                rows={4}
                                value={newItemData?.description}
                                style={{ minHeight: '100px' }}
                                className="form-control"
                                name="description"
                                onChange={handleNewItemChange}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setShowModal(false)} className="btn btn-danger">
                        Cancelar
                    </button>
                    <button onClick={handleAddNewItem} className="btn btn-success">
                        Aceptar
                    </button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDetails} className="fade" size="lg">
                <Modal.Header>
                    <Modal.Title>{detailProduct?.name}</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowDetails(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-4">
                            <img src={`${SystemInfo?.host}${detailProduct?.imagePath || notImage}`} style={{ maxWidth: '100%', borderRadius: '10px' }} alt="" />
                        </div>
                        <div className="col-md-4">
                            <div className="form-group my-2">
                                <b>Descripción: </b>
                                {detailProduct?.description}
                            </div>
                            <div className="form-group my-2">
                                <b>Codigo: </b>
                                {detailProduct?.code}
                            </div>
                            <div className="form-group my-2">
                                <b>Precio: </b>
                                {detailProduct?.price}$
                            </div>
                            <div className="form-group my-2">
                                <b>Categoria: </b>
                                {detailProduct?.category?.name}$
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h4>Versiones</h4>
                        </div>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>imagen</th>
                                    <th>Nombre</th>
                                    <th>Codigo</th>
                                    <th>Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detailProduct?.productVersions?.length > 0 ?
                                        detailProduct?.productVersions?.map?.((productVersion, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <img style={{ maxWidth: '50px', height: '50px' }} src={`${SystemInfo?.host}${productVersion?.imagePath || notImage}`} />
                                                    </td>
                                                    <td>
                                                        {productVersion?.name}
                                                    </td>
                                                    <td>
                                                        {productVersion?.code}
                                                    </td>
                                                    <td>
                                                        <input
                                                            onChange={() => { handleToggleVersion(productVersion) }}
                                                            checked={orderHasProduct(productVersion?.code)}
                                                            type={'checkbox'}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan={4}>
                                                <h4 className="text-danger">
                                                    No hay versiones.
                                                </h4>
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => { setShowDetails(false) }} className="btn btn-danger">
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
        </DragDropContext>
    )
}

export default StepFour;