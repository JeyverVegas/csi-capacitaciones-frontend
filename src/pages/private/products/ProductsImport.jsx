import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import excelTemplate from "../../../assets/excels/plantilla-para-cargar-productos-en-pedidos.xlsx";

const ProductsImport = () => {

    const [file, setFile] = useState(null);

    const { setLoading, setCustomAlert } = useFeedBack();


    const [{ data: updateData, loading: updateLoading }, importProducts] = useAxios({ url: `/products/import`, method: 'post' }, { manual: true, useCache: false });

    const [showValidRows, setShowValidRows] = useState(false);

    const [showInvalidRows, setShowInvalidRows] = useState(false);

    useEffect(() => {
        setLoading({
            show: updateLoading,
            message: 'Importando registros'
        })
    }, [updateLoading]);

    useEffect(() => {
        if (updateData) {
            setShowValidRows(true);
            setShowInvalidRows(true);
            setCustomAlert({ show: true, message: "El archivo se ha importado correctamente.", severity: "success", title: 'Operación exitosa' })
        }
    }, [updateData])

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (updateLoading) {
            return;
        }

        if (!file) {
            alert('El archivo es obligatorio.');
        }

        const data = new FormData();
        data.append('file', file);

        importProducts({ data });
    }

    return (
        <div className="card">
            <div className="card-header">
                <div className="row aling-items-center col-md-12">
                    <div className="col-md-6">
                        <h4>Importar Productos</h4>
                    </div>
                    <div className="col-md-6 text-end">
                        <a href={excelTemplate} download>Descargar plantilla</a>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="">Archivo excel</label>
                        <br />
                        <input
                            type="file"
                            className="from-control"
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={(e) => setFile(e?.target?.files[0])}
                        />
                    </div>
                    <p className="mt-2">
                        <b>Nota:</b> Recuerde que una vez se carguen los productos debe asociarlos a los <b>servicios</b> que correspondan cada uno para que asi se le muestren a los usuarios pertinentes.
                        Para asociales puede ingresar en... <Link className="text-primary" to={'/productos/asociar-servicios'}>"Asociar Productos a los Servicios"</Link>
                    </p>
                    {
                        updateData?.message &&
                        <p className="text-success">
                            {updateData?.message}
                        </p>
                    }
                    {
                        updateData?.errors?.length > 0 && showInvalidRows ?
                            <div className="row">
                                <h4 className="col-6 mb-3">
                                    Filas con errores: {updateData?.errors?.length}
                                </h4>
                                <div className="col-6 text-right">
                                    <button className="btn btn-danger" onClick={() => setShowInvalidRows(false)}>Eliminar</button>
                                </div>
                                <div className="col-md-12">
                                    {
                                        updateData?.errors?.map((error, i) => {
                                            return (
                                                <div key={i} className="text-danger">
                                                    <p className="m-0"><b>En la fila: {error?.row}</b></p>
                                                    <ul>
                                                        {
                                                            error?.errors.map((errorDescription, i2) => {
                                                                return (
                                                                    <li key={i2}>
                                                                        {errorDescription}
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
                <div className="card-footer text-right">
                    <Link to={'/usuarios'} className="btn btn-danger mx-2">
                        Volver
                    </Link>
                    <button disabled={!file || updateLoading} className="btn btn-primary mx-2">
                        {
                            updateLoading ?
                                'Cargando'
                                :
                                'Enviar'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProductsImport;