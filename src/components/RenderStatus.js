import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";


const RenderStatus = ({ value, styles, hiddenBar }) => {

    const [currentStatus, setCurrentStatus] = useState(null);

    useEffect(() => {
        if (value?.orderStatus) setCurrentStatus(value?.orderStatus);
        if (value?.quoteStatus) setCurrentStatus(value?.quoteStatus);
    }, [value])

    return (
        <>
            <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', justifyContent: 'space-evenly', textTransform: 'capitalize', ...styles }}>
                {currentStatus?.name}
                <div
                    style={{
                        height: '10px',
                        width: '10px',
                        borderRadius: '100%',
                        background: currentStatus?.color
                    }}
                />
            </div>
            {
                !hiddenBar &&
                <ProgressBar
                    now={currentStatus?.progress}
                    variant={currentStatus?.variantColor}
                    className="my-3"
                />
            }
        </>
    )
}

export default RenderStatus;