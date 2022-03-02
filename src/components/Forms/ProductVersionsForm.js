import { useEffect, useState } from "react";
import ImgUploadInput from "../ImgUploadInput";

const ProductVersionForm = ({ onDelete, productVersion, productId }) => {

    const [data, setData] = useState({
        name: '',
        code: '',
        image: '',
    })

    useEffect(() => {
        setData((oldData) => {
            return {
                ...oldData,
                ...productVersion
            }
        });
    }, [productVersion])

    const handleDelete = () => {
        onDelete?.();
    }

    const handleSubmit = (e) => {
        e.preventDefault?.();
    }

    const handleChange = (e) => {
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.type === 'file' ? e.target.files[0] : e.target.value
            }
        })
    }

    return (
        <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
                <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-5">
                            <div className="form-group mb-3 col-md-8">
                                <div className="mb-4">
                                    <label>
                                        <h5>
                                            Nombre de esta version
                                        </h5>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre"
                                        name="name"
                                        autoFocus
                                        value={data?.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label>
                                        Codigo de esta version
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Codigo"
                                        name="code"
                                        value={data?.code}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-3 col-md-4">
                                <label>
                                    <h5>
                                        Imagen de esta version
                                    </h5>
                                </label>
                                <ImgUploadInput
                                    style={{ width: '65%' }}
                                    description="imagen de la version del producto"
                                    name="image"
                                    change={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 d-flex justify-content-end">
                            <button type="button" onClick={handleDelete} className="btn btn-danger mx-2">
                                Eliminar
                            </button>
                            <button type="submit" className="btn btn-primary mx-2">
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductVersionForm;