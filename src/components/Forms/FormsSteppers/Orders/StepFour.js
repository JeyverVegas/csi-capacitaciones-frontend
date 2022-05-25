import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFeedBack } from "../../../../context/FeedBackContext";
import useAxios from "../../../../hooks/useAxios";

const StepFour = () => {

    const navigate = useNavigate();

    const { setCustomAlert } = useFeedBack();

    const [{ data: createData, loading: createLoading, error: createError }, createOrder] = useAxios({ url: `/orders`, method: 'POST' }, { manual: true, useCache: false });

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

    /* const handleDragEnd = (e) => {
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
    } */

    /* const handleRemove = (index) => {
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
    } */

    /* const handleItemChange = (e, index) => {
        const newOrderItems = update(data?.orderItems, { [index]: { [e.target.name]: { $set: e.target.value } } });
        setData((oldData) => {
            return {
                ...oldData,
                orderItems: newOrderItems
            }
        });
    } */

    return (
        <div>
            Step 4
        </div>
    )
}

export default StepFour;