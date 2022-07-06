import StepFour from "./StepFour";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import { useOrderCrud } from "../../../../context/OrderCrudContext";
import Stepper from "../../../Stepper/Stepper";
import { useEffect, useState } from "react";
import SystemInfo from "../../../../util/SystemInfo";
import swal from "sweetalert";



const CreateOrderForm = () => {

    const { currentStep, canNext, setCurrentStep, data, setData } = useOrderCrud();

    const [canSave, setCanSave] = useState(false);

    const steps = [
        { name: "Paso 1", Component: StepOne },
        { name: "Paso 2", Component: StepTwo },
        { name: "Paso 3", Component: StepThree },
        { name: "Paso 4", Component: StepFour },
    ];

    useEffect(() => {
        const lastData = localStorage.getItem(SystemInfo?.AUTO_SAVE_KEY);
        if (lastData) {
            const orderData = JSON.parse(lastData);
            if (orderData?.currentStep > 0 && orderData?.data?.serviceId) {
                swal({
                    title: "¡Orden incompleta!",
                    text: "¿Desea cancelar el pedido o continuarlo?",
                    icon: "warning",
                    buttons: true,
                }).then((willLoad) => {
                    if (willLoad) {
                        setData((oldData) => {
                            return {
                                ...oldData,
                                ...orderData?.data
                            }
                        });
                        setCurrentStep(orderData?.currentStep);
                        setCanSave(true);
                    } else {
                        setCanSave(true);
                    }
                })
            } else {
                setCanSave(true);
            }
        } else {
            setCanSave(true);
        }
    }, []);

    useEffect(() => {
        if (canSave) {
            localStorage.setItem(SystemInfo?.AUTO_SAVE_KEY, JSON.stringify({
                data: data,
                currentStep: currentStep
            }));
        }
    }, [currentStep, data, canSave])

    const handleStep = ({ stepNumber }) => {
        setCurrentStep(stepNumber);
    }

    return (
        <>
            <div className="row">
                <div className="col-xl-12 col-xxl-12">
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                    />
                </div>
            </div>
        </>
    )
}
export default CreateOrderForm;