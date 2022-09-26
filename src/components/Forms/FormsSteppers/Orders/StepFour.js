import { useCallback, useEffect, useRef, useState } from "react";
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
import useCategories from "../../../../hooks/useCategories";
import ImgUploadInput from "../../../ImgUploadInput";
import clsx from "clsx";
import { useTheme } from "../../../../context/ThemeContext";
import swal from "sweetalert";
import useOrdersTemplates from "../../../../hooks/useOrdersTemplates";
import { format } from "date-fns";


const StepFour = () => {
    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const { background } = useTheme();

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
        categoryId: '',
        parentsOnly: true,
        withChildren: true
    });

    const [categoriesFilters, setCategoriesFilters] = useState({
        page: 1,
        perPage: 200,
        parentsOnly: true
    });

    const [templatesFilters, setTemplatesFilters] = useState({
        perPage: 10,
        page: 1,
        forCurrentUser: true
    });

    const [subCategoriesFilters, setSubCategoriesFilters] = useState({
        page: 1,
        perPage: 200
    });

    const { data, setData, setCurrentStep } = useOrderCrud();

    const [currentOrdersTemplates, setCurrentOrdersTemplates] = useState([]);

    const [currentProducts, setCurrentProducts] = useState([]);

    const [newItemData, setNewItemData] = useState({
        name: '',
        price: 0,
        providerName: '',
        description: '',
        image: null
    });

    const [{ data: service, loading: loadingService }, getService] = useAxios({ url: `/services/${data?.serviceId}` }, { useCache: false, manual: true });

    const [{ data: orderType, loading: loadingOrderType }, getOrderType] = useAxios({ url: `/order-types/${data?.orderTypeId}` }, { useCache: false, manual: true });

    const [{ products, total: productsTotal, numberOfPages, loading: loadingProducts }, getProducts] = useProducts({ params: { ...filters }, options: { useCache: false } });

    const [{ ordersTemplates, numberOfPages: templatesPages, loading: loadingTemplates }, getOrdersTemplates] = useOrdersTemplates({ params: { ...templatesFilters }, options: { useCache: false } });

    const [{ categories, loading: loadingCategories }] = useCategories({ params: { ...categoriesFilters } });

    const [{ categories: subCategories, loading: loadingSubCategories }, getSubCategories] = useCategories({ params: { ...categoriesFilters }, options: { manual: true } });

    const [{ data: createData, loading: createLoading, error: createError }, createOrder] = useAxios({ url: `/orders`, method: 'POST' }, { manual: true, useCache: false });

    const [total, setTotal] = useState(0);

    const observer = useRef();

    const lastTemplateRef = useCallback((template) => {
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (templatesPages > templatesFilters.page) {
                    setTemplatesFilters((oldTemplatesFilters) => {
                        return {
                            ...oldTemplatesFilters,
                            page: oldTemplatesFilters?.page + 1
                        }
                    })
                }
            }
        })
        if (template) observer?.current?.observe?.(template)
    }, [templatesPages, templatesFilters.page]);

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
    }, [filters?.name, filters?.serviceId, filters?.reference, filters?.providerName, filters?.price, filters?.isReplacement, filters?.serviceId, filters?.subCategoryId, filters?.categoryId])

    useEffect(() => {
        if (data?.serviceId) {
            getService();
        }
    }, [data?.serviceId])

    useEffect(() => {
        if (data?.orderTypeId) {
            getOrderType();
        }
    }, [data?.orderTypeId])

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                serviceId: data?.serviceId || '',
                isReplacement: data?.isReplacement ? 'true' : 'false',
                isProduct: data?.isReplacement ? 'false' : 'true',
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
            localStorage.removeItem(SystemInfo?.AUTO_SAVE_KEY);
            navigate('/mis-pedidos');
        }
    }, [createData]);

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

    useEffect(() => {
        setCurrentOrdersTemplates((oldTemplates) => {
            return [...currentOrdersTemplates, ...ordersTemplates]
        })
    }, [ordersTemplates])

    const handleDragEnd = (e) => {
        const { source, destination } = e;
        if (!destination) {
            return;
        }

        if (source?.droppableId === destination?.droppableId) {
            return;
        }



        const product = products.find(x => x.id == e.draggableId);

        console.log(product);

        const orderHasProduct = data?.orderItems?.find(x => x.id === product.id);

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
                        id: product?.id,
                        name: product?.name,
                        quantity: 1,
                        price: product?.price,
                        code: product?.code,
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
                [e.target.name]: e.target.type === 'file' ? e?.target?.files?.[0] : e.target.value
            }
        });
    }

    const handleAddNewItem = () => {

        if (!newItemData?.name || !newItemData?.price || !newItemData?.providerName || !newItemData?.image || !newItemData?.description) {
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
                        image: newItemData?.image,
                        providerName: newItemData?.providerName,
                        description: newItemData?.description,
                        quantity: 1,
                        price: newItemData?.price,
                        code: '--',
                    }
                ]
            }
        });
        setNewItemData({
            name: '',
            price: 0,
            providerName: '',
            description: '',
            image: null
        });
    }

    const showProductDetails = (product) => {
        setDetailProduct(product);
        setShowDetails(true);
    }

    const handleToggleVersion = (productVersion) => {

        const res = orderHasProduct(productVersion?.id);

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
                            name: `${productVersion?.name}`,
                            quantity: 1,
                            price: productVersion?.price,
                            code: productVersion?.code,
                            id: productVersion?.id
                        }
                    ]
                }
            });
        }
    }

    const orderHasProduct = ($id) => {
        const itemIndex = data?.orderItems?.findIndex(x => x.id === $id);

        if (itemIndex >= 0) {
            return { have: true, index: itemIndex };
        } else {
            return false;
        }
    }

    const handleBack = () => {
        swal({
            title: "¿Estás Seguro?",
            text: "Esto eliminara todo lo que hicistes hasta ahora.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                setData((oldData) => {
                    return {
                        ...oldData,
                        orderItems: []
                    }
                });
                setCurrentStep((oldStep) => {
                    return oldStep - 1
                });
            } else {

            }
        })
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

    const handleCreateOrder = () => {
        const { isReplacement, orderItems, ...rest } = data;

        var formData = new FormData();

        if (data?.orderTypeId == 3) {
            Object.keys(rest).forEach((key, i) => {
                formData?.append(key, rest[key]);
            });

            formData?.append('isReplacement', isReplacement ? 1 : 0);

            orderItems?.forEach((item, i) => {
                formData.append(`customOrderItems[${i}][name]`, item?.name);
                formData.append(`customOrderItems[${i}][image]`, item?.image, item?.image?.name);
                formData.append(`customOrderItems[${i}][providerName]`, item?.providerName);
                formData.append(`customOrderItems[${i}][description]`, item?.description);
                formData.append(`customOrderItems[${i}][quantity]`, item?.quantity);
                formData.append(`customOrderItems[${i}][price]`, item?.price);
            });
        } else {
            formData = {
                ...rest,
                isReplacement: isReplacement ? 1 : 0,
                orderItems: orderItems?.map((item, i) => {
                    return {
                        productId: item?.id,
                        quantity: item?.quantity,
                    }
                })
            }
        }

        createOrder({ data: formData });
    }

    const handleTemplate = (template) => {
        setData((oldData) => {
            return {
                ...oldData,
                orderItems: template?.items?.map((item) => {
                    return {
                        productId: item?.id,
                        quantity: item?.quantity,
                        name: item?.name,
                        price: item?.price
                    }
                })
            }
        });

        setShowModal(false);

    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="container mb-5">
                <div className="row">
                    {
                        data?.orderTypeId == 3 ?
                            <div className="col-md-7 card p-5">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h3>
                                            Información del producto
                                        </h3>
                                    </div>
                                    <div className="col-md-6 form-group mb-4">
                                        <ImgUploadInput
                                            name="image"
                                            style={{
                                                width: '100px',
                                                height: '100px'
                                            }}
                                            value={newItemData?.image}
                                            description="imagen"
                                            deleteButton={newItemData?.image}
                                            change={handleNewItemChange}
                                        />
                                    </div>
                                    <div className="col-md-6 form-group mb-4">
                                        <label>Nombre</label>
                                        <input autoFocus value={newItemData?.name} onChange={handleNewItemChange} name="name" type="text" className="form-control" />
                                    </div>
                                    <div className="col-md-6 form-group mb-4">
                                        <label>Precio Referencia</label>
                                        <input value={newItemData?.price} onChange={handleNewItemChange} name="price" type="number" className="form-control" />
                                    </div>
                                    <div className="col-md-12 form-group mb-4">
                                        <label>Proveedor</label>
                                        <input value={newItemData?.providerName} type="text" className="form-control" name="providerName" onChange={handleNewItemChange} />
                                    </div>
                                    <div className="col-md-12 form-group mb-2">
                                        <label>Descripción</label>
                                        <textarea
                                            rows={4}
                                            value={newItemData?.description}
                                            style={{ minHeight: '100px' }}
                                            className="form-control"
                                            name="description"
                                            onChange={handleNewItemChange}
                                        />
                                    </div>
                                    <div className="col-md-12 text-center">
                                        <button onClick={handleAddNewItem} className="btn btn-success">
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-md-7">
                                <h1 className="text-center">{data?.isReplacement ? 'Repuestos' : 'Productos'}</h1>
                                <div style={{ height: 'fit-content' }} className={clsx(["mb-4 rounded shadow-sm"], {
                                    "bg-white": background?.value === 'light',
                                    'card': background?.value !== 'light'
                                })}>
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
                                                <label>Categoría</label>
                                                <select disabled={loadingCategories} className="form-control" onChange={handleChange} value={filters?.categoryId} name="categoryId">
                                                    <option value="">
                                                        Seleccione una opción
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
                                                <label>Sub - Categorías</label>
                                                <select disabled={!filters?.categoryId || loadingSubCategories} className="form-control" name="subCategoryId" value={filters?.subCategoryId} onChange={handleChange}>
                                                    <option value="">
                                                        Seleccione una opción
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
                                                        <Draggable key={i} draggableId={`${product?.id}`} index={i}>
                                                            {(draggableProvided) => <div
                                                                {...draggableProvided?.draggableProps}
                                                                ref={draggableProvided?.innerRef}
                                                                {...draggableProvided?.dragHandleProps}
                                                                className="col-md-4 animate__animated animate__fadeIn"
                                                            >
                                                                <div className="rounded" style={{ overflow: 'hidden', background: background?.value === 'light' ? 'white' : '#171622' }}>
                                                                    <img
                                                                        src={`${SystemInfo?.host}${product?.imagePath || notImage}`}
                                                                        style={{ maxWidth: '100%' }}
                                                                        alt=""
                                                                    />
                                                                    <div className="p-3">
                                                                        <div className="d-flex justify-content-between">
                                                                            <h5>{cutString(product?.name, 10, 0, '...')}</h5>
                                                                            <span>{product?.price}$</span>
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                Categoría: <b>{product?.category?.name || '--'}</b>
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                Sub Categoría: <b>{product?.subCategory?.name || '--'}</b>
                                                                            </span>
                                                                        </div>
                                                                        <span>
                                                                            Proveedor: <b>{product?.provider?.name || '--'}</b>
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
                    }
                    <div className="col-md-5">
                        {
                            data?.orderTypeId !== 3 &&
                            <div className="text-center">
                                <button onClick={() => { setShowModal(true) }} className="btn btn-primary mb-2">
                                    Cargar Plantilla
                                    <i className="flaticon-381-add mx-2"></i>
                                </button>
                            </div>
                        }
                        <Droppable droppableId="orderItems">
                            {
                                (droppableProvided, snapshot) => <div
                                    {...droppableProvided?.droppableProps}
                                    ref={droppableProvided?.innerRef}
                                    className={clsx(["rounded shadow-sm", {
                                        "bg-white": background?.value === 'light',
                                        "card": background?.value !== 'light',
                                    }])}
                                    style={{ position: 'relative', overflow: 'hidden', minHeight: '60vh', height: 'fit-content' }}
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
                                                {
                                                    loadingOrderType ?
                                                        <b>Cargado...</b>
                                                        :
                                                        <b>{orderType?.data?.displayText}</b>
                                                }
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
                                                    <th>Código</th>
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
                                                                        <input type="number" min={1} style={{
                                                                            borderRadius: '8px',
                                                                            width: '100%',
                                                                            border: '1px solid whitesmoke',
                                                                            padding: '5px',
                                                                            background: 'transparent',
                                                                            color: background?.value === 'light' ? 'black' : 'white'
                                                                        }} name="quantity" value={item?.quantity} onChange={(e) => { handleArrayChange(e, i, 'orderItems') }} />
                                                                    </td>
                                                                    <td>$ {item?.price}</td>
                                                                    <td>$ {item?.price * item?.quantity}</td>
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
                                                        <h3>$ {total}</h3>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        <button type="button" className="btn btn-danger mx-1" onClick={handleBack}>
                                            Volver
                                        </button>
                                        <button disabled={createLoading} onClick={handleCreateOrder} className="btn btn-success mx-1">
                                            {
                                                createLoading ? 'Cargando...' : 'Crear Pedido'
                                            }
                                        </button>
                                    </div>
                                </div>
                            }
                        </Droppable>
                    </div>
                </div>
            </div>
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
                                <b>Código: </b>
                                {detailProduct?.code}
                            </div>
                            <div className="form-group my-2">
                                <b>Precio: </b>
                                ${detailProduct?.price}
                            </div>
                            <div className="form-group my-2">
                                <b>Categoría: </b>
                                {detailProduct?.category?.name}
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
                                    <th>Código</th>
                                    <th>Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detailProduct?.children?.length > 0 ?
                                        detailProduct?.children?.map?.((childProduct, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <img style={{ maxWidth: '50px', height: '50px' }} src={`${SystemInfo?.host}${childProduct?.imagePath || notImage}`} />
                                                    </td>
                                                    <td>
                                                        {childProduct?.name}
                                                    </td>
                                                    <td>
                                                        {childProduct?.code}
                                                    </td>
                                                    <td>
                                                        <input
                                                            onChange={() => { handleToggleVersion(childProduct) }}
                                                            checked={orderHasProduct(childProduct?.id)}
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

            <Modal show={showModal} className="fade" size="lg">
                <Modal.Header>
                    <Modal.Title>Tus Plantillas</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>
                                        Template #
                                    </th>
                                    <th>
                                        nombre
                                    </th>
                                    <th>
                                        Nro. de items
                                    </th>
                                    <th>
                                        Fecha de Creación
                                    </th>
                                    <th>
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentOrdersTemplates?.map((template, i) => {
                                        return (
                                            <tr key={i}
                                                ref={i + 1 === currentOrdersTemplates.length ? lastTemplateRef : null}
                                            >
                                                <td>
                                                    {template?.id}
                                                </td>
                                                <td>
                                                    {template?.name}
                                                </td>
                                                <td>
                                                    {template?.items?.length}
                                                </td>
                                                <td>
                                                    {format(new Date(template?.createdAt), 'dd/MM/yyyy hh:mm:ss a')}
                                                </td>
                                                <td onClick={() => handleTemplate(template)} className="text-end">
                                                    <button className="btn btn-primary" title="descargar">
                                                        <i className="flaticon-381-add"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => { setShowModal(false) }} className="btn btn-danger">
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>
        </DragDropContext>
    )
}

export default StepFour;