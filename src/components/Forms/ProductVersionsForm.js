import { useEffect, useState } from "react";
import ImgUploadInput from "../ImgUploadInput";
import ReactTooltip from 'react-tooltip';


const ProductVersionForm = ({ onDelete, productVersion, productId, index, onChange }) => {

    const [show, setShow] = useState(false);

    const handleDelete = () => {
        onDelete?.(productVersion, index);
    }

    const handleChange = (e) => {
        onChange?.(e, index);
    }

    const handleSubmit = (e) => {
        e.preventDefault?.();
        alert('hola');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="d-flex my-4 border-bottom pb-2 align-items-center justify-content-between animate__animated animate__fadeInRight">
                <div className="d-flex">
                    <div className="mx-5">
                        <ImgUploadInput name="image" description="imagen" style={{ height: 100, width: 100 }} />
                    </div>
                    <div className="mx-2">
                        <label>
                            <p>
                                Codigo
                            </p>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Codigo"
                            autoFocus={!productVersion?.id}
                            name="code"
                            value={productVersion?.code}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mx-2">
                        <label>
                            <p>
                                Nombre de la Version
                            </p>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de la Version"
                            name="name"
                            value={productVersion?.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mx-2">
                        <label>
                            <p>
                                Precio de la Version
                            </p>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Precio de la Version"
                            name="name"
                            value={productVersion?.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="d-flex">
                    <button onClick={handleDelete} type="button" data-tip="Eliminar" className="btn btn-danger mx-1">
                        <i className="flaticon-381-trash-2" />
                    </button>
                    <button onClick={() => { setShow((oldShow) => !oldShow) }} type="button" data-tip="Mostrar Detalles" className="btn btn-warning mx-1" title="Mostrar detalles">
                        {
                            show ?
                                <i className="flaticon-003-arrow-up" />
                                :
                                <i className="flaticon-002-arrow-down" />
                        }
                    </button>
                    <button type="button" data-tip="Actualizar" className="btn btn-success mx-1">
                        <i className="flaticon-381-tab" />
                    </button>
                </div>
                <ReactTooltip />
            </div>
            {
                show &&
                <div className="animate__animated animate__fadeInRight border-bottom">
                    <h1>Hola</h1>
                </div>
            }
        </form>
    )
}

export default ProductVersionForm;