import { useEffect } from "react";
import { useState } from "react";
import clsx from "clsx";
import useAxios from "../../hooks/useAxios";
import { Button, Modal } from "react-bootstrap";

const TemplateSection = ({ order, show }) => {

    const [showModalTemplateName, setShowModalTemplateName] = useState(false);

    const [templateName, setTemplateName] = useState('');

    const [{ data: createTemplateData, loading: createTemplateLoading }, createTemplate] = useAxios({ url: `/orders-templates`, method: 'POST' }, { useCache: false, manual: true });

    const [{ loading: deleteTemplateLoading }, deleteTemplate] = useAxios({ method: 'DELETE' }, { useCache: false, manual: true });

    const [template, setTemplate] = useState(null);

    useEffect(() => {
        if (order) {
            setTemplate(order?.template);
        }
    }, [order]);

    useEffect(() => {
        if (createTemplateData) {
            setTemplate(createTemplateData?.data);
        }
    }, [createTemplateData]);

    const handleCreateTemplate = (e) => {
        e?.preventDefault();

        if (order?.orderTypeId !== 3) {
            createTemplate({
                data: {
                    name: templateName,
                    order_id: order?.id
                }
            }).then((response) => {
                setShowModalTemplateName(false);
                setTemplateName('');
            })
        }
    }

    const handleDeleteTemplate = () => {
        if (!template) {
            alert('No es una plantilla');
            return;
        }

        deleteTemplate({ url: `/orders-templates/${template?.id}` })
            .then(() => {
                setTemplate(null);
            })
    }

    if (!show) {
        return null;
    }

    return (
        <>
            <button
                onClick={template ? handleDeleteTemplate : () => setShowModalTemplateName(true)}
                disabled={template ? deleteTemplateLoading : createTemplateLoading}
                className={clsx(['btn btn-block'], {
                    "btn-danger": template,
                    'btn-primary': !template
                })}
            >
                {
                    deleteTemplateLoading ?
                        'Cargando...'
                        :
                        template ?
                            'Eliminar Como Plantilla'
                            :
                            'Guardar Como Plantilla'
                }
            </button>
            <Modal size="lg" className="fade" show={showModalTemplateName}>
                <form onSubmit={handleCreateTemplate}>
                    <Modal.Header>
                        <Modal.Title>Nombre del Template:</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={() => setShowModalTemplateName(false)}
                        >
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            autoFocus
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="form-control"
                            placeholder="Ingrese el nombre de la plantilla..."
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="row">
                            <div className="col-md-6">
                                <button type="button" onClick={() => setShowModalTemplateName(false)} className="btn btn-danger btn-block">
                                    Cancelar
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button disabled={createTemplateLoading} type="submit" className="btn btn-success btn-block">
                                    {
                                        createTemplateLoading ?
                                            'Cargando...'
                                            :
                                            'Aceptar'
                                    }
                                </button>
                            </div>
                        </div>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default TemplateSection;