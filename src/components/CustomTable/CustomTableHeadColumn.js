const CustomTableHeadColumn = ({ style, children, className, tabIndex, ariaControls, rowSpan, colSpan, ariaLabel, ...rest }) => {
    return (
        <th
            className={`sorting ${className}`}
            tabIndex={tabIndex ? tabIndex : 0}
            aria-controls={ariaControls}
            rowSpan={rowSpan ? rowSpan : 1}
            colSpan={colSpan ? colSpan : 1}
            aria-label={ariaLabel}
            style={style}
        >
            {children}
        </th>
    )
}

export default CustomTableHeadColumn;