import Toggle from "react-toggle";
import { useOrderCrud } from "../../../../context/OrderCrudContext";
import productsImage from "../../../../images/dairy-products.png";
import replacementImage from "../../../../images/repuestos.png";
const StepTwo = () => {

    const { data, setData, currentStep, setCurrentStep } = useOrderCrud();

    return (
        <div className="container">
            <div className="card col-md-12 animate__animated animate__fadeInUp">
                <h4 style={{ textAlign: 'center', padding: "20px", borderBottom: '1px solid whitesmoke' }}>¿Es Para Repuestos?</h4>
                <div className="text-center">
                    <label htmlFor="togglesome" className="text-center mt-5 animate__animated animate__fadeIn" style={{ width: 'fit-content', cursor: 'pointer' }}>
                        <img src={data?.isReplacement ? replacementImage : productsImage} style={{ width: '100px' }} />
                        <h3>{data?.isReplacement ? "Si, es para repuestos." : "No, es para productos."}</h3>
                    </label>
                </div>
                <div className="card-body text-center">
                    <Toggle id="togglesome" onChange={() => { setData((oldData) => { return { ...oldData, isReplacement: !oldData?.isReplacement } }) }} checked={data?.isReplacement} />
                </div>
                <div className="card-footer text-end">
                    <button type="button" className="btn btn-danger mx-1" onClick={() => { setCurrentStep((oldStep) => oldStep - 1) }}>
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