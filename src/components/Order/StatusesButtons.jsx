import { useEffect } from "react";
import swal from "sweetalert";
import { useFeedBack } from "../../context/FeedBackContext";
import useAxios from "../../hooks/useAxios";

const StatusesButtons = ({ order, orderStateFunct }) => {

    const { setCustomAlert, setLoading } = useFeedBack();

    const [{ loading: changeStatusLoading }, changeStatus] = useAxios({ url: `/orders/${order?.id}/status`, method: 'PUT' }, { useCache: false, manual: true });

    useEffect(() => {
        setLoading?.({
            show: changeStatusLoading,
            message: 'Cambiando Estatus'
        });
    }, [changeStatusLoading]);

    const handleStatusChange = (statusCode) => {
        swal({
            title: "¿Estás Seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((confirm) => {
            if (confirm) {
                handleAcceptChangeStatus(statusCode);
            }
        });
    }

    const handleAcceptChangeStatus = (statusCode) => {
        changeStatus({
            data: {
                order_status_code: statusCode
            },
            method: 'POST'
        }).then((response) => {
            setCustomAlert({
                message: 'El status se ha cambiado exitosamente.',
                show: true,
                severity: 'success'
            });
            console.log(response?.data?.data);
            orderStateFunct((oldOrdersDetails) => {
                return {
                    ...oldOrdersDetails,
                    allowedStatuses: response?.data?.data?.allowedStatuses,
                    orderStatus: response?.data?.data?.orderStatus,
                }
            });
        });
    }

    if (order?.allowedStatuses?.length > 0) {
        return (
            <div className="row">
                {
                    order?.allowedStatuses?.map((status, i) => {
                        return (
                            <button
                                onClick={() => handleStatusChange(status?.code)}
                                type="button"
                                className="btn mx-4 my-2"
                                key={i}
                                value={status?.code}
                                style={{ textTransform: 'capitalize', background: status?.color, color: 'white' }}
                            >
                                {status?.name}
                            </button>
                        )
                    })
                }
            </div>
        )
    } else {
        return <p>
            --
        </p>
    }
}

export default StatusesButtons;