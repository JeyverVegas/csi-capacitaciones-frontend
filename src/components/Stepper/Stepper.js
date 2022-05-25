import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";

const Stepper = ({ steps, currentStep, onClickStepp, disableScrolToTop }) => {

    useEffect(() => {
        if (!disableScrolToTop) window.scrollTo({ top: 0 });
    }, [currentStep])

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: '10px' }}>
                {steps?.map((stepForm, i) => {
                    return <Fragment key={i}>
                        <Button variant={currentStep >= i + 1 ? 'primary' : 'light'} onClick={() => { onClickStepp?.({ step: stepForm, stepNumber: i + 1 }) }}>
                            {stepForm?.name}
                        </Button>
                        {
                            steps?.length > i + 1 &&
                            <div style={{ height: '1px', width: '100%', transition: 'all 1s' }} className={currentStep > (i + 1) ? 'bg-primary' : 'bg-light'}></div>
                        }
                    </Fragment>
                })}
            </div>
            {
                steps?.map(({ Component }, i) => {
                    return (
                        currentStep === (i + 1) ?
                            <Component key={i} />
                            :
                            null
                    )
                })
            }
        </>
    )
}

export default Stepper;