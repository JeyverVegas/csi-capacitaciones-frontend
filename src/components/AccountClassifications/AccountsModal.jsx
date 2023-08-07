import { Button, Image, Modal, Table } from "react-bootstrap";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";

const AccountsModal = ({ costCenterId, accountClassification, show, onClose }) => {

    const [{ data, loading }, getAccounts] = useAxios({ url: `/cost-centers/${costCenterId}/accounts`, params: { accountClassificationId: accountClassification?.id } }, { useCache: false, manual: true });

    useEffect(() => {
        if (show) getAccounts();
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
                    Cuentas
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
                            <th>Codigo</th>
                            <th>Afecta la dotación</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.data?.map((account, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>
                                            {account?.name || '--'}
                                        </td>
                                        <td>{account?.code || '--'}</td>
                                        <td>
                                            {account?.staff ? 'Si' : 'No'}
                                        </td>
                                        <td>
                                            {account?.type === 'income' && 'Ingreso'}
                                            {account?.type === 'spent' && 'Gasto'}
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

export default AccountsModal;