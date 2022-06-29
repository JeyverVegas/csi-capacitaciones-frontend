import { ProgressBar } from "react-bootstrap";


const RenderStatus = ({ value, styles, hiddenBar }) => {
    return (
        <>
            <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', justifyContent: 'space-evenly', textTransform: 'capitalize', ...styles }}>
                {value?.orderStatus?.name}
                <div
                    style={{
                        height: '10px',
                        width: '10px',
                        borderRadius: '100%',
                        background: value?.orderStatus?.color
                    }}
                />
            </div>
            {
                !hiddenBar &&
                <ProgressBar
                    now={value?.orderStatus?.progress}
                    variant={value?.orderStatus?.variantColor}
                    className="my-3"
                />
            }
        </>
    )
}

export default RenderStatus;