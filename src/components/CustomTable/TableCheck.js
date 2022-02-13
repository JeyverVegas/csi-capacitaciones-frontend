const TableCheck = ({ onChange, id, checked }) => {

    return (
        <div className="form-check custom-checkbox ">
            <input
                type="checkbox"
                onChange={() => { onChange?.() }}
                className="form-check-input"
                id="customCheckBox2"
                required
                checked={checked}
            />
            <label
                className="form-check-label"
                htmlFor="customCheckBox2"
            />
        </div>
    )
}

export default TableCheck;