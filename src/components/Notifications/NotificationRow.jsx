import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import {
    ORDER_NOTIFICATION,
    ORDER_NOTIFICATION_FOR_OWNER,
    QUOTE_NOTIFICATION,
    QUOTE_NOTIFICATION_FOR_OWNER
} from "../../util/NotificationsTypes";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

const NotificationRow = ({ notification, onReadNotification }) => {

    const [currentNotification, setCurrentNotification] = useState(null);

    const [{ }, setReadNotification] = useAxios({ url: `notifications/${currentNotification?.id}/read`, method: 'put' }, { manual: true, useCache: false });

    useEffect(() => {
        if (notification) {
            setCurrentNotification(notification);
        }
    }, [notification])

    var notificationUrl = '#';

    switch (notification?.notification_type) {
        case ORDER_NOTIFICATION_FOR_OWNER:
            notificationUrl = `/mis-pedidos/${notification?.notificable_id}`
            break;
        case ORDER_NOTIFICATION:
            notificationUrl = `/pedidos/detalles/${notification?.notificable_id}`
            break;
        case QUOTE_NOTIFICATION_FOR_OWNER:
            notificationUrl = `/mis-cotizaciones/${notification?.notificable_id}`
            break;
        case QUOTE_NOTIFICATION:
            notificationUrl = `/cotizaciones/detalles/${notification?.notificable_id}`
            break;

    }

    const timeDistance = (date, length) => {
        if (date) {
            const dateDistance = formatDistance(new Date(date), new Date(), {
                locale: es
            });

            if (dateDistance?.length > length) {
                return `${dateDistance?.slice(0, length)}...`
            }

            return dateDistance;
        }
    }

    const handleClick = () => {
        if (!currentNotification?.isRead) {
            setReadNotification();
            setCurrentNotification((oldNotification) => {
                return {
                    ...oldNotification,
                    isRead: true
                }
            });
            onReadNotification?.()
        }
    }

    return (
        <li onClick={handleClick} title={`${currentNotification?.message}.`}>
            <Link to={notificationUrl} >
                <div className="timeline-panel">
                    <div className="media-body">
                        <h6 className="mb-1">{currentNotification?.title}</h6>
                        <p className="mb-1">
                            {currentNotification?.message?.length > 30 ?
                                `${currentNotification?.message?.slice(0, 30)}...`
                                :
                                currentNotification?.message
                            }
                        </p>
                        <small className="d-block">
                            <b>Hace: {timeDistance(currentNotification?.createdAt, 20)}</b>
                        </small>
                    </div>
                    {
                        !currentNotification?.isRead &&
                        <small className="float-right text-muted pl-2 text-capitalize">
                            <b>Nueva</b>
                        </small>
                    }
                </div>
            </Link>
        </li>
    )
}

export default NotificationRow;