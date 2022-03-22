import { createPortal } from "react-dom";
import { MultiSelect } from "react-multi-select-component";

const CustomMultiSelect = (props) => {

    return createPortal(<MultiSelect
        {
        ...props
        }
    />, document.getElementById("portal"))
}

export default CustomMultiSelect;