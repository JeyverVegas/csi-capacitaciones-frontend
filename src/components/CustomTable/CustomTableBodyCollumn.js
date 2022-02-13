const CustomTableBodyCollumn = ({ style, children, className, tabIndex, ariaControls, rowSpan, colSpan, ariaLabel, ...rest }) => {
    return (
        <td
            className={`sorting ${className}`}
            tabIndex={tabIndex ? tabIndex : 0}
            aria-controls={ariaControls}
            rowSpan={rowSpan ? rowSpan : 1}
            colSpan={colSpan ? colSpan : 1}
            aria-label={ariaLabel}
            style={style}
        >
            {children}
        </td>
    )
}

export default CustomTableBodyCollumn;