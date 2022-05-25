import StepFour from "./StepFour";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import StepTwo from "./StepTwo";
import { useOrderCrud } from "../../../../context/OrderCrudContext";
import { useTheme } from '../../../../context/ThemeContext';
import { Button } from "react-bootstrap";
import Stepper from "../../../Stepper/Stepper";

const CreateOrderForm = () => {

    const { currentStep, canNext, setCurrentStep } = useOrderCrud();

    const { primaryColor } = useTheme();

    const steps = [
        { name: "Paso 1", Component: StepOne },
        { name: "Paso 2", Component: StepTwo },
        { name: "Paso 3", Component: StepThree },
        { name: "Paso 4", Component: StepFour },
    ];

    const handleStep = ({ stepNumber }) => {
        setCurrentStep(stepNumber);
    }

    return (
        <div className="row">
            <div className="col-xl-12 col-xxl-12">
                <Stepper
                    steps={steps}
                    currentStep={currentStep}
                    onClickStepp={handleStep}
                />
            </div>
        </div>
    )
}
export default CreateOrderForm;