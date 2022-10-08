import Toggle from "react-toggle";
import { useOrderCrud } from "../../../../context/OrderCrudContext";
import productsImage from "../../../../images/dairy-products.png";
import replacementImage from "../../../../images/repuestos.png";
import grayProductsImage from "../../../../images/dairy-products-gris.png";
import grayReplacementImage from "../../../../images/repuestos-gris.png";
const StepTwo = () => {

    const { data, setData, currentStep, setCurrentStep } = useOrderCrud();

    return (
        <div className="container">
            <div className="card col-md-12 animate__animated animate__fadeInUp">
                <h4 style={{ textAlign: 'center', padding: "20px", borderBottom: '1px solid whitesmoke' }}>
                    Por favor indique lo que necesita.
                </h4>
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="text-center">
                            <label onClick={() => setData((oldData) => { return { ...oldData, isReplacement: false } })} htmlFor="togglesome" className="text-center mt-5 animate__animated animate__fadeIn" style={{ width: 'fit-content', cursor: 'pointer' }}>
                                <img src={!data?.isReplacement ? productsImage : grayProductsImage} style={{ width: '150px' }} />
                                <h3>
                                    <input className="mx-2" type="radio" checked={!data?.isReplacement} />
                                    Artículos generales
                                </h3>
                            </label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="text-center">
                            <label onClick={() => setData((oldData) => { return { ...oldData, isReplacement: true } })} htmlFor="togglesome" className="text-center mt-5 animate__animated animate__fadeIn" style={{ width: 'fit-content', cursor: 'pointer' }}>
                                <img src={data?.isReplacement ? replacementImage : grayReplacementImage} style={{ width: '150px' }} />
                                <h3>
                                    <input className="mx-2" type="radio" checked={data?.isReplacement} />
                                    Repuestos
                                </h3>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="card-footer text-end">
                    <button type="button" className="btn btn-danger mx-1" onClick={() => setCurrentStep((oldStep) => {
                        return oldStep - 1
                    })}>
                        Atras
                    </button>
                    <button type="button" className="btn btn-primary mx-1" onClick={() => { setCurrentStep((oldStep) => oldStep + 1) }}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StepTwo;