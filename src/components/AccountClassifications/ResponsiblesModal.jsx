import { Button, Image, Modal, Table } from "react-bootstrap";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";

const ResponsiblesModal = ({ costCenterId, accountClassification, show, onClose }) => {

    const [{ data, loading }, getResponsibles] = useAxios({ url: `/cost-centers/${costCenterId}/responsibles`, params: { accountClassificationId: accountClassification?.id } }, { useCache: false, manual: true });

    useEffect(() => {
        if (show) getResponsibles();
    }, [show]);

    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={() => onClose?.()}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Responsables
                </Modal.Title>
            </Modal.Header>

            {
                loading &&
                <div className="spinner my-5">
                    <div className="double-bounce1 bg-primary"></div>
                    <div className="double-bounce2 bg-primary"></div>
                </div>
            }

            {
                !loading &&
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Rut</th>
                            <th>Telefono</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.data?.map((responsible, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <Image style={{ height: 50, width: 50, marginRight: 5 }} src={responsible?.user?.imagePath} roundedCircle />
                                            {responsible?.user?.name || '--'}
                                        </td>
                                        <td>{responsible?.user?.documentNumber || '--'}</td>
                                        <td>{responsible?.user?.phoneNumber || '--'}</td>
                                        <td>{responsible?.user?.email || '--'}</td>
                                        <td>
                                            <button className="btn btn-danger btn-xs">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            }
            <Modal.Footer>
                <Button onClick={() => onClose?.()}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ResponsiblesModal;