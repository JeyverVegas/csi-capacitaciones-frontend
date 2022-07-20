import { useEffect } from "react";
import { useOrderCrud } from "../../../../context/OrderCrudContext";
import useServices from "../../../../hooks/useServices";
import check from "../../../../images/check.png";
import cancel from "../../../../images/cancel.png";

const StepOne = () => {

    const { data, setData, currentStep, setCurrentStep } = useOrderCrud();

    const [{ services, loading: servicesLoading }, getServices] = useServices({ params: { perPage: 200, currentUserServices: true, page: 1 }, options: { useCache: false } });

    useEffect(() => {
        if (services?.length === 1) {
            setData((oldData) => {
                return {
                    ...oldData,
                    serviceId: services[0]?.id
                }
            });
            setCurrentStep((oldStep) => oldStep + 1);
        }
    }, [services])


    const handleChange = (e) => {
        if (e.target.value === 'Seleccione un servicio') {
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
                <h4 style={{ textAlign: 'center', padding: "20px", borderBottom: '1px solid whitesmoke' }}>Seleccione el servicio</h4>
                {
                    data?.serviceId ?
                        <div className="text-center mt-5 animate__animated animate__fadeInUp">
                            <img src={check} style={{ width: '100px' }} />
                            <h3>Perfecto ya puedes continuar</h3>
                        </div>
                        :
                        <div className="text-center mt-5 animate__animated animate__fadeInUp">
                            <img src={cancel} style={{ width: '100px' }} />
                            <h3>Por favor seleccione un servicio</h3>
                        </div>
                }
                <div className="card-body">
                    <select className="form-control" name="serviceId" onChange={handleChange} value={data?.serviceId}>
                        <option>Seleccione un servicio</option>
                        {
                            services?.map((service, i) => {
                                return (
                                    <option key={i} value={service?.id}>{service?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="card-footer text-end">
                    <button type="button" disabled={!data?.serviceId} className="btn btn-primary" onClick={() => { setCurrentStep((oldStep) => oldStep + 1) }}>
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StepOne;