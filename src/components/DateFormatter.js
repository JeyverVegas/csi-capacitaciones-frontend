import { format } from "date-fns";

const DateFormatter = ({ value , dateFormat = 'MM-dd-yyyy' }) => value ? format(new Date(value), dateFormat) : null;

export default DateFormatter;