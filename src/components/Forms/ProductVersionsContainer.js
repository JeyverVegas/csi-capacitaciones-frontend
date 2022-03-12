import { useEffect, useState } from "react";
import ProductVersionForm from "./ProductVersionForm";
import swal from "sweetalert";


const ProductVersionsContainer = ({ initialVersions, productId }) => {

    const [productVersions, setProductVersions] = useState([]);

    useEffect(() => {
        if (initialVersions) {
            setProductVersions((oldVersions) => {
                return [...initialVersions, ...oldVersions]
            })
        }
    }, [initialVersions])


    const handleAddVersion = () => {
        swal({
            title: "¿Estas Seguro?",
            text: "¿Quieres agregar una nueva versión de este producto?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willAdded) => {
            if (willAdded) {
                setProductVersions((oldVersions) => {
                    return [{ name: '', code: '', image: null, features: [], price: 0 }, ...oldVersions];
                });
            }
        });
    }


    const handleDeleteProductVersion = (index) => {
        setProductVersions(productVersions.filter((product, i) => i !== index));
    }

    return (

        <div className="col-md-12 my-4 border-top py-4">
            <h3>Versiones del producto</h3>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-primary mx-2" onClick={handleAddVersion}>
                    Nueva Version
                </button>
            </div>
            {
                productVersions?.map((productVersion, i) => {
                    return (
                        <ProductVersionForm
                            key={i}
                            defaultProductVersion={productVersion}
                            productId={productId}
                            index={i}
                            onDelete={handleDeleteProductVersion}
                        />
                    )
                })
            }

        </div>
    )
}

export default ProductVersionsContainer;