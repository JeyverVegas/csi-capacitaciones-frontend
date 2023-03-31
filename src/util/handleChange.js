const handleChange = (event, setter, values) => {
    if (event?.target?.type === "checkbox") {
        const value = values[event?.target?.name].includes(event?.target?.value);
        if (value) {
            const newValues = values[event?.target?.name].filter(n => n !== event?.target?.value);
            setter((oldValues) => {
                return {
                    ...oldValues,
                    [event?.target?.name]: newValues,
                    page: 1
                }
            });
        } else {
            setter((oldValues) => {
                return {
                    ...oldValues,
                    [event?.target?.name]: [event?.target?.value, ...oldValues[event?.target?.name]],
                    page: 1
                }
            });
        }
        return;
    }

    setter((oldValues) => {
        return {
            ...oldValues,
            [event?.target?.name]: event?.target?.type === 'file' ? event?.target?.multiple ? event?.target?.files : event?.target?.files[0] : event?.target?.value
        }
    });
}

export default handleChange;