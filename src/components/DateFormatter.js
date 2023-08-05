import { format } from "date-fns";
import es from "date-fns/locale/es";

const DateFormatter = ({ value, dateFormat = 'MM-dd-yyyy' }) => value ? format(new Date(value), dateFormat, {
    locale: es
}) : null;

export default DateFormatter;