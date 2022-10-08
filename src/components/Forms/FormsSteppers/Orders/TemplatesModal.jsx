import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import useOrdersTemplates from "../../../../hooks/useOrdersTemplates";
import { format } from "date-fns";

const TemplatesModal = ({ onClose, show, onSelectTemplate }) => {

    const [templatesFilters, setTemplatesFilters] = useState({
        perPage: 10,
        page: 1,
        forCurrentUser: true
    });

    const [currentOrdersTemplates, setCurrentOrdersTemplates] = useState([]);

    const [{ ordersTemplates, numberOfPages: templatesPages, loading: loadingTemplates }, getOrdersTemplates] = useOrdersTemplates({ params: { ...templatesFilters }, options: { useCache: false } });

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
        setCurrentOrdersTemplates((oldTemplates) => {
            return [...currentOrdersTemplates, ...ordersTemplates]
        })
    }, [ordersTemplates])

    return (
        <Modal className="fade" size="lg" show={show}>
            <Modal.Header>
                <Modal.Title>Copias Guardadas</Modal.Title>
                <Button
                    variant=""
                    className="btn-close"
                    onClick={() => onClose?.()}
                >
                </Button>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>
                                    Copia #
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
                                            <td onClick={() => onSelectTemplate(template)} className="text-end">
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
                <button onClick={() => onClose?.()} className="btn btn-danger">
                    Cerrar
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default TemplatesModal;