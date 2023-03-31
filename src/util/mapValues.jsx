const mapValues = (values) => {
    const valuesMapped = values.map((value) => {
        return {
            label: value?.name,
            value: value?.id
        }
    });
    return valuesMapped;
}

export default mapValues;