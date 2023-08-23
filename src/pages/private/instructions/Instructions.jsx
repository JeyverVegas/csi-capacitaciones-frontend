import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { useFeedBack } from "../../../context/FeedBackContext";



const Instructions = () => {

    const { setCustomAlert } = useFeedBack();

    const [description, setDescription] = useState('');

    const [{ data: instructionsData, loading: loadingInstructions }] = useAxios({ url: `/instructions` }, { useCache: false });

    const [{ data: updateData, loading: loadingUpdateInstructions }, updateInstructions] = useAxios({ method: 'PUT', url: `/instructions/1` }, { manual: true, useCache: false });

    useEffect(() => {
        if (updateData) {
            setCustomAlert({
                show: true,
                severity: 'success',
                title: 'Operación Exitosa',
                message: 'El registro fue actualizado exitosamente.'
            });
        }
    }, [updateData])

    useEffect(() => {
        if (instructionsData) {
            setDescription(instructionsData?.data?.description);
        }
    }, [instructionsData])

    return (
        <div>
            <div className="card p-4">
                <h3>
                    Instrucciones del sistema
                </h3>
                <CKEditor
                    editor={Editor}
                    data={description}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setDescription(data);
                    }}
                />
                <br />
                <div className="text-center">
                    <button disabled={loadingUpdateInstructions} className="btn btn-primary" onClick={() => updateInstructions({ data: { description } })}>
                        {
                            loadingUpdateInstructions ?
                                'Cargando...'
                                :
                                'Actualizar'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Instructions;