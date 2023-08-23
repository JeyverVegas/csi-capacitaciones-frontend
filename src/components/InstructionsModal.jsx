import { Modal } from "react-bootstrap";
import useAxios from "../hooks/useAxios";
import { useEffect } from "react";

const InstructionsModal = ({ show, onClose }) => {

    const [{ data: instructionsData, loading: loadingInstructions }, getInstructions] = useAxios({ url: `/instructions` }, { useCache: false });

    useEffect(() => {
        if (show) getInstructions();
    }, [show])

    return (
        <Modal size="xl" show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Instrucciones del sistema</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <div dangerouslySetInnerHTML={{ __html: instructionsData?.data?.description }}>

                </div>
            </Modal.Body>
        </Modal>
    )
}

export default InstructionsModal;