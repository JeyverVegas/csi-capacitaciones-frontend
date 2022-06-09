const RenderStatus = ({ value, styles }) => {
    return (
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
    )
}

export default RenderStatus;