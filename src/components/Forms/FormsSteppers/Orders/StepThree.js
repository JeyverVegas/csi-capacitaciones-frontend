import check from "../../../../images/check.png";
import cancel from "../../../../images/cancel.png";
import useOrdersTypes from "../../../../hooks/useOrdersTypes";
import { useOrderCrud } from "../../../../context/OrderCrudContext";

const StepThree = () => {

    const { data, setData, currentStep, setCurrentStep } = useOrderCrud();

    const [{ ordersTypes, loading: loadingOrdersTypes }, getOrdersTypes] = useOrdersTypes();

    const handleChange = (e) => {
        if (e.target.value === 'Seleccione un tipo') {
            return;
        }
        setData((oldData) => {
            return {
                ...oldData,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <div className="container">
            <div className="card col-md-12 animate__animated animate__fadeInUp">
                <h4 style={{ textAlign: 'center', padding: "20px", borderBottom: '1px solid whitesmoke' }}>Seleccione el Tipo de Pedido</h4>
                {
                    data?.orderTypeId ?
                        <div className="text-center mt-5 animate__animated animate__fadeInUp">
                            <img src={check} style={{ width: '100px' }} />
                            <h3>Perfecto ya puedes continuar</h3>
                        </div>
                        :
                        <div className="text-center mt-5 animate__animated animate__fadeInUp">
                            <img src={cancel} style={{ width: '100px' }} />
                            <h3>Por favor seleccione un tipo</h3>
                        </div>
                }
                <div className="card-body">
                    <select className="form-control" name="orderTypeId" onChange={handleChange} value={data?.orderTypeId}>
                        {
                            !data?.orderTypeId &&
                            <option>Seleccione un tipo</option>
                        }
                        {
                            ordersTypes?.map((ordersTypes, i) => {
                                return (
                                    <option value={ordersTypes?.id}>{ordersTypes?.displayText}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="card-footer text-end">
                    <button type="button" className="btn btn-danger mx-1" onClick={() => { setCurrentStep((oldStep) => oldStep - 1) }}>
                        Atras
                    </button>
                    <button type="button" disabled={!data?.orderTypeId} className="btn btn-primary" onClick={() => { setCurrentStep((oldStep) => oldStep + 1) }}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StepThree;