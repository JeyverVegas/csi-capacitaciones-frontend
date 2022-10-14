import { useState } from "react";
import { useEffect } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import useAxios from "../hooks/useAxios";
import useOrderStatuses from "../hooks/useOrderStatuses";
import imgUrl from "../util/imgUrl";
import SystemInfo from "../util/SystemInfo";

const OrderItemRow = ({ orderItem, index, canUpdateStatus, selectValues, onCheck, withOutCheck, orderTypeId }) => {

    const [orderStatusesFilter, setOrderStatusesFilter] = useState({
        page: 1,
        exceptCodes: []
    })

    const [currentItem, setCurrentItem] = useState(null);

    const [showModalImagePreview, setShowModalImagePreview] = useState(false);

    const [{ orderStatuses, total, numberOfPages, size, error, loading }, getOrderStatuses] = useOrderStatuses({ params: { ...orderStatusesFilter, exceptCodes: orderStatusesFilter?.exceptCodes?.join(',') } });

    const [{ data: updateStatusData, loading: updateStatusLoading }, updateStatus] = useAxios({ url: `/order-items/${currentItem?.id}/update-status`, method: 'POST' }, { manual: true, useCache: false });

    useEffect(() => {
        if (updateStatusData) {
            setCurrentItem(updateStatusData?.data);
            console.log(updateStatusData);
        }
    }, [updateStatusData])

    useEffect(() => {
        if (currentItem?.status?.code) {
            setOrderStatusesFilter((oldFilters) => {
                return {
                    ...oldFilters,
                    exceptCodes: [currentItem?.status?.code, 'ors-002', 'ors-003', 'ors-005', 'ors-006']
                }
            });
        }
    }, [currentItem])

    useEffect(() => {
        if (orderItem) {
            setCurrentItem(orderItem);
        }
    }, [orderItem])

    const handleStatusCode = (statusCode) => {
        if (updateStatusLoading) return;

        updateStatus({
            data: {
                status_code: statusCode
            }
        });
    }

    return (
        <>
            <tr>
                {
                    !withOutCheck &&
                    <td>
                        <div className="form-check custom-checkbox ">
                            <input
                                type="checkbox"
                                onChange={() => { onCheck?.(currentItem) }}
                                className="form-check-input"
                                id="customCheckBox2"
                                required
                                checked={selectValues?.includes(currentItem?.id)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="customCheckBox2"
                            />
                        </div>
                    </td>
                }
                <td>{index + 1}</td>
                <td>
                    {currentItem?.productCode || '--'}
                </td>
                <td>
                    <img
                        onClick={() => {
                            setShowModalImagePreview(true);
                        }}
                        className="rounded"
                        style={{ width: 60, height: 60, cursor: 'pointer' }}
                        src={`${SystemInfo?.host}${currentItem?.imagePath}`}
                        alt=""
                    />
                    <br></br>

                    {currentItem?.name}
                </td>
                <td>{currentItem?.providerName}</td>
                {
                    orderTypeId === 3 &&
                    <td>
                        {
                            currentItem?.filePath ?
                                <a href={imgUrl(currentItem?.filePath, '#')} target="_blank" className="btn btn-danger btn-xs">
                                    Descargar
                                </a>
                                :
                                <a className="btn btn-light btn-xs">
                                    No tiene
                                </a>
                        }
                    </td>
                }
                <td>
                    <div className="basic-dropdown">
                        <Dropdown>
                            {
                                updateStatusLoading ?
                                    <Dropdown.Toggle size="xs" variant='light'>
                                        Cargando...
                                    </Dropdown.Toggle>
                                    :
                                    <Dropdown.Toggle size="xs" variant={currentItem?.status?.variant_color}>
                                        {currentItem?.status?.name}
                                    </Dropdown.Toggle>
                            }
                            {
                                canUpdateStatus ?
                                    <Dropdown.Menu>
                                        {
                                            loading ?
                                                <Dropdown.Item href="#">Cargando...</Dropdown.Item>
                                                :
                                                orderStatuses?.map((status, i) => {
                                                    return (
                                                        <Dropdown.Item onClick={() => handleStatusCode(status?.code)} href="#" key={i}>
                                                            {status?.name}
                                                        </Dropdown.Item>
                                                    )
                                                })
                                        }
                                    </Dropdown.Menu>
                                    :
                                    null
                            }
                        </Dropdown>
                    </div>
                </td>
                <td>{currentItem?.quantity}</td>
                <td>$ {currentItem?.price}</td>
                <td>$ {currentItem?.price * currentItem?.quantity}</td>
            </tr>
            <Modal size="lg" className="fade" show={showModalImagePreview}>
                <Modal.Header>
                    <Modal.Title></Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setShowModalImagePreview(false)}
                    >
                    </Button>
                </Modal.Header>
                <Modal.Body>

                    <div className="text-center">
                        <img style={{ width: '40vw' }} src={`${SystemInfo?.host}${currentItem?.imagePath}`} />
                    </div>

                </Modal.Body>
            </Modal>
        </>

    )
}

export default OrderItemRow;