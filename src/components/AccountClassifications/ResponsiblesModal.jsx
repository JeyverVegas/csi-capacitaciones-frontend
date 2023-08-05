import { Button, Modal, Table } from "react-bootstrap";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";
import ResponsibleRow from "./ResponsibleRow";

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
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.data?.map((responsible, i) => {
                                return (
                                    <ResponsibleRow
                                        costCenterId={costCenterId}
                                        responsible={responsible}
                                        key={i}
                                        index={i}
                                        onDelete={() => getResponsibles()}
                                    />
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