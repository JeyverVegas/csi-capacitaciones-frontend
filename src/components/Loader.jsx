const Loader = ({ size, color, className }) => {
    return (
        <div className={`loader ${className}`} style={{
            fontSize: size,
            color: color,
            margin: 0,
            borderTop: `1.1em solid ${color}33`,
            borderRight: `1.1em solid ${color}33`,
            borderBottom: `1.1em solid ${color}33`,
            borderLeft: `1.1em solid ${color}`
        }} />
    )
}

export default Loader;