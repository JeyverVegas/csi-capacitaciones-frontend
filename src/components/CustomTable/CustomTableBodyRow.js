const CustomTableBodyRow = ({ children }) => {
    return (
        <tr role="row" className="odd">
            {children}
        </tr>
    )
}

export default CustomTableBodyRow;