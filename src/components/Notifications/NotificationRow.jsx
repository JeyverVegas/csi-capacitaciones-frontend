import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import {
    AccreditationProcessWasAdminApproved,
    NewAccreditationProcess,
} from "../../util/NotificationsTypes";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { NewAccreditationProcessStepObservation } from "../../util/NotificationsTypes";

const NotificationRow = ({ notification, onReadNotification }) => {

    const [currentNotification, setCurrentNotification] = useState(null);

    const [{ }, setReadNotification] = useAxios({ url: `notifications/${currentNotification?.id}/read`, method: 'put' }, { manual: true, useCache: false });

    useEffect(() => {
        if (notification) {
            setCurrentNotification(notification);
        }
    }, [notification])

    let notificationUrl = '#';

    switch (notification.type) {
        case NewAccreditationProcess:
        case NewAccreditationProcessStepObservation:
        case AccreditationProcessWasAdminApproved:
            notificationUrl = `/proceso-de-acreditaciones/${notification.data.accreditationProcessId}`
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